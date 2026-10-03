// Draws textured quads in perspective into an offscreen frame. The scene builder (scene.js) stacks
// many of these per sign: returns, faces, trim caps, raceways, standoffs, light. WebGL does the work
// when available (inverse homography per fragment, mipmapped textures); a CPU loop covers the rest.
//
//   const r = createRenderer();
//   r.begin({ x, y, w, h });                 // frame rectangle in target pixels
//   r.quad(tex, [tl, tr, br, bl], { tint, mul, alpha, add, light });
//   const frame = r.end();                   // canvas to draw at (x, y, w, h)
//
// tint: [r,g,b] 0..1 replaces the texture color (alpha kept); mul: [r,g,b] multiplies it;
// light: a second texture sampled at the same uv and multiplied in; add: additive blending;
// uv: [u0, v0, u1, v1] sub-rectangle of the texture mapped onto the quad (default the whole of it).
import { squareToQuad, invert3, bounds, signedArea } from "./geometry.js";

const MAX_TEX = 2048;
const MAX_CACHED = 48;
const FULL_UV = [0, 0, 1, 1];

const VERT = `
attribute vec2 aPos;
uniform vec2 uSize;
varying vec2 vPos;
void main() {
  vPos = aPos;
  gl_Position = vec4(aPos.x / uSize.x * 2.0 - 1.0, 1.0 - aPos.y / uSize.y * 2.0, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform mat3 uInv;
uniform vec3 uEdge[4];
uniform sampler2D uTex;
uniform sampler2D uLight;
uniform vec4 uTint;
uniform vec3 uMul;
uniform float uAlpha;
uniform float uUseLight;
uniform vec4 uUV;
varying vec2 vPos;
void main() {
  vec3 q = uInv * vec3(vPos, 1.0);
  if (q.z <= 0.0) discard;
  vec2 uv = q.xy / q.z;
  float d = min(min(dot(uEdge[0].xy, vPos) + uEdge[0].z, dot(uEdge[1].xy, vPos) + uEdge[1].z),
                min(dot(uEdge[2].xy, vPos) + uEdge[2].z, dot(uEdge[3].xy, vPos) + uEdge[3].z));
  float cover = clamp(d + 0.5, 0.0, 1.0);
  if (cover <= 0.0) discard;
  vec2 st = uUV.xy + clamp(uv, 0.0, 1.0) * (uUV.zw - uUV.xy);
  vec4 c = texture2D(uTex, st);
  vec3 rgb = mix(c.rgb, uTint.rgb * c.a, uTint.a) * uMul;
  if (uUseLight > 0.5) rgb *= texture2D(uLight, st).rgb;
  float k = cover * uAlpha;
  gl_FragColor = vec4(rgb * k, c.a * k);
}`;

const pow2 = n => 2 ** Math.round(Math.log2(Math.min(MAX_TEX, Math.max(1, n))));
let nextId = 1;
const idOf = src => (src.__smId ||= nextId++);
const verOf = src => src.__smVer || 0;

/** Mark a canvas as changed so renderers re-upload it. */
export function touch(canvas) {
  canvas.__smVer = (canvas.__smVer || 0) + 1;
  return canvas;
}

// Inward edge lines (nx, ny, c): dot(n, p) + c is the signed pixel distance inside the quad.
function edgeLines(q) {
  const orient = signedArea(q) >= 0 ? 1 : -1;
  const out = [];
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = (-(b.y - a.y) / len) * orient, ny = ((b.x - a.x) / len) * orient;
    out.push(nx, ny, -(nx * a.x + ny * a.y));
  }
  return out;
}

const vec3 = v => (v == null ? [1, 1, 1] : typeof v === "number" ? [v, v, v] : v);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}

function glRenderer() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
  if (!gl) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const U = {};
  for (const n of ["uSize", "uInv", "uEdge", "uTex", "uLight", "uTint", "uMul", "uAlpha", "uUseLight", "uUV"]) U[n] = gl.getUniformLocation(prog, n);
  gl.uniform1i(U.uTex, 0);
  gl.uniform1i(U.uLight, 1);
  const aPos = gl.getAttribLocation(prog, "aPos");
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  const maxView = Math.min(...gl.getParameter(gl.MAX_VIEWPORT_DIMS), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), 4096);
  let lost = false;
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); lost = true; });

  const cache = new Map(); // id -> { tex, ver }
  function upload(src) {
    const id = idOf(src), ver = verOf(src);
    const hit = cache.get(id);
    if (hit && hit.ver === ver) {
      cache.delete(id);
      cache.set(id, hit);
      return hit.tex;
    }
    const tex = hit?.tex || gl.createTexture();
    const pot = document.createElement("canvas");
    pot.width = pow2(src.width);
    pot.height = pow2(src.height);
    const pctx = pot.getContext("2d");
    pctx.imageSmoothingQuality = "high";
    pctx.drawImage(src, 0, 0, pot.width, pot.height);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    cache.delete(id);
    cache.set(id, { tex, ver });
    while (cache.size > MAX_CACHED) {
      const [oldId, old] = cache.entries().next().value;
      gl.deleteTexture(old.tex);
      cache.delete(oldId);
    }
    return tex;
  }

  let frame = null;
  return {
    kind: "webgl",
    get ok() { return !lost; },
    begin(box) {
      const k = Math.min(1, maxView / Math.max(box.w, box.h, 1));
      frame = { ...box, k };
      canvas.width = Math.max(1, Math.round(box.w * k));
      canvas.height = Math.max(1, Math.round(box.h * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uSize, canvas.width, canvas.height);
    },
    quad(src, pts, { tint = null, mul = 1, alpha = 1, add = false, light = null, uv = null } = {}) {
      if (!frame || lost || !src || !src.width) return;
      const q = pts.map(p => ({ x: (p.x - frame.x) * frame.k, y: (p.y - frame.y) * frame.k }));
      if (q.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) return;
      const H = squareToQuad(q), inv = H && invert3(H);
      if (!inv) return;
      const b = bounds(q);
      const x0 = Math.max(0, Math.floor(b.minX) - 1), y0 = Math.max(0, Math.floor(b.minY) - 1);
      const x1 = Math.min(canvas.width, Math.ceil(b.maxX) + 1), y1 = Math.min(canvas.height, Math.ceil(b.maxY) + 1);
      if (x1 <= x0 || y1 <= y0) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, upload(src));
      if (light) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, upload(light));
        gl.activeTexture(gl.TEXTURE0);
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x0, y0, x1, y0, x0, y1, x1, y1]), gl.DYNAMIC_DRAW);
      gl.uniformMatrix3fv(U.uInv, false, [inv[0], inv[3], inv[6], inv[1], inv[4], inv[7], inv[2], inv[5], inv[8]]);
      gl.uniform3fv(U.uEdge, edgeLines(q));
      gl.uniform4f(U.uTint, ...(tint || [0, 0, 0]), tint ? 1 : 0);
      gl.uniform3f(U.uMul, ...vec3(mul));
      gl.uniform1f(U.uAlpha, alpha);
      gl.uniform1f(U.uUseLight, light ? 1 : 0);
      gl.uniform4fv(U.uUV, uv || FULL_UV);
      if (add) gl.blendFunc(gl.ONE, gl.ONE);
      else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    end() {
      const f = frame;
      frame = null;
      return { canvas, ...f };
    },
  };
}

// CPU fallback: same API, premultiplied float accumulation buffer, bilinear sampling.
function cpuRenderer() {
  const MAX_FRAME = 1400;
  const sources = new Map();
  function sample(src) {
    const id = idOf(src), ver = verOf(src);
    const hit = sources.get(id);
    if (hit && hit.ver === ver) return hit;
    const c = document.createElement("canvas");
    const k = Math.min(1, 768 / Math.max(src.width, src.height));
    c.width = Math.max(1, Math.round(src.width * k));
    c.height = Math.max(1, Math.round(src.height * k));
    const cctx = c.getContext("2d");
    cctx.drawImage(src, 0, 0, c.width, c.height);
    const d = cctx.getImageData(0, 0, c.width, c.height).data;
    const pm = new Float32Array(d.length);
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3] / 255;
      pm[i] = (d[i] / 255) * a; pm[i + 1] = (d[i + 1] / 255) * a; pm[i + 2] = (d[i + 2] / 255) * a; pm[i + 3] = a;
    }
    const entry = { ver, w: c.width, h: c.height, pm };
    sources.set(id, entry);
    if (sources.size > MAX_CACHED) sources.delete(sources.keys().next().value);
    return entry;
  }
  const out = [0, 0, 0, 0];
  function bilinear(s, u, v) {
    const fx = Math.min(s.w - 1, Math.max(0, u * s.w - 0.5)), fy = Math.min(s.h - 1, Math.max(0, v * s.h - 0.5));
    const x0 = fx | 0, y0 = fy | 0, x1 = Math.min(s.w - 1, x0 + 1), y1 = Math.min(s.h - 1, y0 + 1);
    const tx = fx - x0, ty = fy - y0, p = s.pm;
    const i00 = (y0 * s.w + x0) * 4, i10 = (y0 * s.w + x1) * 4, i01 = (y1 * s.w + x0) * 4, i11 = (y1 * s.w + x1) * 4;
    for (let c = 0; c < 4; c++) {
      const top = p[i00 + c] + (p[i10 + c] - p[i00 + c]) * tx;
      const bot = p[i01 + c] + (p[i11 + c] - p[i01 + c]) * tx;
      out[c] = top + (bot - top) * ty;
    }
    return out;
  }
  let frame = null, buf = null;
  return {
    kind: "cpu",
    ok: true,
    begin(box) {
      const k = Math.min(1, MAX_FRAME / Math.max(box.w, box.h, 1));
      frame = { ...box, k, W: Math.max(1, Math.round(box.w * k)), H: Math.max(1, Math.round(box.h * k)) };
      buf = new Float32Array(frame.W * frame.H * 4);
    },
    quad(src, pts, { tint = null, mul = 1, alpha = 1, add = false, light = null, uv = null } = {}) {
      if (!frame || !src || !src.width) return;
      const [su0, sv0, su1, sv1] = uv || FULL_UV;
      const q = pts.map(p => ({ x: (p.x - frame.x) * frame.k, y: (p.y - frame.y) * frame.k }));
      const H = squareToQuad(q), inv = H && invert3(H);
      if (!inv) return;
      const b = bounds(q);
      const x0 = Math.max(0, Math.floor(b.minX)), y0 = Math.max(0, Math.floor(b.minY));
      const x1 = Math.min(frame.W, Math.ceil(b.maxX) + 1), y1 = Math.min(frame.H, Math.ceil(b.maxY) + 1);
      if (x1 <= x0 || y1 <= y0) return;
      const s = sample(src), l = light ? sample(light) : null;
      const e = edgeLines(q), m = vec3(mul);
      for (let py = y0; py < y1; py++) {
        const Y = py + 0.5;
        for (let px = x0; px < x1; px++) {
          const X = px + 0.5;
          let d = Infinity;
          for (let i = 0; i < 12; i += 3) d = Math.min(d, e[i] * X + e[i + 1] * Y + e[i + 2]);
          const cover = Math.min(1, d + 0.5);
          if (cover <= 0) continue;
          const w = inv[6] * X + inv[7] * Y + inv[8];
          if (w <= 0) continue;
          const u = su0 + Math.min(1, Math.max(0, (inv[0] * X + inv[1] * Y + inv[2]) / w)) * (su1 - su0);
          const v = sv0 + Math.min(1, Math.max(0, (inv[3] * X + inv[4] * Y + inv[5]) / w)) * (sv1 - sv0);
          const c = bilinear(s, u, v);
          const a = c[3];
          if (a <= 0) continue;
          let r = tint ? tint[0] * a : c[0], g = tint ? tint[1] * a : c[1], bl = tint ? tint[2] * a : c[2];
          r *= m[0]; g *= m[1]; bl *= m[2];
          if (l) { const lc = bilinear(l, u, v), la = lc[3] || 1; r *= lc[0] / la; g *= lc[1] / la; bl *= lc[2] / la; }
          const k = cover * alpha;
          const o = (py * frame.W + px) * 4;
          if (add) {
            buf[o] += r * k; buf[o + 1] += g * k; buf[o + 2] += bl * k; buf[o + 3] = Math.min(1, buf[o + 3] + a * k);
          } else {
            const inv1 = 1 - a * k;
            buf[o] = r * k + buf[o] * inv1; buf[o + 1] = g * k + buf[o + 1] * inv1; buf[o + 2] = bl * k + buf[o + 2] * inv1; buf[o + 3] = a * k + buf[o + 3] * inv1;
          }
        }
      }
    },
    end() {
      const f = frame;
      const c = document.createElement("canvas");
      c.width = f.W;
      c.height = f.H;
      const img = new ImageData(f.W, f.H);
      const d = img.data;
      for (let i = 0; i < buf.length; i += 4) {
        const a = Math.min(1, buf[i + 3]);
        if (a <= 0) continue;
        d[i] = Math.min(255, (buf[i] / a) * 255); d[i + 1] = Math.min(255, (buf[i + 1] / a) * 255); d[i + 2] = Math.min(255, (buf[i + 2] / a) * 255); d[i + 3] = a * 255;
      }
      c.getContext("2d").putImageData(img, 0, 0);
      frame = null;
      buf = null;
      return { canvas: c, ...f };
    },
  };
}

export function createRenderer({ forceCpu = false } = {}) {
  if (!forceCpu) {
    try {
      const r = glRenderer();
      if (r) return r;
    } catch (err) {
      console.warn("WebGL unavailable, using the CPU renderer", err);
    }
  }
  return cpuRenderer();
}

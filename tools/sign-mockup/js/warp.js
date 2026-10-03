// Draws the sign artwork perspective-warped onto a quad. WebGL does the work when available
// (inverse homography per fragment, mipmapped texture); a CPU loop covers the rest.
import { squareToQuad, invert3, bounds, signedArea } from "./geometry.js";

const MAX_TEX = 2048;

const VERT = `
attribute vec2 aPos;
uniform vec4 uBox;
varying vec2 vPos;
void main() {
  vPos = aPos;
  vec2 c = (aPos - uBox.xy) / uBox.zw;
  gl_Position = vec4(c.x * 2.0 - 1.0, 1.0 - c.y * 2.0, 0.0, 1.0);
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
uniform float uAlpha;
varying vec2 vPos;
void main() {
  vec3 q = uInv * vec3(vPos, 1.0);
  vec2 uv = q.xy / q.z;
  vec4 color = texture2D(uTex, clamp(uv, 0.0, 1.0));
  float d = min(min(dot(uEdge[0].xy, vPos) + uEdge[0].z, dot(uEdge[1].xy, vPos) + uEdge[1].z),
                min(dot(uEdge[2].xy, vPos) + uEdge[2].z, dot(uEdge[3].xy, vPos) + uEdge[3].z));
  float a = clamp(d + 0.5, 0.0, 1.0);
  if (q.z <= 0.0 || a <= 0.0 || uv.x < -0.02 || uv.y < -0.02 || uv.x > 1.02 || uv.y > 1.02) discard;
  gl_FragColor = color * (a * uAlpha);
}`;

const pow2 = n => 2 ** Math.round(Math.log2(Math.min(MAX_TEX, Math.max(64, n))));

// Inward-facing edge lines (nx, ny, c) so that dot(n, p) + c is the signed pixel distance inside the quad.
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

function pixelBox(q, limitW, limitH) {
  const b = bounds(q);
  const x = Math.max(0, Math.floor(b.minX) - 1), y = Math.max(0, Math.floor(b.minY) - 1);
  const x2 = Math.min(limitW, Math.ceil(b.maxX) + 1), y2 = Math.min(limitH, Math.ceil(b.maxY) + 1);
  return x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null;
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}

function glWarper() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
  if (!gl) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const loc = name => gl.getUniformLocation(prog, name);
  const uBox = loc("uBox"), uInv = loc("uInv"), uEdge = loc("uEdge"), uAlpha = loc("uAlpha");
  const aPos = gl.getAttribLocation(prog, "aPos");
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  const maxView = Math.min(...gl.getParameter(gl.MAX_VIEWPORT_DIMS), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), 4096);
  let lost = false, hasTexture = false;
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); lost = true; });

  return {
    kind: "webgl",
    get ok() { return !lost; },
    setSource(src) {
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
      hasTexture = true;
    },
    // quad is in the target context's device pixels; the context's transform is ignored.
    draw(ctx, quad, opacity = 1) {
      if (!hasTexture || lost) return false;
      const H = squareToQuad(quad), inv = H && invert3(H);
      const box = pixelBox(quad, ctx.canvas.width, ctx.canvas.height);
      if (!inv || !box) return true;
      const k = Math.min(1, maxView / Math.max(box.w, box.h));
      canvas.width = Math.max(1, Math.round(box.w * k));
      canvas.height = Math.max(1, Math.round(box.h * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const { x, y, w, h } = box;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x + w, y, x, y + h, x + w, y + h]), gl.DYNAMIC_DRAW);
      gl.uniform4f(uBox, x, y, w, h);
      gl.uniformMatrix3fv(uInv, false, [inv[0], inv[3], inv[6], inv[1], inv[4], inv[7], inv[2], inv[5], inv[8]]);
      gl.uniform3fv(uEdge, edgeLines(quad).map(v => v * k));
      gl.uniform1f(uAlpha, opacity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, w, h);
      ctx.restore();
      return true;
    },
  };
}

function cpuWarper() {
  let src = null;
  return {
    kind: "cpu",
    ok: true,
    setSource(source) {
      const c = document.createElement("canvas");
      const k = Math.min(1, 1024 / Math.max(source.width, source.height));
      c.width = Math.max(1, Math.round(source.width * k));
      c.height = Math.max(1, Math.round(source.height * k));
      const cctx = c.getContext("2d");
      cctx.drawImage(source, 0, 0, c.width, c.height);
      src = { w: c.width, h: c.height, data: cctx.getImageData(0, 0, c.width, c.height).data };
    },
    draw(ctx, quad, opacity = 1) {
      if (!src) return false;
      const H = squareToQuad(quad), inv = H && invert3(H);
      const box = pixelBox(quad, ctx.canvas.width, ctx.canvas.height);
      if (!inv || !box) return true;
      const e = edgeLines(quad);
      const out = new ImageData(box.w, box.h);
      const o = out.data, s = src.data, sw = src.w, sh = src.h;
      for (let py = 0; py < box.h; py++) {
        const Y = box.y + py + 0.5;
        for (let px = 0; px < box.w; px++) {
          const X = box.x + px + 0.5;
          let d = Infinity;
          for (let i = 0; i < 12; i += 3) d = Math.min(d, e[i] * X + e[i + 1] * Y + e[i + 2]);
          const cover = Math.min(1, d + 0.5);
          if (cover <= 0) continue;
          const w = inv[6] * X + inv[7] * Y + inv[8];
          if (w <= 0) continue;
          const u = (inv[0] * X + inv[1] * Y + inv[2]) / w, v = (inv[3] * X + inv[4] * Y + inv[5]) / w;
          if (u < -0.02 || v < -0.02 || u > 1.02 || v > 1.02) continue;
          const fx = Math.min(sw - 1, Math.max(0, u * sw - 0.5)), fy = Math.min(sh - 1, Math.max(0, v * sh - 0.5));
          const x0 = fx | 0, y0 = fy | 0, x1 = Math.min(sw - 1, x0 + 1), y1 = Math.min(sh - 1, y0 + 1);
          const tx = fx - x0, ty = fy - y0;
          const i00 = (y0 * sw + x0) * 4, i10 = (y0 * sw + x1) * 4, i01 = (y1 * sw + x0) * 4, i11 = (y1 * sw + x1) * 4;
          const oi = (py * box.w + px) * 4;
          for (let c = 0; c < 4; c++) {
            const top = s[i00 + c] + (s[i10 + c] - s[i00 + c]) * tx;
            const bot = s[i01 + c] + (s[i11 + c] - s[i01 + c]) * tx;
            o[oi + c] = top + (bot - top) * ty;
          }
          o[oi + 3] *= cover * opacity;
        }
      }
      const tmp = document.createElement("canvas");
      tmp.width = box.w;
      tmp.height = box.h;
      tmp.getContext("2d").putImageData(out, 0, 0);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(tmp, box.x, box.y);
      ctx.restore();
      return true;
    },
  };
}

export function createWarper({ forceCpu = false } = {}) {
  if (!forceCpu) {
    try {
      const w = glWarper();
      if (w) return w;
    } catch (err) {
      console.warn("WebGL warp unavailable, using CPU fallback", err);
    }
  }
  return cpuWarper();
}

// Awnings in the photo. Paints the surfaces an awning shows (cover, valance, fascia, nose, gable,
// glass plate) with the chosen color, pattern, cut edge and lettering, and turns the mesh from
// awning-geometry.js into shaded quads in back-to-front order for scene.js.
//
// Faces are two-sided: where the camera sees the back of a face it is drawn as the inside of the
// cover, in shade. Draw order: every back face, then the frame under the cover, then the front
// faces and the exposed frame, each group far to near. At night only a backlit awning glows.
import { awningMesh } from "./geometry.js";
import { sanitizeAwningOptions } from "./types.js";
import { makeCanvas, hexToRgb, mix, WHITE } from "../../art.js";

const SEAM_IN = 46; // fabric is sewn in widths about this wide
const RIB_IN = 16; // standing-seam spacing
const MAX_SIDE = 2048;
const STAINLESS = "#9aa0a7";
const GLASS_EDGE = "#b9d3d0";
const SOFT = ["fabric", "vinyl"];

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mulc = (c, m) => c.map((v, i) => v * (typeof m === "number" ? m : m[i]));
const LIGHT = norm([-0.35, -1, 0.55]); // sun from above, a little left and in front

const letterSource = art => (art.cutout ? art.letters : art.source);

let tubeTex = null;
// Round-bar shading across a ribbon: dark edges, bright core.
function TUBE() {
  if (tubeTex) return tubeTex;
  tubeTex = makeCanvas(4, 32);
  const g = tubeTex.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 32);
  grad.addColorStop(0, "#5a5a5a");
  grad.addColorStop(0.32, "#ffffff");
  grad.addColorStop(0.55, "#cfcfcf");
  grad.addColorStop(1, "#3c3c3c");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 32);
  return tubeTex;
}

// ---------- surface painting ----------

function stripeBands(o) {
  if (!SOFT.includes(o.cover)) return null;
  if (o.pattern === "stripes") return { gap: 4.5, bar: 4.5 };
  if (o.pattern === "pinstripe") return { gap: 3.25, bar: 0.75 };
  return null;
}

// Panel color, plus stripe bars running down the surface, centered on originIn so both ends match.
function fillCloth(g, wpx, hpx, k, o, originIn, stripes = true) {
  g.fillStyle = o.panel;
  g.fillRect(0, 0, wpx, hpx);
  const s = stripes && stripeBands(o);
  if (!s) return;
  const period = s.gap + s.bar;
  g.fillStyle = o.stripe;
  let x = originIn - s.bar / 2;
  x -= Math.ceil(x / period + 1) * period;
  for (; x * k < wpx; x += period) g.fillRect(x * k, 0, s.bar * k, hpx);
}

function drawLetters(g, L, box, wpx, hpx, { maxW = 0.92, maxH = 0.8, frosted = false } = {}) {
  if (!L || !L.width || !box) return;
  const bx = box[0] * wpx, by = box[1] * hpx, bw = (box[2] - box[0]) * wpx, bh = (box[3] - box[1]) * hpx;
  const s = Math.min((bw * maxW) / L.width, (bh * maxH) / L.height);
  if (!(s > 0)) return;
  const lw = L.width * s, lh = L.height * s, x = bx + (bw - lw) / 2, y = by + (bh - lh) / 2;
  if (!frosted) {
    g.drawImage(L, x, y, lw, lh);
    return;
  }
  const t = makeCanvas(Math.max(1, Math.ceil(lw)), Math.max(1, Math.ceil(lh)));
  const tg = t.getContext("2d");
  tg.drawImage(L, 0, 0, t.width, t.height);
  tg.globalCompositeOperation = "source-in";
  tg.fillStyle = "rgba(246,250,252,0.88)";
  tg.fillRect(0, 0, t.width, t.height);
  g.drawImage(t, x, y, lw, lh);
}

// Valance cut: 1 = the full drop, 0 = the top of the cut. f is the position within one repeat.
const EDGES = {
  straight: { depth: 0, period: 1, d: () => 1 },
  scalloped: { depth: 0.38, period: 1.25, d: f => Math.sqrt(Math.max(0, 1 - (2 * f - 1) ** 2)) },
  wave: { depth: 0.3, period: 2, d: f => 0.5 - 0.5 * Math.cos(2 * Math.PI * f) },
  serpentine: { depth: 0.36, period: 2.4, d: f => { const a = 2 * Math.PI * f; return Math.min(1, Math.max(0, 0.5 + 0.42 * Math.sin(a) + 0.16 * Math.sin(2 * a))); } },
  parisian: { depth: 0.3, period: 1.2, d: f => (f > 0.13 && f < 0.87 ? 1 : 0) },
};
export const edgeProfile = style => EDGES[style] || EDGES.straight;

function paintValance(g, wpx, hpx, k, spec, o, L) {
  const e = edgeProfile(spec.edge);
  const cut = e.depth * spec.h;
  const n = Math.max(2, Math.round(spec.w / Math.min(16, Math.max(5, e.period * spec.h))));
  const p = spec.w / n;
  const bottom = [];
  const step = Math.max(1, wpx / 1600);
  for (let x = wpx; x >= -step; x -= step) {
    const xi = Math.max(0, x) / k, f = (xi / p) % 1;
    bottom.push([Math.max(0, x), (spec.h - cut + cut * e.d(f)) * k]);
  }
  g.save();
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(wpx, 0);
  for (const [x, y] of bottom) g.lineTo(x, y);
  g.closePath();
  g.clip();
  fillCloth(g, wpx, hpx, k, o, spec.w / 2, !spec.letter);
  g.restore();
  // Binding tape along the cut edge.
  g.save();
  g.beginPath();
  bottom.forEach(([x, y], i) => (i ? g.lineTo(x, y - 0.35 * k) : g.moveTo(x, y - 0.35 * k)));
  g.lineWidth = Math.max(1.5, 0.75 * k);
  g.strokeStyle = "rgba(0,0,0,.26)";
  g.stroke();
  g.restore();
  if (spec.letter) {
    const band = Math.max(0.2, (spec.h - cut) / spec.h);
    drawLetters(g, L, [spec.letter[0], 0, spec.letter[1], band], wpx, hpx, { maxW: 0.86, maxH: 0.68 });
  }
}

function paintSurface(key, spec, o, L, { back = false, scale = 1 } = {}) {
  let k = Math.min(10 * scale, (MAX_SIDE * scale) / Math.max(spec.w, spec.h, 1));
  if (spec.h * k < 40) k = Math.min(40 / spec.h, (MAX_SIDE * scale) / spec.w);
  const wpx = Math.max(2, Math.round(spec.w * k)), hpx = Math.max(2, Math.round(spec.h * k));
  const c = makeCanvas(wpx, hpx);
  const g = c.getContext("2d");
  const letter = back ? null : spec.letter;
  if (key === "valance") {
    paintValance(g, wpx, hpx, k, { ...spec, letter }, o, L);
    return c;
  }
  if (key === "plate") {
    const glass = spec.glass === "glass";
    g.fillStyle = glass ? "rgba(178,214,214,0.3)" : "rgba(232,238,240,0.55)";
    g.fillRect(0, 0, wpx, hpx);
    g.fillStyle = glass ? "rgba(150,196,194,0.55)" : "rgba(210,218,222,0.7)";
    g.fillRect(0, 0, wpx, Math.max(2, 0.6 * k));
    drawLetters(g, L, letter, wpx, hpx, { frosted: true });
    return c;
  }
  if (key === "face") {
    g.fillStyle = o.panel;
    g.fillRect(0, 0, wpx, hpx);
    const grad = g.createLinearGradient(0, 0, 0, hpx);
    grad.addColorStop(0, "rgba(255,255,255,.12)");
    grad.addColorStop(0.5, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(0,0,0,.12)");
    g.fillStyle = grad;
    g.fillRect(0, 0, wpx, hpx);
    drawLetters(g, L, letter, wpx, hpx, { maxW: 0.94, maxH: 0.74 });
    return c;
  }
  if (key === "fan") {
    // Dutch hood ends: the hoops pivot at the bottom corner by the wall, so they fan out from it.
    fillCloth(g, wpx, hpx, k, o, spec.w / 2, false);
    g.strokeStyle = "rgba(0,0,0,.2)";
    g.lineWidth = Math.max(1, 0.5 * k);
    for (let i = 1; i <= spec.hoops; i++) {
      const a = (i / (spec.hoops + 1)) * (Math.PI / 2);
      g.beginPath();
      g.moveTo(0, hpx);
      g.lineTo(Math.sin(a) * wpx * 1.5, hpx - Math.cos(a) * hpx * 1.5);
      g.stroke();
    }
    return c;
  }
  const striped = !letter || key === "cover";
  fillCloth(g, wpx, hpx, k, o, spec.w / 2, striped);
  if (spec.ribs) {
    for (let x = (spec.w / 2) % RIB_IN; x < spec.w; x += RIB_IN) {
      g.fillStyle = "rgba(255,255,255,.22)";
      g.fillRect(x * k - 0.3 * k, 0, Math.max(1, 0.35 * k), hpx);
      g.fillStyle = "rgba(0,0,0,.28)";
      g.fillRect(x * k + 0.05 * k, 0, Math.max(1, 0.35 * k), hpx);
    }
  } else if (o.cover === "fabric" && !stripeBands(o) && (key === "cover" || key === "end") && !spec.along) {
    g.fillStyle = "rgba(0,0,0,.1)";
    for (let x = spec.w / 2 - SEAM_IN / 2; x > 0; x -= SEAM_IN) g.fillRect(x * k, 0, Math.max(1, 0.25 * k), hpx);
    for (let x = spec.w / 2 + SEAM_IN / 2; x < spec.w; x += SEAM_IN) g.fillRect(x * k, 0, Math.max(1, 0.25 * k), hpx);
  }
  if (spec.pleats) {
    for (let i = 0; i <= spec.pleats; i++) {
      const y = (i / spec.pleats) * hpx, b = (hpx / spec.pleats) * 0.5;
      const grad = g.createLinearGradient(0, y - b, 0, y + b);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.5, "rgba(0,0,0,.24)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, y - b, wpx, 2 * b);
    }
  }
  drawLetters(g, L, letter, wpx, hpx, { maxW: 0.9, maxH: 0.74 });
  return c;
}

// Painted surfaces are cached per artwork; sizes are bucketed so dragging a corner doesn't repaint.
const surfaceCache = new WeakMap();
const bucket = v => Math.round(Math.log(Math.max(1, v)) * 25);
function surface(art, o, key, spec, back) {
  const L = letterSource(art);
  let m = surfaceCache.get(art);
  if (!m) surfaceCache.set(art, (m = new Map()));
  const id = [key, back ? 1 : 0, bucket(spec.w), bucket(spec.h), JSON.stringify({ ...spec, w: 0, h: 0 }), o.panel, o.stripe, o.pattern, o.cover].join("|");
  const hit = m.get(id);
  if (hit && hit.src === L) {
    m.delete(id);
    m.set(id, hit);
    return hit.c;
  }
  const c = paintSurface(key, spec, o, L, { back });
  m.set(id, { src: L, c });
  while (m.size > 24) m.delete(m.keys().next().value);
  return c;
}

/** The surface that carries the lettering, flat, for the PDF and the approval page. */
export function awningFlat(type, art, opts, W, D) {
  const o = sanitizeAwningOptions(type, opts);
  const mesh = awningMesh(type, o, W, D);
  const keys = Object.keys(mesh.tex);
  const key = keys.find(k => mesh.tex[k].letter) || keys[0];
  return paintSurface(key, mesh.tex[key], o, letterSource(art), { scale: 1 });
}

// ---------- backlit light ----------

const RAFTER_IN = 30; // frame rafters behind a backlit cover, typical spacing
const lightMaps = new Map();
/**
 * How light from tubes inside the frame reaches a backlit cover w × h inches: brightest in the
 * middle of each bay, falling off toward the edges, with soft dark bands where rafters block it.
 */
function backlitMap(w, h, rafters = true) {
  const key = `${Math.round(w / 4)}x${Math.round(h / 4)}${rafters ? "r" : ""}`;
  if (lightMaps.has(key)) return lightMaps.get(key);
  const c = makeCanvas(160, 64);
  const g = c.getContext("2d");
  const img = g.createImageData(c.width, c.height), d = img.data;
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const ribs = [];
  const n = Math.max(1, Math.round(w / RAFTER_IN));
  if (rafters && w > RAFTER_IN * 1.5) for (let i = 0; i <= n; i++) ribs.push((i / n) * w);
  for (let y = 0; y < c.height; y++) {
    const v = (y + 0.5) / c.height;
    const ev = 0.68 + 0.32 * smooth(0, 0.3, v) * smooth(0, 0.3, 1 - v);
    for (let x = 0; x < c.width; x++) {
      const u = (x + 0.5) / c.width, xi = u * w;
      const eu = 0.6 + 0.4 * smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u);
      let rib = 1;
      for (const r of ribs) rib = Math.min(rib, 1 - 0.3 * Math.exp(-(((xi - r) / 1.6) ** 2)));
      const k = Math.round(255 * eu * ev * rib), o = (y * c.width + x) * 4;
      d[o] = d[o + 1] = d[o + 2] = k; d[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  if (lightMaps.size > 16) lightMaps.delete(lightMaps.keys().next().value);
  lightMaps.set(key, c);
  return c;
}

let washTex = null;
/** Light thrown down from the bottom of a backlit awning: strong at the edge, fading with distance. */
function WASH() {
  if (washTex) return washTex;
  washTex = makeCanvas(64, 64);
  const g = washTex.getContext("2d");
  const img = g.createImageData(64, 64), d = img.data;
  for (let y = 0; y < 64; y++) {
    const v = y / 63, fall = (1 - v) ** 2.2;
    for (let x = 0; x < 64; x++) {
      const u = (x + 0.5) / 64, t = Math.min(1, Math.min(u, 1 - u) / 0.24), side = t * t * (3 - 2 * t);
      const k = Math.round(255 * fall * side), o = (y * 64 + x) * 4;
      d[o] = d[o + 1] = d[o + 2] = k; d[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return washTex;
}

// ---------- building the quads ----------

/**
 * Adds the awning to the scene. ctx: { layer, emit, spill, amb, softRect } from scene.js;
 * amb(v) is the ambient multiplier for an unlit part at this time of day.
 */
export function buildAwning(type, env, { layer, emit, spill, amb, softRect }) {
  const { W, H: D, night, art, cam } = env;
  const o = sanitizeAwningOptions(type, env.opts);
  const mesh = awningMesh(type, o, W, D);
  const lit = night && o.lit === "backlit";
  // A marquee lights only its fascia, from LED modules behind the face: no rafters, no light thrown down.
  const fascia = type.id === "aw-marquee";
  const glow = new Set(lit ? mesh.glow : []);
  const eye = cam?.eye || [W / 2, D * 0.5, Math.max(W, D) * 6];
  const depth = cam?.eye ? p => cam.depth(p[0], p[1], p[2]) : p => Math.hypot(p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]);
  const panel = hexToRgb(o.panel), frame = hexToRgb(o.frame);
  const COLORS = {
    frame, arm: frame, housing: frame, rod: hexToRgb(STAINLESS), edge: hexToRgb(GLASS_EDGE),
    deck: mulc(panel, 0.9), soffit: mulc(mix(panel, [1, 1, 1], 0.08), 0.95), blade: panel,
  };

  if (!night && mesh.shadow) {
    const s = mesh.shadow, h = Math.max(4, s.depth * 0.55);
    const sr = softRect(s.x1 - s.x0, h, Math.max(2, h * 0.35));
    layer(sr.canvas, [[s.x0 - sr.padIn + 1.5, s.y - h * 0.2 - sr.padIn, 0], [s.x1 + sr.padIn + 1.5, s.y - h * 0.2 - sr.padIn, 0], [s.x1 + sr.padIn + 1.5, s.y + h + sr.padIn, 0], [s.x0 - sr.padIn + 1.5, s.y + h + sr.padIn, 0]], { tint: [0, 0, 0], alpha: s.alpha });
  }

  const items = [];
  for (const f of mesh.faces) {
    const c = [0, 1, 2].map(i => (f.pts[0][i] + f.pts[1][i] + f.pts[2][i] + f.pts[3][i]) / 4);
    const front = dot(f.n, sub(eye, c)) > 0;
    items.push({ pass: front ? 3 : 1, d: depth(c), f, front });
  }
  for (const t of mesh.tubes) {
    const mid = [0, 1, 2].map(i => (t.a[i] + t.b[i]) / 2);
    items.push({ pass: t.inner || t.mat === "rod" ? 2 : 3, d: depth(mid), t, mid });
  }
  items.sort((a, b) => a.pass - b.pass || b.d - a.d);

  for (const it of items) {
    if (it.t) {
      const { a, b, r, mat } = it.t;
      const side = cross(sub(b, a), sub(eye, it.mid));
      const l = Math.hypot(side[0], side[1], side[2]);
      if (!(l > 1e-9)) continue;
      const s = side.map(v => (v / l) * r);
      layer(TUBE(), [addv(a, s), addv(b, s), sub(b, s), sub(a, s)], { mul: mulc(COLORS[mat] || frame, amb(1)) });
      continue;
    }
    const { f, front } = it;
    const spec = f.tex && mesh.tex[f.tex];
    const tex = spec ? surface(art, o, f.tex, spec, !front) : WHITE();
    const tint = spec ? null : COLORS[f.mat] || panel;
    const uv = spec ? f.uv : null;
    const sun = Math.max(0, dot(front ? f.n : f.n.map(v => -v), LIGHT));
    const isGlass = f.mat === "glass";
    if (glow.has(f.mat)) {
      const light = spec ? backlitMap(spec.w, spec.h, !fascia) : backlitMap(W, D, !fascia);
      layer(tex, f.pts, { uv, tint, light, mul: front ? 1.08 : 0.92 });
      layer(tex, f.pts, { uv, tint, light, mul: front ? 0.16 : 0.1, add: true });
      emit.push({ tex, pts: f.pts, uv, tint, light, mul: front ? 0.8 : 0.5 });
    } else {
      const v = isGlass ? 0.92 + 0.12 * sun : front ? 0.6 + 0.48 * sun : 0.34 + 0.14 * sun;
      layer(tex, f.pts, { uv, tint, mul: amb(v) });
    }
  }

  if (lit) {
    const P = mesh.P, sr = softRect(W, P, Math.max(4, P * 0.4));
    const tone = mix(panel, [1, 1, 1], 0.55);
    spill.push({ tex: sr.canvas, pts: [[-sr.padIn, D - sr.padIn, 0], [W + sr.padIn, D - sr.padIn, 0], [W + sr.padIn, D + P * 0.6 + sr.padIn, 0], [-sr.padIn, D + P * 0.6 + sr.padIn, 0]], tint: tone, mul: 0.7, add: true });
    // Downward wash on the storefront below, reaching farther under a deeper awning.
    if (!fascia) {
      const reach = Math.min(96, Math.max(36, P * 1.8));
      spill.push({ tex: WASH(), pts: [[-8, D - 2, 0], [W + 8, D - 2, 0], [W + 8, D + reach, 0], [-8, D + reach, 0]], tint: tone, mul: 1.15, add: true });
    }
  }
  return mesh;
}

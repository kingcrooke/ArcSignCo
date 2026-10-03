// The build kit: what a category's render rules use to describe a product in the photo.
//
// A category's build(type, env, kit) adds textured quads and hardware paths in plane coordinates
// (inches on the pinned quad: X across, Y down, Z out of the wall toward the viewer). Nothing is
// drawn here; scene.js projects and draws the plan afterwards.
//
//   kit.layer(tex, pts, o)  a textured quad. pts: 4 [x, y, z] corners (tl, tr, br, bl).
//                           o: { tint:[r,g,b], mul:number|[r,g,b], alpha, add, uv, light }
//   kit.path(o)             a stroked or filled 3D polyline: { pts, width (in), stroke, fill, close, alpha }
//   kit.emit.push(layer)    what glows at night (feeds bloom and wall spill)
//   kit.spill.push(layer)   light that lands on the wall at night
//   kit.amb(v)              multiplier for an unlit surface of brightness v at this time of day
//   kit.box / extrude / shadow / boxShadow / caps / cornerSpots   common construction helpers
import { makeCanvas, maskOf, blur, hexToRgb, WHITE, DISK } from "./art.js";

export const NIGHT_PHOTO = [0.2, 0.23, 0.31];
export const NIGHT_UNLIT = [0.44, 0.47, 0.56]; // non-lit products: still readable by street light
export const NIGHT_DARK = [0.16, 0.18, 0.24]; // unlit parts of lit products
export const WARM = "#fff1d6";
export const STEEL = "#2b2d31";

export const rect = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
export const rgbCss = (c, a = 1) => `rgba(${c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255)).join(",")},${a})`;
export const mulc = (c, m) => c.map((v, i) => v * (typeof m === "number" ? m : m[i]));

const softRects = new Map();
/** A white rectangle w × h inches with blurred edges (shadows, soft spill). */
export function softRect(w, h, blurIn) {
  const key = [w, h, blurIn].map(v => Math.round(v * 2) / 2).join("x");
  if (softRects.has(key)) return softRects.get(key);
  const k = 96 / Math.max(w, h, 1);
  const c = makeCanvas(Math.max(2, w * k), Math.max(2, h * k));
  const g = c.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, c.width, c.height);
  const b = blur(c, Math.max(0.6, blurIn * k));
  const v = { canvas: b.canvas, padIn: b.pad / k };
  if (softRects.size > 40) softRects.delete(softRects.keys().next().value);
  softRects.set(key, v);
  return v;
}

let spot = null;
/** A soft round light spot (lamp mouths, LEDs). */
export function SPOT() {
  if (spot) return spot;
  const c = makeCanvas(48, 48);
  const g = c.getContext("2d");
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(24, 24, 20, 0, Math.PI * 2);
  g.fill();
  spot = blur(c, 7).canvas;
  return spot;
}

const pools = new Map();
/** Light from n lamps across a face (opaque, a multiply map when floor is given) or on the wall (additive). */
export function lampPools(n, color, floor) {
  const key = `${n}${color}${floor ? floor.join() : "add"}`;
  if (pools.has(key)) return pools.get(key);
  const c = makeCanvas(256, 128);
  const g = c.getContext("2d");
  if (floor) {
    g.fillStyle = `rgb(${floor.map(v => Math.round(v * 255)).join(",")})`;
    g.fillRect(0, 0, 256, 128);
  }
  g.globalCompositeOperation = "lighter";
  const [r, gg, b] = hexToRgb(color).map(v => Math.round(v * 255));
  for (let i = 0; i < n; i++) {
    const u = ((i + 0.5) / n) * 256;
    g.save();
    g.translate(u, floor ? -14 : 30);
    g.scale((256 / n) * 0.62, floor ? 150 : 70);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, `rgba(${r},${gg},${b},${floor ? 0.95 : 0.8})`);
    grad.addColorStop(0.5, `rgba(${r},${gg},${b},${floor ? 0.45 : 0.25})`);
    grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    g.fillStyle = grad;
    g.fillRect(-1, -1, 2, 2);
    g.restore();
  }
  if (pools.size > 12) pools.delete(pools.keys().next().value);
  pools.set(key, c);
  return c;
}

/**
 * The kit handed to a category's build(). env: { W, H, cam, night, lit, litType, opts, art, wall, sliceCount }.
 * lit = this product glows right now (night and a lit style); litType = it would glow at night.
 */
export function makeKit(env) {
  const { W, H, night, litType, cam } = env;
  const ops = [], emit = [], spill = [];
  let batch = null;
  const layer = (tex, pts, o = {}) => {
    if (!tex) return;
    if (!batch) ops.push((batch = { kind: "layers", layers: [] }));
    batch.layers.push({ tex, pts, ...o });
    return batch;
  };
  const path = o => { batch = null; ops.push({ kind: "path", ...o }); };
  const amb = v => (night ? mulc(litType ? NIGHT_DARK : NIGHT_UNLIT, v) : [v, v, v]);
  const facing = (axis, sign, X, Y, Z) => !!cam && cam.facing(axis, sign, X, Y, Z);

  /** A solid box; only the faces the camera sees are added. */
  function box(x0, x1, y0, y1, z0, z1, color, { front = false, top = 1, side = 0.72, bottom = 0.45 } = {}) {
    const cy = (y0 + y1) / 2, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const T = WHITE();
    if (facing("y", -1, cx, y0, cz)) layer(T, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], { tint: color, mul: amb(top) });
    if (facing("y", 1, cx, y1, cz)) layer(T, [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], { tint: color, mul: amb(bottom) });
    if (facing("x", -1, x0, cy, cz)) layer(T, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], { tint: color, mul: amb(side) });
    if (facing("x", 1, x1, cy, cz)) layer(T, [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], { tint: color, mul: amb(side) });
    if (front) layer(T, rect(x0, y0, x1, y1, z1), { tint: color, mul: amb(0.9) });
  }
  /** Stack of mask slices from zb to zf: the returns of an extruded shape. */
  function extrude(mask, zb, zf, color, { mulBack = 0.5, mulFront = 0.8, emitAt = 0 } = {}) {
    const n = env.sliceCount(zb, zf);
    for (let i = 0; i <= n; i++) {
      const t = n ? i / n : 1;
      const z = zb + (zf - zb) * t;
      const m = mulBack + (mulFront - mulBack) * t;
      layer(mask, rect(0, 0, W, H, z), { tint: color, mul: emitAt ? [emitAt * m, emitAt * m, emitAt * m] : amb(m) });
    }
  }
  /** Daytime shadow of a mask standing `height` inches off the wall. */
  function shadow(mask, z0, height, { strength = 0.5, x0 = 0, y0 = 0, x1 = W, y1 = H } = {}) {
    if (night || height <= 0) return;
    const mk = mask.width / (x1 - x0);
    const b = blur(mask, Math.max(0.6, (0.3 + 0.22 * height) * mk));
    const pad = b.pad / mk, dy = 0.2 + 0.45 * height, dx = 0.1 * height;
    layer(b.canvas, rect(x0 - pad + dx, y0 - pad + dy, x1 + pad + dx, y1 + pad + dy, z0), { tint: [0, 0, 0], alpha: Math.min(0.62, strength + 0.03 * height) });
  }
  /** Daytime shadow of a rectangle standing `height` inches off the wall. */
  function boxShadow(x0, y0, x1, y1, height, strength = 0.45) {
    if (night || height <= 0) return;
    const s = softRect(x1 - x0, y1 - y0, 0.35 + 0.3 * height);
    const dy = 0.25 + 0.45 * height, dx = 0.1 * height;
    layer(s.canvas, rect(x0 - s.padIn + dx, y0 - s.padIn + dy, x1 + s.padIn + dx, y1 + s.padIn + dy, 0), { tint: [0, 0, 0], alpha: strength });
  }
  /** Round standoff caps at the given [x, y] points. */
  function caps(points, z, rIn = 0.5) {
    for (const [x, y] of points) layer(DISK(), rect(x - rIn, y - rIn, x + rIn, y + rIn, z), { mul: amb(1) });
  }
  function cornerSpots(x0, y0, x1, y1) {
    const inset = Math.min(2.5, (x1 - x0) * 0.08, (y1 - y0) * 0.14);
    return [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]];
  }

  return {
    ops, emit, spill, layer, path, amb, facing, box, extrude, shadow, boxShadow, caps, cornerSpots, softRect,
    rect, mulc, maskOf, hexToRgb, WHITE, DISK,
  };
}

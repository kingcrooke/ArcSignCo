// Builds each sign type as real construction (returns, faces, trim, raceway, cabinet, standoffs,
// brackets, lamps) in the photo's perspective, and lights it for day or night.
//
// Plane coordinates are inches on the pinned quad: X across, Y down, Z out of the wall toward the
// viewer. A type is turned into an ordered list of ops (textured quads and hardware paths), plus
// "emit" layers (what glows) and "spill" layers (light that lands on the wall). Night mode darkens
// the photo, adds the spill on the wall (photo × light), draws the sign with lit parts at full
// strength and everything else at ambient, then adds bloom. Non-lit types never emit.
import { makeCamera, squareToQuad, apply3, dist, bounds } from "./geometry.js";
import { createRenderer } from "./renderer.js";
import {
  makeCanvas, maskOf, morph, ring, blur, tube, averageColor, hexToRgb, mix, alphaBounds, WHITE, DISK,
} from "./art.js";
import { isLit } from "./sign-types.js";

const NIGHT_PHOTO = [0.2, 0.23, 0.31];
const NIGHT_UNLIT = [0.44, 0.47, 0.56]; // non-lit signs: still readable by street light
const NIGHT_DARK = [0.16, 0.18, 0.24]; // unlit parts of lit signs
const WARM = "#fff1d6";
const STEEL = "#2b2d31";

// floor: share of the wall light added regardless of the wall's color, so a halo still reads on
// a near-black fascia the way it does in person.
const LIGHT_FX = {
  face: { spill: 0.32, bloom: 0.5 },
  "face-sides": { spill: 0.45, bloom: 0.6 },
  halo: { spill: 0.12, bloom: 0.35, floor: 0.42 },
  "face-halo": { spill: 0.3, bloom: 0.5, floor: 0.32 },
  neon: { spill: 0.95, bloom: 0.95 },
  internal: { spill: 0.35, bloom: 0.42 },
  "internal-letters": { spill: 0.3, bloom: 0.5 },
  external: { spill: 0, bloom: 0.55 },
  none: { spill: 0, bloom: 0 },
};

/** Default per-type options; the editor shows controls for the ones the type lists. */
export function defaultOptions(type) {
  const r = type.render;
  return {
    returns: typeof r.returns === "string" && r.returns.startsWith("#") ? r.returns : "",
    trim: r.trimColor || "",
    raceway: "",
    panel: type.id === "awning" ? "#7a1f1f" : "#0b1d33",
    frame: r.frameColor || "",
    light: WARM,
    side: "left",
    fabric: "solid",
    edge: "straight",
  };
}

/**
 * The flat artwork a type uses as its face: this sets the sign's aspect and is the fab source.
 * Awnings need the size, because the valance is a fixed height whatever the awning's width.
 */
export function faceArt(type, art, options = {}, sizeIn = null) {
  const k = type.render.kind;
  if (k === "letters" || k === "neon") return art.letters;
  if (k === "flat") return art.cutout ? art.letters : art.source;
  if (k === "awning") {
    const W = sizeIn?.width || 144, D = sizeIn?.height || 36;
    return awningValance(art, options, W, awningDims(type, W, D).vr);
  }
  return art.layout(options.panel || "#0b1d33").panel;
}

/** Height/width the pinned quad should have for this type and artwork. */
export function aspectFor(type, art, options) {
  if (type.render.kind === "awning") return 0.3;
  const c = faceArt(type, art, options);
  return c.height / c.width;
}

const STRIPE_IN = 9; // stripe repeat across the fabric, inches
const CREAM = "#efe8d6";

// Projection and valance height for a pinned awning W wide with drop D (inches).
function awningDims(type, W, D) {
  const r = type.render;
  return { p: Math.min(r.projection * 1.34, Math.max(r.projection * 0.67, D * 1.1)), vr: Math.min(r.valance, D * 0.45) };
}

// Fabric seen straight on: solid, or vertical stripes running down the slope.
function fabricTexture(color, stripes, W) {
  const key = `fabric${color}${stripes}${Math.round(W / STRIPE_IN)}`;
  if (pools.has(key)) return pools.get(key);
  const n = Math.max(2, Math.round(W / STRIPE_IN));
  const c = makeCanvas(stripes ? Math.min(2048, n * 16) : 4, 4);
  const g = c.getContext("2d");
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, 4);
  if (stripes) {
    g.fillStyle = CREAM;
    const w = c.width / n;
    for (let i = 0; i < n; i += 2) g.fillRect((i + (n % 2 ? 0.5 : 0)) * w, 0, w, 4);
  }
  pools.set(key, c);
  return c;
}

function awningValance(art, options, W, vr) {
  const L = art.cutout ? art.letters : art.source;
  const color = options.panel || "#7a1f1f", stripes = options.fabric === "stripes", scallop = options.edge === "scalloped";
  const key = `valance${color}${stripes}${scallop}${Math.round(W)}x${Math.round(vr * 2)}`;
  art.__valance ||= new Map();
  const hit = art.__valance.get(key);
  if (hit && hit.src === L) return hit.c;
  const h = 200, w = Math.min(4096, Math.round((h * W) / vr));
  const c = makeCanvas(w, h);
  const g = c.getContext("2d");
  const lobe = scallop ? h * 0.38 : 0;
  g.fillStyle = color;
  g.fillRect(0, 0, w, h - lobe);
  if (scallop) {
    const n = Math.max(2, Math.round(W / (vr * 1.25))), p = w / n;
    g.beginPath();
    for (let i = 0; i < n; i++) g.ellipse((i + 0.5) * p, h - lobe, p / 2, lobe, 0, 0, Math.PI);
    g.fill();
  }
  // Striped awnings keep a solid valance so the lettering stays readable; only the scallops stripe.
  if (stripes && scallop) {
    g.save();
    g.beginPath();
    g.rect(0, h - lobe, w, lobe);
    g.clip();
    g.globalCompositeOperation = "source-atop";
    g.drawImage(fabricTexture(color, true, W), 0, 0, w, h);
    g.restore();
  }
  // Binding along the cut edge.
  g.fillStyle = "rgba(0,0,0,.28)";
  if (!scallop) g.fillRect(0, h - h * 0.07, w, h * 0.07);
  // Lettering fills the band above the cut, centered, at most 68% of the band's height.
  const band = h - lobe;
  const k = Math.min((band * 0.68) / L.height, (w * 0.86) / L.width);
  const lw = L.width * k, lh = L.height * k;
  g.drawImage(L, (w - lw) / 2, (band - lh) / 2, lw, lh);
  if (art.__valance.size > 8) art.__valance.delete(art.__valance.keys().next().value);
  art.__valance.set(key, { src: L, c });
  return c;
}

const softRects = new Map();
function softRect(w, h, blurIn) {
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
function SPOT() {
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
// Light from gooseneck lamps across a face (opaque, used as a multiply map) or on the wall (additive).
function lampPools(n, color, floor) {
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

const rect = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const rgbCss = (c, a = 1) => `rgba(${c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255)).join(",")},${a})`;
const mulc = (c, m) => c.map((v, i) => v * (typeof m === "number" ? m : m[i]));

// Standoff positions: near the bottom of each letter, where they show in the gap from below.
function standoffSpots(mask, W, H) {
  const s = makeCanvas(Math.min(256, mask.width), Math.max(1, Math.round(Math.min(256, mask.width) * (mask.height / mask.width))));
  const g = s.getContext("2d", { willReadFrequently: true });
  g.drawImage(mask, 0, 0, s.width, s.height);
  const d = g.getImageData(0, 0, s.width, s.height).data;
  const at = (x, y) => d[(y * s.width + x) * 4 + 3] > 160;
  const out = [];
  const bin = Math.max(3, Math.round((H * 0.5) / (W / s.width)));
  const inset = Math.max(1, Math.round(1.2 / (H / s.height)));
  for (let x0 = Math.floor(bin / 2); x0 < s.width; x0 += bin) {
    for (let y = s.height - 1 - inset; y > inset; y--) {
      if (at(x0, y) && at(x0, y + inset) && at(x0, y - inset)) {
        out.push([(x0 + 0.5) * (W / s.width), (y + 0.5) * (H / s.height)]);
        break;
      }
    }
  }
  return out;
}

/**
 * Turns a type into draw ops. Pure description; nothing is drawn here.
 * env: { W, H, cam, night, opts, art, wall:[r,g,b], maxSlices, sliceCount(zb, zf) }
 */
function build(type, env) {
  const { W, H, night, opts, art, cam } = env;
  const r = type.render;
  const lit = isLit(type) && night;
  const ops = [], emit = [], spill = [];
  let batch = null;
  const layer = (tex, pts, o = {}) => {
    if (!tex) return;
    if (!batch) ops.push((batch = { kind: "layers", layers: [] }));
    batch.layers.push({ tex, pts, ...o });
    return batch;
  };
  const path = o => { batch = null; ops.push({ kind: "path", ...o }); };
  // Ambient multiplier for unlit material at this time of day.
  const amb = v => (night ? mulc(isLit(type) ? NIGHT_DARK : NIGHT_UNLIT, v) : [v, v, v]);
  const light = hexToRgb(opts.light || WARM);
  const facing = (axis, sign, X, Y, Z) => !!cam && cam.facing(axis, sign, X, Y, Z);

  function box(x0, x1, y0, y1, z0, z1, color, { front = false, top = 1, side = 0.72, bottom = 0.45 } = {}) {
    const cy = (y0 + y1) / 2, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const T = WHITE();
    if (facing("y", -1, cx, y0, cz)) layer(T, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], { tint: color, mul: amb(top) });
    if (facing("y", 1, cx, y1, cz)) layer(T, [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], { tint: color, mul: amb(bottom) });
    if (facing("x", -1, x0, cy, cz)) layer(T, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], { tint: color, mul: amb(side) });
    if (facing("x", 1, x1, cy, cz)) layer(T, [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], { tint: color, mul: amb(side) });
    if (front) layer(T, rect(x0, y0, x1, y1, z1), { tint: color, mul: amb(0.9) });
  }
  // Stack of mask slices from zb to zf: the returns of an extruded shape.
  function extrude(mask, zb, zf, color, { mulBack = 0.5, mulFront = 0.8, emitAt = 0 } = {}) {
    const n = env.sliceCount(zb, zf);
    for (let i = 0; i <= n; i++) {
      const t = n ? i / n : 1;
      const z = zb + (zf - zb) * t;
      const m = mulBack + (mulFront - mulBack) * t;
      layer(mask, rect(0, 0, W, H, z), { tint: color, mul: emitAt ? [emitAt * m, emitAt * m, emitAt * m] : amb(m) });
    }
  }
  function shadow(mask, z0, height, { strength = 0.5, x0 = 0, y0 = 0, x1 = W, y1 = H } = {}) {
    if (night || height <= 0) return;
    const mk = mask.width / (x1 - x0);
    const b = blur(mask, Math.max(0.6, (0.3 + 0.22 * height) * mk));
    const pad = b.pad / mk, dy = 0.2 + 0.45 * height, dx = 0.1 * height;
    layer(b.canvas, rect(x0 - pad + dx, y0 - pad + dy, x1 + pad + dx, y1 + pad + dy, z0), { tint: [0, 0, 0], alpha: Math.min(0.62, strength + 0.03 * height) });
  }
  function boxShadow(x0, y0, x1, y1, height, strength = 0.45) {
    if (night || height <= 0) return;
    const s = softRect(x1 - x0, y1 - y0, 0.35 + 0.3 * height);
    const dy = 0.25 + 0.45 * height, dx = 0.1 * height;
    layer(s.canvas, rect(x0 - s.padIn + dx, y0 - s.padIn + dy, x1 + s.padIn + dx, y1 + s.padIn + dy, 0), { tint: [0, 0, 0], alpha: strength });
  }
  function caps(points, z, rIn = 0.5) {
    for (const [x, y] of points) layer(DISK(), rect(x - rIn, y - rIn, x + rIn, y + rIn, z), { mul: amb(1) });
  }
  function cornerSpots(x0, y0, x1, y1) {
    const inset = Math.min(2.5, (x1 - x0) * 0.08, (y1 - y0) * 0.14);
    return [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]];
  }

  const kind = r.kind;
  if (kind === "letters") {
    const L = art.letters, M = maskOf(L), mk = M.width / W;
    const race = r.raceway;
    const gap = race ? race.depth : r.gap, zb = gap, zf = gap + r.depth;
    const trimPx = r.trim ? Math.max(0.8, 0.3 * mk) : 0;
    const outer = trimPx ? morph(M, trimPx) : M;
    const artColor = art.color;
    const retColor = opts.returns ? hexToRgb(opts.returns)
      : r.returns === "art" ? artColor : r.returns === "art-dark" ? mulc(artColor, 0.55) : hexToRgb(r.returns);
    const halo = !!r.halo;
    const faceLit = ["face", "face-sides", "face-halo"].includes(type.lighting);

    if (race) {
      const b = alphaBounds(L);
      const bx0 = b ? (b.x / L.width) * W : 0, bx1 = b ? ((b.x + b.w) / L.width) * W : W;
      const by0 = b ? (b.y / L.height) * H : 0, by1 = b ? ((b.y + b.h) / L.height) * H : H;
      const rh = Math.min(race.height, (by1 - by0) * 0.7);
      const cy = (by0 + by1) / 2 + (by1 - by0) * 0.04;
      const rx0 = bx0 - 1.5, rx1 = bx1 + 1.5, ry0 = cy - rh / 2, ry1 = cy + rh / 2;
      // Painted to match the wall, which never matches exactly: lift it a little so it reads.
      const rc = opts.raceway ? hexToRgb(opts.raceway) : mix(env.wall, [0.8, 0.8, 0.8], 0.16);
      boxShadow(rx0, ry0, rx1, ry1, race.depth, 0.5);
      box(rx0, rx1, ry0, ry1, 0, race.depth, rc, { top: 1.15, side: 0.8, bottom: 0.42 });
      layer(WHITE(), rect(rx0, ry0, rx1, ry1, race.depth), { tint: rc, mul: amb(1) });
      path({ pts: [[rx0, ry0, race.depth], [rx1, ry0, race.depth]], width: 0.25, stroke: mulc(mix(rc, [1, 1, 1], 0.35), night ? NIGHT_DARK : [1, 1, 1]), alpha: 0.8 });
    } else {
      shadow(outer, 0, zf, { strength: halo ? 0.38 : 0.42 });
    }
    if (gap >= 0.4 && !race) {
      const spots = standoffSpots(M, W, H);
      for (const [x, y] of spots) {
        layer(WHITE(), [[x - 0.3, y, 0], [x + 0.3, y, 0], [x + 0.3, y, zb], [x - 0.3, y, zb]], { tint: hexToRgb("#9a9ea5"), mul: amb(0.7) });
        layer(WHITE(), [[x, y - 0.3, 0], [x, y + 0.3, 0], [x, y + 0.3, zb], [x, y - 0.3, zb]], { tint: hexToRgb("#8a8e95"), mul: amb(0.6) });
      }
    }
    if (r.face === "open") {
      extrude(outer, zb, zf, retColor, { mulBack: 0.35, mulFront: 0.7 });
      const tubeIn = r.tube || 0.5;
      const T = tube(M, Math.max(1, (tubeIn / 2) * mk));
      const tc = night ? mix(artColor, [1, 1, 1], 0.3) : mix(artColor, [1, 1, 1], 0.4);
      if (lit) layer(outer, rect(0, 0, W, H, zf - 0.3), { tint: artColor, mul: 0.16, add: true, alpha: 0.7 });
      layer(T, rect(0, 0, W, H, zb + 1), { tint: tc, mul: lit ? 1 : amb(0.95) });
      if (lit) layer(T, rect(0, 0, W, H, zb + 1), { tint: artColor, mul: 0.5, add: true });
      layer(ring(outer, Math.max(1, 0.18 * mk)), rect(0, 0, W, H, zf), { tint: mulc(retColor, 1.6), mul: amb(1) });
      if (lit) emit.push({ tex: T, pts: rect(0, 0, W, H, zb + 1), tint: artColor, mul: 1.5 });
    } else {
      const sidesLit = !!r.sidesLit && lit;
      extrude(outer, zb, zf, retColor, sidesLit ? { mulBack: 0.45, mulFront: 0.85, emitAt: 1 } : {});
      if (trimPx) layer(outer, rect(0, 0, W, H, zf), { tint: hexToRgb(opts.trim || r.trimColor || "#202226"), mul: amb(0.95) });
      const faceMul = lit && faceLit ? 1 : lit && halo ? [0.13, 0.13, 0.15] : amb(1);
      layer(L, rect(0, 0, W, H, zf + 0.02), { mul: faceMul });
      if (lit && faceLit) {
        layer(L, rect(0, 0, W, H, zf + 0.02), { mul: 0.18, add: true });
        emit.push({ tex: L, pts: rect(0, 0, W, H, zf), mul: 1 });
        if (sidesLit) emit.push({ tex: outer, pts: rect(0, 0, W, H, zf - r.depth / 2), tint: artColor, mul: 0.6 });
      }
    }
    if (lit && halo) {
      const near = blur(outer, Math.max(0.8, (0.35 * gap + 0.25) * mk));
      const far = blur(outer, Math.max(1.5, (1.4 * gap + 1.2) * mk));
      for (const [b, m] of [[near, 1.5], [far, 1.6]]) {
        const p = b.pad / mk;
        spill.push({ tex: b.canvas, pts: rect(-p, -p, W + p, H + p, 0), tint: light, mul: m, add: true });
      }
      const p = far.pad / mk;
      emit.push({ tex: far.canvas, pts: rect(-p, -p, W + p, H + p, 0), tint: light, mul: 0.35 });
    }
  } else if (kind === "cabinet") {
    const zb = r.gap || 0, zf = zb + r.depth, fr = r.frame || 0;
    const frameC = hexToRgb(opts.frame || r.frameColor || "#24262b");
    const lay = art.layout(opts.panel || "#0b1d33");
    boxShadow(0, 0, W, H, zf, 0.45);
    box(0, W, 0, H, zb, zf, frameC, { top: 0.95, side: 0.66, bottom: 0.42 });
    if (fr > 0) layer(WHITE(), rect(0, 0, W, H, zf), { tint: frameC, mul: amb(0.92) });
    if (r.face === "routed") {
      const plate = opts.panel ? hexToRgb(opts.panel) : lay.bg;
      layer(WHITE(), rect(fr, fr, W - fr, H - fr, zf + 0.01), { tint: plate, mul: amb(0.95) });
      const C = lay.copy, CM = maskOf(C);
      const push = r.push || 0.75;
      const edge = [0.93, 0.95, 0.97];
      extrude(CM, zf, zf + push, edge, lit ? { mulBack: 0.6, mulFront: 0.9, emitAt: 1 } : { mulBack: 0.7, mulFront: 0.92 });
      layer(C, rect(fr, fr, W - fr, H - fr, zf + push + 0.01), { mul: lit ? 1 : amb(1) });
      if (lit) {
        layer(C, rect(fr, fr, W - fr, H - fr, zf + push + 0.01), { mul: 0.2, add: true });
        emit.push({ tex: C, pts: rect(fr, fr, W - fr, H - fr, zf + push), mul: 1 });
        emit.push({ tex: CM, pts: rect(fr, fr, W - fr, H - fr, zf + push / 2), tint: [1, 1, 1], mul: 0.5 });
      }
    } else {
      const face = rect(fr, fr, W - fr, H - fr, zf + 0.01);
      layer(lay.panel, face, { mul: lit ? 1 : amb(0.98) });
      if (lit) {
        layer(lay.panel, face, { mul: 0.14, add: true });
        emit.push({ tex: lay.panel, pts: face, mul: 0.85 });
      }
    }
  } else if (kind === "blade") {
    const t = r.thick, side = opts.side === "right" ? 1 : -1;
    const wallX = side < 0 ? -r.arm : W + r.arm, edgeX = side < 0 ? 0 : W, zc = -t / 2;
    const steel = hexToRgb(STEEL);
    const lay = art.layout(opts.panel || "#0b1d33");
    const frameC = hexToRgb(opts.frame || r.frameColor || "#24262b");
    const plateTop = r.bracket ? -8 : -3, plateBot = r.bracket ? H * 0.6 : H + 3;
    layer(WHITE(), [[wallX, plateTop, zc - 3.5], [wallX, plateTop, zc + 3.5], [wallX, plateBot, zc + 3.5], [wallX, plateBot, zc - 3.5]], { tint: steel, mul: amb(0.8) });
    if (r.bracket) {
      const far = side < 0 ? W + 2.5 : -2.5;
      path({ pts: [[wallX, -3, zc], [far, -3, zc]], width: 1.25, stroke: mulc(steel, night ? NIGHT_UNLIT : [1, 1, 1]) });
      const n = 18, cx = wallX - side * Math.min(r.arm + W * 0.35, W * 0.5), braceTop = -3;
      const brace = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        brace.push([wallX + (cx - wallX) * u, plateBot * 0.75 * (1 - u) * (1 - u) + braceTop * (1 - (1 - u) * (1 - u)), zc]);
      }
      path({ pts: brace, width: 0.9, stroke: mulc(steel, night ? NIGHT_UNLIT : [1, 1, 1]) });
      const rr = Math.min(4, H * 0.12), sc = [wallX - side * (rr + 1.5), braceTop + rr + 1, zc];
      const curl = [];
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 1.75 + (side < 0 ? 0 : Math.PI);
        curl.push([sc[0] + Math.cos(a) * rr * (1 - i / 60), sc[1] + Math.sin(a) * rr * (1 - i / 60), zc]);
      }
      path({ pts: curl, width: 0.6, stroke: mulc(steel, night ? NIGHT_UNLIT : [1, 1, 1]) });
      for (const x of [W * 0.12, W * 0.88]) path({ pts: [[x, -3, zc], [x, 0.4, zc]], width: 0.4, stroke: mulc(steel, night ? NIGHT_UNLIT : [1, 1, 1]) });
    } else {
      for (const y of [H * 0.16, H * 0.84]) {
        box(Math.min(wallX, edgeX), Math.max(wallX, edgeX), y - 0.9, y + 0.9, zc - 0.9, zc + 0.9, steel, { front: true });
      }
    }
    box(0, W, 0, H, -t, 0, r.lit ? frameC : hexToRgb(opts.frame || r.frameColor || "#1b1c1f"), { top: 1, side: 0.7, bottom: 0.45 });
    const fr = r.lit ? Math.min(1.25, W * 0.04) : 0;
    if (fr) layer(WHITE(), rect(0, 0, W, H, 0), { tint: frameC, mul: amb(0.92) });
    const face = rect(fr, fr, W - fr, H - fr, 0.01);
    const litFace = r.lit && night;
    layer(lay.panel, face, { mul: litFace ? 1 : amb(1) });
    if (litFace) {
      layer(lay.panel, face, { mul: 0.14, add: true });
      emit.push({ tex: lay.panel, pts: face, mul: 0.85 });
    }
  } else if (kind === "panel") {
    const zb = r.gap, zf = zb + r.thick;
    const lay = art.layout(opts.panel || "#0b1d33");
    boxShadow(0, 0, W, H, zf, r.lamps ? 0.36 : 0.4);
    box(0, W, 0, H, zb, zf, hexToRgb("#c4c7cc"), { side: 0.75 });
    const lampsOn = r.lamps && night;
    const n = r.lamps ? Math.max(2, Math.min(6, Math.round(W / 42))) : 0;
    layer(lay.panel, rect(0, 0, W, H, zf), lampsOn ? { mul: 1, light: lampPools(n, opts.light || WARM, NIGHT_UNLIT.map(v => v * 0.55)) } : { mul: amb(1) });
    if (r.standoffs) caps(cornerSpots(0, 0, W, H), zf + 0.35, 0.5);
    if (r.lamps) {
      const reach = Math.min(30, Math.max(16, H * 0.35 + 14));
      const steel = mulc(hexToRgb(STEEL), night ? NIGHT_UNLIT : [1, 1, 1]);
      for (let i = 0; i < n; i++) {
        const x = (W * (i + 0.5)) / n;
        const arm = [];
        for (let k = 0; k <= 20; k++) {
          const u = k / 20;
          arm.push([x, -4 - 12 * Math.sin(u * Math.PI * 0.85), reach * (1 - Math.cos(u * Math.PI * 0.5))]);
        }
        layer(DISK(), rect(x - 2.2, -6.2, x + 2.2, -1.8, 0.1), { tint: hexToRgb(STEEL), mul: amb(1.2) });
        path({ pts: arm, width: 0.9, stroke: steel });
        const end = arm[arm.length - 1];
        const ax = [0, H * 0.25 - end[1], -end[2]];
        const al = Math.hypot(ax[1], ax[2]);
        const d = [0, ax[1] / al, ax[2] / al];
        const mouth = [x, end[1] + d[1] * 7, end[2] + d[2] * 7];
        path({
          pts: [[x - 1.6, end[1], end[2]], [x + 1.6, end[1], end[2]], [x + 4.2, mouth[1], mouth[2]], [x - 4.2, mouth[1], mouth[2]]],
          fill: steel, close: true,
        });
        if (night) {
          emit.push({ tex: SPOT(), pts: rect(x - 5, mouth[1] - 2.5, x + 5, mouth[1] + 2.5, mouth[2]), tint: light, mul: 1.6 });
          path({ pts: [[x - 3.6, mouth[1], mouth[2]], [x + 3.6, mouth[1], mouth[2]]], width: 1, stroke: mix(light, [1, 1, 1], 0.5) });
        }
      }
      if (night) spill.push({ tex: lampPools(n, opts.light || WARM, null), pts: rect(-W * 0.06, -H * 0.45, W * 1.06, H * 1.1, 0), mul: 1.4, add: true });
    }
  } else if (kind === "neon") {
    const L = art.letters, M = maskOf(L), mk = M.width / W;
    const zb = r.gap, zf = zb + r.thick, m = 2;
    const T = tube(M, Math.max(1, ((r.tube || 0.5) / 2) * mk));
    const color = art.color;
    if (!night) {
      boxShadow(-m, -m, W + m, H + m, zf, 0.12);
      shadow(T, 0, zf + 0.3, { strength: 0.38 });
    }
    layer(WHITE(), rect(-m, -m, W + m, H + m, zf), { tint: [0.86, 0.92, 0.96], alpha: night ? 0.05 : 0.1, mul: amb(1) });
    const glass = mulc([0.92, 0.96, 1], night ? NIGHT_UNLIT : [1, 1, 1]);
    path({ pts: [[-m, -m, zf], [W + m, -m, zf], [W + m, H + m, zf], [-m, H + m, zf]], close: true, width: 0.3, stroke: glass, alpha: 0.55 });
    caps(cornerSpots(-m, -m, W + m, H + m), zf + 0.3, 0.45);
    const tc = night ? mix(color, [1, 1, 1], 0.55) : mix(color, [1, 1, 1], 0.42);
    layer(T, rect(0, 0, W, H, zf + 0.3), { tint: tc, mul: night ? 1 : amb(0.98) });
    if (night) {
      emit.push({ tex: T, pts: rect(0, 0, W, H, zf + 0.3), tint: color, mul: 1.6 });
      const g = blur(T, Math.max(1, 0.8 * mk)), p = g.pad / mk;
      layer(g.canvas, rect(-p, -p, W + p, H + p, zf + 0.25), { tint: color, mul: 0.8, add: true });
    }
  } else if (kind === "flat") {
    const src = art.cutout ? art.letters : art.source;
    const glass = r.surface === "glass";
    const b = layer(src, rect(0, 0, W, H, 0), { mul: amb(glass ? 0.98 : 1), alpha: glass ? 0.95 : 0.94 });
    if (!glass) b.paint = true;
  } else if (kind === "awning") {
    buildAwning(type, env, { layer, path, amb, box, opts });
  }
  return { ops, emit, spill, fx: LIGHT_FX[type.lighting] || LIGHT_FX.none };
}

// Traditional slope with closed sides. The pinned patch is the wall area it covers, top attachment line to the bottom bar (drop D).
// The roof runs from the wall at Y=0 out to the front bar at projection P and Y=Dc; the rigid
// valance hangs from Dc to D; the side panels are trapezoids; the underside is open.
function buildAwning(type, env, { layer, path, amb, opts }) {
  const { W, H: D, night, art, cam } = env;
  const { p: P, vr } = awningDims(type, W, D);
  const dc = D - vr;
  const color = opts.panel || "#7a1f1f";
  const fabric = hexToRgb(color);
  const stripes = opts.fabric === "stripes";
  const shade = v => mulc(fabric, night ? mulc(NIGHT_UNLIT, v) : [v, v, v]);
  const steel = mulc(hexToRgb("#3a3d42"), night ? NIGHT_UNLIT : [1, 1, 1]);
  if (!night) {
    const s = softRect(W, P * 0.55, 4);
    layer(s.canvas, rect(-s.padIn + 2, D - s.padIn, W + s.padIn + 2, D + P * 0.55 + s.padIn, 0), { tint: [0, 0, 0], alpha: 0.38 });
  }
  const sidePts = x => [[x, 0, 0], [x, dc, P], [x, D, P], [x, D, 0]];
  const sides = [[0, -1], [W, 1]];
  const sideVisible = ([x, s]) => !!cam && cam.facing("x", s, x, D / 2, P / 2);
  for (const s of sides.filter(s => !sideVisible(s))) path({ pts: sidePts(s[0]), close: true, fill: shade(0.48) });
  if (cam && cam.facing("y", 1, W / 2, D, P / 2)) {
    // Open underside: the inside of the cover in shade, and the frame's projection bars.
    layer(WHITE(), [[0, D, P], [W, D, P], [W, D, 0], [0, D, 0]], { tint: fabric, mul: amb(0.28) });
    const bars = Math.max(2, Math.ceil(W / 60) + 1);
    for (let i = 0; i < bars; i++) {
      const x = (W * i) / (bars - 1);
      path({ pts: [[x, D, 0.5], [x, D, P]], width: 0.75, stroke: steel, alpha: 0.8 });
    }
  }
  const tex = fabricTexture(color, stripes, W);
  layer(tex, [[0, 0, 0], [W, 0, 0], [W, dc, P], [0, dc, P]], { mul: night ? mulc(NIGHT_UNLIT, 1) : [1.06, 1.06, 1.06] });
  if (!stripes) {
    // Seams where the 46" fabric widths are sewn together.
    const seams = Math.max(1, Math.round(W / 44));
    for (let i = 1; i < seams; i++) {
      const x = (W * i) / seams;
      path({ pts: [[x, 0, 0], [x, dc, P]], width: 0.3, stroke: shade(0.78), alpha: 0.6 });
    }
  }
  for (const s of sides.filter(sideVisible)) path({ pts: sidePts(s[0]), close: true, fill: shade(0.8) });
  path({ pts: [[0, dc, P], [W, dc, P]], width: 0.8, stroke: shade(0.62) });
  layer(awningValance(art, opts, W, vr), rect(0, dc, W, D, P + 0.05), { mul: amb(1) });
}

/** Average wall color around the quad (raceways are painted to match the wall). */
function sampleWall(photo, quad) {
  const b = bounds(quad);
  const pad = (b.maxX - b.minX) * 0.08;
  const x = Math.max(0, b.minX - pad), y = Math.max(0, b.minY - pad);
  const w = Math.min(photo.width, b.maxX + pad) - x, h = Math.min(photo.height, b.maxY + pad) - y;
  if (w < 2 || h < 2) return [0.55, 0.55, 0.55];
  const c = makeCanvas(24, 24);
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(photo, x, y, w, h, 0, 0, 24, 24);
  const d = g.getImageData(0, 0, 24, 24).data;
  const px = [];
  for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
  px.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));
  const mid = px.slice(Math.floor(px.length * 0.3), Math.ceil(px.length * 0.7));
  return [0, 1, 2].map(k => mid.reduce((s, p) => s + p[k], 0) / mid.length / 255);
}

function half(src) {
  const c = makeCanvas(Math.max(1, src.width / 2), Math.max(1, src.height / 2));
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

function intersect(a, b) {
  const x0 = Math.max(a.x, b.x), y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.x + a.w, b.x + b.w), y1 = Math.min(a.y + a.h, b.y + b.h);
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}
const grow = (b, p) => ({ x: b.x - p, y: b.y - p, w: b.w + 2 * p, h: b.h + 2 * p });

export function createScene() {
  let renderer = null;
  const R = () => {
    if (!renderer || !renderer.ok) renderer = createRenderer({ forceCpu: !!renderer });
    return renderer;
  };
  let wallKey = "", wallColor = [0.55, 0.55, 0.55];

  /**
   * Draws the photo and the sign into ctx (identity transform, target pixels).
   * o: { photo, view:{s,x,y} photo->target, clip:{w,h}, quad (photo px), art, type, options,
   *      mode:'day'|'night', quality:'draft'|'full', sizeIn:{width,height}, opacity }
   */
  function render(ctx, o) {
    const { photo, view } = o;
    const night = o.mode === "night";
    const photoBox = { x: view.x, y: view.y, w: photo.width * view.s, h: photo.height * view.s };
    const clip = intersect({ x: 0, y: 0, w: o.clip.w, h: o.clip.h }, photoBox) || { x: 0, y: 0, w: 0, h: 0 };
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(photo, photoBox.x, photoBox.y, photoBox.w, photoBox.h);
    if (night) {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = rgbCss(NIGHT_PHOTO);
      ctx.fillRect(clip.x, clip.y, clip.w, clip.h);
      ctx.globalCompositeOperation = "source-over";
    }
    if (!o.quad || !o.art || !o.type || !clip.w) { ctx.restore(); return; }

    const { quad, type } = o;
    const W = o.sizeIn.width, H = o.sizeIn.height;
    const lens = { cx: photo.width / 2, cy: photo.height / 2, f: 0.85 * Math.max(photo.width, photo.height) };
    const cam = makeCamera(quad, o.sizeIn, lens);
    const flat = squareToQuad(quad);
    const T = p => p && { x: view.x + p.x * view.s, y: view.y + p.y * view.s };
    const P = (X, Y, Z) => T(cam ? cam.project(X, Y, Z) : flat && apply3(flat, X / W, Y / H));

    const key = quad.map(p => `${Math.round(p.x / 8)},${Math.round(p.y / 8)}`).join(";");
    if (key !== wallKey) { wallKey = key; wallColor = sampleWall(photo, quad); }

    const r = R();
    const cpu = r.kind === "cpu";
    const maxSlices = cpu ? 5 : o.quality === "draft" ? 12 : 40;
    const sliceCount = (zb, zf) => {
      if (!cam) return 0;
      let d = 0;
      for (const [x, y] of [[0, 0], [W, 0], [W, H], [0, H]]) {
        const a = P(x, y, zb), b = P(x, y, zf);
        if (a && b) d = Math.max(d, dist(a, b));
      }
      return d < 0.4 ? 0 : Math.min(maxSlices, Math.ceil(d / 0.9));
    };
    const plan = build(type, { W, H, cam, night, opts: o.options || {}, art: o.art, wall: wallColor, sliceCount });

    const projectAll = pts => {
      const out = [];
      for (const p of pts) { const q = P(p[0], p[1], p[2]); if (!q) return null; out.push(q); }
      return out;
    };
    const boxOf = lists => {
      const all = [];
      for (const pts of lists) { const q = projectAll(pts); if (q) all.push(...q); }
      if (!all.length) return null;
      const b = bounds(all);
      return { x: b.minX, y: b.minY, w: b.maxX - b.minX, h: b.maxY - b.minY };
    };
    const opPts = [];
    for (const op of plan.ops) {
      if (op.kind === "layers") for (const l of op.layers) opPts.push(l.pts);
      else opPts.push(op.pts);
    }
    const signBox0 = boxOf(opPts);
    if (!signBox0) { ctx.restore(); return; }
    const signBox = intersect(grow(signBox0, 3), clip);

    const runLayers = (layers, box, q = 1) => {
      r.begin({ x: box.x * q, y: box.y * q, w: box.w * q, h: box.h * q });
      for (const l of layers) {
        const pts = projectAll(l.pts);
        if (!pts) continue;
        r.quad(l.tex, q === 1 ? pts : pts.map(p => ({ x: p.x * q, y: p.y * q })), l);
      }
      return r.end().canvas;
    };
    const copy = c => { const k = makeCanvas(c.width, c.height); k.getContext("2d").drawImage(c, 0, 0); return k; };

    // Night: light that lands on the wall, multiplied into the photo.
    const lit = night && isLit(type);
    let emitCanvas = null, emitBox = null;
    if (lit && (plan.emit.length || plan.spill.length)) {
      const sp = Math.max(signBox0.h * 0.7, signBox0.w * 0.14);
      emitBox = intersect(grow(signBox0, sp), clip);
      if (emitBox) {
        const q = Math.min(o.quality === "draft" ? 0.3 : 0.5, 720 / Math.max(emitBox.w, emitBox.h));
        emitCanvas = plan.emit.length ? copy(runLayers(plan.emit, emitBox, q)) : null;
        const L = makeCanvas(emitBox.w * q, emitBox.h * q);
        const lg = L.getContext("2d");
        lg.fillStyle = "#000";
        lg.fillRect(0, 0, L.width, L.height);
        lg.globalCompositeOperation = "lighter";
        if (plan.spill.length) lg.drawImage(runLayers(plan.spill, emitBox, q), 0, 0, L.width, L.height);
        if (emitCanvas && plan.fx.spill) {
          let lv = emitCanvas;
          const weights = [0, 0, 0.5, 0.7, 0.8, 0.8];
          for (let i = 1; i < weights.length && lv.width > 2; i++) {
            lv = half(lv);
            if (!weights[i]) continue;
            lg.globalAlpha = Math.min(1, weights[i] * plan.fx.spill);
            lg.drawImage(lv, 0, 0, L.width, L.height);
          }
          lg.globalAlpha = 1;
        }
        const Tc = makeCanvas(L.width, L.height);
        const tg = Tc.getContext("2d");
        tg.drawImage(photo, (emitBox.x - view.x) / view.s, (emitBox.y - view.y) / view.s, emitBox.w / view.s, emitBox.h / view.s, 0, 0, Tc.width, Tc.height);
        tg.globalCompositeOperation = "multiply";
        tg.drawImage(L, 0, 0);
        // Even a dark fascia reflects some light, so the spill never vanishes on black walls.
        tg.globalCompositeOperation = "lighter";
        tg.globalAlpha = plan.fx.floor ?? 0.16;
        tg.drawImage(L, 0, 0);
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(Tc, emitBox.x, emitBox.y, emitBox.w, emitBox.h);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // The sign itself, in op order (texture batches and hardware paths interleave).
    if (signBox) {
      ctx.globalAlpha = o.opacity ?? 1;
      for (const op of plan.ops) {
        if (op.kind === "layers") {
          let frame = runLayers(op.layers, signBox);
          if (op.paint) frame = paintOnWall(frame, signBox, photo, view);
          ctx.drawImage(frame, signBox.x, signBox.y, signBox.w, signBox.h);
        } else drawPath(ctx, op, P);
      }
      ctx.globalAlpha = 1;
    }

    if (emitCanvas && plan.fx.bloom) {
      ctx.globalCompositeOperation = "lighter";
      let lv = emitCanvas;
      const weights = [0.35, 0.4, 0.4, 0.35, 0.3];
      for (const w of weights) {
        if (lv.width <= 2) break;
        lv = half(lv);
        ctx.globalAlpha = Math.min(1, w * plan.fx.bloom);
        ctx.drawImage(lv, emitBox.x, emitBox.y, emitBox.w, emitBox.h);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();
  }

  return {
    render,
    get kind() { return R().kind; },
  };
}

function drawPath(ctx, op, P) {
  const pts = op.pts.map(p => P(p[0], p[1], p[2]));
  if (pts.some(p => !p)) return;
  const a = op.pts[0], p0 = pts[0], p1 = P(a[0] + 1, a[1], a[2]);
  const ppi = p1 ? dist(p0, p1) : 1;
  ctx.save();
  ctx.globalAlpha *= op.alpha ?? 1;
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (op.close) ctx.closePath();
  if (op.fill) {
    ctx.fillStyle = rgbCss(op.fill);
    ctx.fill();
  }
  if (op.stroke) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, (op.width || 0.5) * ppi);
    ctx.strokeStyle = rgbCss(op.stroke);
    ctx.stroke();
  }
  ctx.restore();
}

// Paint takes the wall's texture: the paint color is modulated by the brightness of the wall under it.
function paintOnWall(frame, box, photo, view) {
  const w = frame.width, h = frame.height;
  const out = makeCanvas(w, h);
  const g = out.getContext("2d", { willReadFrequently: true });
  g.drawImage(photo, (box.x - view.x) / view.s, (box.y - view.y) / view.s, box.w / view.s, box.h / view.s, 0, 0, w, h);
  const wall = g.getImageData(0, 0, w, h).data;
  g.clearRect(0, 0, w, h);
  g.drawImage(frame, 0, 0);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    sum += wall[i] * 0.3 + wall[i + 1] * 0.59 + wall[i + 2] * 0.11;
    n++;
  }
  const mean = n ? sum / n : 128;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const lum = wall[i] * 0.3 + wall[i + 1] * 0.59 + wall[i + 2] * 0.11;
    const k = Math.min(1.25, Math.max(0.35, 0.45 + 0.55 * (lum / (mean || 1))));
    d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k);
  }
  g.putImageData(img, 0, 0);
  return out;
}

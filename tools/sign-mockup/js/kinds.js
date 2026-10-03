// Construction kinds any category can reuse: a type's `render.kind` picks one and the rest of
// `render` tunes it. Signs use all of them; a new category can describe its products with these
// kinds and write no render code at all (see docs/ADDING-A-CATEGORY.md).
//
//   letters  extruded letters from the artwork: returns, faces, trim cap, optional raceway or halo
//            render: { depth, gap, returns: "art"|"art-dark"|"#hex", trim, trimColor, face: "open",
//                      tube, halo, sidesLit, raceway: { depth, height } }
//   cabinet  a box with a printed or routed face. render: { depth, gap, frame, frameColor, face: "routed", push }
//   blade    double-sided, projecting from the wall. render: { thick, arm, bracket, lit, frameColor }
//   panel    a flat panel on standoffs or flush, optional gooseneck lamps.
//            render: { gap, thick, standoffs, lamps }
//   neon     LED neon line on a clear backer. render: { gap, thick, tube }
//   flat     printed or painted straight onto the surface. render: { surface: "glass"|"wall" }
//
// The artwork object (art.js makeArtwork) supplies: letters (cut-out copy), source (as supplied),
// cutout (true when the copy has a transparent ground), color, layout(panelColor) -> { panel, copy, bg }.
import { maskOf, morph, ring, blur, tube, hexToRgb, mix, alphaBounds, makeCanvas, WHITE, DISK } from "./art.js";
import { rect, mulc, lampPools, SPOT, NIGHT_DARK, NIGHT_UNLIT, WARM, STEEL } from "./kit.js";

export const KINDS = ["letters", "cabinet", "blade", "panel", "neon", "flat"];

/** Default options for a kind-based type; the editor shows the ones listed in type.options. */
export function kindDefaults(type) {
  const r = type.render;
  return {
    returns: typeof r.returns === "string" && r.returns.startsWith("#") ? r.returns : "",
    trim: r.trimColor || "",
    raceway: "",
    panel: "#0b1d33",
    frame: r.frameColor || "",
    light: WARM,
    side: "left",
  };
}

const LIGHT_CHOICES = [
  ["#fff1d6", "Warm white"], ["#eef5ff", "Cool white"], ["#ff4a3d", "Red"], ["#4aa3ff", "Blue"], ["#3ddc84", "Green"], ["#ffb02e", "Amber"],
];
const FIELDS = {
  returns: { label: "Returns", kind: "color", auto: "Match artwork", fallback: "#202226" },
  trim: { label: "Trim cap", kind: "color", fallback: "#24262b" },
  raceway: { label: "Raceway", kind: "color", auto: "Match wall", fallback: "#6b6f76" },
  panel: { label: "Panel", kind: "color", fallback: "#0b1d33" },
  frame: { label: "Cabinet", kind: "color", fallback: "#24262b" },
  light: { label: "Light color", kind: "select", choices: LIGHT_CHOICES },
  side: { label: "Wall is on the", kind: "select", choices: [["left", "Left"], ["right", "Right"]] },
};

/** Option fields for the keys a type lists in type.options (see the field format in categories/define.js). */
export function kindFields(type, opts) {
  return (type.options || []).filter(k => FIELDS[k]).map(key => {
    const f = FIELDS[key];
    const label = key === "panel" && type.render.kind === "cabinet" ? "Face" : f.label;
    return { key, ...f, label, value: opts[key] ?? "" };
  });
}

/** The flat artwork a kind uses as its face: this sets the aspect and is the fab source. */
export function kindFaceArt(type, art, options = {}) {
  const k = type.render.kind;
  if (k === "letters" || k === "neon") return art.letters;
  if (k === "flat") return art.cutout ? art.letters : art.source;
  return art.layout(options.panel || "#0b1d33").panel;
}

/** Height / width the pinned quad should have for this type and artwork. */
export function kindAspect(type, art, options) {
  const c = kindFaceArt(type, art, options);
  return c.height / c.width;
}

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

/** Builds a kind-based type with the kit (see kit.js). */
export function buildKind(type, env, kit) {
  const { W, H, night, opts, art, lit } = env;
  const { layer, path, amb, box, extrude, shadow, boxShadow, caps, cornerSpots, emit, spill } = kit;
  const r = type.render;
  const light = hexToRgb(opts.light || WARM);
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
      for (const [x, y] of standoffSpots(M, W, H)) {
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
    const steelNow = mulc(steel, night ? NIGHT_UNLIT : [1, 1, 1]);
    layer(WHITE(), [[wallX, plateTop, zc - 3.5], [wallX, plateTop, zc + 3.5], [wallX, plateBot, zc + 3.5], [wallX, plateBot, zc - 3.5]], { tint: steel, mul: amb(0.8) });
    if (r.bracket) {
      const far = side < 0 ? W + 2.5 : -2.5;
      path({ pts: [[wallX, -3, zc], [far, -3, zc]], width: 1.25, stroke: steelNow });
      const n = 18, cx = wallX - side * Math.min(r.arm + W * 0.35, W * 0.5), braceTop = -3;
      const brace = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        brace.push([wallX + (cx - wallX) * u, plateBot * 0.75 * (1 - u) * (1 - u) + braceTop * (1 - (1 - u) * (1 - u)), zc]);
      }
      path({ pts: brace, width: 0.9, stroke: steelNow });
      const rr = Math.min(4, H * 0.12), sc = [wallX - side * (rr + 1.5), braceTop + rr + 1, zc];
      const curl = [];
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 1.75 + (side < 0 ? 0 : Math.PI);
        curl.push([sc[0] + Math.cos(a) * rr * (1 - i / 60), sc[1] + Math.sin(a) * rr * (1 - i / 60), zc]);
      }
      path({ pts: curl, width: 0.6, stroke: steelNow });
      for (const x of [W * 0.12, W * 0.88]) path({ pts: [[x, -3, zc], [x, 0.4, zc]], width: 0.4, stroke: steelNow });
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
  }
}

// "How it's built" cards for the awning shapes: a side profile (or front view where the shape
// only reads from the front) showing the frame and the cover. Drawn with the diagram kit. Not to scale.
import { PALETTE, card, inches, feet } from "../../diagram-kit.js";
import { roofProfile } from "./geometry.js";
import { projectionFor, defaultAwningOptions, COVERS } from "./types.js";

const PALE = { fabric: "#cfdcea", vinyl: "#d8e2ee", metal: "#c3c9d1", glass: "#e4f1fb", poly: "#eef2f4" };
const FRAME_LABEL = {
  "aw-quarter": "Bent-tube bows", "aw-convex": "Curved rafters", "aw-concave": "Inward-bent rafters",
  "aw-bullnose": "Bent nose bows", "aw-hip": "Hip rafters at corners", "aw-mansard": "Three-part tube frame",
  "aw-bay": "Rafters at each facet", "aw-seam": "Aluminum tube frame", "aw-dutch": "Hoops on side hinges",
  "aw-dome": "Ribs from top center", "aw-longdome": "Bows + dome-end ribs", "aw-cone": "Ribs from a top hub",
  "aw-waterfall": "Rounded nose bows", "aw-box": "Square tube frame", "aw-backlit": "Welded aluminum frame",
  "aw-wedge": "Welded tube frame",
};
const LETTER_ROWS = [34, 58, 82, 106, 130, 154];

const fmt = v => Math.round(v * 10) / 10;
const poly = pts => pts.map(([x, y], i) => `${i ? "L" : "M"}${fmt(x)} ${fmt(y)}`).join(" ");

function dims(type, W = 144) {
  const o = defaultAwningOptions(type);
  const D = W * type.aspect;
  const vr = type.valances.length && o.valance !== "none" ? Math.min(type.vr, D * (type.vr >= 20 ? 0.7 : 0.45)) : 0;
  return { o, D, vr, Dc: Math.max(2, D - vr), P: projectionFor(type, o, W, D) };
}

// Fits a drawing P wide and H tall (inches) into the space between the wall and the labels.
function fitter(P, H, { x0 = 44, y0 = 30, w = 150, h = 126 } = {}) {
  const k = Math.min(w / P, h / H);
  return { k, X: z => x0 + z * k, Y: y => y0 + y * k };
}

function rowsFor(labels) {
  return labels.map((l, i) => ({ ...l, ty: LETTER_ROWS[Math.round((i * (LETTER_ROWS.length - 1)) / Math.max(1, labels.length - 1))] }));
}
function addLabels(s, labels) {
  for (const l of rowsFor(labels.filter(Boolean))) s.label(l.text, l.px, l.py, l.ty);
}

function coverLabel(type) {
  return `${COVERS[type.covers[0]].short} cover`;
}

// Profile shapes: the roof from the wall out to the front, then a valance or the face below.
function profileCard(s, type, C) {
  const { o, D, vr, Dc, P } = dims(type);
  const id = type.id;
  const prof = id === "aw-wedge" ? { pts: [[0, 0], [P, D]] } : roofProfile(id === "aw-spear" ? "aw-traditional" : id, P, Dc);
  const ext = id === "aw-spear" ? Math.min(8, 0.2 * P) : 0;
  const open = o.sides === "open" || ["aw-spear"].includes(id);
  const armDrop = open ? 0.75 * P : 0;
  const f = fitter(P + ext, D + armDrop);
  const pts = prof.pts.map(([z, y]) => [f.X(z), f.Y(y)]);
  const front = pts[pts.length - 1];
  const bottom = f.Y(D);
  const cover = type.covers[0], line = cover === "metal" ? C.metal : C.fabric;
  s.wall();
  if (!open && type.sides.length) s.path(`${poly([...pts, [front[0], bottom], [44, bottom]])} Z`, PALE[cover], C.ink, 0.8);
  if (id === "aw-hip" || id === "aw-mansard") s.path(`${poly([...pts, [44, front[1]]])} Z`, PALE[cover], C.ink, 0.8);
  if (id === "aw-wedge") s.path(`${poly([...pts, [44, bottom]])} Z`, PALE[cover], C.ink, 0.8);
  // Frame just under the cover.
  const inner = pts.map(([x, y]) => [x + 2.5, y + 3]);
  s.path(poly(inner), "none", C.metal, 1.6);
  s.path(poly(pts), "none", line, 4, ` stroke-linejoin="round" stroke-linecap="round"`);
  s.rect(40, f.Y(0) - 3, 7, 8, C.metal);
  s.circle(front[0] - 1, front[1] + 1.5, 2.4, C.metal);
  if (vr) {
    s.rect(front[0] - 2, front[1], 5, bottom - front[1], line, C.ink, 0.8);
    if (o.letterOn === "valance") s.rect(front[0] - 0.5, front[1] + (bottom - front[1]) * 0.25, 2, (bottom - front[1]) * 0.5, "#ffffff");
  }
  if (!open && type.sides.length) s.line(44, bottom, front[0], bottom, C.metal, 2.2);
  if (open) {
    const A = f.Y(Dc + 0.75 * P);
    s.rect(40, A - 4, 7, 8, C.metal);
    const end = id === "aw-spear" ? [f.X(P + ext), f.Y(Dc) - (f.Y(Dc + 0.75 * P) - f.Y(Dc)) * (ext / P)] : [front[0] - 1, front[1]];
    s.line(46, A, end[0], end[1], C.ink, 2);
    if (id === "aw-spear") s.path(`M${fmt(end[0])} ${fmt(end[1] - 3)} L${fmt(end[0] + 7)} ${fmt(end[1] - 1)} L${fmt(end[0])} ${fmt(end[1] + 1.5)} Z`, C.ink);
  }
  if (id === "aw-dutch") {
    const hinge = [46, bottom];
    for (let i = 1; i <= 4; i++) {
      const p = pts[Math.round((i / 5) * (pts.length - 1))];
      s.line(hinge[0], hinge[1], p[0], p[1], C.metalLight, 1, ` stroke-dasharray="3 2"`);
    }
    s.circle(hinge[0], hinge[1], 2.6, C.metal);
  }
  if (type.lit === "backlit") {
    s.led(70, front[1] - 4); s.led(100, front[1] + 6);
    s.rays(104, front[1] + 6, 1, Math.max(20, front[0] - 110), 0.4);
  }
  if (o.letterOn === "face" && !vr) {
    const k = pts.length > 3 ? Math.floor(pts.length * 0.8) : pts.length - 1;
    const a = pts[Math.max(1, k - 1)], b = front;
    s.line(a[0] + 2.5, a[1], b[0] + 2.5, b[1] - 3, "#ffffff", 1.6);
  }
  const mid = pts[Math.floor(pts.length * 0.45)];
  const frameAt = inner[Math.floor(inner.length * 0.7)];
  addLabels(s, [
    { text: coverLabel(type), px: mid[0], py: mid[1] },
    { text: FRAME_LABEL[id] || "Welded tube frame", px: frameAt[0], py: frameAt[1] },
    vr ? { text: o.letterOn === "valance" ? "Valance, lettering" : "Valance", px: front[0] + 2, py: (front[1] + bottom) / 2 } : null,
    !vr && o.letterOn === "face" ? { text: "Lettering on the face", px: front[0] + 2, py: front[1] - 8 } : null,
    !open && type.sides.length ? { text: "Closed side panel", px: (44 + front[0]) / 2 - 10, py: (front[1] + bottom) / 2 + 6 } : null,
    open ? { text: id === "aw-spear" ? "Iron arm, spear tip" : "Support arm", px: 70, py: f.Y(Dc + 0.75 * P) - 8 } : null,
    { text: "Wall bracket", px: 43, py: f.Y(0) + 1 },
  ]);
  return "Side view";
}

// Arched shapes: side profile with the arch drawn in a small front-view inset.
function archCard(s, type, C) {
  const { o, D, P } = dims(type);
  const posts = !!type.posts;
  const total = posts ? D + 70 : D;
  const f = fitter(P, total, { w: posts ? 98 : 100 });
  const nose = f.X(P), top = f.Y(0), bot = f.Y(D);
  s.wall();
  s.path(`M44 ${fmt(top)} L${fmt(nose)} ${fmt(top)} L${fmt(nose)} ${fmt(bot)} L44 ${fmt(bot)} Z`, PALE[type.covers[0]], C.ink, 0.8);
  s.line(44, top, nose, top, C.fabric, 4);
  s.line(nose, top, nose, bot, C.fabric, 4);
  const bows = Math.max(2, Math.ceil(P / 48));
  for (let i = 0; i <= bows; i++) s.line(46 + ((nose - 48) * i) / bows, top + 3, 46 + ((nose - 48) * i) / bows, bot, C.metal, 1.2, ` stroke-dasharray="2 2"`);
  s.rect(40, top - 3, 7, 8, C.metal);
  if (o.letterOn === "face") s.rect(nose - 1, top + (bot - top) * 0.25, 2, (bot - top) * 0.4, "#ffffff");
  if (posts) {
    s.rect(nose - 4, bot, 4, f.Y(total) - bot, C.metal);
    s.line(nose - 12, f.Y(total), nose + 10, f.Y(total), C.ink, 1.4);
  }
  // Front-view inset: the arch.
  const ix = 154, iy = 150, iw = 42, ih = 24;
  s.path(`M${ix} ${iy} L${ix} ${iy - ih * 0.45} Q${ix + iw / 2} ${iy - ih * 1.35} ${ix + iw} ${iy - ih * 0.45} L${ix + iw} ${iy}`, "none", C.fabric, 2.2);
  s.add(`<text x="${ix + iw / 2}" y="${iy + 10}" font-size="7" text-anchor="middle" fill="${C.muted}">FRONT</text>`);
  addLabels(s, [
    { text: coverLabel(type), px: (44 + nose) / 2, py: top },
    { text: "Bent arch bows", px: 46 + (nose - 48) / bows, py: (top + bot) / 2 },
    { text: o.letterOn === "face" ? "Arched nose, lettering" : "Arched nose", px: nose, py: top + (bot - top) * 0.35 },
    posts ? { text: "Front posts, footings", px: nose - 2, py: (bot + f.Y(total)) / 2 } : null,
    { text: "Wall frame", px: 43, py: top + 1 },
  ]);
  return "Side view";
}

function gableCard(s, type, C) {
  // Front view: the roof end as a triangle with the valance across the bottom.
  const { o, vr, Dc } = dims(type);
  const x0 = 34, x1 = 186, apex = 40, eave = 40 + 90 * Math.min(1, Dc / 52);
  const vb = eave + Math.max(10, vr * 1.6);
  s.path(`M${x0} ${fmt(eave)} L110 ${apex} L${x1} ${fmt(eave)} Z`, PALE[type.covers[0]], C.ink, 0.8);
  s.path(`M${x0} ${fmt(eave)} L110 ${apex} L${x1} ${fmt(eave)}`, "none", C.fabric, 4, ` stroke-linejoin="round"`);
  s.line(110, apex + 3, 110, eave, C.metal, 1.4, ` stroke-dasharray="3 2"`);
  s.line(x0 + 4, eave - 2, x1 - 4, eave - 2, C.metal, 1.6);
  if (vr) s.rect(x0, eave, x1 - x0, vb - eave, C.fabric, C.ink, 0.8);
  if (o.letterOn === "face") s.rect(90, eave - 26, 40, 9, "#ffffff");
  else if (vr) s.rect(80, eave + (vb - eave) * 0.25, 60, (vb - eave) * 0.5, "#ffffff");
  addLabels(s, [
    { text: "Ridge bar", px: 110, py: apex + 2 },
    { text: coverLabel(type), px: 70, py: (apex + eave) / 2 + 6 },
    { text: o.letterOn === "face" ? "Gable end, lettering" : "Gable end", px: 110, py: eave - 14 },
    { text: "Eave bars", px: 160, py: eave - 2 },
    vr ? { text: o.letterOn === "valance" ? "Valance, lettering" : "Valance", px: 150, py: (eave + vb) / 2 } : null,
  ]);
  return "Front view";
}

function freestandingCard(s, type, C) {
  const { D, Dc, P } = dims(type);
  const f = fitter(P + 16, D + 66, { x0: 56, w: 140 });
  const z0 = f.X(0), z1 = f.X(P), zm = (z0 + z1) / 2, top = f.Y(0), eave = f.Y(Dc), vb = f.Y(D), ground = f.Y(D + 66);
  s.wall(12, 188);
  s.path(`M${fmt(z0)} ${fmt(eave)} L${fmt(zm)} ${fmt(top)} L${fmt(z1)} ${fmt(eave)} Z`, PALE[type.covers[0]], C.ink, 0.8);
  s.path(`M${fmt(z0)} ${fmt(eave)} L${fmt(zm)} ${fmt(top)} L${fmt(z1)} ${fmt(eave)}`, "none", C.fabric, 4, ` stroke-linejoin="round"`);
  for (const x of [z0, z1]) {
    s.rect(x - 1.5, eave, 4, vb - eave, C.fabric);
    s.rect(x + (x === z0 ? 3 : -6), eave, 3.5, ground - eave, C.metal);
  }
  s.line(z0 - 6, ground, z1 + 6, ground, C.ink, 1.4);
  addLabels(s, [
    { text: "Ridge bar", px: zm, py: top + 2 },
    { text: coverLabel(type), px: (z0 + zm) / 2, py: (top + eave) / 2 },
    { text: "Valance", px: z1, py: (eave + vb) / 2 },
    { text: "Four posts", px: z1 - 4, py: (vb + ground) / 2 },
    { text: "Not tied to the wall", px: 46, py: ground - 6 },
  ]);
  return "Side view";
}

function canopyCard(s, type, C) {
  const { D, P } = dims(type);
  const id = type.id, F = Math.min(type.vr, D * 0.7), glass = id === "aw-glass";
  const f = fitter(P, D + 8, { y0: 30 });
  const nose = f.X(P), top = f.Y(0), yt = f.Y(D - (glass ? 1 : F)), bot = f.Y(D);
  s.wall();
  s.rect(40, top - 3, 7, 9, C.metal);
  s.line(46, top + 2, nose - (glass ? 6 : 4), yt + 1, C.metalLight, 1.6);
  if (glass) {
    s.rect(44, bot - 2, nose - 44, 3, C.glass, C.clearEdge, 0.8);
    s.rect(44, bot - 6, 6, 9, C.metal);
    s.rect(80, bot - 1.2, 40, 1.2, "#ffffff");
  } else {
    if (id !== "aw-louver") s.rect(44, yt, nose - 44, 4, C.metal);
    if (id === "aw-louver") {
      for (let x = 56; x < nose - 6; x += 12) s.line(x - 4, yt + F * f.k * 0.25, x + 4, yt + F * f.k * 0.75, C.metal, 2);
      s.line(44, yt, nose, yt, C.metalLight, 1);
      s.line(44, bot, nose, bot, C.metalLight, 1);
    } else s.path(`M44 ${fmt(yt + 8)} L${fmt(nose)} ${fmt(bot)}`, "none", C.metalLight, 1, ` stroke-dasharray="3 2"`);
    s.rect(nose - 5, yt, 6, bot - yt, C.metal, C.ink, 0.8);
    s.rect(nose - 3.5, yt + (bot - yt) * 0.25, 2, (bot - yt) * 0.5, "#ffffff");
    if (type.lit === "backlit") { s.led(nose - 14, (yt + bot) / 2, -1); s.rays(nose - 10, (yt + bot) / 2, 1, 24, 0.3, 2); }
  }
  addLabels(s, [
    { text: "Hanger rod", px: (46 + nose) / 2, py: (top + yt) / 2 },
    glass ? { text: type.covers[0] === "glass" ? "Laminated glass plate" : "Polycarbonate plate", px: (44 + nose) / 2 + 10, py: bot - 1 } : null,
    glass ? { text: "Frosted print", px: 100, py: bot - 0.6 } : null,
    !glass && id !== "aw-louver" ? { text: "Aluminum deck", px: (44 + nose) / 2, py: yt + 2 } : null,
    id === "aw-louver" ? { text: "Angled blades", px: 68, py: (yt + bot) / 2 } : null,
    !glass ? { text: type.lit === "backlit" ? "Fascia, lit lettering" : "Fascia, lettering", px: nose, py: (yt + bot) / 2 } : null,
    { text: glass ? "Clamps at the wall" : "Wall plate", px: 43, py: glass ? bot - 2 : top + 1 },
  ]);
  return "Side view";
}

function retractCard(s, type, C) {
  const { D, Dc, vr, P } = dims(type);
  const drop = type.id === "aw-droparm";
  const f = fitter(P, D + (drop ? 10 : 30));
  const top = f.Y(0), nose = f.X(P), fy = f.Y(Dc), bot = f.Y(D);
  s.wall();
  s.rect(44, top - 2, 18, 14, C.metal, C.ink, 0.8);
  s.circle(53, top + 5, 4, C.metalLight, C.ink, 0.6);
  s.line(58, top + 10, nose, fy, C.fabric, 3.5);
  s.rect(nose - 3, fy - 2, 6, 5, C.metal);
  if (vr) s.rect(nose - 1.5, fy + 3, 3, bot - fy - 3, C.fabric);
  if (drop) {
    const py = f.Y(Math.min(Dc - 4, Dc * 0.45 + 8));
    s.rect(44, py - 4, 6, 8, C.metal);
    s.line(48, py, nose - 2, fy, C.ink, 2);
    s.circle(48, py, 2.2, C.ink);
  } else {
    const elbow = [(44 + nose) / 2 + 6, (top + fy) / 2 + 22];
    s.path(`M48 ${fmt(top + 18)} L${fmt(elbow[0])} ${fmt(elbow[1])} L${fmt(nose - 4)} ${fmt(fy + 2)}`, "none", C.ink, 2.2, ` stroke-linejoin="round"`);
    s.circle(elbow[0], elbow[1], 2.4, C.ink);
    s.rect(44, top + 14, 6, 8, C.metal);
  }
  addLabels(s, [
    { text: "Box with roller", px: 60, py: top + 2 },
    { text: "Acrylic canvas", px: (58 + nose) / 2, py: (top + fy) / 2 - 2 },
    { text: "Front load bar", px: nose, py: fy },
    vr ? { text: "Loose valance", px: nose + 1, py: (fy + bot) / 2 } : null,
    { text: drop ? "Pivoting side arm" : "Folding lateral arm", px: drop ? 70 : (44 + nose) / 2 + 6, py: drop ? f.Y(Dc * 0.6) : (top + fy) / 2 + 22 },
  ]);
  return "Side view";
}

export function drawAwning(s, type, C = PALETTE) {
  switch (type.id) {
    case "aw-gable": return gableCard(s, type, C);
    case "aw-halfbarrel": case "aw-barrel": case "aw-entrance": return archCard(s, type, C);
    case "aw-freestanding": return freestandingCard(s, type, C);
    case "aw-flat": case "aw-marquee": case "aw-louver": case "aw-glass": return canopyCard(s, type, C);
    case "aw-retractable": case "aw-droparm": return retractCard(s, type, C);
    default: return profileCard(s, type, C);
  }
}

/** Returns the side-profile card SVG markup for an awning shape. */
function typical(type) {
  const parts = [];
  if (type.d?.max > 0) parts.push(`projects ${feet(type.d.min)}–${feet(type.d.max)}`);
  if (type.vr) parts.push(`${inches(type.vr)} ${type.valances.length ? "valance" : "front"}`);
  return parts.join(", ");
}

export const awningDiagram = type => card(type, s => drawAwning(s, type), typical(type));

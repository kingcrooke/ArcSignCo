// Original isometric drawings for the winter enclosures page.
// Same camera for every type. Not traced from competitor photos.
import { writeFileSync } from "node:fs";

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

function P(x, y, z) {
  return [(x - y) * COS, (x + y) * SIN - z];
}
function fmt(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}
function dOf(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${fmt(p[0])} ${fmt(p[1])}`).join("") + "Z";
}

function fig() {
  return { parts: [], pts: [] };
}
function track(f, pts) {
  for (const p of pts) f.pts.push(p);
}
function add(f, cls, pts) {
  track(f, pts);
  f.parts.push(`<path class="${cls}" d="${dOf(pts)}"/>`);
}
function addOpen(f, cls, pts) {
  track(f, pts);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${fmt(p[0])} ${fmt(p[1])}`).join("");
  f.parts.push(`<path class="${cls}" d="${d}"/>`);
}
function hole(f, cls, outer, inner) {
  track(f, outer);
  track(f, inner);
  f.parts.push(`<path class="${cls}" fill-rule="evenodd" d="${dOf(outer)} ${dOf(inner)}"/>`);
}
function dot(f, cls, x, y, z, r) {
  const c = P(x, y, z);
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
  }
  add(f, cls, pts);
}

function quad(f, cls, a, b, c, d) {
  add(f, cls, [a, b, c, d]);
}

function front(x, y, w, h, u, v) {
  return P(x + u * w, y, v * h);
}
function side(x, y, d, h, u, v) {
  return P(x, y + u * d, v * h);
}

function pad(f, x0, y0, x1, y1) {
  quad(f, "pad", P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0));
}

function facade(f, x, w, y, h) {
  quad(f, "facade", P(x, y, 0), P(x + w, y, 0), P(x + w, y, h), P(x, y, h));
  addOpen(f, "mullion", [P(x + 0.15, y, h * 0.62), P(x + w - 0.15, y, h * 0.62)]);
}

function post(f, cx, cy, z0, z1, t) {
  const x = cx - t / 2;
  const y = cy - t / 2;
  quad(f, "frame", P(x, y + t, z0), P(x, y, z0), P(x, y, z1), P(x, y + t, z1));
  quad(f, "frame", P(x, y, z0), P(x + t, y, z0), P(x + t, y, z1), P(x, y, z1));
}

function posts(f, x, y, w, d, h, t) {
  post(f, x + w, y + d, 0, h, t);
  post(f, x, y + d, 0, h, t);
  post(f, x + w, y, 0, h, t);
  post(f, x, y, 0, h, t);
}

function flatRoof(f, x, y, w, d, h, oh) {
  quad(
    f,
    "roof",
    P(x - oh, y - oh, h),
    P(x + w + oh, y - oh, h),
    P(x + w + oh, y + d + oh, h),
    P(x - oh, y + d + oh, h)
  );
  addOpen(f, "goldline", [P(x - oh, y - oh, h), P(x + w + oh, y - oh, h)]);
}

function gableRoof(f, x, y, w, d, h, peak) {
  const m = x + w / 2;
  const z = h + peak;
  quad(f, "roof", P(x, y, h), P(m, y, z), P(m, y + d, z), P(x, y + d, h));
  quad(f, "roofside", P(x + w, y, h), P(x + w, y + d, h), P(m, y + d, z), P(m, y, z));
  add(f, "panel", [P(x, y, h), P(x + w, y, h), P(m, y, z)]);
  addOpen(f, "goldline", [P(x, y, h), P(m, y, z), P(x + w, y, h)]);
}

function wallFront(f, x, y, w, h, win) {
  const outer = [front(x, y, w, h, 0, 0), front(x, y, w, h, 1, 0), front(x, y, w, h, 1, 1), front(x, y, w, h, 0, 1)];
  if (!win) {
    add(f, "panel", outer);
    return;
  }
  const inner = [
    front(x, y, w, h, win[0], win[1]),
    front(x, y, w, h, win[2], win[1]),
    front(x, y, w, h, win[2], win[3]),
    front(x, y, w, h, win[0], win[3])
  ];
  quad(f, "glass", inner[0], inner[1], inner[2], inner[3]);
  hole(f, "panel", outer, inner);
}

function wallSide(f, x, y, d, h, win) {
  const outer = [side(x, y, d, h, 0, 0), side(x, y, d, h, 1, 0), side(x, y, d, h, 1, 1), side(x, y, d, h, 0, 1)];
  if (!win) {
    add(f, "side", outer);
    return;
  }
  const inner = [
    side(x, y, d, h, win[0], win[1]),
    side(x, y, d, h, win[2], win[1]),
    side(x, y, d, h, win[2], win[3]),
    side(x, y, d, h, win[0], win[3])
  ];
  quad(f, "glass", inner[0], inner[1], inner[2], inner[3]);
  hole(f, "side", outer, inner);
}

function headerBand(f, x, y, w, h, v0, v1) {
  quad(f, "header", front(x, y, w, h, 0.06, v0), front(x, y, w, h, 0.94, v0), front(x, y, w, h, 0.94, v1), front(x, y, w, h, 0.06, v1));
  return front(x, y, w, h, 0.5, (v0 + v1) / 2);
}

function door(f, x, y, w, z0, z1, open) {
  const hw = w;
  let x0 = x;
  let y0 = y;
  let x1 = x + hw;
  let y1 = y;
  if (open) {
    const a = 0.62;
    x1 = x + Math.cos(a) * hw;
    y1 = y - Math.sin(a) * hw;
  }
  const bl = P(x0, y0, z0);
  const br = P(x1, y1, z0);
  const tr = P(x1, y1, z1);
  const tl = P(x0, y0, z1);
  const glass = [
    [x0 + (x1 - x0) * 0.16, y0 + (y1 - y0) * 0.16, z0 + (z1 - z0) * 0.38],
    [x0 + (x1 - x0) * 0.84, y0 + (y1 - y0) * 0.84, z0 + (z1 - z0) * 0.38],
    [x0 + (x1 - x0) * 0.84, y0 + (y1 - y0) * 0.84, z0 + (z1 - z0) * 0.9],
    [x0 + (x1 - x0) * 0.16, y0 + (y1 - y0) * 0.16, z0 + (z1 - z0) * 0.9]
  ].map((p) => P(p[0], p[1], p[2]));
  quad(f, "glass", glass[0], glass[1], glass[2], glass[3]);
  hole(f, "frame", [bl, br, tr, tl], glass);
  dot(f, "header", x0 + (x1 - x0) * 0.78, y0 + (y1 - y0) * 0.78, z0 + (z1 - z0) * 0.48, 0.09);
}

function siding(f, x, y, d, h) {
  for (const v of [0.28, 0.48, 0.68]) {
    addOpen(f, "mullion", [side(x, y, d, h, 0.08, v), side(x, y, d, h, 0.92, v)]);
  }
}

function vestibule(spec) {
  const f = fig();
  const x = 0;
  const y = 0;
  const { w, d, h, roof, winSide, winFront, doorMode, wood, t = 0.2 } = spec;
  pad(f, -1.1, -1.3, w + 1.2, d + 1.1);
  facade(f, -0.7, w + 1.5, d + 0.18, h + 1.5);
  wallSide(f, x, y, d, h, winSide);
  if (wood) siding(f, x, y, d, h);
  wallFront(f, x, y, w, h, winFront);
  posts(f, x, y, w, d, h, t);
  if (roof === "gable") gableRoof(f, x, y, w, d, h, spec.peak || 1.35);
  else flatRoof(f, x, y, w, d, h, 0.22);
  const nameAt = headerBand(f, x, y, w, h, spec.hv0 ?? 0.8, spec.hv1 ?? 0.94);
  if (doorMode === "swing") door(f, x + w * 0.28, y, w * 0.42, 0, h * 0.72, true);
  else if (doorMode === "slide") {
    door(f, x + w * 0.08, y, w * 0.4, 0, h * 0.74, false);
    door(f, x + w * 0.46, y - 0.18, w * 0.4, 0, h * 0.74, false);
    addOpen(f, "goldline", [front(x, y, w, h, 0.06, 0.76), front(x, y, w, h, 0.94, 0.76)]);
  } else if (doorMode === "front") {
    door(f, x + (spec.dx ?? w * 0.3), y, spec.dw ?? w * 0.4, 0, h * 0.72, false);
  }
  f.nameAt = nameAt;
  return f;
}

function glassEntry() {
  const f = fig();
  const w = 8.2;
  const d = 4.6;
  const h = 7.6;
  pad(f, -1.1, -1.2, w + 1.1, d + 1);
  facade(f, -0.8, w + 1.6, d + 0.16, h + 1.6);
  wallSide(f, 0, 0, d, h, [0.12, 0.08, 0.88, 0.78]);
  wallFront(f, 0, 0, w, h, null);
  for (const u of [0.33, 0.66]) {
    addOpen(f, "mullion", [front(0, 0, w, h, u, 0.02), front(0, 0, w, h, u, 0.78)]);
  }
  addOpen(f, "mullion", [front(0, 0, w, h, 0.04, 0.62), front(0, 0, w, h, 0.96, 0.62)]);
  quad(f, "glass", front(0, 0, w, h, 0.08, 0.08), front(0, 0, w, h, 0.3, 0.08), front(0, 0, w, h, 0.3, 0.58), front(0, 0, w, h, 0.08, 0.58));
  quad(f, "glass", front(0, 0, w, h, 0.7, 0.08), front(0, 0, w, h, 0.92, 0.08), front(0, 0, w, h, 0.92, 0.58), front(0, 0, w, h, 0.7, 0.58));
  posts(f, 0, 0, w, d, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.28);
  const nameAt = headerBand(f, 0, 0, w, h, 0.8, 0.94);
  door(f, w * 0.36, 0, w * 0.28, 0, h * 0.7, false);
  f.nameAt = nameAt;
  return f;
}

function cornerUnit() {
  const f = fig();
  const h = 7.2;
  pad(f, -1.2, -1.3, 11.2, 8.4);
  facade(f, -0.4, 10.2, 7.5, h + 1.4);
  wallSide(f, 0, 3.2, 4.2, h, [0.14, 0.22, 0.86, 0.7]);
  wallFront(f, 0, 3.2, 4.2, h, null);
  posts(f, 0, 3.2, 4.2, 4.2, h, 0.2);
  flatRoof(f, 0, 3.2, 4.2, 4.2, h, 0.16);
  wallSide(f, 0, 0, 3.5, h, [0.16, 0.24, 0.84, 0.68]);
  wallFront(f, 0, 0, 9.4, h, [0.52, 0.22, 0.9, 0.68]);
  posts(f, 0, 0, 9.4, 3.5, h, 0.2);
  flatRoof(f, 0, 0, 9.4, 3.5, h, 0.16);
  const nameAt = headerBand(f, 0, 0, 9.4, h, 0.8, 0.94);
  door(f, 1.15, 0, 2.3, 0, h * 0.7, false);
  f.nameAt = nameAt;
  return f;
}

function curtains() {
  const f = fig();
  const w = 10;
  const d = 4.2;
  const h = 6.6;
  pad(f, -0.8, -1.4, w + 0.8, d + 0.8);
  facade(f, -0.4, w + 0.8, d + 0.05, h + 1.8);
  quad(f, "roof", P(0, d, h + 1.3), P(w, d, h + 1.3), P(w, 0, h - 0.2), P(0, 0, h - 0.2));
  addOpen(f, "goldline", [P(0, 0, h - 0.2), P(w, 0, h - 0.2)]);
  for (const u of [0.22, 0.72]) {
    const cx = u * w;
    quad(f, "frame", P(cx - 0.35, 0.15, h - 0.15), P(cx + 0.35, 0.15, h - 0.15), P(cx + 0.35, 0.15, h + 0.45), P(cx - 0.35, 0.15, h + 0.45));
    quad(f, "glass", P(cx - 0.22, 0.05, h - 0.05), P(cx + 0.22, 0.05, h - 0.05), P(cx + 0.22, 0.05, h + 0.28), P(cx - 0.22, 0.05, h + 0.28));
  }
  quad(f, "glass", P(6.5, 0.02, 0), P(9.3, 0.02, 0), P(9.3, 0.02, h - 0.45), P(6.5, 0.02, h - 0.45));
  addOpen(f, "mullion", [P(6.5, 0.02, 0), P(6.5, 0.02, h - 0.45), P(9.3, 0.02, h - 0.45), P(9.3, 0.02, 0)]);
  post(f, 0, 0, 0, h - 0.2, 0.18);
  post(f, w, 0, 0, h - 0.2, 0.18);
  const nameAt = P(w / 2, 0.02, h - 0.55);
  quad(f, "header", P(0.4, 0.02, h - 0.95), P(w - 0.4, 0.02, h - 0.95), P(w - 0.4, 0.02, h - 0.35), P(0.4, 0.02, h - 0.35));
  f.nameAt = nameAt;
  return f;
}

function zipperWall() {
  const f = fig();
  const w = 9.2;
  const d = 3.4;
  const h = 7.2;
  pad(f, -0.8, -1.2, w + 0.8, d + 0.8);
  facade(f, -0.5, w + 1, d + 0.12, h + 1.3);
  wallSide(f, 0, 0, d, h, [0.16, 0.18, 0.84, 0.72]);
  wallFront(f, 0, 0, w, h, [0.06, 0.16, 0.94, 0.74]);
  for (const u of [0.33, 0.66]) {
    addOpen(f, "zip", [front(0, 0, w, h, u, 0.16), front(0, 0, w, h, u, 0.74)]);
  }
  posts(f, 0, 0, w, d, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.16);
  const nameAt = headerBand(f, 0, 0, w, h, 0.8, 0.94);
  f.nameAt = nameAt;
  return f;
}

function panelRoom(fSpec) {
  const f = fig();
  const w = fSpec.w;
  const d = fSpec.d;
  const h = 7.3;
  const t = fSpec.t;
  pad(f, -1, -1.2, w + 1, d + 0.9);
  facade(f, -0.6, w + 1.2, d + 0.14, h + 1.4);
  wallSide(f, 0, 0, d, h, [0.1, 0.1, 0.9, 0.74]);
  wallFront(f, 0, 0, w, h, [0.08, 0.1, 0.92, 0.74]);
  const cols = fSpec.cols;
  for (let i = 1; i < cols; i++) {
    addOpen(f, "mullion", [front(0, 0, w, h, i / cols, 0.08), front(0, 0, w, h, i / cols, 0.74)]);
  }
  if (fSpec.mid) addOpen(f, "mullion", [front(0, 0, w, h, 0.08, 0.42), front(0, 0, w, h, 0.92, 0.42)]);
  posts(f, 0, 0, w, d, h, t);
  if (fSpec.roof === "open") {
    quad(f, "roof", P(-0.2, -0.2, h), P(w * 0.42, -0.2, h), P(w * 0.42, d + 0.2, h), P(-0.2, d + 0.2, h));
    quad(f, "roof", P(w * 0.58, -0.2, h), P(w + 0.2, -0.2, h), P(w + 0.2, d + 0.2, h), P(w * 0.58, d + 0.2, h));
    addOpen(f, "frame", [P(w * 0.42, -0.2, h), P(w * 0.58, -0.2, h)]);
    addOpen(f, "goldline", [P(-0.2, -0.2, h), P(w + 0.2, -0.2, h)]);
  } else flatRoof(f, 0, 0, w, d, h, 0.2);
  const nameAt = headerBand(f, 0, 0, w, h, 0.8, 0.94);
  door(f, w * 0.38, 0, w * 0.24, 0, h * 0.7, false);
  f.nameAt = nameAt;
  return f;
}

function sidewalk() {
  const f = fig();
  const w = 9.5;
  const d = 4.8;
  const h = 6.8;
  pad(f, -0.6, -1.5, w + 0.8, d + 0.6);
  facade(f, -0.3, w + 0.6, d + 0.08, h + 0.8);
  post(f, 0.2, 0.2, 0, h, 0.16);
  post(f, w - 0.2, 0.2, 0, h, 0.16);
  post(f, 0.2, d - 0.2, 0, h, 0.16);
  post(f, w - 0.2, d - 0.2, 0, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.3);
  const rail = 2.15;
  quad(f, "frame", P(0.3, 0.15, 0), P(w - 0.3, 0.15, 0), P(w - 0.3, 0.15, rail), P(0.3, 0.15, rail));
  quad(f, "frame", P(0.15, 0.3, 0), P(0.15, d - 0.2, 0), P(0.15, d - 0.2, rail), P(0.15, 0.3, rail));
  quad(f, "glass", P(0.2, 0.12, rail), P(w * 0.72, 0.12, rail), P(w * 0.72, 0.12, h - 1.35), P(0.2, 0.12, h - 1.35));
  const nameAt = P(w / 2, 0.05, h - 0.45);
  quad(f, "header", P(w * 0.22, -0.28, h - 0.15), P(w * 0.78, -0.28, h - 0.15), P(w * 0.78, -0.28, h + 0.28), P(w * 0.22, -0.28, h + 0.28));
  f.nameAt = nameAt;
  return f;
}

function roadway() {
  const f = fig();
  const w = 8.6;
  const d = 4.4;
  const h = 6.6;
  pad(f, -0.8, -1.6, w + 1.3, d + 0.5);
  facade(f, -0.2, w + 0.5, d + 0.1, h + 0.7);
  const bh = 2.35;
  quad(f, "frame", P(0, -0.15, 0), P(w, -0.15, 0), P(w, -0.15, bh), P(0, -0.15, bh));
  quad(f, "header", P(0, -0.16, bh - 0.28), P(w, -0.16, bh - 0.28), P(w, -0.16, bh - 0.08), P(0, -0.16, bh - 0.08));
  quad(f, "frame", P(-0.1, 0, 0), P(-0.1, d, 0), P(-0.1, d, bh), P(-0.1, 0, bh));
  quad(f, "frame", P(w + 0.1, 0, 0), P(w + 0.1, d, 0), P(w + 0.1, d, bh), P(w + 0.1, 0, bh));
  post(f, 0.15, 0.15, bh, h, 0.16);
  post(f, w - 0.15, 0.15, bh, h, 0.16);
  post(f, 0.15, d - 0.15, 0, h, 0.16);
  post(f, w - 0.15, d - 0.15, 0, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.24);
  quad(f, "glass", P(0.25, -0.05, bh), P(w * 0.78, -0.05, bh), P(w * 0.78, -0.05, h - 1.5), P(0.25, -0.05, h - 1.5));
  const nameAt = P(w / 2, -0.2, h - 0.35);
  quad(f, "header", P(w * 0.2, -0.32, h - 0.1), P(w * 0.8, -0.32, h - 0.1), P(w * 0.8, -0.32, h + 0.32), P(w * 0.2, -0.32, h + 0.32));
  f.nameAt = nameAt;
  return f;
}

function tent() {
  const f = fig();
  const w = 9.4;
  const d = 5.2;
  const eave = 5.4;
  const peak = 8.1;
  pad(f, -0.8, -1.3, w + 0.8, d + 0.8);
  post(f, 0, 0, 0, eave, 0.16);
  post(f, w, 0, 0, eave, 0.16);
  post(f, 0, d, 0, eave, 0.16);
  post(f, w, d, 0, eave, 0.16);
  wallSide(f, 0, 0, d, eave * 0.92, [0.12, 0.08, 0.88, 0.78]);
  wallFront(f, 0, 0, w, eave * 0.92, [0.08, 0.08, 0.92, 0.78]);
  const m = w / 2;
  quad(f, "roof", P(0, 0, eave), P(m, 0, peak), P(m, d, peak), P(0, d, eave));
  quad(f, "roofside", P(w, 0, eave), P(w, d, eave), P(m, d, peak), P(m, 0, peak));
  add(f, "panel", [P(0, 0, eave), P(w, 0, eave), P(m, 0, peak)]);
  addOpen(f, "goldline", [P(0, 0, eave), P(m, 0, peak), P(w, 0, eave)]);
  const nameAt = P(m, 0.02, eave + 0.35);
  quad(f, "header", P(w * 0.28, 0.02, eave - 0.05), P(w * 0.72, 0.02, eave - 0.05), P(m, 0.02, peak - 0.55), P(w * 0.38, 0.02, eave + 0.7));
  f.nameAt = nameAt;
  return f;
}

function dome() {
  const f = fig();
  const cx = 3.3;
  const cy = 3.1;
  const r = 3.15;
  const H = 4.5;
  pad(f, -0.4, -1.5, 7.2, 6.2);
  const rings = 5;
  const gores = 8;
  function pt(i, k) {
    const ang = -0.7 + (i / gores) * Math.PI * 1.15;
    const v = k / rings;
    const rr = Math.cos(v * Math.PI * 0.5) * r;
    const z = Math.sin(v * Math.PI * 0.5) * H;
    return P(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.72, z);
  }
  for (let i = 0; i < gores; i++) {
    for (let k = 0; k < rings; k++) {
      const cls = k > rings - 2 ? "roof" : "glass";
      add(f, cls, [pt(i, k), pt(i + 1, k), pt(i + 1, k + 1), pt(i, k + 1)]);
    }
    addOpen(f, "mullion", [pt(i, 0), pt(i, rings)]);
  }
  door(f, cx - 0.7, cy - r * 0.55, 1.5, 0, 2.5, false);
  const nameAt = P(cx, cy - r * 0.62, 2.85);
  quad(f, "header", P(cx - 1.15, cy - r * 0.7, 2.55), P(cx + 1.15, cy - r * 0.7, 2.55), P(cx + 1.15, cy - r * 0.7, 3.15), P(cx - 1.15, cy - r * 0.7, 3.15));
  f.nameAt = nameAt;
  return f;
}

const TYPES = [
  { id: "small-entry", group: "vestibule", name: "Small entry vestibule", blurb: "A flat-roof box at one door. Fabric walls, a clear vinyl window, and the name on the header.", tags: ["Single entry", "Fabric", "Clear vinyl", "Seasonal"], fig: vestibule({ w: 5.4, d: 4.3, h: 7.3, roof: "flat", winSide: [0.14, 0.28, 0.86, 0.7], winFront: null, doorMode: "front", dx: 0.85, dw: 3.5 }) },
  { id: "lobby", group: "vestibule", name: "Medium lobby vestibule", blurb: "Wide enough for people to pass. Door on one side, a clear panel on the other.", tags: ["Lobby", "Fabric", "Clear vinyl", "Seasonal"], fig: vestibule({ w: 8.6, d: 5, h: 7.4, roof: "flat", winSide: [0.14, 0.24, 0.86, 0.7], winFront: [0.5, 0.16, 0.9, 0.7], doorMode: "front", dx: 0.55, dw: 2.5 }) },
  { id: "cafe-room", group: "vestibule", name: "Large cafe room", blurb: "A room-sized enclosure for a waiting area or a private patio, not a sealed sidewalk cafe.", tags: ["Cafe room", "Fabric", "Clear vinyl", "Private property"], fig: vestibule({ w: 12.2, d: 6.4, h: 7.5, roof: "flat", winSide: [0.1, 0.18, 0.9, 0.7], winFront: [0.46, 0.16, 0.92, 0.7], doorMode: "front", dx: 0.7, dw: 2.6 }) },
  { id: "gable", group: "vestibule", name: "Peaked gable vestibule", blurb: "The same entry box with a low peak, so snow and rain leave the roof.", tags: ["Single entry", "Fabric", "Seasonal"], fig: vestibule({ w: 5.8, d: 4.5, h: 6.7, roof: "gable", peak: 1.45, winSide: [0.16, 0.26, 0.84, 0.68], winFront: null, doorMode: "front", dx: 0.9, dw: 3.6, hv0: 0.74, hv1: 0.88 }) },
  { id: "glass-entry", group: "vestibule", name: "Glass and aluminum entry", blurb: "Storefront framing and clear panes. The year-round version, with a permit path of its own.", tags: ["Lobby", "Glass", "Aluminum", "Year-round path"], fig: glassEntry() },
  { id: "wood", group: "vestibule", name: "Wood-frame vestibule", blurb: "Thicker painted wood posts and rails, with a clear window and the name on the header.", tags: ["Single entry", "Wood", "Seasonal"], fig: vestibule({ w: 5.8, d: 4.4, h: 7.2, roof: "flat", t: 0.38, wood: true, winSide: [0.18, 0.32, 0.82, 0.68], winFront: null, doorMode: "front", dx: 0.95, dw: 3.5 }) },
  { id: "swing", group: "vestibule", name: "Swing-door vestibule", blurb: "A hinged door that swings out, with room for the maneuvering clearance at the handle.", tags: ["Single entry", "Swing door", "Seasonal"], fig: vestibule({ w: 6.2, d: 4.6, h: 7.3, roof: "flat", winSide: [0.16, 0.28, 0.84, 0.7], winFront: [0.62, 0.28, 0.9, 0.68], doorMode: "swing" }) },
  { id: "slide", group: "vestibule", name: "Sliding-door vestibule", blurb: "Panels that slide on a head track, for a door that should not sweep the sidewalk.", tags: ["Lobby", "Sliding door", "Seasonal"], fig: vestibule({ w: 8.4, d: 4.6, h: 7.3, roof: "flat", winSide: [0.16, 0.24, 0.84, 0.68], winFront: null, doorMode: "slide", hv0: 0.82, hv1: 0.95 }) },
  { id: "corner", group: "vestibule", name: "Corner wraparound", blurb: "An L at a corner door: one run across the front, one run down the side.", tags: ["Corner", "Fabric", "Clear vinyl", "Seasonal"], fig: cornerUnit() },
  { id: "curtains", group: "cover", name: "Awning with roll-down curtains", blurb: "A cover on the wall, clear curtains rolled up, and one panel dropped.", tags: ["Walkway", "Clear vinyl", "Fabric", "Seasonal"], fig: curtains() },
  { id: "zipper", group: "cover", name: "Zippered vinyl panels", blurb: "Clear panels joined by zippers, so a wall can open without coming off the frame.", tags: ["Walkway", "Clear vinyl", "Seasonal"], fig: zipperWall() },
  { id: "poly", group: "cover", name: "Polycarbonate panels", blurb: "Rigid clear panels in a heavier frame. A material for a longer install, not a rolled curtain.", tags: ["Cafe room", "Polycarbonate", "Year-round path"], fig: panelRoom({ w: 9.4, d: 5.2, t: 0.32, cols: 3, mid: true, roof: "flat" }) },
  { id: "acrylic", group: "cover", name: "Acrylic glass-look", blurb: "Larger clear panes and a thin frame, closer to glass than to a vinyl curtain.", tags: ["Lobby", "Acrylic", "Year-round path"], fig: panelRoom({ w: 8.8, d: 4.8, t: 0.14, cols: 2, mid: false, roof: "flat" }) },
  { id: "sidewalk", group: "cover", name: "Sidewalk cafe screen", blurb: "A low rail, a cover, and a clear screen that stops short of the roof. Not a sealed room.", tags: ["Sidewalk seating", "Clear vinyl", "Open air"], fig: sidewalk() },
  { id: "roadway", group: "cover", name: "Roadway dining cover", blurb: "Barriers on the street sides, a cover overhead, and a screen only on the road face.", tags: ["Sidewalk seating", "Open air", "Seasonal"], fig: roadway() },
  { id: "tent", group: "cover", name: "Tent with sidewalls", blurb: "A peaked fabric roof on posts, with clear sidewalls for a private event space.", tags: ["Events", "Fabric", "Clear vinyl", "Private property"], fig: tent() },
  { id: "retractable", group: "cover", name: "Retractable-roof enclosure", blurb: "Clear walls with a roof that can open in the middle and close when the weather turns.", tags: ["Cafe room", "Clear vinyl", "Private property"], fig: panelRoom({ w: 10.2, d: 5.4, t: 0.18, cols: 3, mid: false, roof: "open" }) },
  { id: "dome", group: "cover", name: "Dome and cabana pod", blurb: "A freestanding clear pod. A cabana is the same idea with a flat roof and a lower wall.", tags: ["Pod", "Clear panel", "Private property"], fig: dome() }
];

function layoutAll(types) {
  const raw = types.map((t) => {
    const pts = t.fig.pts;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }
    return { minX, maxX, minY, maxY, bw: maxX - minX, bh: maxY - minY };
  });
  const maxW = Math.max(...raw.map((b) => b.bw));
  const maxH = Math.max(...raw.map((b) => b.bh));
  const scale = Math.min(292 / maxW, 158 / maxH);
  return types.map((t, i) => {
    const b = raw[i];
    const cx = ((b.minX + b.maxX) / 2) * scale;
    const bottom = b.maxY * scale;
    const tx = 160 - cx;
    const ty = 186 - bottom;
    const map = (p) => [p[0] * scale + tx, p[1] * scale + ty];
    const svgBody = t.fig.parts
      .map((part) => part.replace(/(-?\d+\.\d)/g, (n) => n))
      .join("");
    // Rebuild paths from mapped points by regenerating. The parts store formatted unit coords.
    // Easier: transform by wrapping in a group.
    const name = map(t.fig.nameAt);
    return { tx, ty, scale, name };
  });
}

function svgFor(type, mapped) {
  const name = mapped.name;
  const font = 11;
  return `<svg class="enclosure-svg" viewBox="0 0 320 200" role="img" aria-hidden="true">
  <g transform="translate(${fmt(mapped.tx)} ${fmt(mapped.ty)}) scale(${fmt(mapped.scale)})">
    ${type.fig.parts.join("\n    ")}
  </g>
  <text class="name" x="${fmt(name[0])}" y="${fmt(name[1])}" text-anchor="middle" dominant-baseline="middle" font-size="${font}">NAME</text>
</svg>`;
}

function cardsHtml(types, mapped) {
  const chunks = [];
  let last = "";
  types.forEach((t, i) => {
    if (t.group !== last) {
      if (last) chunks.push(`</div>`);
      const title = t.group === "vestibule" ? "Entry vestibules" : "Covers beyond the door";
      const note = t.group === "vestibule"
        ? "Start here. A New York winter vestibule is usually a box at the door: flat or slightly peaked, solid fabric or clear panels, a door on the front or the side, and the business name on the header."
        : "Curtains, rigid panels, tents, and pods. A new sidewalk or roadway dining setup cannot be a sealed room. These drawings keep that difference visible.";
      chunks.push(`<h3 class="style-group">${title}</h3><p class="style-group-note">${note}</p><div class="style-grid">`);
      last = t.group;
    }
    const tags = t.tags.map((tag) => `<li>${tag}</li>`).join("");
    chunks.push(`<a class="style-card" href="#enclosure-quote" data-style-id="${t.id}" data-style-name="${t.name}">
  ${svgFor(t, mapped[i])}
  <span class="style-copy">
    <h3 class="style-name">${t.name}</h3>
    <p class="style-desc">${t.blurb}</p>
    <ul class="style-tags">${tags}</ul>
  </span>
</a>`);
  });
  chunks.push(`</div>`);
  return chunks.join("\n");
}

const mapped = layoutAll(TYPES);
const sheet = `<!DOCTYPE html><meta charset="utf-8"><title>enclosure sheet</title>
<style>
  body { margin: 0; background: #e8edf2; font-family: Arial, sans-serif; }
  .style-grid { display: grid; grid-template-columns: repeat(3, 320px); gap: 12px; padding: 12px; }
  .style-group { grid-column: 1 / -1; margin: 12px 0 0; color: #0b1d33; }
  .style-group-note { grid-column: 1 / -1; margin: 0 0 8px; color: #3c4a5d; }
  .style-card { display: block; background: #fff; border: 1px solid #d5dde6; }
  .style-copy { padding: 8px 10px 12px; }
  .style-name { margin: 0; font-size: 14px; color: #0b1d33; }
  .style-desc { margin: 4px 0; font-size: 12px; color: #526072; }
  .style-tags { display: flex; gap: 4px; flex-wrap: wrap; padding: 0; margin: 0; list-style: none; }
  .style-tags li { font-size: 10px; border: 1px solid #d5dde6; border-radius: 99px; padding: 2px 6px; }
  .enclosure-svg { width: 320px; height: 200px; background: #f4f6f8; display: block; }
  .pad { fill: #e3ebf3; }
  .facade { fill: #f7f4ee; stroke: #0b1d33; stroke-width: 1; }
  .panel { fill: var(--panel); stroke: #0b1d33; stroke-width: 1; }
  .side { fill: var(--panel-side); stroke: #0b1d33; stroke-width: 1; }
  .roof { fill: var(--panel); stroke: #0b1d33; stroke-width: 1; }
  .roofside { fill: var(--panel-side); stroke: #0b1d33; stroke-width: 1; }
  .frame { fill: var(--frame); stroke: rgba(11,29,51,.45); stroke-width: .8; }
  .glass { fill: var(--glass); stroke: #0b1d33; stroke-width: 1; }
  .header { fill: var(--header); }
  .goldline { fill: none; stroke: #d4a843; stroke-width: 2; }
  .mullion { fill: none; stroke: #0b1d33; stroke-width: 1.4; }
  .zip { fill: none; stroke: #d4a843; stroke-width: 1.6; stroke-dasharray: 1.2 1.1; }
  .name { font-family: Arial, Helvetica, sans-serif; font-weight: 700; fill: #0b1d33; }
  .enclosure-svg { --frame: #0b1d33; --panel: #163454; --panel-side: #10263d; --glass: #d7e6f2; --header: #d4a843; }
</style>
${cardsHtml(TYPES, mapped)}
`;

writeFileSync("/tmp/enclosure-sheet.html", sheet);
writeFileSync("/tmp/enclosure-cards.html", cardsHtml(TYPES, mapped));
console.log("types", TYPES.length, "scale sample", mapped[0].scale);

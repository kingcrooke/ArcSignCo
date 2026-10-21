// Original isometric drawings for the winter enclosures page.
// One camera angle. Each drawing is scaled to fill its own tile.
// Not traced from competitor photos.
import { readFileSync, writeFileSync } from "node:fs";

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const VB_W = 320;
const VB_H = 480;

function P(x, y, z) {
  return [(x - y) * COS, (x + y) * SIN - z];
}
function fmt(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}
function dOf(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${fmt(p[0])} ${fmt(p[1])}`).join("") + "Z";
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function fig() {
  return { parts: [], box: [] };
}
function add(f, cls, pts, inBox = true) {
  if (inBox) for (const p of pts) f.box.push(p);
  f.parts.push(`<path class="${cls}" d="${dOf(pts)}"/>`);
}
function addOpen(f, cls, pts, inBox = true) {
  if (inBox) for (const p of pts) f.box.push(p);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${fmt(p[0])} ${fmt(p[1])}`).join("");
  f.parts.push(`<path class="${cls}" d="${d}"/>`);
}
function hole(f, cls, outer, inners, inBox = true) {
  const holes = Array.isArray(inners[0] && inners[0][0]) ? inners : [inners];
  if (inBox) {
    for (const p of outer) f.box.push(p);
    for (const inner of holes) for (const p of inner) f.box.push(p);
  }
  const d = [dOf(outer), ...holes.map((inner) => dOf(inner))].join(" ");
  f.parts.push(`<path class="${cls}" fill-rule="evenodd" d="${d}"/>`);
}
function quad(f, cls, a, b, c, d, inBox = true) {
  add(f, cls, [a, b, c, d], inBox);
}
function dot(f, cls, x, y, z, r) {
  const c = P(x, y, z);
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
  }
  add(f, cls, pts);
}

function front(x, y, w, h, u, v) {
  return P(x + u * w, y, v * h);
}
function side(x, y, d, h, u, v) {
  return P(x, y + u * d, v * h);
}
function winsOf(win) {
  if (!win) return [];
  return Array.isArray(win[0]) ? win : [win];
}

function pad(f, x0, y0, x1, y1) {
  quad(f, "pad", P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0), false);
}
function facade(f, x, w, y, h) {
  quad(f, "facade", P(x, y, 0), P(x + w, y, 0), P(x + w, y, h), P(x, y, h), false);
  addOpen(f, "mullion", [P(x + 0.2, y, h * 0.55), P(x + w - 0.2, y, h * 0.55)], false);
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
  quad(f, "roof", P(x - oh, y - oh, h), P(x + w + oh, y - oh, h), P(x + w + oh, y + d + oh, h), P(x - oh, y + d + oh, h));
  quad(f, "frame", P(x - oh, y - oh, h - 0.22), P(x + w + oh, y - oh, h - 0.22), P(x + w + oh, y - oh, h), P(x - oh, y - oh, h));
  addOpen(f, "goldline", [P(x - oh, y - oh, h), P(x + w + oh, y - oh, h)]);
}

function gableRoof(f, x, y, w, d, h, peak) {
  const m = x + w / 2;
  const z = h + peak;
  quad(f, "roof", P(x, y, h), P(m, y, z), P(m, y + d, z), P(x, y + d, h));
  quad(f, "roofside", P(x + w, y, h), P(x + w, y + d, h), P(m, y + d, z), P(m, y, z));
  add(f, "panel", [P(x, y, h), P(x + w, y, h), P(m, y, z)]);
  addOpen(f, "goldline", [P(x, y, h), P(m, y, z), P(x + w, y, h)]);
  addOpen(f, "goldline", [P(m, y, z), P(m, y + d, z)]);
}

function wallFace(f, kind, x, y, span, h, win) {
  const at = kind === "front"
    ? (u, v) => front(x, y, span, h, u, v)
    : (u, v) => side(x, y, span, h, u, v);
  const fill = kind === "front" ? "panel" : "side";
  const outer = [at(0, 0), at(1, 0), at(1, 1), at(0, 1)];
  const wins = winsOf(win);
  if (!wins.length) {
    add(f, fill, outer);
    return;
  }
  const inners = wins.map((w) => [at(w[0], w[1]), at(w[2], w[1]), at(w[2], w[3]), at(w[0], w[3])]);
  for (const inner of inners) quad(f, "glass", inner[0], inner[1], inner[2], inner[3]);
  hole(f, fill, outer, inners);
}

function ribs(f, kind, x, y, span, h, win, count) {
  const at = kind === "front"
    ? (u, v) => front(x, y, span, h, u, v)
    : (u, v) => side(x, y, span, h, u, v);
  const [u0, v0, u1, v1] = win;
  const dv = 0.012;
  for (let i = 1; i <= count; i++) {
    const v = v0 + ((v1 - v0) * i) / (count + 1);
    quad(f, "rib", at(u0, v - dv), at(u1, v - dv), at(u1, v + dv), at(u0, v + dv));
  }
}

function gridBars(f, kind, x, y, span, h) {
  const at = kind === "front"
    ? (u, v) => front(x, y, span, h, u, v)
    : (u, v) => side(x, y, span, h, u, v);
  const du = 0.018;
  const dv = 0.016;
  quad(f, "glass", at(0.03, 0.02), at(0.97, 0.02), at(0.97, 0.8), at(0.03, 0.8));
  for (const u of [0.25, 0.5, 0.75]) {
    quad(f, "frame", at(u - du, 0.02), at(u + du, 0.02), at(u + du, 0.8), at(u - du, 0.8));
  }
  for (const v of [0.28, 0.54]) {
    quad(f, "frame", at(0.03, v - dv), at(0.97, v - dv), at(0.97, v + dv), at(0.03, v + dv));
  }
}

function headerBand(f, x, y, w, h, v0, v1) {
  quad(f, "header", front(x, y, w, h, 0.04, v0), front(x, y, w, h, 0.96, v0), front(x, y, w, h, 0.96, v1), front(x, y, w, h, 0.04, v1));
  return front(x, y, w, h, 0.5, (v0 + v1) / 2);
}

function doorLeaf(f, x0, y0, x1, y1, z0, z1) {
  const bl = P(x0, y0, z0);
  const br = P(x1, y1, z0);
  const tr = P(x1, y1, z1);
  const tl = P(x0, y0, z1);
  const g = (u, v) => P(lerp(x0, x1, u), lerp(y0, y1, u), lerp(z0, z1, v));
  const glass = [g(0.12, 0.34), g(0.88, 0.34), g(0.88, 0.9), g(0.12, 0.9)];
  quad(f, "glass", glass[0], glass[1], glass[2], glass[3]);
  hole(f, "frame", [bl, br, tr, tl], glass);
  dot(f, "header", lerp(x0, x1, 0.78), lerp(y0, y1, 0.78), lerp(z0, z1, 0.48), 0.16);
}

function door(f, x, y, w, z0, z1, open) {
  const a = open ? 1.15 : 0;
  const x1 = x + Math.cos(a) * w;
  const y1 = y - Math.sin(a) * w;
  doorLeaf(f, x, y, x1, y1, z0, z1);
  if (open) {
    const arc = [];
    for (let i = 0; i <= 10; i++) {
      const t = (a * i) / 10;
      arc.push(P(x + Math.cos(t) * w, y - Math.sin(t) * w, 0.08));
    }
    addOpen(f, "goldline", arc);
  }
}

function doorSide(f, x, y, len, z0, z1, open) {
  const a = open ? 1.05 : 0;
  const x1 = x - Math.sin(a) * len;
  const y1 = y + Math.cos(a) * len;
  doorLeaf(f, x, y, x1, y1, z0, z1);
  if (open) {
    const arc = [];
    for (let i = 0; i <= 8; i++) {
      const t = (a * i) / 8;
      arc.push(P(x - Math.sin(t) * len, y + Math.cos(t) * len, 0.08));
    }
    addOpen(f, "goldline", arc);
  }
}

function lap(f, a, b, c, d) {
  quad(f, "siding", a, b, c, d);
}
function siding(f, x, y, d, h) {
  for (const v of [0.2, 0.36, 0.52, 0.68]) {
    lap(f, side(x, y, d, h, 0.08, v), side(x, y, d, h, 0.92, v), side(x, y, d, h, 0.92, v + 0.045), side(x, y, d, h, 0.08, v + 0.045));
  }
}
function sidingFront(f, x, y, w, h, gap0, gap1) {
  for (const v of [0.18, 0.34, 0.5]) {
    if (gap0 > 0.12) lap(f, front(x, y, w, h, 0.05, v), front(x, y, w, h, gap0, v), front(x, y, w, h, gap0, v + 0.045), front(x, y, w, h, 0.05, v + 0.045));
    if (gap1 < 0.88) lap(f, front(x, y, w, h, gap1, v), front(x, y, w, h, 0.95, v), front(x, y, w, h, 0.95, v + 0.045), front(x, y, w, h, gap1, v + 0.045));
  }
}

function vestibule(spec) {
  const f = fig();
  const x = 0;
  const y = 0;
  const { w, d, h, roof, winSide, winFront, doorMode, wood, t = 0.22 } = spec;
  pad(f, -0.7, -1.6, w + 0.8, d + 0.7);
  facade(f, -0.35, w + 0.7, d + 0.12, h + 0.9);
  wallFace(f, "side", x, y, d, h, winSide);
  if (wood) siding(f, x, y, d, h);
  wallFace(f, "front", x, y, w, h, winFront);
  if (wood && spec.doorU) sidingFront(f, x, y, w, h, spec.doorU[0], spec.doorU[1]);
  posts(f, x, y, w, d, h, t);
  if (roof === "gable") gableRoof(f, x, y, w, d, h, spec.peak || 2.8);
  else flatRoof(f, x, y, w, d, h, 0.28);
  const nameAt = headerBand(f, x, y, w, h, spec.hv0 ?? 0.8, spec.hv1 ?? 0.94);
  if (doorMode === "swing") door(f, x + w * 0.12, y, w * 0.4, 0, h * 0.74, true);
  else if (doorMode === "slide") {
    door(f, x + w * 0.06, y, w * 0.42, 0, h * 0.76, false);
    door(f, x + w * 0.4, y - 0.55, w * 0.42, 0, h * 0.76, false);
    addOpen(f, "goldline", [front(x, y, w, h, 0.04, 0.78), front(x, y, w, h, 0.96, 0.78)]);
    addOpen(f, "goldline", [front(x, y, w, h, 0.04, 0.74), front(x, y, w, h, 0.96, 0.74)]);
  } else if (doorMode === "side") {
    doorSide(f, x, y + d * 0.22, d * 0.5, 0, h * 0.72, true);
  } else if (doorMode === "front") {
    door(f, x + (spec.dx ?? w * 0.3), y, spec.dw ?? w * 0.4, 0, h * 0.74, false);
  }
  f.nameAt = nameAt;
  return f;
}

function glassEntry() {
  const f = fig();
  const w = 8.4;
  const d = 4.4;
  const h = 7.6;
  pad(f, -0.6, -1.4, w + 0.7, d + 0.6);
  facade(f, -0.4, w + 0.8, d + 0.1, h + 1.1);
  gridBars(f, "side", 0, 0, d, h);
  gridBars(f, "front", 0, 0, w, h);
  posts(f, 0, 0, w, d, h, 0.12);
  flatRoof(f, 0, 0, w, d, h, 0.16);
  const nameAt = headerBand(f, 0, 0, w, h, 0.84, 0.96);
  door(f, w * 0.34, 0, w * 0.28, 0, h * 0.72, false);
  f.nameAt = nameAt;
  return f;
}

function cornerUnit() {
  const f = fig();
  const h = 7.1;
  pad(f, -0.8, -1.5, 11.4, 8.6);
  facade(f, -0.3, 10.4, 7.6, h + 1.1);
  wallFace(f, "side", 0, 3.4, 4.4, h, [0.12, 0.18, 0.88, 0.7]);
  wallFace(f, "front", 0, 3.4, 4.6, h, null);
  posts(f, 0, 3.4, 4.6, 4.4, h, 0.22);
  flatRoof(f, 0, 3.4, 4.6, 4.4, h, 0.16);
  wallFace(f, "side", 0, 0, 3.4, h, null);
  wallFace(f, "front", 0, 0, 10.2, h, [0.42, 0.16, 0.92, 0.7]);
  posts(f, 0, 0, 10.2, 3.4, h, 0.22);
  flatRoof(f, 0, 0, 10.2, 3.4, h, 0.16);
  const nameAt = headerBand(f, 0, 0, 10.2, h, 0.8, 0.94);
  door(f, 0.7, 3.4, 2.5, 0, h * 0.72, false);
  f.nameAt = nameAt;
  return f;
}

function roll(f, x0, x1, y, z) {
  const r = 0.62;
  quad(f, "frame", P(x0, y, z - r), P(x1, y, z - r), P(x1, y - 0.28, z), P(x0, y - 0.28, z));
  for (const x of [x0 + 0.2, (x0 + x1) / 2, x1 - 0.05]) {
    for (const [rad, cls] of [[r, "frame"], [r * 0.62, "glass"], [r * 0.28, "header"]]) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        pts.push(P(x, y + Math.sin(a) * rad * 0.7, z + Math.cos(a) * rad));
      }
      add(f, cls, pts);
    }
  }
}

function curtains() {
  const f = fig();
  const w = 10.4;
  const d = 3.6;
  const h = 6.4;
  pad(f, -0.6, -1.8, w + 0.7, d + 0.5);
  facade(f, -0.3, w + 0.6, d + 0.08, h + 2.2);
  quad(f, "roof", P(0, d, h + 1.7), P(w, d, h + 1.7), P(w, -0.15, h), P(0, -0.15, h));
  quad(f, "header", P(0.2, -0.2, h - 0.55), P(w - 0.2, -0.2, h - 0.55), P(w - 0.2, -0.2, h + 0.05), P(0.2, -0.2, h + 0.05));
  roll(f, 0.35, 2.5, -0.15, h - 0.95);
  roll(f, 2.9, 5.05, -0.15, h - 0.95);
  roll(f, 5.45, 6.7, -0.15, h - 0.95);
  quad(f, "glass", P(7.15, -0.05, 0.15), P(9.85, -0.05, 0.15), P(9.85, -0.05, h - 0.7), P(7.15, -0.05, h - 0.7));
  addOpen(f, "mullion", [P(7.15, -0.05, 0.15), P(7.15, -0.05, h - 0.7)]);
  addOpen(f, "mullion", [P(9.85, -0.05, 0.15), P(9.85, -0.05, h - 0.7)]);
  quad(f, "frame", P(7.05, -0.08, 0.05), P(9.95, -0.08, 0.05), P(9.95, -0.08, 0.32), P(7.05, -0.08, 0.32));
  addOpen(f, "zip", [P(8.5, -0.06, 0.35), P(8.5, -0.06, h - 0.85)]);
  post(f, 0.15, 0, 0, h, 0.16);
  post(f, w - 0.15, 0, 0, h, 0.16);
  const nameAt = P(w / 2, -0.2, h - 0.25);
  f.nameAt = nameAt;
  return f;
}

function zipperWall() {
  const f = fig();
  const w = 9.6;
  const d = 3.6;
  const h = 7.2;
  const win = [0.05, 0.06, 0.95, 0.76];
  pad(f, -0.6, -1.5, w + 0.7, d + 0.6);
  facade(f, -0.3, w + 0.6, d + 0.1, h + 1);
  wallFace(f, "side", 0, 0, d, h, [0.08, 0.1, 0.92, 0.74]);
  wallFace(f, "front", 0, 0, w, h, win);
  for (const u of [0.33, 0.66]) {
    for (let i = 0; i < 8; i++) {
      const v0 = 0.1 + (0.62 * i) / 8;
      const v1 = v0 + 0.04;
      quad(f, "header", front(0, 0, w, h, u - 0.018, v0), front(0, 0, w, h, u + 0.018, v0), front(0, 0, w, h, u + 0.018, v1), front(0, 0, w, h, u - 0.018, v1));
    }
    const zx = u * w;
    quad(f, "header", P(zx - 0.22, -0.12, h * 0.38), P(zx + 0.22, -0.12, h * 0.38), P(zx + 0.22, -0.12, h * 0.38 + 0.55), P(zx - 0.22, -0.12, h * 0.38 + 0.55));
  }
  posts(f, 0, 0, w, d, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.18);
  const nameAt = headerBand(f, 0, 0, w, h, 0.82, 0.95);
  f.nameAt = nameAt;
  return f;
}

function panelRoom(spec) {
  const f = fig();
  const w = spec.w;
  const d = spec.d;
  const h = 7.2;
  const t = spec.t;
  const win = spec.win || [0.06, 0.08, 0.94, 0.74];
  pad(f, -0.7, -1.5, w + 0.8, d + 0.6);
  facade(f, -0.35, w + 0.7, d + 0.1, h + 1);
  wallFace(f, "side", 0, 0, d, h, [0.08, 0.1, 0.92, 0.74]);
  wallFace(f, "front", 0, 0, w, h, win);
  for (let i = 1; i < spec.cols; i++) {
    addOpen(f, "mullion", [front(0, 0, w, h, i / spec.cols, win[1]), front(0, 0, w, h, i / spec.cols, win[3])]);
  }
  if (spec.mid) addOpen(f, "mullion", [front(0, 0, w, h, win[0], 0.42), front(0, 0, w, h, win[2], 0.42)]);
  if (spec.ribs) {
    ribs(f, "front", 0, 0, w, h, win, 6);
    ribs(f, "side", 0, 0, d, h, [0.08, 0.1, 0.92, 0.74], 5);
  }
  posts(f, 0, 0, w, d, h, t);
  if (spec.roof === "open") {
    quad(f, "roof", P(-0.15, -0.15, h), P(w * 0.36, -0.15, h), P(w * 0.36, d + 0.15, h), P(-0.15, d + 0.15, h));
    quad(f, "roof", P(w * 0.64, -0.15, h), P(w + 0.15, -0.15, h), P(w + 0.15, d + 0.15, h), P(w * 0.64, d + 0.15, h));
    addOpen(f, "goldline", [P(w * 0.36, -0.2, h), P(w * 0.64, -0.2, h)]);
    addOpen(f, "frame", [P(w * 0.36, d * 0.5, h), P(w * 0.64, d * 0.5, h)]);
    addOpen(f, "goldline", [P(-0.15, -0.15, h), P(w * 0.36, -0.15, h)]);
    addOpen(f, "goldline", [P(w * 0.64, -0.15, h), P(w + 0.15, -0.15, h)]);
  } else flatRoof(f, 0, 0, w, d, h, 0.2);
  const nameAt = headerBand(f, 0, 0, w, h, 0.8, 0.94);
  if (spec.door !== false) door(f, w * 0.4, 0, w * 0.2, 0, h * 0.7, false);
  f.nameAt = nameAt;
  return f;
}

function sidewalk() {
  const f = fig();
  const w = 10;
  const d = 4.6;
  const h = 6.6;
  const rail = 1.7;
  pad(f, -0.5, -1.8, w + 0.7, d + 0.4);
  facade(f, -0.2, w + 0.4, d + 0.06, h + 0.5);
  post(f, 0.2, 0.2, 0, h, 0.16);
  post(f, w - 0.2, 0.2, 0, h, 0.16);
  post(f, 0.2, d - 0.15, 0, h, 0.16);
  post(f, w - 0.2, d - 0.15, 0, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.35);
  quad(f, "frame", P(0.25, 0.08, 0), P(w - 0.25, 0.08, 0), P(w - 0.25, 0.08, rail), P(0.25, 0.08, rail));
  quad(f, "frame", P(0.08, 0.25, 0), P(0.08, d - 0.15, 0), P(0.08, d - 0.15, rail), P(0.08, 0.25, rail));
  quad(f, "glass", P(0.3, -0.02, rail + 0.08), P(w * 0.62, -0.02, rail + 0.08), P(w * 0.62, -0.02, h * 0.58), P(0.3, -0.02, h * 0.58));
  addOpen(f, "mullion", [P(0.3, -0.02, h * 0.58), P(w * 0.62, -0.02, h * 0.58)]);
  const nameAt = P(w / 2, -0.35, h + 0.05);
  quad(f, "header", P(w * 0.18, -0.4, h - 0.15), P(w * 0.82, -0.4, h - 0.15), P(w * 0.82, -0.4, h + 0.32), P(w * 0.18, -0.4, h + 0.32));
  f.nameAt = nameAt;
  return f;
}

function roadway() {
  const f = fig();
  const w = 9.2;
  const d = 4.2;
  const h = 6.4;
  const bh = 2.15;
  pad(f, -0.8, -1.8, w + 1.1, d + 0.4);
  facade(f, -0.15, w + 0.4, d + 0.08, h + 0.4);
  quad(f, "frame", P(0, -0.35, 0), P(w, -0.35, 0), P(w, -0.35, bh), P(0, -0.35, bh));
  quad(f, "header", P(0, -0.42, bh - 0.38), P(w, -0.42, bh - 0.38), P(w, -0.42, bh - 0.08), P(0, -0.42, bh - 0.08));
  quad(f, "frame", P(-0.28, 0.1, 0), P(-0.28, d, 0), P(-0.28, d, bh), P(-0.28, 0.1, bh));
  quad(f, "frame", P(w + 0.28, 0.1, 0), P(w + 0.28, d, 0), P(w + 0.28, d, bh), P(w + 0.28, 0.1, bh));
  post(f, 0.2, 0.15, bh, h, 0.16);
  post(f, w - 0.2, 0.15, bh, h, 0.16);
  post(f, 0.2, d - 0.15, 0, h, 0.16);
  post(f, w - 0.2, d - 0.15, 0, h, 0.16);
  flatRoof(f, 0, 0, w, d, h, 0.22);
  quad(f, "glass", P(0.35, -0.28, bh + 0.08), P(w - 0.35, -0.28, bh + 0.08), P(w - 0.35, -0.28, h - 1.35), P(0.35, -0.28, h - 1.35));
  addOpen(f, "mullion", [P(0.35, -0.28, h - 1.35), P(w - 0.35, -0.28, h - 1.35)]);
  const nameAt = P(w / 2, -0.45, h + 0.02);
  quad(f, "header", P(w * 0.18, -0.5, h - 0.12), P(w * 0.82, -0.5, h - 0.12), P(w * 0.82, -0.5, h + 0.28), P(w * 0.18, -0.5, h + 0.28));
  f.nameAt = nameAt;
  return f;
}

function tent() {
  const f = fig();
  const w = 9.2;
  const d = 5.4;
  const eave = 5.2;
  const peak = 8.6;
  pad(f, -0.6, -1.4, w + 0.7, d + 0.7);
  post(f, 0.1, 0.1, 0, eave, 0.18);
  post(f, w - 0.1, 0.1, 0, eave, 0.18);
  post(f, 0.1, d - 0.1, 0, eave, 0.18);
  post(f, w - 0.1, d - 0.1, 0, eave, 0.18);
  wallFace(f, "side", 0, 0, d, eave * 0.96, [0.08, 0.06, 0.92, 0.82]);
  wallFace(f, "front", 0, 0, w, eave * 0.96, [0.06, 0.06, 0.94, 0.82]);
  const wallH = eave * 0.96;
  for (let i = 0; i < 7; i++) {
    const v0 = 0.1 + (0.66 * i) / 7;
    const v1 = v0 + 0.045;
    quad(f, "header", front(0, 0, w, wallH, 0.48, v0), front(0, 0, w, wallH, 0.52, v0), front(0, 0, w, wallH, 0.52, v1), front(0, 0, w, wallH, 0.48, v1));
  }
  const zx = w * 0.5;
  const zh = eave * 0.42;
  quad(f, "header", P(zx - 0.16, -0.08, zh), P(zx + 0.16, -0.08, zh), P(zx + 0.16, -0.08, zh + 0.4), P(zx - 0.16, -0.08, zh + 0.4));
  const m = w / 2;
  quad(f, "roof", P(0, 0, eave), P(m, 0, peak), P(m, d, peak), P(0, d, eave));
  quad(f, "roofside", P(w, 0, eave), P(w, d, eave), P(m, d, peak), P(m, 0, peak));
  add(f, "panel", [P(0, 0, eave), P(w, 0, eave), P(m, 0, peak)]);
  addOpen(f, "goldline", [P(0, 0, eave), P(m, 0, peak), P(w, 0, eave)]);
  const nameAt = P(m, 0.02, eave + (peak - eave) * 0.42);
  quad(f, "header", P(w * 0.32, 0.02, eave + 0.35), P(w * 0.68, 0.02, eave + 0.35), P(w * 0.58, 0.02, eave + 1.15), P(w * 0.42, 0.02, eave + 1.15));
  f.nameAt = nameAt;
  return f;
}

function dome() {
  const f = fig();
  const cx = 3.4;
  const cy = 2.8;
  const r = 3.2;
  const H = 4.8;
  pad(f, -0.2, -1.6, 7.4, 6.2);
  const rings = 5;
  const gores = 8;
  function pt(i, k) {
    const ang = -0.55 + (i / gores) * Math.PI * 1.25;
    const v = k / rings;
    const rr = Math.cos(v * Math.PI * 0.5) * r;
    const z = Math.sin(v * Math.PI * 0.5) * H;
    return P(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.7, z);
  }
  for (let i = 0; i < gores; i++) {
    for (let k = 0; k < rings; k++) {
      const cls = k > rings - 2 ? "roof" : "glass";
      add(f, cls, [pt(i, k), pt(i + 1, k), pt(i + 1, k + 1), pt(i, k + 1)]);
    }
    addOpen(f, "mullion", [pt(i, 0), pt(i, rings)]);
  }
  door(f, cx - 0.85, cy - r * 0.42, 1.7, 0, 2.6, false);
  const nameAt = P(cx, cy - r * 0.15, 3.55);
  quad(f, "header", P(cx - 1.25, cy - r * 0.22, 3.25), P(cx + 1.25, cy - r * 0.22, 3.25), P(cx + 1.25, cy - r * 0.22, 3.9), P(cx - 1.25, cy - r * 0.22, 3.9));
  f.nameAt = nameAt;
  return f;
}

const TYPES = [
  { id: "small-entry", group: "vestibule", name: "Small entry vestibule", blurb: "A flat-roof box at one door. Fabric walls, a clear vinyl window, and the name on the header.", tags: ["Single entry", "Fabric", "Clear vinyl", "Seasonal"], fig: vestibule({ w: 5.4, d: 4.2, h: 7.4, roof: "flat", winSide: [0.1, 0.14, 0.9, 0.72], winFront: null, doorMode: "front", dx: 0.85, dw: 3.5 }) },
  { id: "lobby", group: "vestibule", name: "Medium lobby vestibule", blurb: "Wide enough for people to pass. Door on the side wall, a clear panel across the front.", tags: ["Lobby", "Fabric", "Clear vinyl", "Seasonal"], fig: vestibule({ w: 8.8, d: 4.8, h: 7.3, roof: "flat", winSide: null, winFront: [0.08, 0.12, 0.92, 0.72], doorMode: "side" }) },
  { id: "cafe-room", group: "vestibule", name: "Large cafe room", blurb: "A room-sized enclosure for a waiting area or a private patio, not a sealed sidewalk cafe.", tags: ["Cafe room", "Fabric", "Clear vinyl", "Private property"], fig: vestibule({ w: 12.4, d: 5.6, h: 7.2, roof: "flat", winSide: [0.08, 0.14, 0.92, 0.7], winFront: [[0.05, 0.14, 0.28, 0.7], [0.6, 0.14, 0.94, 0.7]], doorMode: "front", dx: 4.3, dw: 2.3 }) },
  { id: "gable", group: "vestibule", name: "Peaked gable vestibule", blurb: "The same entry box with a high peak, so snow and rain leave the roof.", tags: ["Single entry", "Fabric", "Seasonal"], fig: vestibule({ w: 6.2, d: 4.4, h: 6.1, roof: "gable", peak: 3.1, winSide: [0.12, 0.18, 0.88, 0.68], winFront: null, doorMode: "front", dx: 1.15, dw: 3.6, hv0: 0.7, hv1: 0.86 }) },
  { id: "glass-entry", group: "vestibule", name: "Glass and aluminum entry", blurb: "Storefront framing and a mullion grid. The year-round version, with a permit path of its own.", tags: ["Lobby", "Glass", "Aluminum", "Year-round path"], fig: glassEntry() },
  { id: "wood", group: "vestibule", name: "Wood-frame vestibule", blurb: "Thicker painted wood posts and lap siding, with a clear window and the name on the header.", tags: ["Single entry", "Wood", "Seasonal"], fig: vestibule({ w: 6.2, d: 4.4, h: 7.2, roof: "flat", t: 0.58, wood: true, doorU: [0.16, 0.78], winSide: [0.16, 0.28, 0.84, 0.66], winFront: null, doorMode: "front", dx: 1.35, dw: 3.2 }) },
  { id: "swing", group: "vestibule", name: "Swing-door vestibule", blurb: "A hinged door that swings out, with room for the maneuvering clearance at the handle.", tags: ["Single entry", "Swing door", "Seasonal"], fig: vestibule({ w: 6.6, d: 4.6, h: 7.3, roof: "flat", winSide: [0.12, 0.18, 0.88, 0.7], winFront: [0.58, 0.2, 0.92, 0.68], doorMode: "swing" }) },
  { id: "slide", group: "vestibule", name: "Sliding-door vestibule", blurb: "Two panels on a head track, for a door that should not sweep the sidewalk.", tags: ["Lobby", "Sliding door", "Seasonal"], fig: vestibule({ w: 8.6, d: 4.4, h: 7.2, roof: "flat", winSide: [0.14, 0.2, 0.86, 0.68], winFront: null, doorMode: "slide", hv0: 0.84, hv1: 0.96 }) },
  { id: "corner", group: "vestibule", name: "Corner wraparound", blurb: "An L at a corner door: one run across the front, one run down the side.", tags: ["Corner", "Fabric", "Clear vinyl", "Seasonal"], fig: cornerUnit() },
  { id: "curtains", group: "cover", name: "Awning with roll-down curtains", blurb: "A cover on the wall, clear curtains rolled up, and one panel dropped.", tags: ["Walkway", "Clear vinyl", "Fabric", "Seasonal"], fig: curtains() },
  { id: "zipper", group: "cover", name: "Zippered vinyl panels", blurb: "Clear panels joined by zippers, so a wall can open without coming off the frame.", tags: ["Walkway", "Clear vinyl", "Seasonal"], fig: zipperWall() },
  { id: "poly", group: "cover", name: "Polycarbonate panels", blurb: "Rigid clear panels with horizontal ribs in a heavier frame. A longer install, not a rolled curtain.", tags: ["Cafe room", "Polycarbonate", "Year-round path"], fig: panelRoom({ w: 9.2, d: 5, t: 0.4, cols: 3, mid: true, ribs: true, roof: "flat" }) },
  { id: "acrylic", group: "cover", name: "Acrylic glass-look", blurb: "Two large clear panes and a thin frame, closer to glass than to a vinyl curtain.", tags: ["Lobby", "Acrylic", "Year-round path"], fig: panelRoom({ w: 8.6, d: 4.6, t: 0.12, cols: 2, mid: false, ribs: false, roof: "flat", win: [0.04, 0.05, 0.96, 0.78] }) },
  { id: "sidewalk", group: "cover", name: "Sidewalk cafe screen", blurb: "A low rail, a cover, and a clear screen that stops short of the roof. Not a sealed room.", tags: ["Sidewalk seating", "Clear vinyl", "Open air"], fig: sidewalk() },
  { id: "roadway", group: "cover", name: "Roadway dining cover", blurb: "Barriers on the street sides, a cover overhead, and a screen only on the road face.", tags: ["Sidewalk seating", "Open air", "Seasonal"], fig: roadway() },
  { id: "tent", group: "cover", name: "Tent with sidewalls", blurb: "A peaked fabric roof on posts, with clear sidewalls and a zipper door.", tags: ["Events", "Fabric", "Clear vinyl", "Private property"], fig: tent() },
  { id: "retractable", group: "cover", name: "Retractable-roof enclosure", blurb: "Clear walls with a roof that opens in the middle and closes when the weather turns.", tags: ["Cafe room", "Clear vinyl", "Private property"], fig: panelRoom({ w: 10.4, d: 5.2, t: 0.16, cols: 3, mid: false, ribs: false, roof: "open" }) },
  { id: "dome", group: "cover", name: "Dome and cabana pod", blurb: "A freestanding clear pod. A cabana is the same idea with a flat roof and a lower wall.", tags: ["Pod", "Clear panel", "Private property"], fig: dome() }
];

function layoutOne(figure) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of figure.box) {
    minX = Math.min(minX, p[0]);
    maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  }
  const bw = Math.max(0.01, maxX - minX);
  const bh = Math.max(0.01, maxY - minY);
  const scale = Math.min((VB_W * 0.88) / bw, (VB_H * 0.78) / bh);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const tx = VB_W / 2 - cx * scale;
  const ty = VB_H / 2 - cy * scale;
  return {
    tx,
    ty,
    scale,
    name: [figure.nameAt[0] * scale + tx, figure.nameAt[1] * scale + ty],
    fillW: (bw * scale) / VB_W,
    fillH: (bh * scale) / VB_H
  };
}

function svgFor(type, mapped, opts = {}) {
  const hidden = opts.hidden !== false;
  const label = opts.label || type.name;
  const aria = hidden
    ? `aria-hidden="true"`
    : `role="img" aria-label="${label}"`;
  return `<svg class="enclosure-svg" viewBox="0 0 ${VB_W} ${VB_H}" ${aria}>
  <g transform="translate(${fmt(mapped.tx)} ${fmt(mapped.ty)}) scale(${fmt(mapped.scale)})">
    ${type.fig.parts.join("\n    ")}
  </g>
  <text class="name" x="${fmt(mapped.name[0])}" y="${fmt(mapped.name[1])}" text-anchor="middle" dominant-baseline="middle" font-size="16">NAME</text>
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
        ? "Start here. A New York winter vestibule is usually a box at the door: flat or peaked, solid fabric or clear panels, a door on the front or the side, and the business name on the header."
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

function replaceDivInner(html, idAttr, inner) {
  const marker = `id="${idAttr}"`;
  const idPos = html.indexOf(marker);
  if (idPos < 0) throw new Error(`missing ${idAttr}`);
  const open = html.lastIndexOf("<div", idPos);
  const start = html.indexOf(">", idPos) + 1;
  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = open;
  let depth = 0;
  let end = -1;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        end = m.index;
        break;
      }
    } else depth += 1;
  }
  if (end < 0) throw new Error(`unclosed ${idAttr}`);
  return `${html.slice(0, start)}\n${inner}\n${html.slice(end)}`;
}

const mapped = TYPES.map((t) => layoutOne(t.fig));
const cards = cardsHtml(TYPES, mapped);
const preview = svgFor(TYPES[0], mapped[0], { hidden: false, label: TYPES[0].name });

const sheetCss = `
  body { margin: 0; background: #e8edf2; font-family: Arial, sans-serif; }
  .style-grid { display: grid; grid-template-columns: repeat(3, 280px); gap: 12px; padding: 12px; }
  .style-group, .style-group-note { grid-column: 1 / -1; }
  .style-card { display: flex; flex-direction: column; background: #fff; border: 1px solid #d5dde6; text-decoration: none; color: inherit; }
  .style-copy { padding: 8px 10px 12px; }
  .style-name { margin: 0; font-size: 14px; color: #0b1d33; }
  .style-desc { margin: 4px 0; font-size: 12px; color: #526072; }
  .style-tags { display: flex; gap: 4px; flex-wrap: wrap; padding: 0; margin: 0; list-style: none; }
  .style-tags li { font-size: 10px; border: 1px solid #d5dde6; border-radius: 99px; padding: 2px 6px; }
  .enclosure-svg { width: 280px; height: auto; aspect-ratio: 320 / 480; background: #f4f6f8; display: block; --frame:#0b1d33; --panel:#163454; --panel-side:#10263d; --glass:#b9daf6; --header:#d4a843; }
  .pad { fill: #e3ebf3; }
  .facade { fill: #f7f4ee; stroke: #0b1d33; stroke-width: 1.25; }
  .panel, .roof { fill: var(--panel); stroke: #0b1d33; stroke-width: 1.25; }
  .side, .roofside { fill: var(--panel-side); stroke: #0b1d33; stroke-width: 1.25; }
  .frame { fill: var(--frame); stroke: rgba(11,29,51,.45); stroke-width: 1; }
  .glass { fill: var(--glass); stroke: #0b1d33; stroke-width: 1.15; }
  .header { fill: var(--header); }
  .goldline { fill: none; stroke: #d4a843; stroke-width: 2.2; }
  .mullion { fill: none; stroke: #0b1d33; stroke-width: 1.8; }
  .rib { fill: #6d879c; stroke: none; }
  .siding { fill: #e7eef6; stroke: none; }
  .zip { fill: none; stroke: #d4a843; stroke-width: 2.4; stroke-dasharray: 0.55 0.38; }
  .name { font-family: Arial, Helvetica, sans-serif; font-weight: 700; fill: #0b1d33; }
  .panel, .side, .roof, .roofside, .frame, .glass, .facade, .mullion, .goldline, .zip, .rib, .siding { vector-effect: non-scaling-stroke; }
`;

writeFileSync("/tmp/enclosure-sheet.html", `<!DOCTYPE html><meta charset="utf-8"><title>enclosure sheet</title><style>${sheetCss}</style>\n${cards}\n`);
writeFileSync("/tmp/enclosure-cards.html", cards);
writeFileSync("/tmp/enclosure-preview.svg", preview);

const pagePath = new URL("../winter-enclosures/index.html", import.meta.url);
let page = readFileSync(pagePath, "utf8");
page = replaceDivInner(page, "styleGroups", cards);
page = replaceDivInner(page, "stylePreview", preview);
writeFileSync(pagePath, page);

for (let i = 0; i < TYPES.length; i++) {
  const m = mapped[i];
  console.log(TYPES[i].id, "scale", m.scale.toFixed(2), "fillW", m.fillW.toFixed(2), "fillH", m.fillH.toFixed(2));
}

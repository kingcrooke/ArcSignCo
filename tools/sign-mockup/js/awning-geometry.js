// Awning geometry: turns a shape from awning-types.js into faces and frame tubes in plane inches.
// Pure (no DOM), so tools/check-sign-mockup.mjs can test every shape.
//
// Coordinates match the scene: X across the wall (0..W), Y down from the top attachment line
// (0..D), Z out from the wall toward the street. Each face is a quad with a texture key, a uv
// rectangle into that texture, and a unit normal pointing out of the awning (faces are two-sided:
// the scene shades the back of a face as the inside of the cover). Tubes are frame members.
//
// Textures are described, not drawn: { key: { w, h, letter } } in inches, where letter is the
// [u0, v0, u1, v1] box the lettering is fitted into, when that surface carries it.
import { projectionFor, sanitizeAwningOptions } from "./awning-types.js";

const HALF = Math.PI / 2;
const OVERLAP = 0.14; // cells overlap their neighbors so anti-aliased seams don't show
const POST_DROP = 96; // posts run 8' below the pinned patch
const lerp = (a, b, t) => a + (b - a) * t;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.hypot(a[0], a[1], a[2]);
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => lerp(a, b, i / n));
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
};

/** A 2D polyline sampled by arc length. Points are [a, b] pairs (z, y for profiles; x, z for plans). */
export function path2(points) {
  const s = [0];
  for (let i = 1; i < points.length; i++) s.push(s[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const L = s[s.length - 1] || 1;
  const at = f => {
    const target = Math.min(1, Math.max(0, f)) * L;
    let i = 1;
    while (i < s.length - 1 && s[i] < target) i++;
    const seg = s[i] - s[i - 1] || 1, k = Math.min(1, Math.max(0, (target - s[i - 1]) / seg));
    return [lerp(points[i - 1][0], points[i][0], k), lerp(points[i - 1][1], points[i][1], k)];
  };
  return { points, L, at, nodes: s.map(v => v / L) };
}

const curve = (fn, n = 18) => range(0, 1, n).map(fn);

/** Side profile of the roof from the wall (0, 0) to the front bar, as [z, y] points, plus sharp corners. */
export function roofProfile(id, P, Dc) {
  const nose = (s, r) => {
    const pts = [[0, 0], [P - r, s]];
    for (let i = 1; i <= 10; i++) { const a = (i / 10) * HALF; pts.push([P - r + r * Math.sin(a), s + r - r * Math.cos(a)]); }
    if (s + r < Dc - 0.01) pts.push([P, Dc]);
    return pts;
  };
  switch (id) {
    case "aw-quarter": case "aw-dutch": case "aw-dome": case "aw-longdome":
      return { pts: curve(t => [P * Math.sin(t * HALF), Dc * (1 - Math.cos(t * HALF))]), sharp: [] };
    case "aw-convex":
      return { pts: curve(t => bez([0, 0], [0.55 * P, 0.2 * Dc], [P, 0.45 * Dc], [P, Dc], t)), sharp: [] };
    case "aw-concave":
      return { pts: curve(t => bez([0, 0], [0.15 * P, 0.55 * Dc], [0.5 * P, Dc], [P, Dc], t)), sharp: [] };
    case "aw-bullnose": {
      const s = 0.16 * Dc;
      return { pts: nose(s, Math.min(Dc - s, 0.55 * P)), sharp: [] };
    }
    case "aw-waterfall": case "aw-backlit": {
      const s = 0.06 * P, r = (id === "aw-backlit" ? 0.4 : 0.32) * Math.min(P, Dc);
      return { pts: nose(s, r), sharp: [] };
    }
    case "aw-box":
      return { pts: [[0, 0], [P, 0.12 * P], [P, Dc]], sharp: [1] };
    case "aw-mansard": {
      const pt = 0.22 * P;
      return { pts: [[0, 0], [pt, 0], [P, Dc]], sharp: [1] };
    }
    default:
      return { pts: [[0, 0], [P, Dc]], sharp: [] };
  }
}

function mesh() {
  const faces = [], tubes = [];
  return {
    faces, tubes,
    face(mat, tex, pts, uv, { flip = false, inner = false } = {}) {
      let n = cross(sub(pts[2], pts[0]), sub(pts[3], pts[1]));
      const l = len(n);
      if (l < 1e-6) return;
      n = n.map(v => (v / l) * (flip ? -1 : 1));
      faces.push({ mat, tex, pts, uv, n, inner });
    },
    // A parametric surface f(u, v) cut at the given nodes; uv(u, v) gives the texture coords.
    grid({ mat, tex = null, f, uv = (u, v) => [u, v], us, vs, flip = false, sharpV = [], inner = false, overlap = OVERLAP }) {
      const u0 = us[0], u1 = us[us.length - 1];
      for (let j = 0; j < vs.length - 1; j++) {
        const vlo = sharpV.includes(j) ? vs[j] : vs[0], vhi = sharpV.includes(j + 1) ? vs[j + 1] : vs[vs.length - 1];
        const dv = (vs[j + 1] - vs[j]) * overlap;
        const va = Math.max(vlo, vs[j] - dv), vb = Math.min(vhi, vs[j + 1] + dv);
        for (let i = 0; i < us.length - 1; i++) {
          const du = (us[i + 1] - us[i]) * overlap;
          const ua = Math.max(u0, us[i] - du), ub = Math.min(u1, us[i + 1] + du);
          const pts = [f(ua, va), f(ub, va), f(ub, vb), f(ua, vb)];
          const a = len(cross(sub(pts[2], pts[0]), sub(pts[3], pts[1])));
          if (a < 1e-4) continue;
          const t0 = uv(ua, va), t1 = uv(ub, vb);
          this.face(mat, tex, pts, [t0[0], t0[1], t1[0], t1[1]], { flip, inner });
        }
      }
    },
    tube(mat, pts, r, inner = false) {
      for (let i = 0; i < pts.length - 1; i++) tubes.push({ mat, a: pts[i], b: pts[i + 1], r, inner });
    },
    // Thin vertical-ish box (posts, wall plates) as four faces.
    post(x, z, y0, y1, r, mat = "frame") {
      this.face(mat, null, [[x - r, y0, z + r], [x + r, y0, z + r], [x + r, y1, z + r], [x - r, y1, z + r]], null);
      this.face(mat, null, [[x + r, y0, z - r], [x - r, y0, z - r], [x - r, y1, z - r], [x + r, y1, z - r]], null);
      this.face(mat, null, [[x - r, y0, z - r], [x - r, y0, z + r], [x - r, y1, z + r], [x - r, y1, z - r]], null);
      this.face(mat, null, [[x + r, y0, z + r], [x + r, y0, z - r], [x + r, y1, z - r], [x + r, y1, z + r]], null);
    },
    // Axis-aligned box: x0..x1, y0..y1 (down), z0..z1 (out). Six outward faces.
    box(mat, x0, x1, y0, y1, z0, z1, tex = null) {
      this.face(mat, tex, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], tex ? [0, 0, 1, 1] : null);
      this.face(mat, null, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], null);
      this.face(mat, null, [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], null);
      this.face(mat, null, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], null);
      this.face(mat, null, [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], null);
    },
  };
}

const xNodes = (W, step = 30) => range(0, 1, Math.max(2, Math.ceil(W / step)));

// Valance (or fascia) hanging `h` below a rim. rim: [x, y, z] points ordered left wall → front →
// right wall, so the faces point outward. letter: [s0, s1] arc-length fractions for the copy.
function valance(m, rim, h, { mat = "valance", tex = "valance", step = 18 } = {}) {
  const s = [0];
  for (let i = 1; i < rim.length; i++) s.push(s[i - 1] + len(sub(rim[i], rim[i - 1])));
  const L = s[s.length - 1] || 1;
  for (let i = 0; i < rim.length - 1; i++) {
    const a = rim[i], b = rim[i + 1], n = Math.max(1, Math.ceil((s[i + 1] - s[i]) / step));
    const at = (k, dy) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + dy, lerp(a[2], b[2], k)];
    m.grid({
      mat, tex, f: (u, v) => at(u, v * h), uv: (u, v) => [(s[i] + u * (s[i + 1] - s[i])) / L, v],
      us: range(0, 1, n), vs: [0, 1], sharpV: [0, 1],
    });
  }
  return L;
}

function rimLength(rim) {
  let L = 0;
  for (let i = 1; i < rim.length; i++) L += len(sub(rim[i], rim[i - 1]));
  return L;
}

// Front segment of a wrap-around rim [left side, front, right side], as arc-length fractions.
const frontOf = (P, W) => [P / (2 * P + W), (P + W) / (2 * P + W)];

/**
 * Builds the awning. opts are the awning options (sanitized here). W, D: pinned width and drop.
 * Returns { faces, tubes, tex, glow, shadow, P, vr, Dc, print }.
 */
export function awningMesh(type, rawOpts, W, D) {
  const o = sanitizeAwningOptions(type, rawOpts);
  const id = type.id;
  const m = mesh();
  const hasVal = type.valances.length > 0 && o.valance !== "none";
  const vr = hasVal ? Math.min(type.vr, D * (type.vr >= 20 ? 0.7 : 0.45)) : 0;
  const Dc = Math.max(2, D - vr);
  const P = projectionFor(type, o, W, D);
  const tex = {};
  const out = { faces: m.faces, tubes: m.tubes, tex, P, vr, Dc, D, W, glow: ["cover", "end", "face", "nose", "gable", "side", "valance"], shadow: { x0: 0, x1: W, y: D, depth: P, alpha: 0.4 }, print: o.letterOn };
  const onFace = o.letterOn === "face";
  const letterBox = box => (onFace ? box : null);
  const valanceLetter = range => (!onFace && hasVal ? range : null);
  const setValance = (L, letter, extra = {}) => { if (hasVal) tex.valance = { w: L, h: vr, edge: o.valance, letter: valanceLetter(letter), ...extra }; };

  // Straight-front sweep along X with an optional hip at each end.
  function sweep({ prof, hip = 0, sides = o.sides, bottom = D, faceV = [0.3, 0.95], wrapValance = false }) {
    const path = path2(prof.pts);
    const zy = v => path.at(v);
    const e = v => hip * (1 - zy(v)[0] / P);
    const vs = path.nodes, sharpV = prof.sharp;
    const xAt = (u, v) => e(v) + u * (W - 2 * e(v));
    tex.cover = { w: W, h: path.L, letter: letterBox([0.1, faceV[0], 0.9, faceV[1]]), ribs: o.cover === "metal" };
    m.grid({ mat: "cover", tex: "cover", f: (u, v) => { const [z, y] = zy(v); return [xAt(u, v), y, z]; }, us: xNodes(W), vs, sharpV });
    if (hip > 0) {
      tex.end = { w: P, h: path.L, letter: null, ribs: o.cover === "metal" };
      m.grid({ mat: "end", tex: "end", f: (u, v) => { const [z, y] = zy(v); return [e(v), y, u * z]; }, us: range(0, 1, 3), vs, sharpV });
      m.grid({ mat: "end", tex: "end", f: (u, v) => { const [z, y] = zy(v); return [W - e(v), y, u * z]; }, us: range(0, 1, 3), vs, sharpV, flip: true });
      for (const sgn of [0, 1]) m.tube("frame", vs.map(v => { const [z, y] = zy(v); return [sgn ? W - e(v) : e(v), y + 0.8, z - 0.5]; }), 0.6, true);
    } else if (sides === "closed") {
      const sideF = x => (u, v) => { const [z, y] = zy(u); return [x, y + v * (bottom - y), z]; };
      m.grid({ mat: "side", f: sideF(0), us: vs, vs: [0, 0.5, 1] });
      m.grid({ mat: "side", f: sideF(W), us: vs, vs: [0, 0.5, 1], flip: true });
      m.tube("frame", [[0.5, bottom - 0.5, 0.5], [0.5, bottom - 0.5, P - 0.5]], 0.6, true);
      m.tube("frame", [[W - 0.5, bottom - 0.5, 0.5], [W - 0.5, bottom - 0.5, P - 0.5]], 0.6, true);
    }
    const front = zy(1);
    m.tube("frame", [[0, 0.6, 0.6], [W, 0.6, 0.6]], 0.6, true);
    m.tube("frame", [[0, front[1] - 0.6, front[0] - 0.6], [W, front[1] - 0.6, front[0] - 0.6]], 0.6, true);
    const n = Math.max(2, Math.ceil(W / 60) + 1);
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      m.tube("frame", vs.map(v => { const [z, y] = zy(v); return [xAt(u, v) + (u === 0 ? 0.8 : u === 1 ? -0.8 : 0), y + 0.8, z - 0.6]; }), 0.55, true);
    }
    if (hasVal) {
      const rim = wrapValance
        ? [[0, front[1], 0], [0, front[1], front[0]], [W, front[1], front[0]], [W, front[1], 0]]
        : [[0, front[1], front[0]], [W, front[1], front[0]]];
      const L = valance(m, rim, vr);
      setValance(L, wrapValance ? frontOf(front[0], W) : [0, 1]);
    }
    return { path, zy };
  }

  // Shapes swept from a curved plan rim: every point runs from an axis point on the wall top
  // (O) out to the rim, following c(v) outward and y(v) down.
  function radial({ rim, axisX, c, y, faceU = [0.3, 0.7], faceV = [0.5, 0.95], nv = 10 }) {
    const plan = path2(rim);
    const at = (u, v) => {
      const [x, z] = plan.at(u), ox = axisX(x);
      return [ox + c(v) * (x - ox), y(v), c(v) * z];
    };
    tex.cover = { w: plan.L, h: Dc * 1.2, letter: letterBox([faceU[0], faceV[0], faceU[1], faceV[1]]) };
    const us = range(0, 1, Math.max(16, Math.ceil(plan.L / 14)));
    m.grid({ mat: "cover", tex: "cover", f: at, us, vs: range(0.012, 1, nv) });
    for (const u of range(0, 1, 6)) m.tube("frame", range(0.02, 1, nv).map(v => { const p = at(u, v); return [p[0], p[1] + 0.8, p[2] - 0.6]; }), 0.55, true);
    m.tube("frame", us.map(u => at(u, 1)), 0.6, true);
    if (hasVal) {
      const L = valance(m, us.map(u => { const [x, z] = plan.at(u); return [x, Dc, z]; }), vr, { step: 8 });
      setValance(L, [0.3, 0.7], { curved: true });
    }
  }

  const ellipse = (cx, rx, rz, a0, a1, n = 24) => range(a0, a1, n).map(a => [cx + rx * Math.sin(a), rz * Math.cos(a)]);

  switch (id) {
    case "aw-traditional": case "aw-quarter": case "aw-convex": case "aw-concave": case "aw-bullnose": case "aw-seam": {
      const open = o.sides === "open";
      sweep({ prof: roofProfile(id, P, Dc), faceV: [0.32, 0.95] });
      if (open) {
        const A = Dc + 0.7 * P;
        for (const x of [0.8, W - 0.8]) m.tube("frame", [[x, A, 0.5], [x, Dc - 0.6, P - 0.6]], 0.65, true);
        out.shadow.alpha = 0.3;
      }
      break;
    }
    case "aw-spear": {
      sweep({ prof: roofProfile("aw-traditional", P, Dc), sides: "open", faceV: [0.32, 0.95] });
      const A = Dc + 0.75 * P, ext = Math.min(8, 0.2 * P), slope = (A - Dc) / P;
      const n = Math.max(2, Math.ceil(W / 72) + 1);
      for (let i = 0; i < n; i++) {
        const x = lerp(1.2, W - 1.2, i / (n - 1));
        const zE = P + ext, yEnd = A - zE * slope;
        m.tube("arm", [[x, A, 0.6], [x, Dc, P]], 0.7, true);
        m.tube("arm", [[x, Dc, P], [x, yEnd, zE]], 0.7);
        m.face("arm", null, [[x, yEnd, zE], [x, yEnd - 1.6, zE + 2.4], [x, yEnd, zE + 6], [x, yEnd + 1.6, zE + 2.4]], null);
        m.face("arm", null, [[x, yEnd + 1.6, zE + 2.4], [x, yEnd, zE + 6], [x, yEnd - 1.6, zE + 2.4], [x, yEnd, zE]], null);
        m.box("arm", x - 2, x + 2, A - 3, A + 3, 0, 0.8);
      }
      out.shadow.alpha = 0.3;
      break;
    }
    case "aw-dutch": {
      const { zy } = sweep({ prof: roofProfile(id, P, Dc), bottom: Dc + vr, faceV: [0.28, 0.92] });
      tex.cover.pleats = 5;
      out.sideTex = "fan";
      tex.fan = { w: P, h: Dc + vr, hoops: 5 };
      for (const f of m.faces) if (f.mat === "side") {
        f.tex = "fan";
        f.uv = [Math.min(f.pts[0][2], f.pts[2][2]) / P, Math.min(f.pts[0][1], f.pts[2][1]) / (Dc + vr), Math.max(f.pts[0][2], f.pts[2][2]) / P, Math.max(f.pts[0][1], f.pts[2][1]) / (Dc + vr)];
        if (f.pts[0][0] > W / 2) f.uv = [f.uv[2], f.uv[1], f.uv[0], f.uv[3]];
      }
      void zy;
      break;
    }
    case "aw-waterfall": case "aw-box": case "aw-backlit": {
      const prof = roofProfile(id, P, Dc);
      const path = path2(prof.pts);
      // The lettering sits on the vertical face: find where it starts along the profile.
      let k = prof.pts.length - 1;
      while (k > 0 && Math.abs(prof.pts[k - 1][0] - P) < 0.05) k--;
      const v0 = path.nodes[k] + 0.04;
      sweep({ prof, faceV: [Math.min(0.85, v0), 0.96] });
      if (id === "aw-backlit") {
        for (const z of [P * 0.35, P * 0.68]) m.tube("frame", [[1, D - 0.4, z], [W - 1, D - 0.4, z]], 0.4, true);
        for (let x = 24; x < W - 12; x += 24) m.tube("frame", [[x, D - 0.4, 1], [x, D - 0.4, P - 1]], 0.4, true);
      }
      break;
    }
    case "aw-hip": case "aw-mansard": {
      const prof = roofProfile(id, P, Dc);
      const hip = Math.min(id === "aw-hip" ? 0.9 * P : 0.6 * P, W / 4);
      sweep({ prof, hip, wrapValance: true, faceV: id === "aw-mansard" ? [0.35, 0.95] : [0.32, 0.95] });
      break;
    }
    case "aw-bay": {
      const a = 0.4, b = Math.min(0.3, ((1 - a) * P) / W);
      const zf = x => (x < b * W ? lerp(a * P, P, x / (b * W)) : x > (1 - b) * W ? lerp(P, a * P, (x - (1 - b) * W) / (b * W)) : P);
      const us = [...range(0, b, 2), ...range(b, 1 - b, Math.max(2, Math.ceil(((1 - 2 * b) * W) / 30))).slice(1), ...range(1 - b, 1, 2).slice(1)];
      const at = (u, v) => { const x = u * W, z = v * zf(x); return [x, (Dc * z) / P, z]; };
      tex.cover = { w: W, h: Math.hypot(P, Dc), letter: letterBox([0.3, 0.4, 0.7, 0.95]), ribs: o.cover === "metal" };
      m.grid({ mat: "cover", tex: "cover", f: at, us, vs: range(0, 1, 6) });
      const yb = a * Dc + vr;
      const sideF = x => (u, v) => { const z = u * a * P, y = (Dc * z) / P; return [x, y + v * (yb - y), z]; };
      m.grid({ mat: "side", f: sideF(0), us: range(0, 1, 3), vs: [0, 1] });
      m.grid({ mat: "side", f: sideF(W), us: range(0, 1, 3), vs: [0, 1], flip: true });
      for (const u of us.filter((_, i) => i % 2 === 0)) m.tube("frame", [at(u, 0.02), at(u, 1)].map(p => [p[0], p[1] + 0.8, p[2] - 0.6]), 0.55, true);
      const rim = [[0, a * Dc, a * P], [b * W, Dc, P], [(1 - b) * W, Dc, P], [W, a * Dc, a * P]];
      m.tube("frame", rim, 0.6, true);
      if (hasVal) {
        const L = valance(m, rim, vr);
        const s1 = len(sub(rim[1], rim[0])) / L;
        setValance(L, [s1, 1 - s1]);
      }
      break;
    }
    case "aw-dome": {
      radial({ rim: ellipse(W / 2, W / 2, P, -HALF, HALF, 32), axisX: () => W / 2, c: v => Math.sin(v * HALF), y: v => Dc * (1 - Math.cos(v * HALF)) });
      break;
    }
    case "aw-longdome": {
      const R = Math.min(P, W * 0.3);
      const rim = [...ellipse(R, R, P, -HALF, 0, 12), ...ellipse(W - R, R, P, 0, HALF, 12)];
      radial({ rim, axisX: x => Math.min(W - R, Math.max(R, x)), c: v => Math.sin(v * HALF), y: v => Dc * (1 - Math.cos(v * HALF)), faceU: [0.22, 0.78] });
      break;
    }
    case "aw-cone": {
      radial({ rim: ellipse(W / 2, W / 2, P, -HALF, HALF, 32), axisX: () => W / 2, c: v => v, y: v => Dc * v, nv: 8, faceV: [0.45, 0.95] });
      break;
    }
    case "aw-gable": {
      const Hg = Dc, slope = Math.hypot(W / 2, Hg);
      tex.cover = { w: P, h: slope, letter: null, ribs: o.cover === "metal" };
      tex.end = tex.cover;
      const zs = range(0, 1, Math.max(2, Math.ceil(P / 24)));
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => [(W / 2) * (1 - v), Hg * v, u * P], us: zs, vs: range(0, 1, 4) });
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => [W / 2 + (W / 2) * v, Hg * v, (1 - u) * P], us: zs, vs: range(0, 1, 4) });
      tex.gable = { w: W, h: Hg, letter: letterBox([0.3, 0.42, 0.7, 0.94]) };
      const top = u => Hg * Math.abs(2 * u - 1);
      m.grid({ mat: "gable", tex: "gable", f: (u, v) => [u * W, top(u) + v * (Hg - top(u)), P], uv: (u, v) => [u, (top(u) + v * (Hg - top(u))) / Hg], us: range(0, 1, 16), vs: range(0, 1, 3) });
      m.tube("frame", [[W / 2, 0.8, 0], [W / 2, 0.8, P - 0.6]], 0.6, true);
      for (const x of [0.6, W - 0.6]) m.tube("frame", [[x, Hg - 0.6, 0], [x, Hg - 0.6, P - 0.6]], 0.6, true);
      for (const z of zs.map(u => u * P)) m.tube("frame", [[0.6, Hg - 0.6, z], [W / 2, 0.9, z], [W - 0.6, Hg - 0.6, z]], 0.5, true);
      if (hasVal) setValance(valance(m, [[0, Hg, 0], [0, Hg, P], [W, Hg, P], [W, Hg, 0]], vr), frontOf(P, W));
      break;
    }
    case "aw-halfbarrel": case "aw-barrel": case "aw-entrance": {
      const Ra = id === "aw-entrance" ? Math.min(W / 2, Math.max(6, 0.18 * W), Dc) : Math.min(W / 2, Dc);
      const Rc = ((W / 2) ** 2 + Ra ** 2) / (2 * Ra), am = Math.asin(Math.min(1, W / 2 / Rc));
      const arch = u => { const a = -am + u * 2 * am; return [W / 2 + Rc * Math.sin(a), Rc - Rc * Math.cos(a)]; };
      const archL = 2 * am * Rc;
      tex.cover = { w: archL, h: P, letter: null, along: true };
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => { const [x, y] = arch(u); return [x, y, v * P]; }, us: range(0, 1, 16), vs: range(0, 1, Math.max(2, Math.ceil(P / 24))) });
      tex.nose = { w: W, h: Ra, letter: letterBox([0.18, 0.32, 0.82, 0.95]) };
      m.grid({ mat: "nose", tex: "nose", f: (u, v) => { const [x, y] = arch(u); return [x, y + v * (Ra - y), P]; }, uv: (u, v) => { const [x, y] = arch(u); return [x / W, (y + v * (Ra - y)) / Ra]; }, us: range(0, 1, 16), vs: range(0, 1, 3) });
      const bands = D - Ra;
      for (const z of range(0, P, Math.max(1, Math.ceil(P / 48)))) m.tube("frame", range(0, 1, 12).map(u => { const [x, y] = arch(u); return [x, y + 0.8, Math.min(P - 0.6, Math.max(0.6, z))]; }), 0.55, true);
      for (const x of [0.6, W - 0.6]) m.tube("frame", [[x, Ra, 0], [x, Ra, P]], 0.6, true);
      if (bands > 0.5) {
        const L = valance(m, [[0, Ra, 0], [0, Ra, P], [W, Ra, P], [W, Ra, 0]], bands, { step: 24 });
        if (hasVal) tex.valance = { w: L, h: bands, edge: o.valance, letter: valanceLetter(frontOf(P, W)) };
        else {
          tex.valance = { w: L, h: bands, edge: "straight", letter: null };
        }
      }
      if (type.posts) {
        const e = 2;
        const zs = [P - e];
        for (let z = P - e - 120; z > 30; z -= 120) zs.push(z);
        for (const z of zs) for (const x of [e, W - e]) m.post(x, z, D, D + POST_DROP, 1.4);
        out.shadow = { x0: 0, x1: W, y: D, depth: Math.min(P, 40), alpha: 0.3 };
      }
      break;
    }
    case "aw-freestanding": {
      const z0 = 16, z1 = z0 + P, zm = (z0 + z1) / 2;
      tex.cover = { w: W, h: Math.hypot(P / 2, Dc), letter: letterBox([0.15, 0.3, 0.85, 0.92]), ribs: o.cover === "metal" };
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => [u * W, v * Dc, lerp(zm, z1, v)], us: xNodes(W), vs: range(0, 1, 4) });
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => [u * W, v * Dc, lerp(zm, z0, v)], us: xNodes(W), vs: range(0, 1, 4), flip: true });
      tex.gable = { w: P, h: Dc, letter: null };
      const top = u => Dc * Math.abs(2 * u - 1);
      const endF = x => (u, v) => [x, top(u) + v * (Dc - top(u)), z0 + u * P];
      m.grid({ mat: "gable", tex: "gable", f: endF(0), uv: (u, v) => [u, (top(u) + v * (Dc - top(u))) / Dc], us: range(0, 1, 8), vs: range(0, 1, 2) });
      m.grid({ mat: "gable", tex: "gable", f: endF(W), uv: (u, v) => [u, (top(u) + v * (Dc - top(u))) / Dc], us: range(0, 1, 8), vs: range(0, 1, 2), flip: true });
      m.tube("frame", [[0, 0.8, zm], [W, 0.8, zm]], 0.6, true);
      if (hasVal) {
        const L = valance(m, [[0, Dc, z0], [0, Dc, z1], [W, Dc, z1], [W, Dc, z0], [0, Dc, z0]], vr);
        setValance(L, [P / (2 * P + 2 * W), (P + W) / (2 * P + 2 * W)]);
      }
      for (const x of [2, W - 2]) for (const z of [z0 + 2, z1 - 2]) m.post(x, z, Dc, D + POST_DROP, 1.4);
      out.shadow = { x0: 0, x1: W, y: D, depth: 24, alpha: 0.18 };
      break;
    }
    case "aw-wedge": {
      sweep({ prof: { pts: [[0, 0], [P, D]], sharp: [] }, bottom: D, faceV: [0.22, 0.9] });
      m.grid({ mat: "side", f: (u, v) => [u * W, D, (1 - v) * P], us: xNodes(W), vs: [0, 1] });
      break;
    }
    case "aw-flat": case "aw-marquee": case "aw-louver": {
      const F = Math.min(vr || type.vr, D * 0.7), yt = D - F, T = id === "aw-flat" ? Math.min(5, F) : F;
      tex.face = { w: W, h: F, letter: [0.04, 0.12, 0.96, 0.88], fascia: true };
      out.print = "face";
      m.grid({ mat: "face", tex: "face", f: (u, v) => [u * W, yt + v * F, P], us: xNodes(W, 36), vs: [0, 1] });
      const bot = z => yt + T + ((F - T) * z) / P;
      const endF = x => (u, v) => { const z = u * P; return [x, yt + v * (bot(z) - yt), z]; };
      m.grid({ mat: "side", f: endF(0), us: range(0, 1, 3), vs: [0, 1] });
      m.grid({ mat: "side", f: endF(W), us: range(0, 1, 3), vs: [0, 1], flip: true });
      if (id === "aw-louver") {
        const n = Math.max(3, Math.round(P / 6)), h = 2.6, beta = 0.7, yc = yt + F / 2;
        for (let k = 1; k <= n; k++) {
          const z = (P * k) / (n + 1);
          m.face("blade", null, [[0.5, yc - h * Math.sin(beta), z - h * Math.cos(beta)], [W - 0.5, yc - h * Math.sin(beta), z - h * Math.cos(beta)], [W - 0.5, yc + h * Math.sin(beta), z + h * Math.cos(beta)], [0.5, yc + h * Math.sin(beta), z + h * Math.cos(beta)]], null);
        }
        m.face("side", null, [[0, yt, 0.4], [W, yt, 0.4], [W, D, 0.4], [0, D, 0.4]], null);
      } else {
        m.grid({ mat: "deck", f: (u, v) => [u * W, yt, v * P], us: xNodes(W), vs: [0, 1] });
        m.grid({ mat: "soffit", f: (u, v) => [u * W, lerp(D, yt + T, v), (1 - v) * P], us: xNodes(W), vs: [0, 1] });
      }
      const n = Math.max(2, Math.ceil(W / 96) + 1);
      for (let i = 0; i < n; i++) {
        const x = lerp(6, W - 6, i / (n - 1));
        m.tube("rod", [[x, 1.5, 0.4], [x, yt + 0.5, P - 3]], 0.38);
        m.box("rod", x - 2, x + 2, -1, 4, 0, 0.6);
      }
      out.glow = id === "aw-marquee" ? ["face", "side"] : [];
      out.shadow = { x0: 0, x1: W, y: D, depth: Math.min(P, 36), alpha: id === "aw-louver" ? 0.25 : 0.4 };
      break;
    }
    case "aw-glass": {
      const yp = D - 0.7, fall = Math.min(1.5, P * 0.03);
      tex.plate = { w: W, h: P, letter: [0.18, 0.06, 0.82, 0.5], glass: o.cover };
      out.print = "plate";
      m.grid({ mat: "glass", tex: "plate", f: (u, v) => [u * W, yp + v * fall, v * P], uv: (u, v) => [u, 1 - v], us: [0, 1], vs: [0, 1], overlap: 0 });
      for (const pts of [[[0, yp, 0], [0, yp + fall, P], [W, yp + fall, P], [W, yp, 0]]]) m.tube("edge", pts, 0.32);
      const n = Math.max(2, Math.ceil(W / 60) + 1);
      for (let i = 0; i < n; i++) {
        const x = lerp(4, W - 4, i / (n - 1));
        m.tube("rod", [[x, 2, 0.5], [x, yp + fall * 0.9, P - 4]], 0.28);
        m.box("rod", x - 1.4, x + 1.4, 0.5, 3.5, 0, 0.8);
        m.box("rod", x - 1.2, x + 1.2, yp - 0.6, yp + 0.8, 0, 2);
      }
      out.glow = [];
      out.shadow = { x0: 0, x1: W, y: D, depth: P * 0.6, alpha: 0.12 };
      break;
    }
    case "aw-retractable": case "aw-droparm": {
      const drop = id === "aw-droparm";
      const hc = drop ? 8 : 9, cd = drop ? 8 : 10;
      const y0 = hc * 0.8, z0 = cd * 0.7, yf = Dc - 2.5;
      m.box("housing", 0, W, 0, hc, 0, cd);
      tex.cover = { w: W, h: Math.hypot(P - z0, yf - y0), letter: letterBox([0.1, 0.25, 0.9, 0.92]) };
      m.grid({ mat: "cover", tex: "cover", f: (u, v) => [u * W, lerp(y0, yf, v), lerp(z0, P - 1.5, v)], us: xNodes(W), vs: range(0, 1, 3) });
      m.box("housing", 0, W, yf, Dc, P - 3, P);
      if (hasVal) setValance(valance(m, [[0, Dc, P - 1.5], [W, Dc, P - 1.5]], vr), [0, 1]);
      const arms = Math.max(2, Math.round(W / 120) + 1);
      for (let i = 0; i < arms; i++) {
        const x = lerp(Math.min(10, W * 0.08), W - Math.min(10, W * 0.08), i / (arms - 1));
        if (drop) {
          const py = Math.min(Dc - 4, Dc * 0.45 + hc);
          for (const xs of [0.8, W - 0.8]) if (i === 0) m.tube("arm", [[xs, py, 0.6], [xs, Dc - 1, P - 1.5]], 0.6);
          if (i === 0) for (const xs of [0.8, W - 0.8]) m.box("arm", xs - 1.2, xs + 1.2, py - 2, py + 2, 0, 1);
        } else {
          const sgn = x < W / 2 ? 1 : -1;
          m.tube("arm", [[x, hc + 2, 1.2], [x + sgn * Math.min(20, W * 0.1), (hc + yf) / 2 + 3, P * 0.5], [x, yf + 0.5, P - 3.5]], 0.8, true);
          m.box("arm", x - 2, x + 2, hc, hc + 5, 0, 1.6);
        }
      }
      out.shadow = { x0: 0, x1: W, y: D, depth: Math.min(P * 0.5, 40), alpha: 0.3 };
      break;
    }
    default:
      sweep({ prof: roofProfile("aw-traditional", P, Dc) });
  }
  return out;
}

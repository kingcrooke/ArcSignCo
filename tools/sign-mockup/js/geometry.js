// Pure geometry helpers (no DOM), shared by the app, the warp renderer and tools/check-sign-mockup.mjs.
// Quads are always [topLeft, topRight, bottomRight, bottomLeft] in image pixels.

export const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

// Row-major 3x3 homography mapping the unit square (u, v) onto the quad.
export function squareToQuad(q) {
  const [p0, p1, p2, p3] = q;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const sx = p0.x - p1.x + p2.x - p3.x, sy = p0.y - p1.y + p2.y - p3.y;
  let g = 0, h = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(den) < 1e-12) return null;
    g = (sx * dy2 - dx2 * sy) / den;
    h = (dx1 * sy - sx * dy1) / den;
  }
  return [
    p1.x - p0.x + g * p1.x, p3.x - p0.x + h * p3.x, p0.x,
    p1.y - p0.y + g * p1.y, p3.y - p0.y + h * p3.y, p0.y,
    g, h, 1,
  ];
}

export function invert3(m) {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  if (!det || !Number.isFinite(det)) return null;
  const k = 1 / det;
  return [
    A * k, -(b * i - c * h) * k, (b * f - c * e) * k,
    B * k, (a * i - c * g) * k, -(a * f - c * d) * k,
    C * k, -(a * h - b * g) * k, (a * e - b * d) * k,
  ];
}

export function apply3(m, x, y) {
  const w = m[6] * x + m[7] * y + m[8];
  return { x: (m[0] * x + m[1] * y + m[2]) / w, y: (m[3] * x + m[4] * y + m[5]) / w };
}

export function signedArea(q) {
  let s = 0;
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length];
    s += a.x * b.y - b.x * a.y;
  }
  return s / 2;
}

export function isConvex(q) {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (Math.abs(cross) < 1e-9) continue;
    const s = Math.sign(cross);
    if (sign && s !== sign) return false;
    sign = s;
  }
  return sign !== 0;
}

export function centroid(q) {
  return { x: q.reduce((s, p) => s + p.x, 0) / q.length, y: q.reduce((s, p) => s + p.y, 0) / q.length };
}

export function pointInQuad(q, p) {
  let inside = false;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) {
    const a = q[i], b = q[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function bounds(points) {
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

export function rectQuad(cx, cy, w, h) {
  return [
    { x: cx - w / 2, y: cy - h / 2 }, { x: cx + w / 2, y: cy - h / 2 },
    { x: cx + w / 2, y: cy + h / 2 }, { x: cx - w / 2, y: cy + h / 2 },
  ];
}

export function scaleQuad(q, k, about = centroid(q)) {
  return q.map(p => ({ x: about.x + (p.x - about.x) * k, y: about.y + (p.y - about.y) * k }));
}

// Pixel lengths of the sign's width (mean of top and bottom edges) and height (mean of left and right edges).
export function quadSpans(q) {
  return {
    width: (dist(q[0], q[1]) + dist(q[3], q[2])) / 2,
    height: (dist(q[0], q[3]) + dist(q[1], q[2])) / 2,
  };
}

export function quadSizeInches(q, pxPerInch) {
  if (!pxPerInch) return null;
  const s = quadSpans(q);
  return { width: s.width / pxPerInch, height: s.height / pxPerInch };
}

// 148.4 -> 12' 4"; 7.6 -> 8"
export function formatFeetInches(inches) {
  if (!Number.isFinite(inches) || inches < 0) return "–";
  let ft = Math.floor(inches / 12);
  let inch = Math.round(inches - ft * 12);
  if (inch === 12) { ft += 1; inch = 0; }
  return ft ? `${ft}' ${inch}"` : `${inch}"`;
}

export function formatArea(widthIn, heightIn) {
  const sq = (widthIn * heightIn) / 144;
  return `${sq < 10 ? sq.toFixed(1) : Math.round(sq)} sq ft`;
}

const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len3 = a => Math.hypot(a[0], a[1], a[2]);
const scale3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

/**
 * A pinhole camera recovered from the pinned quad, so parts that stand off the wall (returns,
 * raceways, standoffs, brackets) can be drawn in the photo's perspective.
 *
 * The quad is the sign's footprint on its plane, in target pixels. Plane coordinates are inches:
 * X across (0..widthIn), Y down (0..heightIn), Z out of the plane toward the camera.
 * Z = 0 reproduces the quad exactly. The focal length is a guess for a phone camera (no EXIF),
 * so depth is approximate; it is clamped so a badly pinned quad can't throw parts across the photo.
 *
 * @param {Array<{x:number,y:number}>} quad
 * @param {{width:number, height:number}} sizeIn
 * @param {{cx:number, cy:number, f:number}} lens  principal point and focal length, target pixels
 */
export function makeCamera(quad, sizeIn, lens) {
  const Wd = sizeIn.width, Hd = sizeIn.height;
  if (!(Wd > 0 && Hd > 0) || !isConvex(quad)) return null;
  const M = squareToQuad(quad);
  if (!M) return null;
  const col = j => [M[j], M[3 + j], M[6 + j]];
  const h1 = scale3(col(0), 1 / Wd), h2 = scale3(col(1), 1 / Hd), h3 = col(2);
  const { cx, cy, f } = lens;
  const kinv = v => [(v[0] - cx * v[2]) / f, (v[1] - cy * v[2]) / f, v[2]];
  const a = kinv(h1), b = kinv(h2), c = kinv(h3);
  let s = 2 / (len3(a) + len3(b));
  const centerDepth = (Wd / 2) * a[2] + (Hd / 2) * b[2] + c[2];
  if (centerDepth * s < 0) s = -s;
  const r1 = scale3(a, s), r2 = scale3(b, s), t = scale3(c, s);
  let r3 = cross3(r1, r2);
  const n = len3(r3);
  if (!n) return null;
  r3 = scale3(r3, 1 / n);
  const center = [r1[0] * Wd / 2 + r2[0] * Hd / 2 + t[0], r1[1] * Wd / 2 + r2[1] * Hd / 2 + t[1], r1[2] * Wd / 2 + r2[2] * Hd / 2 + t[2]];
  if (dot3(r3, center) > 0) r3 = scale3(r3, -1);

  const raw = (X, Y, Z) => {
    const P = [X * r1[0] + Y * r2[0] + t[0] + Z * r3[0], X * r1[1] + Y * r2[1] + t[1] + Z * r3[1], X * r1[2] + Y * r2[2] + t[2] + Z * r3[2]];
    if (P[2] <= 1e-6) return null;
    return { x: (f * P[0]) / P[2] + cx, y: (f * P[1]) / P[2] + cy };
  };

  // Clamp: 6" of depth may move the sign's center by at most 12% of the quad's diagonal.
  const diag = Math.hypot(quad[2].x - quad[0].x, quad[2].y - quad[0].y);
  const p0 = raw(Wd / 2, Hd / 2, 0), p6 = raw(Wd / 2, Hd / 2, 6);
  let zk = 1;
  if (p0 && p6) {
    const d = Math.hypot(p6.x - p0.x, p6.y - p0.y);
    const limit = 0.12 * diag;
    if (d > limit) zk = limit / d;
  } else zk = 0;

  const project = (X, Y, Z = 0) => (Z ? raw(X, Y, Z * zk) : apply3(M, X / Wd, Y / Hd));
  return {
    project,
    width: Wd,
    height: Hd,
    zScale: zk,
    // Unit normal pointing out of the plane, in camera space; z < 0 means it faces the camera.
    normal: r3,
    // Pixels per inch at the sign's center (geometric mean of the two axes).
    pxPerInch: Math.sqrt((dist(quad[0], quad[1]) + dist(quad[3], quad[2])) / (2 * Wd) * (dist(quad[0], quad[3]) + dist(quad[1], quad[2])) / (2 * Hd)),
    // Is the face of a plane-aligned patch with outward normal ±r1/±r2/±r3 visible?
    facing(axis, sign = 1, X = Wd / 2, Y = Hd / 2, Z = 0) {
      const v = axis === "x" ? r1 : axis === "y" ? r2 : r3;
      const nrm = scale3(v, sign / len3(v));
      const P = [X * r1[0] + Y * r2[0] + t[0] + Z * r3[0], X * r1[1] + Y * r2[1] + t[1] + Z * r3[1], X * r1[2] + Y * r2[2] + t[2] + Z * r3[2]];
      return dot3(nrm, sub3([0, 0, 0], P)) > 0;
    },
  };
}

export function toInches(ft, inch) {
  const f = Number(ft) || 0, i = Number(inch) || 0;
  const total = f * 12 + i;
  return total > 0 ? total : 0;
}

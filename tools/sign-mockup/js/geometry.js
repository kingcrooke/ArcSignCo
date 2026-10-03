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

export function toInches(ft, inch) {
  const f = Number(ft) || 0, i = Number(inch) || 0;
  const total = f * 12 + i;
  return total > 0 ? total : 0;
}

// Pastes the uploaded logo onto a render. Shared by the page and the Netlify function so the
// file the visitor uploaded is the file that ends up in the image. The image model never draws it.
// Quads are [topLeft, topRight, bottomRight, bottomLeft], the same order as the sign mockup.
import { squareToQuad, invert3, bounds, isConvex, pointInQuad } from "../../tools/sign-mockup/js/geometry.js";

function over(dst, di, src, si) {
  const a = src[si + 3] / 255;
  if (a >= 1) {
    dst[di] = src[si];
    dst[di + 1] = src[si + 1];
    dst[di + 2] = src[si + 2];
    dst[di + 3] = 255;
    return;
  }
  if (a <= 0) return;
  const inv = 1 - a;
  const da = dst[di + 3] / 255;
  const outA = a + da * inv;
  if (outA <= 0) return;
  for (let c = 0; c < 3; c++) dst[di + c] = Math.round((src[si + c] * a + dst[di + c] * da * inv) / outA);
  dst[di + 3] = Math.round(outA * 255);
}

function nearlyInt(n) {
  const r = Math.round(n);
  return Math.abs(n - r) < 1e-4 ? r : null;
}

/** Copy the logo 1:1 when the quad is that rectangle. Opaque pixels stay byte-for-byte. */
function exactBlit(out, baseW, baseH, logo, quad) {
  const pts = quad.map(p => ({ x: nearlyInt(p.x), y: nearlyInt(p.y) }));
  if (pts.some(p => p.x == null)) return false;
  const [p0, p1, p2, p3] = pts;
  const w = p1.x - p0.x;
  const h = p3.y - p0.y;
  if (w !== logo.width || h !== logo.height || w <= 0 || h <= 0) return false;
  if (p1.y !== p0.y || p3.x !== p0.x || p2.x !== p0.x + w || p2.y !== p0.y + h) return false;
  if (p0.x < 0 || p0.y < 0 || p0.x + w > baseW || p0.y + h > baseH) return false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4;
      const di = ((p0.y + y) * baseW + (p0.x + x)) * 4;
      over(out, di, logo.data, si);
    }
  }
  return true;
}

/**
 * @param {{width:number,height:number,data:Uint8ClampedArray}} base
 * @param {{width:number,height:number,data:Uint8ClampedArray}} logo
 * @param {{x:number,y:number}[]} quad
 */
export function compositeLogo(base, logo, quad) {
  if (!base?.data || !logo?.data || !Array.isArray(quad) || quad.length !== 4) throw new Error("logo placement");
  if (!isConvex(quad)) throw new Error("logo box is not a convex quad");
  const out = new Uint8ClampedArray(base.data);
  if (exactBlit(out, base.width, base.height, logo, quad)) {
    return { width: base.width, height: base.height, data: out, mode: "exact" };
  }
  const inv = invert3(squareToQuad(quad) || []);
  if (!inv) throw new Error("logo box");
  const box = bounds(quad);
  const x0 = Math.max(0, Math.floor(box.minX));
  const y0 = Math.max(0, Math.floor(box.minY));
  const x1 = Math.min(base.width, Math.ceil(box.maxX));
  const y1 = Math.min(base.height, Math.ceil(box.maxY));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      if (!pointInQuad(quad, { x: px, y: py })) continue;
      const w = inv[6] * px + inv[7] * py + inv[8];
      if (w <= 0) continue;
      const u = (inv[0] * px + inv[1] * py + inv[2]) / w;
      const v = (inv[3] * px + inv[4] * py + inv[5]) / w;
      if (u < 0 || v < 0 || u >= 1 || v >= 1) continue;
      const sx = Math.min(logo.width - 1, Math.floor(u * logo.width));
      const sy = Math.min(logo.height - 1, Math.floor(v * logo.height));
      over(out, (y * base.width + x) * 4, logo.data, (sy * logo.width + sx) * 4);
    }
  }
  return { width: base.width, height: base.height, data: out, mode: "warp" };
}

// "Cover the existing sign": paints a flat panel over an old sign in the photo, in the color of the
// wall around it. The covered photo replaces the original for everything downstream (night
// grading, wall spill, downloads and the PDF), so the old sign never shows through.
import { pointInQuad, bounds, scaleQuad } from "./geometry.js";
import { makeCanvas } from "./art.js";

/** A starting patch: the sign's quad grown a little, so it covers an old sign of similar size. */
export function coverFromQuad(quad) {
  return scaleQuad(quad, 1.15);
}

/** Median-ish color (0-255) of the wall in a ring just outside the patch. */
export function sampleAround(photo, quad) {
  const b = bounds(quad);
  const pad = Math.max(6, Math.max(b.maxX - b.minX, b.maxY - b.minY) * 0.05);
  const x = Math.max(0, b.minX - pad), y = Math.max(0, b.minY - pad);
  const w = Math.min(photo.width, b.maxX + pad) - x, h = Math.min(photo.height, b.maxY + pad) - y;
  if (w < 2 || h < 2) return [128, 128, 128];
  const N = 40;
  const c = makeCanvas(N, N);
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(photo, x, y, w, h, 0, 0, N, N);
  const d = g.getImageData(0, 0, N, N).data;
  const px = [];
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (pointInQuad(quad, { x: x + ((i + 0.5) / N) * w, y: y + ((j + 0.5) / N) * h })) continue;
      const k = (j * N + i) * 4;
      px.push([d[k], d[k + 1], d[k + 2]]);
    }
  }
  if (!px.length) return [128, 128, 128];
  px.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));
  const mid = px.slice(Math.floor(px.length * 0.3), Math.max(Math.floor(px.length * 0.3) + 1, Math.ceil(px.length * 0.7)));
  return [0, 1, 2].map(k => Math.round(mid.reduce((s, p) => s + p[k], 0) / mid.length));
}

export const hexOf = rgb => "#" + rgb.map(v => v.toString(16).padStart(2, "0")).join("");
export const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

let cache = { key: "", canvas: null };
/** The photo with the patch painted in, or the photo itself when there is no patch. */
export function coveredPhoto(photo, cover) {
  if (!cover) return photo;
  const key = JSON.stringify([photo.width, photo.height, cover.color, cover.quad.map(p => [Math.round(p.x), Math.round(p.y)])]);
  if (cache.key === key && cache.photo === photo) return cache.canvas;
  const c = cache.canvas && cache.canvas.width === photo.width && cache.canvas.height === photo.height ? cache.canvas : makeCanvas(photo.width, photo.height);
  const g = c.getContext("2d");
  g.clearRect(0, 0, c.width, c.height);
  g.drawImage(photo, 0, 0);
  const q = cover.quad;
  const path = () => { g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); };
  const [r, gg, b] = cover.color;
  path();
  g.fillStyle = `rgb(${r},${gg},${b})`;
  g.fill();
  // A painted panel is a little darker under the cornice and has a thin shadow line at its edges.
  const bb = bounds(q);
  const shade = g.createLinearGradient(0, bb.minY, 0, bb.maxY);
  shade.addColorStop(0, "rgba(0,0,0,.10)");
  shade.addColorStop(0.35, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(255,255,255,.03)");
  path();
  g.fillStyle = shade;
  g.fill();
  path();
  g.lineWidth = Math.max(1, (bb.maxX - bb.minX) / 600);
  g.strokeStyle = "rgba(0,0,0,.22)";
  g.stroke();
  cache = { key, canvas: c, photo };
  return c;
}

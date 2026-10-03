// Tactile room artwork with a Grade 2 Braille band for layout preview (not a translation).
import { makeCanvas } from "../../art.js";

/** Draws raised-dot Braille cells as a visual band under the room copy. */
export function tactileFace(art, opts = {}) {
  const base = art.letters;
  const padX = Math.max(8, base.width * 0.06);
  const bandH = Math.max(28, base.height * 0.28);
  const c = makeCanvas(base.width + padX * 2, base.height + bandH);
  const g = c.getContext("2d");
  g.drawImage(base, padX, 0);
  const dot = Math.max(2.2, bandH * 0.07);
  const cellW = dot * 3.2;
  const cells = 8;
  const startX = padX + (base.width - cells * cellW) / 2;
  const rowY = base.height + bandH * 0.35;
  g.fillStyle = opts.panel && /^#[0-9a-f]{6}$/i.test(opts.panel) ? opts.panel : "#2a2b30";
  for (let cell = 0; cell < cells; cell++) {
    const cx = startX + cell * cellW;
    for (const [dx, dy] of [[0, 0], [0, 1], [1, 0], [1, 1], [0, 2], [1, 2]]) {
      if ((cell + dx + dy) % 3 === 0) continue;
      g.beginPath();
      g.arc(cx + dx * dot * 1.4, rowY + dy * dot * 1.5, dot, 0, Math.PI * 2);
      g.fill();
    }
  }
  return c;
}

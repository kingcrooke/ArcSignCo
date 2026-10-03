// Drawing kit for the "How it's built" construction cards: a 320 × 200 SVG with the wall section on
// the left, the parts in the middle and labels with leader lines in a column on the right.
// Pure string building (no DOM), shared by every category's diagrams.
//
//   const s = new Svg();
//   s.wall();                                   // hatched wall section, wall face at x = 44
//   s.rect(x, y, w, h, fill, stroke, width);    // also line(), path(), circle(), add(rawSvg)
//   s.led(x, y); s.rays(x, y, dir);             // LED module and light rays
//   s.label("Aluminum face", px, py, rowY);     // leader from (px, py) to a label row at rowY
//   return "Section";                           // the view name shown bottom right
//
// card(type, draw) runs draw(s) and caches the markup by type id.
export const PALETTE = {
  ink: "#0b1d33",
  muted: "#657287",
  wall: "#d9dee6",
  hatch: "#9aa5b5",
  metal: "#4f5968",
  metalLight: "#8b95a3",
  acrylic: "#fff4d6",
  acrylicEdge: "#c9a64a",
  clear: "#e4f1fb",
  clearEdge: "#7fa9c9",
  led: "#d4a843",
  ray: "#e8a317",
  paint: "#b8432f",
  fabric: "#1f4f7a",
  glass: "#cfe6f5",
};

const C = PALETTE;
const W = 320, H = 200;
export const DIAGRAM_SIZE = { width: W, height: H };
const LX = 214; // label column

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export class Svg {
  constructor() { this.parts = []; this.labels = []; }
  add(s) { this.parts.push(s); return this; }
  rect(x, y, w, h, fill, stroke = "none", sw = 1, extra = "") {
    return this.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`);
  }
  line(x1, y1, x2, y2, stroke, sw = 1, extra = "") {
    return this.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`);
  }
  path(d, fill, stroke = "none", sw = 1, extra = "") {
    return this.add(`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`);
  }
  circle(cx, cy, r, fill, stroke = "none", sw = 1) {
    return this.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
  }
  // Wall section on the left, hatched; face of the wall at x = 44.
  wall(y0 = 12, y1 = 188) {
    this.rect(14, y0, 30, y1 - y0, C.wall);
    for (let y = y0 - 30; y < y1; y += 9) {
      const a = Math.max(y, y0), b = Math.min(y + 30, y1);
      this.line(14 + (a - y), a, 14 + (b - y), b, C.hatch, 1);
    }
    this.line(44, y0, 44, y1, C.ink, 1.6);
    this.add(`<text x="29" y="${y1 + 9}" font-size="8" text-anchor="middle" fill="${PALETTE.muted}">WALL</text>`);
    return this;
  }
  led(x, y, dir = 1) {
    this.rect(x - 3, y - 4, 6, 8, C.led, C.ink, 0.6);
    return this;
  }
  rays(x, y, dir, len = 22, spread = 0.5, n = 3) {
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * spread;
      const ex = x + Math.cos(a) * len * dir, ey = y + Math.sin(a) * len;
      this.line(x, y, ex, ey, C.ray, 1.2, ` stroke-dasharray="3 2" marker-end="url(#ah)"`);
    }
    return this;
  }
  stud(x0, x1, y) {
    this.line(22, y, x1, y, C.metal, 2.2);
    return this;
  }
  label(text, px, py, ty) {
    this.labels.push({ text, px, py, ty });
    return this;
  }
  toString(title, view = "Section") {
    // Rows go to labels in the same top-to-bottom order as their points, so leaders don't cross.
    const rows = this.labels.map(l => l.ty).sort((a, b) => a - b);
    const ordered = [...this.labels].sort((a, b) => a.py - b.py || a.px - b.px).map((l, i) => ({ ...l, ty: rows[i] }));
    const lab = ordered.map(({ text, px, py, ty }) =>
      `<path d="M${px} ${py} L${LX - 6} ${ty}" fill="none" stroke="${C.muted}" stroke-width="0.8"/>` +
      `<circle cx="${px}" cy="${py}" r="1.8" fill="${PALETTE.ink}"/>` +
      `<text x="${LX}" y="${ty + 3}" font-size="9.5" fill="${PALETTE.ink}">${esc(text)}</text>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}: how it's built" font-family="Arial, Helvetica, sans-serif">` +
      `<defs><marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="${PALETTE.ray}"/></marker></defs>` +
      `<rect width="${W}" height="${H}" fill="#ffffff"/>` +
      this.parts.join("") + lab +
      `<text x="${W - 6}" y="${H - 6}" font-size="8" text-anchor="end" fill="${PALETTE.muted}">${esc(view)} · not to scale</text></svg>`;
  }
}


const cache = new Map();

/** Builds (once per type id) the card markup from draw(s); throws if the type has no drawing. */
export function card(type, draw) {
  if (cache.has(type.id)) return cache.get(type.id);
  if (typeof draw !== "function") throw new Error(`No diagram for ${type.id}`);
  const s = new Svg();
  const view = draw(s) || "Section";
  const out = s.toString(type.name, view);
  cache.set(type.id, out);
  return out;
}

// "How it's built" cross-sections, one per sign type, as small self-contained SVG strings.
// Pure string building (no DOM) so the editor, the proof page, the PDF and the Node check share them.
// Not to scale: the drawings show the parts and where the light goes, not dimensions.

const C = {
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

const W = 320, H = 200;
const LX = 214; // label column

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

class Svg {
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
    this.add(`<text x="29" y="${y1 + 9}" font-size="8" text-anchor="middle" fill="${C.muted}">WALL</text>`);
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
      `<circle cx="${px}" cy="${py}" r="1.8" fill="${C.ink}"/>` +
      `<text x="${LX}" y="${ty + 3}" font-size="9.5" fill="${C.ink}">${esc(text)}</text>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}: how it's built" font-family="Arial, Helvetica, sans-serif">` +
      `<defs><marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="${C.ray}"/></marker></defs>` +
      `<rect width="${W}" height="${H}" fill="#ffffff"/>` +
      this.parts.join("") + lab +
      `<text x="${W - 6}" y="${H - 6}" font-size="8" text-anchor="end" fill="${C.muted}">${esc(view)} · not to scale</text></svg>`;
  }
}

// One channel letter in section: back at bx, face at fx, returns top and bottom.
function channel(s, { bx, fx, y0 = 44, y1 = 156, face = "acrylic", trim = false, back = "metal", returns = C.metal }) {
  if (back === "metal") s.rect(bx, y0, 4, y1 - y0, C.metal);
  else if (back === "clear") s.rect(bx, y0, 3, y1 - y0, C.clear, C.clearEdge, 0.8, ` stroke-dasharray="3 2"`);
  s.rect(bx, y0 - 3, fx - bx, 3, returns);
  s.rect(bx, y1, fx - bx, 3, returns);
  if (face === "acrylic") s.rect(fx, y0 - 3, 5, y1 - y0 + 6, C.acrylic, C.acrylicEdge, 1);
  if (face === "metal") s.rect(fx, y0 - 3, 4, y1 - y0 + 6, C.metal);
  if (trim) {
    s.path(`M${fx - 4} ${y0 - 6} h11 v5 h-11 z`, C.ink);
    s.path(`M${fx - 4} ${y1 + 1} h11 v5 h-11 z`, C.ink);
  }
}

const DRAW = {
  trimcap(s) {
    s.wall();
    s.stud(22, 56, 100);
    channel(s, { bx: 52, fx: 150, face: "acrylic", trim: true });
    s.led(60, 70); s.led(60, 100); s.led(60, 130);
    s.rays(64, 100, 1, 70, 0.32);
    s.label("Acrylic face", 154, 120, 34).label("Trim cap", 152, 40, 56).label("Aluminum return", 110, 158, 82)
      .label("LED modules", 60, 130, 108).label("Aluminum back", 54, 150, 132).label("Stud into wall", 36, 100, 156);
  },
  trimless(s) {
    s.wall();
    s.stud(22, 56, 100);
    s.rect(52, 44, 4, 112, C.metal);
    s.rect(52, 40, 100, 4, C.acrylic, C.acrylicEdge, 0.8);
    s.rect(52, 156, 100, 4, C.acrylic, C.acrylicEdge, 0.8);
    s.rect(148, 40, 6, 120, C.acrylic, C.acrylicEdge, 1);
    s.led(60, 70); s.led(60, 100); s.led(60, 130);
    s.rays(64, 100, 1, 70, 0.32);
    s.rays(64, 70, 1, 40, -0.9, 1); s.rays(64, 130, 1, 40, 0.9, 1);
    s.label("Acrylic face, no trim", 152, 110, 34).label("Acrylic sides glow too", 110, 42, 58)
      .label("LED modules", 60, 130, 84).label("Aluminum back", 54, 150, 110).label("Stud into wall", 36, 100, 136);
  },
  halo(s) {
    s.wall();
    s.line(22, 70, 78, 70, C.metal, 2.2); s.line(22, 130, 78, 130, C.metal, 2.2);
    channel(s, { bx: 78, fx: 150, face: "metal", back: "clear" });
    s.led(140, 80, -1); s.led(140, 120, -1);
    s.rays(134, 80, -1, 84, 0.25); s.rays(134, 120, -1, 84, 0.25);
    s.path(`M44 36 q10 -12 30 -10`, "none", C.ray, 1.2, ` stroke-dasharray="3 2"`);
    s.path(`M44 164 q10 12 30 10`, "none", C.ray, 1.2, ` stroke-dasharray="3 2"`);
    s.label("Solid metal face", 152, 100, 34).label("Metal return", 112, 158, 58).label("LEDs aim at the wall", 140, 120, 82)
      .label("Clear back", 80, 145, 106).label("Standoffs, 1½\"–2\"", 60, 130, 130).label("Halo on the wall", 46, 168, 154);
  },
  combo(s) {
    s.wall();
    s.line(22, 70, 74, 70, C.metal, 2.2); s.line(22, 130, 74, 130, C.metal, 2.2);
    channel(s, { bx: 74, fx: 150, face: "acrylic", trim: true, back: "clear" });
    s.led(112, 80); s.led(112, 120);
    s.rays(116, 80, 1, 34, 0.3); s.rays(116, 120, 1, 34, 0.3);
    s.rays(108, 80, -1, 60, 0.3, 2); s.rays(108, 120, -1, 60, 0.3, 2);
    s.label("Acrylic face + trim", 154, 110, 34).label("Return", 128, 158, 58).label("LEDs light both ways", 112, 120, 82)
      .label("Clear back", 76, 150, 106).label("Standoffs", 56, 130, 130).label("Halo on the wall", 46, 100, 154);
  },
  raceway(s) {
    s.wall();
    s.rect(44, 82, 52, 36, C.wall, C.metal, 1.6);
    s.rect(56, 92, 22, 16, C.metalLight, C.ink, 0.6);
    s.add(`<text x="67" y="103" font-size="7" text-anchor="middle" fill="${C.ink}">PS</text>`);
    s.stud(22, 46, 100);
    channel(s, { bx: 96, fx: 168, face: "acrylic", trim: true });
    s.led(104, 70); s.led(104, 130);
    s.rays(108, 100, 1, 54, 0.32);
    s.label("Acrylic face + trim", 172, 120, 34).label("Return", 136, 158, 58).label("LED modules", 104, 130, 82)
      .label("Raceway (wireway)", 70, 82, 106).label("Power supply inside", 67, 108, 130).label("Bolted to the wall", 34, 100, 154);
  },
  openneon(s) {
    s.wall();
    s.stud(22, 56, 100);
    channel(s, { bx: 52, fx: 128, face: "none" });
    s.rect(52, 44, 76, 112, "#f3f4f6", "none");
    s.rect(52, 44, 4, 112, C.metal);
    s.add(`<rect x="70" y="88" width="14" height="24" rx="6" fill="#ff6a6a" stroke="#b8432f" stroke-width="1"/>`);
    s.rect(64, 96, 6, 8, C.metal);
    s.rays(86, 100, 1, 60, 0.45);
    s.label("Open face, no acrylic", 128, 60, 34).label("Return, painted inside", 100, 158, 58).label("LED neon flex", 84, 92, 82)
      .label("Clip / channel", 66, 104, 106).label("Aluminum back", 54, 140, 130).label("Stud into wall", 36, 100, 154);
  },
  fco(s) {
    s.wall();
    s.line(22, 70, 64, 70, C.metal, 2.2); s.line(22, 130, 64, 130, C.metal, 2.2);
    s.rect(44, 66, 12, 8, C.metalLight); s.rect(44, 126, 12, 8, C.metalLight);
    s.rect(56, 40, 12, 120, "#e5e7eb", C.ink, 1);
    s.label("Cut sheet, ~½\" thick", 68, 90, 40).label("Painted or metal face", 68, 50, 66)
      .label("Spacer", 50, 134, 92).label("Threaded stud", 36, 130, 118).label("No lighting", 66, 150, 144);
  },
  fabmetal(s) {
    s.wall();
    s.stud(22, 50, 100);
    s.rect(48, 44, 4, 112, C.metal);
    s.rect(48, 41, 64, 3, C.metal); s.rect(48, 156, 64, 3, C.metal);
    s.rect(112, 41, 4, 118, C.metalLight, C.ink, 0.8);
    s.label("Metal face", 116, 70, 40).label("Metal return, ~2\"", 82, 158, 66).label("Sealed back", 50, 120, 92)
      .label("Stud into wall", 36, 100, 118).label("No lighting", 114, 150, 144);
  },
  lightbox(s) {
    s.wall();
    s.rect(44, 24, 6, 152, C.metal);
    s.rect(44, 20, 110, 5, C.metal); s.rect(44, 175, 110, 5, C.metal);
    s.rect(150, 18, 8, 10, C.ink); s.rect(150, 172, 8, 10, C.ink);
    s.rect(152, 26, 4, 148, C.acrylic, C.acrylicEdge, 1);
    s.led(58, 60); s.led(58, 100); s.led(58, 140);
    s.rays(62, 100, 1, 82, 0.35); s.rays(62, 60, 1, 82, 0.2, 2); s.rays(62, 140, 1, 82, 0.2, 2);
    s.label("Flex or poly face", 156, 120, 34).label("Retainer frame", 156, 24, 60).label("Aluminum cabinet", 110, 177, 86)
      .label("LED modules", 58, 140, 112).label("Bolted to the wall", 46, 160, 138);
  },
  pushthru(s) {
    s.wall();
    s.rect(44, 24, 6, 152, C.metal);
    s.rect(44, 20, 96, 5, C.metal); s.rect(44, 175, 96, 5, C.metal);
    s.rect(136, 20, 5, 50, C.metalLight, C.ink, 0.8); s.rect(136, 130, 5, 50, C.metalLight, C.ink, 0.8);
    s.rect(122, 70, 32, 60, C.acrylic, C.acrylicEdge, 1);
    s.led(58, 100); s.led(58, 70); s.led(58, 130);
    s.rays(62, 100, 1, 56, 0.25);
    s.label("Push-through acrylic", 154, 90, 34).label("Routed aluminum face", 138, 40, 60).label("Aluminum cabinet", 96, 177, 86)
      .label("LED modules", 58, 130, 112).label("Only the copy glows", 140, 120, 138);
  },
  bladelit(s) {
    s.wall(12, 188);
    s.rect(44, 92, 14, 16, C.metal);
    s.rect(58, 96, 40, 8, C.metal);
    s.rect(98, 82, 104, 36, "#ffffff", C.ink, 1.2);
    s.rect(98, 82, 104, 4, C.acrylic, C.acrylicEdge, 0.8); s.rect(98, 114, 104, 4, C.acrylic, C.acrylicEdge, 0.8);
    s.led(130, 100); s.led(170, 100);
    s.add(`<line x1="130" y1="96" x2="130" y2="68" stroke="${C.ray}" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#ah)"/>`);
    s.add(`<line x1="170" y1="104" x2="170" y2="132" stroke="${C.ray}" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#ah)"/>`);
    s.label("Lit face, side A", 150, 84, 34).label("Lit face, side B", 150, 117, 58).label("LED modules", 170, 100, 82)
      .label("Cabinet, ~8\" thick", 200, 92, 106).label("Mounting arm", 78, 100, 130).label("Wall plate", 50, 108, 154);
    return "Plan view (from above)";
  },
  blade(s) {
    s.wall(12, 188);
    s.rect(44, 30, 8, 40, C.ink);
    s.path(`M52 40 H190 q14 0 14 12 q0 10 -10 10 q-8 0 -8 -7`, "none", C.ink, 3);
    s.path(`M60 60 q20 -18 46 -20`, "none", C.ink, 2);
    s.circle(84, 46, 4, "none", C.ink, 1.6); s.circle(170, 46, 4, "none", C.ink, 1.6);
    s.line(84, 50, 84, 72, C.ink, 1.6); s.line(170, 50, 170, 72, C.ink, 1.6);
    s.rect(70, 72, 114, 92, "#f7f1e1", C.ink, 1.4);
    s.add(`<text x="127" y="122" font-size="12" font-weight="700" text-anchor="middle" fill="${C.ink}">SIGN</text>`);
    s.label("Decorative bracket", 150, 40, 30).label("Hanging rings", 170, 60, 54).label("Two-sided panel", 160, 140, 80)
      .label("Wall plate", 48, 64, 106).label("No lighting", 100, 160, 132);
    return "Side view";
  },
  panel(s) {
    s.wall();
    s.rect(44, 46, 30, 8, C.metalLight, C.ink, 0.6); s.rect(44, 146, 30, 8, C.metalLight, C.ink, 0.6);
    s.rect(74, 30, 4, 140, "#ffffff", C.ink, 1);
    s.rect(78, 44, 8, 12, C.metalLight, C.ink, 0.8); s.rect(78, 144, 8, 12, C.metalLight, C.ink, 0.8);
    s.label("ACM panel, ~⅛\"", 77, 100, 40).label("Printed / vinyl face", 79, 120, 64).label("Standoff cap", 86, 50, 88)
      .label("Standoff barrel, ~1½\"", 60, 150, 112).label("No lighting", 76, 160, 136);
  },
  gooseneck(s) {
    s.wall();
    s.rect(44, 96, 4, 80, "#ffffff", C.ink, 1);
    s.rect(44, 20, 8, 14, C.metal);
    s.path(`M52 27 C96 20 132 20 142 44`, "none", C.metal, 3);
    s.path(`M132 44 L152 44 L146 58 L138 58 Z`, C.ink);
    s.add(`<line x1="138" y1="60" x2="62" y2="120" stroke="${C.ray}" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#ah)"/>`);
    s.add(`<line x1="142" y1="60" x2="60" y2="160" stroke="${C.ray}" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#ah)"/>`);
    s.label("Gooseneck arm", 100, 22, 30).label("Shade with LED lamp", 146, 50, 56).label("Light washes the face", 100, 110, 82)
      .label("Flat panel sign", 48, 140, 108).label("Wall mount + wiring", 48, 27, 134);
  },
  neonbacker(s) {
    s.wall();
    s.rect(44, 46, 26, 8, C.metalLight, C.ink, 0.6); s.rect(44, 146, 26, 8, C.metalLight, C.ink, 0.6);
    s.rect(70, 28, 6, 144, C.clear, C.clearEdge, 1);
    s.add(`<rect x="76" y="76" width="12" height="48" rx="6" fill="#ff7fb0" stroke="#b03a6a" stroke-width="1"/>`);
    s.rect(76, 96, 4, 8, C.metal);
    s.rays(90, 100, 1, 54, 0.45);
    s.label("LED neon flex", 88, 86, 40).label("Mounting clip", 78, 104, 66).label("Clear acrylic backer", 73, 150, 92)
      .label("Standoffs", 56, 50, 118).label("Low-voltage supply", 36, 160, 144);
  },
  vinyl(s) {
    s.rect(96, 16, 10, 168, C.glass, C.clearEdge, 1);
    s.rect(92, 10, 18, 8, C.metal); s.rect(92, 182, 18, 8, C.metal);
    s.rect(106, 50, 3, 100, C.paint);
    s.add(`<text x="60" y="104" font-size="9" text-anchor="middle" fill="${C.muted}">INSIDE</text>`);
    s.add(`<text x="160" y="104" font-size="9" text-anchor="middle" fill="${C.muted}">STREET</text>`);
    s.label("Storefront glass", 101, 30, 40).label("Vinyl film on the glass", 108, 70, 66)
      .label("Storefront frame", 108, 186, 92).label("No depth, no lighting", 108, 130, 118);
  },
  awning(s) {
    s.wall();
    s.rect(44, 34, 8, 12, C.metal);
    s.path(`M48 40 L196 104 L196 138 L188 138 L188 110 L48 50 Z`, C.fabric, C.ink, 1);
    s.line(52, 46, 190, 106, "#7aa6cf", 1, ` stroke-dasharray="4 3"`);
    s.line(52, 120, 188, 112, C.metal, 2);
    s.rect(44, 114, 8, 12, C.metal);
    s.rect(197, 112, 4, 22, "#ffffff");
    s.label("Fabric cover", 120, 74, 34).label("Welded frame", 130, 90, 58).label("Valance with lettering", 199, 124, 82)
      .label("Support arm", 120, 116, 106).label("Wall brackets", 48, 40, 130).label("Projects ~3'", 160, 98, 154);
    return "Side view";
  },
  painted(s) {
    s.wall();
    s.rect(44, 40, 3, 120, "#f1f2f4");
    s.rect(47, 40, 4, 120, C.paint);
    s.label("Exterior paint", 51, 70, 50).label("Primer", 45, 110, 80).label("Wall texture shows", 40, 140, 110).label("No depth, no lighting", 51, 156, 140);
  },
};

const cache = new Map();

/** Returns the cross-section SVG markup for a sign type. */
export function diagramSvg(type) {
  if (cache.has(type.id)) return cache.get(type.id);
  const draw = DRAW[type.id];
  if (!draw) throw new Error(`No diagram for ${type.id}`);
  const s = new Svg();
  const view = draw(s) || "Section";
  const out = s.toString(type.name, view);
  cache.set(type.id, out);
  return out;
}

export const DIAGRAM_SIZE = { width: W, height: H };
export const hasDiagram = id => typeof DRAW[id] === "function";

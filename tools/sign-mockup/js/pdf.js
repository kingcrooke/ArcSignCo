// Minimal PDF 1.4 writer for the mockup proof. No DOM: images arrive as JPEG bytes, text uses the
// standard Helvetica fonts with WinAnsi encoding, so the file stays small and searchable.
// Shared by the editor, the phone proof page and tools/check-sign-mockup.mjs.

const W = 792, H = 612; // US Letter, landscape (points)
const M = 36;

const COLORS = {
  navy: [0.043, 0.114, 0.2],
  gold: [0.831, 0.659, 0.263],
  gold2: [0.941, 0.816, 0.502],
  goldInk: [0.478, 0.353, 0.071],
  ink: [0.09, 0.133, 0.2],
  muted: [0.396, 0.447, 0.529],
  line: [0.875, 0.898, 0.933],
  cream: [1, 0.973, 0.91],
  white: [1, 1, 1],
  well: [0.96, 0.965, 0.973],
  night: [0.075, 0.145, 0.239],
  green: [0.11, 0.42, 0.25],
  greenBg: [0.91, 0.965, 0.925],
};

export const CONTACT = {
  phone: "(347) 450-2110",
  phoneHref: "tel:+13474502110",
  emails: ["jc@arcsignco.com", "arc@arcsignco.com"],
  site: "arcsignco.com",
  area: "New York / Tri-State",
  name: "Arc Signage Co",
  legal: "Arc Signage Co LLC",
};
export const DISCLAIMER = "Concept only – not a shop drawing";

// Standard Helvetica advance widths (1/1000 em) for ASCII 32..126.
const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const HELV_B = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
const WIDE = { 0x96: 556, 0x97: 1000, 0x95: 350, 0xb7: 278, 0x91: 222, 0x92: 222, 0x93: 333, 0x94: 333, 0x85: 1000 };

const WIN_ANSI = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a,
  "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97,
  "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f, "′": 0x27, "″": 0x22,
};

export function toWinAnsi(str) {
  const out = [];
  for (const ch of String(str).normalize("NFC")) {
    const cp = ch.codePointAt(0);
    if (ch === "\t") out.push(32);
    else if (WIN_ANSI[ch] !== undefined) out.push(WIN_ANSI[ch]);
    else if ((cp >= 32 && cp <= 126) || (cp >= 0xa0 && cp <= 0xff)) out.push(cp);
    else if (cp >= 32) out.push(0x3f);
  }
  return out;
}

export function fromWinAnsi(codes) {
  const rev = Object.fromEntries(Object.entries(WIN_ANSI).filter(([, v]) => v >= 0x80).map(([k, v]) => [v, k]));
  return codes.map(c => rev[c] || String.fromCharCode(c)).join("");
}

function pdfString(str) {
  let s = "(";
  for (const c of toWinAnsi(str)) {
    if (c === 0x28 || c === 0x29 || c === 0x5c) s += "\\" + String.fromCharCode(c);
    else if (c < 32 || c > 126) s += "\\" + c.toString(8).padStart(3, "0");
    else s += String.fromCharCode(c);
  }
  return s + ")";
}

export function textWidth(str, bold, size) {
  const table = bold ? HELV_B : HELV;
  let w = 0;
  for (const c of toWinAnsi(str)) w += c >= 32 && c <= 126 ? table[c - 32] : WIDE[c] || 556;
  return (w / 1000) * size;
}

export function wrapText(text, bold, size, maxWidth) {
  const lines = [];
  for (const para of String(text || "").split(/\r?\n/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      let piece = word;
      while (textWidth(piece, bold, size) > maxWidth) {
        let cut = piece.length - 1;
        while (cut > 1 && textWidth(piece.slice(0, cut), bold, size) > maxWidth) cut--;
        if (line) { lines.push(line); line = ""; }
        lines.push(piece.slice(0, cut));
        piece = piece.slice(cut);
      }
      const next = line ? `${line} ${piece}` : piece;
      if (textWidth(next, bold, size) > maxWidth) { lines.push(line); line = piece; }
      else line = next;
    }
    lines.push(line);
  }
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines;
}

// Document info strings use PDFDocEncoding, not the font's WinAnsi, so write them as UTF-16BE.
function pdfTextString(str) {
  let hex = "FEFF";
  for (let i = 0; i < str.length; i++) hex += str.charCodeAt(i).toString(16).padStart(4, "0").toUpperCase();
  return `<${hex}>`;
}

const n = v => (Math.round(v * 100) / 100).toString();
const rgb = c => c.map(n).join(" ");

class Page {
  constructor() { this.ops = []; this.links = []; this.images = new Map(); }
  rect(x, y, w, h, fill, stroke, lw = 1) {
    const yy = H - y - h;
    if (fill) this.ops.push(`${rgb(fill)} rg`);
    if (stroke) this.ops.push(`${rgb(stroke)} RG ${n(lw)} w`);
    this.ops.push(`${n(x)} ${n(yy)} ${n(w)} ${n(h)} re ${fill && stroke ? "B" : fill ? "f" : "S"}`);
  }
  line(x1, y1, x2, y2, color, lw = 1) {
    this.ops.push(`${rgb(color)} RG ${n(lw)} w ${n(x1)} ${n(H - y1)} m ${n(x2)} ${n(H - y2)} l S`);
  }
  // y is the text baseline, measured from the top of the page.
  text(str, x, y, { size = 10, bold = false, color = COLORS.ink, align = "left", spacing = 0, link } = {}) {
    if (!str) return 0;
    const w = textWidth(str, bold, size) + spacing * Math.max(0, [...str].length - 1);
    const tx = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    const tc = spacing ? `${n(spacing)} Tc ` : "";
    this.ops.push(`BT /${bold ? "F2" : "F1"} ${n(size)} Tf ${tc}${rgb(color)} rg ${n(tx)} ${n(H - y)} Td ${pdfString(str)} Tj ${spacing ? "0 Tc " : ""}ET`);
    if (link) this.links.push({ x: tx, y: y - size * 0.8, w, h: size * 1.1, uri: link });
    return w;
  }
  image(img, x, y, w, h) {
    if (!this.images.has(img)) this.images.set(img, `Im${this.images.size + 1}`);
    this.ops.push(`q ${n(w)} 0 0 ${n(h)} ${n(x)} ${n(H - y - h)} cm /${this.images.get(img)} Do Q`);
  }
  // Fits an image inside a box, centered; returns where it landed.
  fitImage(img, x, y, w, h, { well = COLORS.well, border = COLORS.line } = {}) {
    if (well) this.rect(x, y, w, h, well);
    const k = Math.min(w / img.width, h / img.height);
    const iw = img.width * k, ih = img.height * k, ix = x + (w - iw) / 2, iy = y + (h - ih) / 2;
    this.image(img, ix, iy, iw, ih);
    if (border) this.rect(ix, iy, iw, ih, null, border, 0.75);
    return { x: ix, y: iy, w: iw, h: ih };
  }
}

function pdfDate(d) {
  const p = v => String(v).padStart(2, "0");
  return `D:${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function serialize(pages, info) {
  const enc = new TextEncoder();
  const chunks = [];
  let length = 0;
  const offsets = [];
  const push = data => {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    chunks.push(bytes);
    length += bytes.length;
  };
  const obj = (id, body, stream) => {
    offsets[id] = length;
    push(`${id} 0 obj\n${body}\n`);
    if (stream) { push("stream\n"); push(stream); push("\nendstream\n"); }
    push("endobj\n");
  };

  push("%PDF-1.4\n");
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  // 1 catalog, 2 page tree, 3–4 fonts, then shared images, then each page with its content and links.
  let next = 5;
  const imageIds = new Map();
  for (const pg of pages) for (const img of pg.images.keys()) if (!imageIds.has(img)) imageIds.set(img, next++);
  const layout = pages.map(pg => {
    const page = next++, content = next++;
    const links = pg.links.map(() => next++);
    return { page, content, links };
  });
  const infoId = next++;

  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, `<< /Type /Pages /Kids [${layout.map(l => `${l.page} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  obj(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  obj(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  for (const [img, id] of imageIds) {
    obj(id, `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>`, img.bytes);
  }
  pages.forEach((pg, i) => {
    const l = layout[i];
    const xobjects = [...pg.images].map(([img, name]) => `/${name} ${imageIds.get(img)} 0 R`).join(" ");
    const annots = l.links.length ? ` /Annots [${l.links.map(id => `${id} 0 R`).join(" ")}]` : "";
    obj(l.page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents ${l.content} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << ${xobjects} >> >>${annots} >>`);
    const content = enc.encode(pg.ops.join("\n"));
    obj(l.content, `<< /Length ${content.length} >>`, content);
    pg.links.forEach((lk, j) => {
      const r = [lk.x, H - lk.y - lk.h, lk.x + lk.w, H - lk.y].map(n).join(" ");
      obj(l.links[j], `<< /Type /Annot /Subtype /Link /Rect [${r}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(lk.uri)} >> >>`);
    });
  });
  obj(infoId, `<< ${Object.entries(info).map(([k, v]) => `/${k} ${k === "CreationDate" ? pdfString(v) : pdfTextString(v)}`).join(" ")} >>`);

  const xref = length;
  let table = `xref\n0 ${infoId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= infoId; id++) table += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  push(table);
  push(`trailer\n<< /Size ${infoId + 1} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

const C = COLORS;

function header(pg, logo) {
  pg.rect(0, 0, W, 66, C.navy);
  pg.rect(0, 66, W, 3, C.gold);
  const logoH = 30, logoW = (logo.width / logo.height) * logoH;
  pg.image(logo, M, 18, logoW, logoH);
  pg.text(CONTACT.phone, W - M, 26, { size: 12, bold: true, color: C.white, align: "right", link: CONTACT.phoneHref });
  const e2 = CONTACT.emails[1], e1 = CONTACT.emails[0];
  const e2w = pg.text(e2, W - M, 41, { size: 10, color: C.white, align: "right", link: `mailto:${e2}` });
  const sepW = pg.text("  ·  ", W - M - e2w, 41, { size: 10, color: C.gold2, align: "right" });
  pg.text(e1, W - M - e2w - sepW, 41, { size: 10, color: C.white, align: "right", link: `mailto:${e1}` });
  pg.text(`${CONTACT.site}  ·  ${CONTACT.area}`, W - M, 54, { size: 9, color: C.gold2, align: "right", link: `https://${CONTACT.site}/` });
}

function banner(pg, y, note) {
  pg.rect(M, y, W - 2 * M, 28, C.cream, C.gold, 1.2);
  pg.rect(M, y, 5, 28, C.gold);
  const dw = pg.text(DISCLAIMER, M + 16, y + 18.5, { size: 13, bold: true, color: C.navy });
  const room = W - 2 * M - (16 + dw + 14) - 8;
  pg.text(wrapText(note, false, 9.5, room)[0], M + 16 + dw + 14, y + 18, { size: 9.5, color: C.ink });
}

const FINE = "Sizes are approximate: they are estimated from one photo and one reference measurement, and the sign artwork is placed by hand. Lighting is simulated. Fabrication needs verified field measurements and shop drawings.";

function footer(pg, index, count) {
  pg.line(M, 562, W - M, 562, C.line, 0.75);
  pg.text(`${CONTACT.legal}  ·  ${CONTACT.area}  ·  ${CONTACT.site}`, M, 576, { size: 8.5, bold: true, color: C.navy });
  const pw = count > 1 ? pg.text(`Page ${index} of ${count}`, W - M, 576, { size: 8.5, color: C.muted, align: "right" }) + 14 : 0;
  pg.text(`${DISCLAIMER}.`, W - M - pw, 576, { size: 8.5, bold: true, color: C.navy, align: "right" });
  let fy = 589;
  for (const ln of wrapText(FINE, false, 7.5, W - 2 * M)) { pg.text(ln, M, fy, { size: 7.5, color: C.muted }); fy += 9; }
}

// A column of labeled rows that stops at `bottom`.
function column(pg, x, width, top, bottom) {
  let y = top;
  const api = {
    get y() { return y; },
    gap(v) { y += v; return api; },
    // The label's baseline sits 10pt below the current position.
    label(str) {
      if (y + 24 > bottom) return api;
      pg.text(str.toUpperCase(), x, y + 10, { size: 8, bold: true, color: C.goldInk });
      y += 16;
      return api;
    },
    rows(str, opts = {}) {
      const size = opts.size || 10;
      for (const ln of wrapText(str, !!opts.bold, size, opts.width || width)) {
        if (y + size * 1.3 > bottom) break;
        y += size * 1.3;
        pg.text(ln, opts.indent ? x + opts.indent : x, y, { size, color: C.ink, ...opts });
      }
      return api;
    },
    bullets(items, opts = {}) {
      const size = opts.size || 9.5;
      for (const item of items) {
        if (y + size * 1.3 > bottom) break;
        pg.text("•", x, y + size * 1.3, { size, color: C.gold });
        api.rows(item, { ...opts, size, indent: 10, width: width - 10 });
      }
      return api;
    },
  };
  return api;
}

function approvalStamp(pg, approval, x, y, w) {
  const h = 40;
  pg.rect(x, y, w, h, C.greenBg, C.green, 1);
  pg.text("APPROVED FOR NEXT STEPS", x + 10, y + 15, { size: 9, bold: true, color: C.green });
  const who = [approval.name, approval.at].filter(Boolean).join("  ·  ");
  pg.text(wrapText(who, false, 8.5, w - 20)[0], x + 10, y + 29, { size: 8.5, color: C.ink });
  return h;
}

/**
 * Builds the proof. Page 1 is always present; page 2 (night view + construction) and page 3
 * (flat artwork) are added when their images are given.
 *
 * @param {object} p
 * @param {{bytes: Uint8Array, width: number, height: number}} p.logo  white logo on navy, JPEG
 * @param {{bytes: Uint8Array, width: number, height: number}} p.mockup  day composite, JPEG
 * @param {{width: string, height: string, area: string} | null} p.size  formatted sizes, or null without a scale
 * @param {string} [p.reference]  e.g. `Door width = 3' 0"`
 * @param {string} [p.project]
 * @param {string} [p.preparedFor]
 * @param {string} [p.notes]
 * @param {{name: string, group?: string, lighting: string, summary?: string, parts?: string[], night?: string}} [p.type]
 * @param {{range: string, label: string, note: string, basis?: string}} [p.price]
 * @param {object} [p.night]  night composite, JPEG
 * @param {object} [p.diagram]  construction cross-section, JPEG
 * @param {{image: object, caption?: string}} [p.flat]  undistorted artwork, JPEG
 * @param {{name?: string, at: string}} [p.approval]  shown as a stamp when the client approved
 * @param {string} [p.proofUrl]
 * @param {Date} [p.date]
 */
export function buildProofPdf(p) {
  const { logo, mockup, size, reference = "", project = "", preparedFor = "", notes = "", type, price, night, diagram, flat, approval, proofUrl, date = new Date() } = p;
  const dateText = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const pages = [];

  // Page 1: the day mockup with size, type and preliminary price.
  {
    const pg = new Page();
    pages.push(pg);
    header(pg, logo);
    pg.text("Storefront sign mockup", M, 98, { size: 20, bold: true, color: C.navy });
    pg.text(`Prepared ${dateText}`, W - M, 98, { size: 10, color: C.muted, align: "right" });
    if (project) pg.text(wrapText(project, false, 12, W - 2 * M - 160)[0], M, 116, { size: 12, color: C.ink });
    banner(pg, 128, "For visual discussion only. Sizes are estimates from a photo.");

    const top = 170, boxW = 528, boxH = 382;
    if (night || diagram || flat) pg.text("DAY VIEW", M, top - 4, { size: 7.5, bold: true, color: C.muted });
    pg.fitImage(mockup, M, top, boxW, boxH);

    const cx = M + boxW + 20, cw = W - M - cx;
    const col = column(pg, cx, cw, top - 2, top + boxH);
    if (approval) col.gap(approvalStamp(pg, approval, cx, top - 4, cw) + 8);
    col.label("Approx. sign size");
    if (size) {
      for (const [name, value] of [["Width", size.width], ["Height", size.height], ["Area", size.area]]) {
        col.gap(name === "Area" ? 20 : 22);
        pg.text(value, cx, col.y, { size: name === "Area" ? 14 : 18, bold: true, color: C.navy });
        pg.text(name, W - M, col.y, { size: 9, color: C.muted, align: "right" });
        col.gap(6);
        pg.line(cx, col.y, W - M, col.y, C.line, 0.75);
      }
    } else {
      col.rows("Scale not set, so no sizes are shown. Draw a reference line on a known measurement to add them.", { size: 9.5, color: C.muted });
    }
    col.gap(20);
    if (type) {
      col.label("Sign type");
      col.rows(type.name, { bold: true, color: C.navy });
      col.rows(type.lighting, { size: 9, color: C.muted });
      col.gap(16);
    }
    if (price) {
      col.label("Preliminary range");
      col.rows(price.range, { size: 13, bold: true, color: C.navy });
      col.rows(price.label, { size: 8.5, color: C.goldInk, bold: true });
      col.rows(price.note, { size: 7.5, color: C.muted });
      col.gap(16);
    }
    if (reference) { col.label("Scale reference"); col.rows(reference); col.gap(16); }
    if (preparedFor) { col.label("Prepared for"); col.rows(preparedFor); col.gap(16); }
    if (notes) { col.label("Notes"); col.rows(notes, { size: 9.5 }); col.gap(16); }
    if (proofUrl) { col.label("Approval link"); col.rows(proofUrl, { size: 7.5, color: C.muted, link: proofUrl }); }
  }

  // Page 2: the night view from the same pin, and how the sign is built.
  if (night || diagram) {
    const pg = new Page();
    pages.push(pg);
    header(pg, logo);
    pg.text(night ? "Night view and construction" : "Construction", M, 98, { size: 20, bold: true, color: C.navy });
    if (type) pg.text(type.name, W - M, 98, { size: 11, bold: true, color: C.navy, align: "right" });
    banner(pg, 112, "Night lighting is simulated to show where the light goes, not its exact brightness.");

    const top = 152, leftW = night ? 460 : 0;
    if (night) {
      pg.text("NIGHT VIEW, SAME PLACEMENT AS PAGE 1", M, top - 4, { size: 7.5, bold: true, color: C.muted });
      pg.fitImage(night, M, top, leftW, 400, { well: C.night });
    }
    const cx = night ? M + leftW + 20 : M, cw = W - M - cx;
    let y = top;
    if (diagram) {
      const dh = Math.min(cw * (diagram.height / diagram.width), 200);
      pg.fitImage(diagram, cx, y, cw, dh, { well: C.white });
      y += dh + 14;
    }
    const col = column(pg, cx, cw, y - 10, 552);
    if (type) {
      col.label("How it's built");
      if (type.summary) col.rows(type.summary, { size: 9.5 });
      col.gap(6);
      if (type.parts?.length) col.bullets(type.parts, { size: 9 });
      col.gap(10);
      if (type.night) { col.label("At night"); col.rows(`${type.lighting}: ${type.night}`, { size: 9.5 }); }
      col.gap(8);
      col.rows("Typical construction shown for discussion. Not to scale.", { size: 8, color: C.muted });
    }
  }

  // Page 3: the artwork flat, as a fabricator would start from it.
  if (flat) {
    const pg = new Page();
    pages.push(pg);
    header(pg, logo);
    pg.text("Flat artwork", M, 98, { size: 20, bold: true, color: C.navy });
    if (size) pg.text(`About ${size.width} W × ${size.height} H`, W - M, 98, { size: 11, bold: true, color: C.navy, align: "right" });
    banner(pg, 112, "Artwork as supplied, not perspective-corrected. Final art is redrawn for fabrication.");
    const box = pg.fitImage(flat.image, M, 156, W - 2 * M, 350, { well: C.well });
    if (size) {
      pg.text(size.width, box.x + box.w / 2, box.y + box.h + 16, { size: 10, bold: true, color: C.navy, align: "center" });
      pg.line(box.x, box.y + box.h + 6, box.x + box.w, box.y + box.h + 6, C.gold, 1);
    }
    const col = column(pg, M, W - 2 * M, 524, 556);
    col.rows(flat.caption || "This is the undistorted artwork used for the mockup. Colors on screen and in print vary from finished materials.", { size: 9, color: C.muted });
  }

  pages.forEach((pg, i) => footer(pg, i + 1, pages.length));

  return serialize(pages, {
    Title: `Storefront sign mockup${project ? ` – ${project}` : ""}`,
    Author: CONTACT.name,
    Subject: DISCLAIMER,
    Creator: `${CONTACT.site} sign mockup tool`,
    CreationDate: pdfDate(date),
  });
}

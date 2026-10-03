// Minimal PDF 1.4 writer for the one-page mockup proof. No DOM: images arrive as JPEG bytes,
// text uses the standard Helvetica fonts with WinAnsi encoding, so the file stays small and searchable.

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
  constructor() { this.ops = []; this.links = []; }
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
  image(name, x, y, w, h) {
    this.ops.push(`q ${n(w)} 0 0 ${n(h)} ${n(x)} ${n(H - y - h)} cm /${name} Do Q`);
  }
}

function pdfDate(d) {
  const p = v => String(v).padStart(2, "0");
  return `D:${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function serialize({ content, images, links, info }) {
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

  const imageIds = images.map((_, i) => 7 + i);
  const linkIds = links.map((_, i) => 7 + images.length + i);
  const xobjects = images.map((im, i) => `/${im.name} ${imageIds[i]} 0 R`).join(" ");
  const annots = linkIds.length ? ` /Annots [${linkIds.map(id => `${id} 0 R`).join(" ")}]` : "";
  const contentBytes = enc.encode(content);

  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << ${xobjects} >> >>${annots} >>`);
  obj(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  obj(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  obj(6, `<< /Length ${contentBytes.length} >>`, contentBytes);
  images.forEach((im, i) => {
    obj(imageIds[i], `<< /Type /XObject /Subtype /Image /Width ${im.width} /Height ${im.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.bytes.length} >>`, im.bytes);
  });
  links.forEach((l, i) => {
    const r = [l.x, H - l.y - l.h, l.x + l.w, H - l.y].map(n).join(" ");
    obj(linkIds[i], `<< /Type /Annot /Subtype /Link /Rect [${r}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(l.uri)} >> >>`);
  });
  const infoId = 7 + images.length + links.length;
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

/**
 * @param {object} p
 * @param {{bytes: Uint8Array, width: number, height: number}} p.logo  white logo on navy, JPEG
 * @param {{bytes: Uint8Array, width: number, height: number}} p.mockup  composite photo, JPEG
 * @param {{width: string, height: string, area: string} | null} p.size  formatted sizes, or null without a scale
 * @param {string} [p.reference]  e.g. `Door width = 3' 0"`
 * @param {string} [p.project]
 * @param {string} [p.preparedFor]
 * @param {string} [p.notes]
 * @param {Date} [p.date]
 */
export function buildProofPdf({ logo, mockup, size, reference = "", project = "", preparedFor = "", notes = "", date = new Date() }) {
  const pg = new Page();
  const C = COLORS;
  const dateText = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  pg.rect(0, 0, W, 66, C.navy);
  pg.rect(0, 66, W, 3, C.gold);
  const logoH = 30, logoW = (logo.width / logo.height) * logoH;
  pg.image("Logo", M, 18, logoW, logoH);
  pg.text(CONTACT.phone, W - M, 26, { size: 12, bold: true, color: C.white, align: "right", link: CONTACT.phoneHref });
  const e2 = CONTACT.emails[1], e1 = CONTACT.emails[0];
  const e2w = pg.text(e2, W - M, 41, { size: 10, color: C.white, align: "right", link: `mailto:${e2}` });
  const sepW = pg.text("  ·  ", W - M - e2w, 41, { size: 10, color: C.gold2, align: "right" });
  pg.text(e1, W - M - e2w - sepW, 41, { size: 10, color: C.white, align: "right", link: `mailto:${e1}` });
  pg.text(`${CONTACT.site}  ·  ${CONTACT.area}`, W - M, 54, { size: 9, color: C.gold2, align: "right", link: `https://${CONTACT.site}/` });

  pg.text("Storefront sign mockup", M, 98, { size: 20, bold: true, color: C.navy });
  pg.text(`Prepared ${dateText}`, W - M, 98, { size: 10, color: C.muted, align: "right" });
  if (project) pg.text(wrapText(project, false, 12, W - 2 * M - 160)[0], M, 116, { size: 12, color: C.ink });

  const bannerY = 128;
  pg.rect(M, bannerY, W - 2 * M, 28, C.cream, C.gold, 1.2);
  pg.rect(M, bannerY, 5, 28, C.gold);
  const dw = pg.text(DISCLAIMER, M + 16, bannerY + 18.5, { size: 13, bold: true, color: C.navy });
  pg.text("For visual discussion only. Sizes are estimates from a photo.", M + 16 + dw + 14, bannerY + 18, { size: 9.5, color: C.ink });

  const top = 170, boxW = 528, boxH = 382;
  const k = Math.min(boxW / mockup.width, boxH / mockup.height);
  const iw = mockup.width * k, ih = mockup.height * k;
  const ix = M + (boxW - iw) / 2, iy = top + (boxH - ih) / 2;
  pg.rect(M, top, boxW, boxH, [0.96, 0.965, 0.973]);
  pg.image("Mockup", ix, iy, iw, ih);
  pg.rect(ix, iy, iw, ih, null, C.line, 0.75);

  const cx = M + boxW + 20, cw = W - M - cx;
  let y = top + 8;
  const label = str => { pg.text(str.toUpperCase(), cx, y, { size: 8, bold: true, color: C.goldInk }); y += 6; };
  const rows = (str, opts = {}) => {
    const size = opts.size || 10;
    for (const ln of wrapText(str, !!opts.bold, size, cw)) {
      if (y + size > top + boxH) break;
      y += size * 1.3;
      pg.text(ln, cx, y, { size, color: C.ink, ...opts });
    }
  };

  label("Approx. sign size");
  if (size) {
    for (const [name, value] of [["Width", size.width], ["Height", size.height], ["Area", size.area]]) {
      y += 24;
      pg.text(value, cx, y, { size: name === "Area" ? 15 : 20, bold: true, color: C.navy });
      pg.text(name, W - M, y, { size: 9, color: C.muted, align: "right" });
      y += 6;
      pg.line(cx, y, W - M, y, C.line, 0.75);
    }
  } else {
    rows("Scale not set, so no sizes are shown. Draw a reference line on a known measurement to add them.", { size: 9.5, color: C.muted });
  }
  y += 22;
  if (reference) { label("Scale reference"); rows(reference); y += 24; }
  if (preparedFor) { label("Prepared for"); rows(preparedFor); y += 24; }
  if (notes) { label("Notes"); rows(notes, { size: 9.5 }); }

  pg.line(M, 562, W - M, 562, C.line, 0.75);
  pg.text(`${CONTACT.legal}  ·  ${CONTACT.area}  ·  ${CONTACT.site}`, M, 576, { size: 8.5, bold: true, color: C.navy });
  pg.text(`${DISCLAIMER}.`, W - M, 576, { size: 8.5, bold: true, color: C.navy, align: "right" });
  const fine = "Sizes are approximate: they are estimated from one photo and one reference measurement, and the sign artwork is placed by hand. Fabrication needs verified field measurements and shop drawings.";
  let fy = 589;
  for (const ln of wrapText(fine, false, 7.5, W - 2 * M)) { pg.text(ln, M, fy, { size: 7.5, color: C.muted }); fy += 9; }

  return serialize({
    content: pg.ops.join("\n"),
    images: [{ name: "Logo", ...logo }, { name: "Mockup", ...mockup }],
    links: pg.links,
    info: {
      Title: `Storefront sign mockup${project ? ` – ${project}` : ""}`,
      Author: CONTACT.name,
      Subject: DISCLAIMER,
      Creator: `${CONTACT.site} sign mockup tool`,
      CreationDate: pdfDate(date),
    },
  });
}

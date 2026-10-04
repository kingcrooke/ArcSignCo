import { PROPOSAL } from "./quote-rates.mjs";
import { formatMoney } from "./quote-compute.mjs";

const CONTACT = {
  phone: "(347) 450-2110",
  phoneTel: "+13474502110",
  email: "jc@arcsignco.com",
  hours: "Mon–Fri 8 AM–6 PM",
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildProposalHtml({ lead, quote, draft = true }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const validThrough = new Date(Date.now() + PROPOSAL.validDays * 86400000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const lines = quote?.clientLines || [];
  const lineRows = lines
    .map(
      l => `<tr><td>${esc(l.label)}</td><td class="amt">${formatMoney(l.amount)}</td></tr>`,
    )
    .join("");
  const permitNotes = lines.filter(l => l.note).map(l => `<li>${esc(l.note)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Written estimate — ${esc(lead.company || lead.name || "Project")}</title>
  <style>
    :root { --navy:#0b1d33; --gold:#c9a227; --text:#1a1a1a; --muted:#555; }
    * { box-sizing: border-box; }
    body { font-family: Georgia, "Times New Roman", serif; color: var(--text); margin: 0; padding: 2rem 1.25rem; line-height: 1.5; }
    .wrap { max-width: 720px; margin: 0 auto; }
    header { border-bottom: 3px solid var(--navy); padding-bottom: 1rem; margin-bottom: 1.5rem; }
    h1 { font-size: 1.35rem; margin: 0 0 .25rem; color: var(--navy); letter-spacing: .02em; }
    .eyebrow { font-family: system-ui, sans-serif; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); }
    .draft { font-family: system-ui, sans-serif; background: #fff3cd; color: #664d03; padding: .35rem .6rem; font-size: .8rem; display: inline-block; margin-bottom: .75rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: system-ui, sans-serif; font-size: .95rem; }
    th, td { border-bottom: 1px solid #ddd; padding: .55rem .25rem; text-align: left; vertical-align: top; }
    th { font-weight: 600; color: var(--muted); font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; }
    td.amt { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
    tfoot td { font-weight: 700; border-top: 2px solid var(--navy); font-size: 1.05rem; }
    .meta { font-family: system-ui, sans-serif; font-size: .9rem; color: var(--muted); }
    .scope { white-space: pre-wrap; font-family: system-ui, sans-serif; font-size: .9rem; background: #f6f7f9; padding: .75rem 1rem; border-radius: 4px; }
    footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; font-family: system-ui, sans-serif; font-size: .85rem; color: var(--muted); }
    footer strong { color: var(--navy); }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    ${draft ? `<p class="draft">Draft for review — not yet sent to the client</p>` : ""}
    <header>
      <p class="eyebrow">Arc Signage Co</p>
      <h1>Written estimate</h1>
      <p class="meta">Prepared ${esc(date)} · Valid through ${esc(validThrough)}</p>
    </header>
    <p><strong>Prepared for:</strong> ${esc(lead.company || lead.name)}<br>
    ${lead.name && lead.company ? esc(lead.name) + "<br>" : ""}
    ${lead.address ? esc(lead.address) + "<br>" : ""}
    ${lead.email ? esc(lead.email) : ""}</p>
    <h2 style="font-size:1rem;color:var(--navy);">Scope summary</h2>
    <div class="scope">${esc(lead.scopeSummary || lead.projectType || "Signage scope per intake form.")}</div>
    <h2 style="font-size:1rem;color:var(--navy);">Estimate</h2>
    <table>
      <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>${lineRows}</tbody>
      <tfoot><tr><td>Estimated total</td><td class="amt">${formatMoney(quote?.total || 0)}</td></tr></tfoot>
    </table>
    ${permitNotes ? `<ul>${permitNotes}</ul>` : ""}
    <p class="meta">${esc(PROPOSAL.taxNote)}</p>
    <p class="meta">${esc(PROPOSAL.disclaimer)}</p>
    <footer>
      <p><strong>Questions?</strong> Call or text <a href="tel:${CONTACT.phoneTel}">${CONTACT.phone}</a> ·
      <a href="mailto:${CONTACT.email}">${CONTACT.email}</a> · ${CONTACT.hours}</p>
      <p>Arc Signage Co · New York / Tri-State</p>
    </footer>
    <p class="no-print meta"><button type="button" onclick="window.print()">Print or save as PDF</button></p>
  </div>
</body>
</html>`;
}

function pdfSafe(text) {
  return String(text ?? "")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function wrapPdfLine(text, font, size, maxWidth) {
  const words = pdfSafe(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function wrapPdfParagraphs(text, font, size, maxWidth) {
  const out = [];
  for (const chunk of pdfSafe(text).split(/\n/)) {
    out.push(...wrapPdfLine(chunk, font, size, maxWidth));
  }
  return out;
}

export async function buildProposalPdfBytes({ lead, quote, draft = true }) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.04, 0.11, 0.2);
  const muted = rgb(0.35, 0.35, 0.35);
  const margin = 48;
  const maxWidth = 612 - margin * 2;
  let page = doc.addPage([612, 792]);
  let y = 740;

  const newPageIfNeeded = (need = 40) => {
    if (y < margin + need) {
      page = doc.addPage([612, 792]);
      y = 740;
    }
  };

  const drawLines = (lines, { size = 10, f = font, color = navy, gap = 4 } = {}) => {
    for (const line of lines) {
      newPageIfNeeded(size + gap + 20);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= size + gap;
    }
  };

  const drawHeading = (text, size = 11) => {
    newPageIfNeeded(size + 10);
    page.drawText(pdfSafe(text), { x: margin, y, size, font: bold, color: navy });
    y -= size + 8;
  };

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const validThrough = new Date(Date.now() + PROPOSAL.validDays * 86400000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (draft) {
    drawLines(wrapPdfLine("Draft for review — not yet sent to the client", font, 9, maxWidth), { size: 9, color: muted });
    y -= 4;
  }

  drawHeading("Arc Signage Co", 11);
  drawHeading("Written estimate", 16);
  drawLines(wrapPdfLine(`Prepared ${date} · Valid through ${validThrough}`, font, 9, maxWidth), { size: 9, color: muted });
  y -= 6;

  drawLines(wrapPdfLine(`Prepared for: ${lead.company || lead.name || "Client"}`, font, 10, maxWidth));
  if (lead.name && lead.company) drawLines(wrapPdfLine(lead.name, font, 10, maxWidth));
  if (lead.address) drawLines(wrapPdfLine(lead.address, font, 10, maxWidth));
  if (lead.email) drawLines(wrapPdfLine(lead.email, font, 10, maxWidth));
  y -= 8;

  drawHeading("Scope summary", 11);
  drawLines(
    wrapPdfParagraphs(lead.scopeSummary || lead.projectType || "Signage scope per intake form.", font, 9, maxWidth),
    { size: 9, color: muted, gap: 3 },
  );
  y -= 6;

  drawHeading("Estimate", 11);
  page.drawText("Description", { x: margin, y, size: 8, font: bold, color: muted });
  page.drawText("Amount", {
    x: 612 - margin - bold.widthOfTextAtSize("Amount", 8),
    y,
    size: 8,
    font: bold,
    color: muted,
  });
  y -= 14;
  for (const line of quote?.clientLines || []) {
    const labelLines = wrapPdfLine(line.label, font, 9, maxWidth * 0.62);
    const amt = formatMoney(line.amount);
    newPageIfNeeded(30);
    page.drawText(labelLines[0] || "", { x: margin, y, size: 9, font, color: navy });
    page.drawText(amt, { x: 612 - margin - font.widthOfTextAtSize(amt, 9), y, size: 9, font, color: navy });
    y -= 12;
    for (let i = 1; i < labelLines.length; i += 1) {
      drawLines([labelLines[i]], { size: 9 });
    }
    if (line.note) {
      drawLines(wrapPdfLine(line.note, font, 8, maxWidth), { size: 8, color: muted, gap: 2 });
    }
  }
  y -= 4;
  const totalLabel = "Estimated total";
  const totalAmt = formatMoney(quote?.total || 0);
  newPageIfNeeded(24);
  page.drawLine({ start: { x: margin, y: y + 8 }, end: { x: 612 - margin, y: y + 8 }, thickness: 1, color: navy });
  y -= 4;
  page.drawText(totalLabel, { x: margin, y, size: 11, font: bold, color: navy });
  page.drawText(totalAmt, {
    x: 612 - margin - bold.widthOfTextAtSize(totalAmt, 11),
    y,
    size: 11,
    font: bold,
    color: navy,
  });
  y -= 20;

  drawLines(wrapPdfLine(PROPOSAL.taxNote, font, 9, maxWidth), { size: 9, color: muted, gap: 3 });
  drawLines(wrapPdfParagraphs(PROPOSAL.disclaimer, font, 9, maxWidth), { size: 9, color: muted, gap: 3 });
  y -= 8;

  drawHeading("Questions?", 10);
  drawLines(
    wrapPdfLine(`Call or text ${CONTACT.phone} · ${CONTACT.email} · ${CONTACT.hours}`, font, 9, maxWidth),
    { size: 9, color: muted },
  );
  drawLines(wrapPdfLine("Arc Signage Co · New York / Tri-State", font, 9, maxWidth), { size: 9, color: muted });

  return doc.save({ useObjectStreams: false });
}

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

export async function buildProposalPdfBytes({ lead, quote }) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const navy = rgb(0.04, 0.11, 0.2);
  let y = 740;
  const draw = (text, { size = 10, f = font, color = navy } = {}) => {
    page.drawText(String(text).slice(0, 120), { x: 48, y, size, font: f, color });
    y -= size + 6;
  };
  draw("Arc Signage Co", { size: 11, f: bold });
  draw("Written estimate", { size: 16, f: bold });
  y -= 4;
  draw(`Prepared for: ${lead.company || lead.name || "Client"}`);
  if (lead.address) draw(lead.address);
  y -= 8;
  draw("Estimate", { f: bold });
  for (const line of quote?.clientLines || []) {
    draw(`${line.label}: ${formatMoney(line.amount)}`, { size: 9 });
  }
  y -= 4;
  draw(`Estimated total: ${formatMoney(quote?.total || 0)}`, { f: bold });
  y -= 12;
  draw(PROPOSAL.disclaimer.slice(0, 200) + "…", { size: 8, color: rgb(0.35, 0.35, 0.35) });
  y -= 16;
  draw(`Call or text ${CONTACT.phone} · ${CONTACT.email} · ${CONTACT.hours}`, { size: 9 });
  return doc.save();
}

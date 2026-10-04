import { buildClientDocument } from "./client-documents.mjs";
import { formatMoney } from "./quote-engine-pricing.mjs";

export { buildProposalHtml, buildClientDocument } from "./client-documents.mjs";

export async function buildProposalPdfBytes({ lead, quote, draft = true }) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const { md, preliminary } = buildClientDocument({ lead, quote, draft });
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.04, 0.11, 0.2);
  const muted = rgb(0.35, 0.35, 0.35);
  let page = doc.addPage([612, 792]);
  let y = 750;
  const margin = 48;
  const maxW = 612 - margin * 2;

  const draw = (text, size = 9, f = font, color = navy) => {
    const t = String(text).slice(0, 140);
    if (y < margin + 20) {
      page = doc.addPage([612, 792]);
      y = 750;
    }
    page.drawText(t, { x: margin, y, size, font: f, color });
    y -= size + 5;
  };

  if (draft) draw("Draft for review — not yet sent to the client", 8, font, muted);
  draw("Arc Signage Co", 11, bold);
  draw(preliminary ? "Preliminary estimate" : "Written proposal", 14, bold);
  draw(`Prepared for: ${lead.company || lead.name || "Client"}`, 10);
  if (lead.address) draw(lead.address, 9, font, muted);
  y -= 6;
  draw("Scope", 10, bold);
  for (const line of (quote.clientLines || []).slice(0, 12)) {
    if (preliminary) draw(`${line.label}: ${formatMoney(line.low)} – ${formatMoney(line.high)}`, 9);
    else draw(`${line.label}: ${formatMoney(line.amount ?? line.low)}`, 9);
  }
  y -= 4;
  if (preliminary) draw(`Preliminary range: ${formatMoney(quote.low)} – ${formatMoney(quote.high)}`, 10, bold);
  else draw(`Total: ${formatMoney(quote.total)}`, 10, bold);
  y -= 8;
  draw(quote.taxNote || "", 8, font, muted);
  if (quote.preliminaryNotice && preliminary) draw(quote.preliminaryNotice, 8, font, muted);
  y -= 8;
  draw("Call or text (347) 450-2110 · jc@arcsignco.com · Mon–Fri 8 AM–6 PM", 9, font, muted);
  draw("Arc Signage Co · New York / Tri-State", 9, font, muted);
  return doc.save({ useObjectStreams: false });
}

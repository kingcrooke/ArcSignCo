import { buildClientDocument } from "./client-documents.mjs";

export { buildProposalHtml, buildClientDocument, assertClientCopySanitized, CLIENT_TAX_LINE } from "./client-documents.mjs";

/** Full-fidelity PDF from the same HTML as the proposal/estimate preview (Playwright print). */
export async function buildProposalPdfBytes(ctx) {
  const { html } = buildClientDocument(ctx);
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    const bytes = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.45in", bottom: "0.45in", left: "0.55in", right: "0.55in" },
    });
    return bytes;
  } finally {
    await browser.close();
  }
}

import { buildClientDocument } from "./client-documents.mjs";

export { buildProposalHtml, buildClientDocument, assertClientCopySanitized, CLIENT_TAX_LINE } from "./client-documents.mjs";

/** Headless PDF is only for local/CI when explicitly enabled — not on Netlify functions. */
export function canRenderProposalPdf() {
  if (process.env.NETLIFY === "true" || process.env.NETLIFY === "1") return false;
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return process.env.QUOTE_ENGINE_PDF_PLAYWRIGHT === "1";
}

/** Returns PDF bytes, or `null` when Playwright/Chromium is unavailable (use HTML + browser print). */
export async function buildProposalPdfBytes(ctx) {
  if (!canRenderProposalPdf()) return null;
  const { html } = buildClientDocument(ctx);
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      await page.emulateMedia({ media: "print" });
      return await page.pdf({
        format: "Letter",
        printBackground: true,
        margin: { top: "0.45in", bottom: "0.45in", left: "0.55in", right: "0.55in" },
      });
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("proposal pdf render", err);
    return null;
  }
}

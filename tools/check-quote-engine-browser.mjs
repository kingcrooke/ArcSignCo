// Browser checks for the private Quote Engine admin (mocked API; static server).
// Writes screenshots and a sample proposal PDF under /opt/cursor/artifacts/.
//
//   node tools/check-quote-engine-browser.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { computeQuote } from "../netlify/lib/quote-compute.mjs";
import { buildProposalHtml, buildProposalPdfBytes } from "../netlify/lib/proposal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACTS = process.env.CURSOR_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const SCREENSHOTS = path.join(ARTIFACTS, "screenshots");
const SAMPLE_PDF = path.join(ARTIFACTS, "quote-engine-sample-proposal.pdf");
const PORT = Number(process.env.QUOTE_ENGINE_PORT) || 9877;
const BASE = `http://127.0.0.1:${PORT}`;
const OPS = `${BASE}/ops-qel16cb/`;
const PASS = "qa-quote-engine-pass";
const MIN_PNG_BYTES = 35_000;

const demoLead = {
  id: "quote-request-9001",
  receivedAt: "2026-10-04T12:00:00.000Z",
  source: "quote-request",
  status: "New",
  quotedValue: "",
  nextStep: "Review submission and run calculator",
  name: "Jordan Lee",
  company: "Harbor Retail LLC",
  email: "jordan@harbor.example",
  phone: "(555) 555-0100",
  address: "245 Atlantic Ave, Brooklyn, NY",
  projectType: "Channel letters",
  scopeSummary:
    "Exterior Signage Package\n\nProject: exterior\nPermits/approvals: yes\nRecommended items:\n- Storefront channel letters, face-lit\n- DOB approval coordination",
  boroughZone: "brooklyn",
  calculatorInput: {
    signType: "Channel letters",
    quantity: 1,
    sizeW: 14,
    sizeH: 2.5,
    sizeUnit: "ft",
    lit: "Lit",
    height: "Ground floor, under 12 ft",
    permitsRequested: true,
    boroughZone: "brooklyn",
  },
};

const demoQuote = computeQuote(demoLead.calculatorInput);

function startServer() {
  return spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: root, stdio: "pipe" });
}

async function waitFor(url) {
  for (let i = 0; i < 80; i += 1) {
    try {
      if ((await fetch(url)).ok) return;
    } catch { /* retry */ }
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error(`server missing at ${url}`);
}

function assertPng(filePath) {
  const size = fs.statSync(filePath).size;
  if (size < MIN_PNG_BYTES) {
    throw new Error(`${filePath} is only ${size} bytes — likely blank or failed to render`);
  }
}

async function shot(page, name, width) {
  await page.setViewportSize({ width, height: 900 });
  const filePath = path.join(SCREENSHOTS, `${name}-${width}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  assertPng(filePath);
  console.log(`ok   ${path.basename(filePath)} (${fs.statSync(filePath).size} bytes)`);
}

async function captureProposal(context) {
  const html = buildProposalHtml({ lead: demoLead, quote: demoQuote, draft: true });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForSelector(".wrap h1", { state: "visible" });
  await page.waitForSelector("table tbody tr", { state: "visible" });
  await page.waitForFunction(() => {
    const t = document.querySelector("tfoot .amt");
    return t && t.textContent && t.textContent.includes("$");
  });
  await shot(page, "quote-engine-proposal", 1280);
  await shot(page, "quote-engine-proposal", 390);
  await page.close();

  const pdfBytes = await buildProposalPdfBytes({ lead: demoLead, quote: demoQuote });
  fs.writeFileSync(SAMPLE_PDF, pdfBytes);
  if (pdfBytes.length < 500) throw new Error("sample PDF too small");
  console.log(`ok   ${SAMPLE_PDF} (${pdfBytes.length} bytes)`);
}

async function run() {
  fs.mkdirSync(SCREENSHOTS, { recursive: true });
  const server = startServer();
  try {
    await waitFor(OPS);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route("**/api/quote-engine/**", async route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("/leads") && route.request().method() === "GET") {
        return route.fulfill({ json: { mode: "mock", leads: [demoLead] } });
      }
      if (url.pathname.endsWith("/calculate") && route.request().method() === "POST") {
        return route.fulfill({ json: { quote: demoQuote } });
      }
      if (url.pathname.includes("/proposal/")) {
        const html = buildProposalHtml({ lead: demoLead, quote: demoQuote, draft: true });
        return route.fulfill({ contentType: "text/html; charset=utf-8", body: html });
      }
      return route.fulfill({ json: { ok: true } });
    });

    await page.goto(OPS, { waitUntil: "networkidle" });
    await page.fill("#gatePass", PASS);
    await page.click("#gateBtn");
    await page.waitForSelector("#app:not([hidden])", { timeout: 10000 });
    await page.waitForSelector(".lead-list li .name");
    await shot(page, "quote-engine-leads", 1280);
    await shot(page, "quote-engine-leads", 390);

    await page.click(".lead-list li");
    await page.click('button[type="submit"]');
    await page.waitForSelector("#quoteOut:not([hidden])");
    await page.waitForSelector("#quoteOut table tr");
    await shot(page, "quote-engine-calculator", 1280);
    await shot(page, "quote-engine-calculator", 390);

    await captureProposal(context);

    await browser.close();
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

// Browser checks for the private Quote Engine admin (mocked API; static server).
//
//   node tools/check-quote-engine-browser.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACTS = process.env.CURSOR_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const SCREENSHOTS = path.join(ARTIFACTS, "screenshots");
const PORT = Number(process.env.QUOTE_ENGINE_PORT) || 9877;
const BASE = `http://127.0.0.1:${PORT}`;
const OPS = `${BASE}/ops-qel16cb/`;
const PASS = "qa-quote-engine-pass";

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
  scopeSummary: "Exterior Signage Package · Lit storefront letters · DOB path",
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

async function shot(page, name, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.screenshot({ path: path.join(SCREENSHOTS, `${name}-${width}.png`), fullPage: true });
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
        const body = JSON.parse(route.request().postData() || "{}");
        const input = body.input || {};
        const total = 12450;
        return route.fulfill({
          json: {
            quote: {
              label: "Internal placeholder estimate",
              placeholder: true,
              version: "browser-mock",
              total,
              lines: [
                { label: "Channel letters, trim cap", amount: 8200 },
                { label: "Illumination and power supply", amount: 2100 },
                { label: "Site survey and travel (Brooklyn)", amount: 225 },
              ],
            },
          },
        });
      }
      if (url.pathname.includes("/proposal/")) {
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Proposal</title></head><body><h1>Written estimate</h1><p>Harbor Retail LLC</p><p>Total: $12,450</p><p>Call or text (347) 450-2110 · jc@arcsignco.com</p></body></html>`;
        return route.fulfill({ contentType: "text/html", body: html });
      }
      return route.fulfill({ json: { ok: true } });
    });

    await page.goto(OPS, { waitUntil: "networkidle" });
    await page.fill("#gatePass", PASS);
    await page.click("#gateBtn");
    await page.waitForSelector("#app:not([hidden])", { timeout: 10000 });
    await page.waitForSelector(".lead-list li");
    await shot(page, "quote-engine-leads", 1280);
    await shot(page, "quote-engine-leads", 390);

    await page.click(".lead-list li");
    await page.click('button[type="submit"]');
    await page.waitForSelector("#quoteOut:not([hidden])");
    await shot(page, "quote-engine-calculator", 1280);
    await shot(page, "quote-engine-calculator", 390);

    const [proposal] = await Promise.all([
      context.waitForEvent("page"),
      page.click("#genProposal"),
    ]);
    await proposal.waitForLoadState("domcontentloaded");
    await proposal.setViewportSize({ width: 1280, height: 900 });
    await proposal.screenshot({ path: path.join(SCREENSHOTS, "quote-engine-proposal-1280.png"), fullPage: true });
    await proposal.setViewportSize({ width: 390, height: 900 });
    await proposal.screenshot({ path: path.join(SCREENSHOTS, "quote-engine-proposal-390.png"), fullPage: true });
    await proposal.close();

    await browser.close();
    console.log("ok   quote-engine browser screenshots saved");
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

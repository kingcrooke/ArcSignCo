// Browser checks for the sign mockup tool: sample photo, every type in the five product-line
// tabs, night view, PDF build, and (on Netlify) approval links.
//
//   node tools/check-sign-mockup-browser.mjs
//   SIGN_MOCKUP_BASE_URL=https://deploy-preview-NN--arcsign.netlify.app node tools/check-sign-mockup-browser.mjs
//
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { CATEGORIES, READY, lightingOf } from "./sign-mockup/js/catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACTS = process.env.CURSOR_ARTIFACTS_DIR || "/opt/cursor/artifacts";
const SCREENSHOTS = path.join(ARTIFACTS, "screenshots");
const PORT = Number(process.env.SIGN_MOCKUP_PORT) || 9876;
const BASE = (process.env.SIGN_MOCKUP_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
const LOCAL = !process.env.SIGN_MOCKUP_BASE_URL;

const NEW_CATS = ["vinyl", "construction", "wayfinding", "ada", "led"];
let failures = 0;
const ok = msg => console.log(`ok   ${msg}`);
const fail = msg => { failures++; console.log(`FAIL ${msg}`); };

function startServer() {
  if (!LOCAL) return null;
  const child = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: root, stdio: "pipe" });
  return child;
}

async function waitForServer(url, ms = 15000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* retry */ }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error(`server did not respond at ${url}`);
}

async function run() {
  fs.mkdirSync(SCREENSHOTS, { recursive: true });
  const server = startServer();
  try {
    await waitForServer(`${BASE}/tools/sign-mockup/`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/tools/sign-mockup/`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.signMockup?.state);

    for (const id of NEW_CATS) {
      const soon = await page.locator(`#category [data-cat="${id}"]`).evaluate(el => el.classList.contains("is-soon"));
      soon ? fail(`${id} tab still marked coming soon`) : ok(`${id} tab is live`);
    }

    await page.click("#trySample");
    await page.waitForFunction(() => window.signMockup.state.photo && window.signMockup.state.calInches > 0, { timeout: 30000 });
    ok("sample photo loads with scale");

    await page.evaluate(() => window.signMockup.setStep("sign"));
    await page.waitForTimeout(300);

    for (const catId of NEW_CATS) {
      const cat = CATEGORIES.find(c => c.id === catId);
      await page.evaluate(id => window.signMockup.setCategory(id), catId);
      await page.waitForTimeout(150);
      const mode = catId === "led" ? "night" : "day";
      await page.evaluate(m => window.signMockup.setMode(m), mode);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(SCREENSHOTS, `tab-${catId}-${mode}-1280.png`), fullPage: false });
      ok(`${catId}: desktop screenshot (${mode})`);

      for (const type of cat.types) {
        await page.evaluate(tid => window.signMockup.setType(tid), type.id);
        await page.waitForTimeout(120);
        await page.evaluate(() => window.signMockup.requestRender());
        await page.waitForTimeout(200);
        const needsNight = lightingOf(type, {}) !== "none";
        if (needsNight) {
          await page.evaluate(() => window.signMockup.setMode("night"));
          await page.waitForTimeout(250);
        }
        const pdf = await page.evaluate(async () => {
          const f = await window.signMockup.makePdf();
          return f.size;
        });
        if (pdf < 8000) fail(`${type.id}: PDF too small (${pdf} bytes)`);
        else ok(`${type.id}: PDF builds (${pdf} bytes)`);
        if (needsNight) await page.evaluate(() => window.signMockup.setMode("day"));
      }
    }

    await page.evaluate(() => window.signMockup.setCategory("ada"));
    await page.evaluate(() => window.signMockup.setType("ada-room"));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(300);
    const stage = page.locator("#stage");
    await stage.screenshot({ path: path.join(SCREENSHOTS, "ada-tactile-braille-closeup-1280.png") });
    ok("ADA tactile layout close-up");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await page.locator("#category").screenshot({ path: path.join(SCREENSHOTS, "tab-bar-phone-390.png") });
    ok("phone tab bar screenshot");

    if (!LOCAL) {
      await page.evaluate(() => window.signMockup.setStep("export"));
      await page.click("#createLink");
      await page.waitForFunction(() => {
        const el = document.querySelector("#linkUrl");
        return el && !el.closest("[hidden]") && el.value.includes("/proof/#");
      }, { timeout: 45000 });
      const link = await page.inputValue("#linkUrl");
      if (!/\/tools\/sign-mockup\/proof\/#[a-f0-9]+/i.test(link)) fail(`approval link malformed: ${link}`);
      else ok(`approval link created on preview (${link.slice(0, 60)}…)`);
      const proof = await context.newPage();
      await proof.goto(link, { waitUntil: "networkidle" });
      const hasShot = await proof.locator("#shot").evaluate(img => img.complete && img.naturalWidth > 0);
      hasShot ? ok("proof page shows mockup image") : fail("proof page image missing");
      await proof.close();
    } else {
      ok("approval link check skipped (set SIGN_MOCKUP_BASE_URL to a Netlify preview)");
    }

    await browser.close();
  } finally {
    if (server) server.kill("SIGTERM");
  }
  console.log(failures ? `\n${failures} browser check(s) failed` : "\nAll browser checks passed");
  process.exit(failures ? 1 : 0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

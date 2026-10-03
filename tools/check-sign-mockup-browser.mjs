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

    // Every type's default is drawn at its "Typical size" (within 1") and sits fully inside the photo:
    // when picked in its tab, when arriving from another tab, and after picking another size.
    await page.evaluate(() => window.signMockup.setMode("day"));
    const placeTypes = NEW_CATS.flatMap(id => CATEGORIES.find(c => c.id === id).types);
    const sizesOf = type => {
      const cat = CATEGORIES.find(c => c.id === type.category);
      return cat.optionFields(type, cat.defaultOptions(type), null).find(f => f.key === "size")?.choices.map(([v]) => v) || [];
    };
    const presetOf = size => { const m = String(size || "").match(/^(\d+)x(\d+)$/); return m ? { w: Number(m[1]), h: Number(m[2]) } : null; };
    const checkPlacement = async (type, size, how) => {
      const want = presetOf(size);
      const got = await page.evaluate(() => {
        const s = window.signMockup.sizeInfo();
        return { w: s?.width ?? null, h: s?.height ?? null, inside: window.signMockup.quadInsidePhoto() };
      });
      const fits = want && got.w != null && Math.abs(got.w - want.w) <= 1 && Math.abs(got.h - want.h) <= 1;
      const msg = `${type.id} ${how}: ${got.w?.toFixed(1)}" × ${got.h?.toFixed(1)}" (preset ${size}), ${got.inside ? "inside" : "OUTSIDE"} the photo`;
      fits && got.inside ? ok(msg) : fail(msg);
    };
    const signsType = CATEGORIES.find(c => c.id === "sign").defaultType;
    for (const type of placeTypes) {
      await page.evaluate(id => window.signMockup.setCategory(id), type.category);
      await page.evaluate(id => window.signMockup.setType(id), type.id);
      await checkPlacement(type, sizesOf(type)[0], "picked in its tab");
    }
    for (const type of placeTypes) {
      for (const from of ["ada-room", "led-ticker", signsType]) {
        if (CATEGORIES.find(c => c.id === type.category).types.some(t => t.id === from)) continue;
        await page.evaluate(id => window.signMockup.setType(id), from);
        await page.evaluate(id => window.signMockup.setType(id), type.id);
        await checkPlacement(type, sizesOf(type)[0], `after ${from}`);
      }
    }
    for (const type of placeTypes) {
      const [first, second] = sizesOf(type);
      if (!second) continue;
      await page.evaluate(id => window.signMockup.setType(id), type.id);
      await page.selectOption('#typeOptions [data-opt="size"]', second);
      await checkPlacement(type, second, `after choosing ${second}`);
      await page.selectOption('#typeOptions [data-opt="size"]', first);
    }
    await page.evaluate(() => window.signMockup.setType("vinyl-door-hours"));
    const onDoor = await page.evaluate(() => {
      const { quad, cal } = window.signMockup.state;
      const cx = quad.reduce((s, p) => s + p.x, 0) / 4, cy = quad.reduce((s, p) => s + p.y, 0) / 4;
      return cx > Math.min(cal.a.x, cal.b.x) && cx < Math.max(cal.a.x, cal.b.x) && cy < cal.a.y;
    });
    onDoor ? ok("vinyl-door-hours is placed on the door, above the door-width line") : fail("vinyl-door-hours is not placed on the door");
    for (const type of placeTypes.filter(t => CATEGORIES.find(c => c.id === t.category).ui.plaque)) {
      await page.evaluate(id => window.signMockup.setType(id), type.id);
      const clear = await page.evaluate(() => {
        const { quad, cal } = window.signMockup.state;
        const xs = quad.map(p => p.x);
        return Math.min(...xs) > Math.max(cal.a.x, cal.b.x) || Math.max(...xs) < Math.min(cal.a.x, cal.b.x);
      });
      clear ? ok(`${type.id} sits beside the door, not over it`) : fail(`${type.id} overlaps the door`);
    }

    // A small photo of your own (about 18' × 12' at this scale): presets that fit are drawn at size,
    // and the 20' ones are shrunk to fit; nothing hangs off the photo.
    {
      const own = await context.newPage();
      await own.goto(`${BASE}/tools/sign-mockup/`, { waitUntil: "networkidle" });
      await own.setInputFiles("#photoInput", path.join(root, "docs/qa/sample-photo.jpg"));
      await own.waitForFunction(() => window.signMockup.state.photo);
      await own.click("#toScale");
      const pt = p => own.evaluate(({ x, y }) => {
        const s = window.signMockup.state, r = document.getElementById("view").getBoundingClientRect();
        return { x: r.left + s.view.x + x * s.view.s, y: r.top + s.view.y + y * s.view.s };
      }, p);
      const a = await pt({ x: 380, y: 470 }), b = await pt({ x: 530, y: 470 });
      await own.mouse.move(a.x, a.y);
      await own.mouse.down();
      await own.mouse.move(b.x, b.y, { steps: 10 });
      await own.mouse.up();
      await own.fill("#calFt", "3");
      await own.click("#toSign");
      await own.waitForFunction(() => window.signMockup.state.calInches === 36);
      for (const type of placeTypes) {
        await own.evaluate(id => window.signMockup.setType(id), type.id);
        const got = await own.evaluate(() => {
          const { photo, cal, calInches } = window.signMockup.state, s = window.signMockup.sizeInfo();
          const pxPerIn = Math.hypot(cal.b.x - cal.a.x, cal.b.y - cal.a.y) / calInches;
          return { w: s?.width, h: s?.height, inside: window.signMockup.quadInsidePhoto(), photoW: (photo.canvas.width - 6) / pxPerIn, photoH: (photo.canvas.height - 6) / pxPerIn };
        });
        const want = presetOf(sizesOf(type)[0]);
        const fitsPhoto = want.w <= got.photoW && want.h <= got.photoH;
        const sized = fitsPhoto ? Math.abs(got.w - want.w) <= 1 && Math.abs(got.h - want.h) <= 1 : got.w >= got.photoW * 0.8 || got.h >= got.photoH * 0.8;
        const msg = `${type.id} on your own photo: ${got.w?.toFixed(1)}" × ${got.h?.toFixed(1)}" (preset ${sizesOf(type)[0]}${fitsPhoto ? "" : ", shrunk to fit"}), ${got.inside ? "inside" : "OUTSIDE"} the photo`;
        sized && got.inside ? ok(msg) : fail(msg);
      }
      await own.close();
    }

    for (const vw of [1280, 1440]) {
      await page.setViewportSize({ width: vw, height: 900 });
      await page.waitForTimeout(250);
      await page.evaluate(() => window.signMockup.setStep("sign"));
      await page.locator(".sm-cattabs-wrap").screenshot({ path: path.join(SCREENSHOTS, `tab-bar-desktop-${vw}.png`) });
      await page.evaluate(() => {
        window.signMockup.setCategory("ada");
        window.signMockup.setType("ada-room");
        window.signMockup.setStep("sign");
      });
      await page.click("#resetSign");
      await page.waitForTimeout(400);
      const adaMetrics = await page.evaluate(() => {
        const s = window.signMockup.sizeInfo();
        return {
          widthIn: s?.width ?? null,
          heightIn: s?.height ?? null,
          inside: window.signMockup.quadInsidePhoto(),
        };
      });
      if (vw === 1280) {
        if (adaMetrics.widthIn == null || adaMetrics.widthIn >= 24) {
          fail(`ada-room default width readout not under 2 ft (${adaMetrics.widthIn} in)`);
        } else ok(`ada-room width ${adaMetrics.widthIn}" (< 2 ft)`);
        if (adaMetrics.heightIn == null || adaMetrics.heightIn >= 24) {
          fail(`ada-room default height readout not under 2 ft (${adaMetrics.heightIn} in)`);
        } else ok(`ada-room height ${adaMetrics.heightIn}" (< 2 ft)`);
        if (!adaMetrics.inside) fail("ada-room default quad corners outside photo bounds");
        else ok("ada-room quad fully inside canvas");
      }
      const grid = page.locator(".sm-grid");
      await grid.evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
      await page.waitForTimeout(200);
      await grid.screenshot({ path: path.join(SCREENSHOTS, `tab-ada-day-${vw}.png`) });
      ok(`tab bar and ADA mockup screenshots at ${vw}px`);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(200);
    const stage = page.locator("#stage");
    await stage.screenshot({ path: path.join(SCREENSHOTS, "ada-tactile-braille-closeup-1280.png") });
    ok("ADA tactile layout close-up");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await page.locator(".sm-cattabs-wrap").screenshot({ path: path.join(SCREENSHOTS, "tab-bar-phone-390.png") });
        break;
      } catch (e) {
        if (attempt === 2) throw e;
        await page.waitForTimeout(500);
      }
    }
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

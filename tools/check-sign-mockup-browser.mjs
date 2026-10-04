// Browser checks for the sign mockup tool: sample photo, every type in the five product-line
// tabs, night view, PDF build, and (on Netlify) approval links.
//
//   node tools/check-sign-mockup-browser.mjs
//   SIGN_MOCKUP_BASE_URL=https://deploy-preview-NN--arcsign.netlify.app node tools/check-sign-mockup-browser.mjs
//
// Never the live site: the tool runs with ?test=1, so approval links are marked as tests (the
// production server refuses them) and the proof page never notifies Arc.
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
if (/^https?:\/\/(www\.)?arcsignco\.com(\/|$)/i.test(BASE)) {
  console.error("Refusing to run against the live site. Use a local server or a Netlify deploy preview.");
  process.exit(1);
}
const TOOL = `${BASE}/tools/sign-mockup/?test=1&src=qa-check`;

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
    await page.goto(TOOL, { waitUntil: "networkidle" });
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
      await own.goto(TOOL, { waitUntil: "networkidle" });
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
      const sheet = await (await fetch(`${BASE}/api/sign-proofs/${link.split("#")[1]}`)).json();
      sheet.test === true && sheet.src === "qa-check" && sheet.typeId && sheet.category
        ? ok(`approval link sheet is a test proof with tab/type/src (${sheet.category}/${sheet.typeId}/${sheet.src})`)
        : fail(`approval link sheet: test=${sheet.test} src=${sheet.src}`);
      const proof = await context.newPage();
      const posts = [];
      await proof.route(`${BASE}/`, route => { if (route.request().method() === "POST") posts.push(route.request().postData()); return route.abort(); });
      await proof.goto(link, { waitUntil: "networkidle" });
      const hasShot = await proof.locator("#shot").evaluate(img => img.complete && img.naturalWidth > 0);
      hasShot ? ok("proof page shows mockup image") : fail("proof page image missing");
      await proof.close();
    } else {
      ok("approval link check skipped (set SIGN_MOCKUP_BASE_URL to a Netlify preview)");
    }

    // Deep links: ?tab=&type=&src= open that tab and type; bad values fall back to the default.
    for (const [query, cat, type, src] of [
      ["tab=vinyl&type=vinyl-door-hours&src=GBP", "vinyl", "vinyl-door-hours", "gbp"],
      ["tab=led", "led", READY.find(c => c.id === "led").defaultType, ""],
      ["type=wf-directory&src=instagram-bio", "wayfinding", "wf-directory", "instagram-bio"],
      ["tab=vinyl&type=halo", "vinyl", READY.find(c => c.id === "vinyl").defaultType, ""],
      ["tab=nope&type=bogus&src=<x>", READY[0].id, READY[0].defaultType, "x"],
    ]) {
      const dl = await context.newPage();
      await dl.goto(`${BASE}/tools/sign-mockup/?${query}`, { waitUntil: "networkidle" });
      await dl.waitForFunction(() => window.signMockup?.state);
      const got = await dl.evaluate(() => ({
        type: window.signMockup.state.typeId, src: window.signMockup.state.src,
        tab: document.querySelector('#category [aria-checked="true"]')?.dataset.cat,
      }));
      got.type === type && got.tab === cat && got.src === src
        ? ok(`deep link ?${query} opens ${cat} / ${type}${src ? ` (src ${src})` : ""}`)
        : fail(`deep link ?${query}: got ${JSON.stringify(got)}`);
      await dl.close();
    }

    // Request a formal estimate: prefilled from the mockup, power only when lit, files spread over
    // photo_1…, and in test mode the submission is built but never sent.
    {
      const ep = await context.newPage();
      const sent = [];
      await ep.route(`${BASE}/`, route => {
        if (route.request().method() !== "POST") return route.continue();
        sent.push(route.request().url());
        return route.abort();
      });
      await ep.goto(`${BASE}/tools/sign-mockup/?tab=sign&type=halo&src=qa-check&test=1`, { waitUntil: "networkidle" });
      await ep.click("#trySample");
      await ep.waitForFunction(() => window.signMockup.state.photo && window.signMockup.state.calInches > 0, { timeout: 30000 });
      await ep.evaluate(() => window.signMockup.setStep("sign"));
      await ep.waitForFunction(() => window.signMockup.sizeInfo(), { timeout: 15000 });
      await ep.click("#estimateCta").catch(() => {});
      await ep.evaluate(() => window.signMockup.estimate.prefill());
      const f = "#estimateForm .ef-form";
      const val = n => ep.$eval(`${f} [name="${n}"]`, el => el.value);
      const pre = {
        tab: await val("tab"), type: await val("type"), src: await val("src"), signType: await val("sign_type"),
        w: await val("size_w"), h: await val("size_h"), unit: await val("size_unit"),
        lit: await ep.$eval(f, form => form.querySelector('[name="lit"]:checked')?.value),
        want: await ep.evaluate(() => window.signMockup.sizeInfo().width),
        open: await ep.$eval(`${f} .ef-more`, d => d.open),
        firstOptional: await ep.$eval(`${f} .ef-more-body > *`, el => el.className),
      };
      pre.tab === "sign" && pre.type === "halo" && pre.src === "qa-check" && pre.signType === "Channel letters" && pre.lit === "Lit"
        ? ok("estimate form prefills tab, type, src, sign type and lighting from the mockup")
        : fail(`estimate prefill: ${JSON.stringify(pre)}`);
      pre.unit === "ft" && Math.abs(Number(pre.w) * 12 - pre.want) <= 6 && Number(pre.h) > 0
        ? ok(`estimate size prefills from the mockup width (${pre.w} × ${pre.h} ${pre.unit})`)
        : fail(`estimate size prefill: ${JSON.stringify(pre)}`);
      !pre.open && pre.firstOptional === "ef-photos" ? ok("\"Help us price it faster\" starts collapsed, photos first") : fail(`optional section: ${JSON.stringify(pre)}`);

      const powerShown = () => ep.$eval(`${f} [data-power]`, el => !el.hidden);
      await ep.click(`${f} summary`);
      const litPower = await powerShown();
      await ep.check(`${f} [name="lit"][value="Non-lit"]`);
      const unlitPower = await powerShown();
      await ep.check(`${f} [name="lit"][value="Lit"]`);
      litPower && !unlitPower && await powerShown() ? ok("power question shows only when Lit is picked") : fail(`power question: lit ${litPower}, non-lit ${unlitPower}`);
      const tenantHint = await ep.$eval(`${f} [name="role"][value="Tenant"]`, r => r.closest("label").textContent.includes("Tenants need landlord approval."));
      tenantHint ? ok("tenant choice carries the landlord-approval hint") : fail("tenant hint missing");

      // Validation: an empty submit names the first missing field and sends nothing.
      await ep.click(`${f} .ef-submit`);
      const firstErr = await ep.$eval(`${f} .ef-error`, el => el.hidden ? "" : el.textContent);
      /^Name:/.test(firstErr) ? ok(`empty submit is refused at the first field (${firstErr.slice(0, 50)})`) : fail(`empty submit: "${firstErr}"`);

      await ep.fill(`${f} [name="name"]`, "QA Tester");
      await ep.fill(`${f} [name="email"]`, "qa@example.com");
      await ep.fill(`${f} [name="phone"]`, "555 010 0000");
      await ep.fill(`${f} [name="street"]`, "123 Test St");
      await ep.fill(`${f} [name="city"]`, "Brooklyn");
      await ep.fill(`${f} [name="zip"]`, "11201");
      await ep.check(`${f} [name="role"][value="Tenant"]`);
      await ep.check(`${f} [name="job"][value="New sign"]`);
      await ep.check(`${f} [data-service][value="Fabrication"]`);
      await ep.check(`${f} [data-service][value="Permits / DOB filing"]`);
      await ep.fill(`${f} [name="target_date"]`, new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10));
      await ep.fill(`${f} [name="business"]`, "QA Bakery");
      await ep.check(`${f} [name="landmark"][value="Yes"]`);
      await ep.selectOption(`${f} [name="height"]`, "2nd floor or higher");
      await ep.check(`${f} [name="power"][value="Yes"]`);
      await ep.selectOption(`${f} [name="budget"]`, "$3–10k");
      const jpg = fs.readFileSync(path.join(root, "docs/qa/sample-photo.jpg"));
      await ep.setInputFiles(`${f} [data-photos]`, [
        { name: "wide.jpg", mimeType: "image/jpeg", buffer: jpg },
        { name: "close.jpg", mimeType: "image/jpeg", buffer: jpg },
        { name: "plan.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF\n") },
        { name: "anim.gif", mimeType: "image/gif", buffer: Buffer.from("GIF89a") },
        { name: "huge.jpg", mimeType: "image/jpeg", buffer: Buffer.alloc(11 * 1024 * 1024, 0xff) },
      ]);
      const listed = await ep.$$eval(`${f} [data-photo-list] li`, li => li.length);
      const skipNote = await ep.$eval(`${f} .ef-error`, el => el.textContent);
      listed === 3 && /JPG, PNG, HEIC or PDF/.test(skipNote) && /over 10 MB/.test(skipNote)
        ? ok("photo picker keeps JPG/PDF, skips other types and files over 10 MB")
        : fail(`photo picker: ${listed} listed, note "${skipNote}"`);
      await ep.setInputFiles(`${f} [name="artwork"]`, { name: "logo.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"/>') });
      await ep.click(`${f} .ef-submit`);
      await ep.waitForSelector("#estimateForm .ef-done:not([hidden])", { timeout: 15000 });
      const out = await ep.evaluate(() => window.__estimateTest?.fields);
      const done = await ep.$eval("#estimateForm .ef-done", el => el.textContent.replace(/\s+/g, " ").trim());
      out && out["form-name"] === "sign-estimate-request" && out.subject === "[Sign Preview] QA Bakery / Brooklyn / Channel letters / source=qa-check"
        ? ok(`estimate subject: ${out.subject}`) : fail(`estimate subject: ${out?.subject}`);
      out?.flags === "FLAGS: Lit · Permits requested · Landmark = Yes · Height 2nd floor+" ? ok(`estimate flags: ${out.flags}`) : fail(`estimate flags: ${out?.flags}`);
      out && out.services === "Fabrication, Permits / DOB filing" && out.role === "Tenant" && out.power === "Yes" && out.budget === "$3–10k" && out.tab === "sign" && out.type === "halo" && out.src === "qa-check"
        ? ok("estimate submission carries every field, the services list and the hidden tab/type/src")
        : fail(`estimate fields: ${JSON.stringify(out)}`);
      out && out.photo_1?.name === "wide.jpg" && out.photo_2?.name === "close.jpg" && out.photo_3?.name === "plan.pdf" && !out.photo_4 && out.artwork?.name === "logo.svg"
        ? ok("photos go out as photo_1…photo_3 and the logo as artwork")
        : fail(`estimate files: ${JSON.stringify(out && Object.fromEntries(Object.entries(out).filter(([k]) => /photo|artwork/.test(k))))}`);
      done.startsWith("Concept approved, request a formal estimate") ? ok(`estimate confirmation: ${done}`) : fail(`estimate confirmation: ${done}`);
      sent.length === 0 ? ok("test mode: the estimate form posted nothing") : fail(`test mode: the estimate form posted ${sent.length} time(s)`);
      await ep.close();
    }

    // Proof page against a mocked API: the approval wording, no notification from an automated
    // browser or a test proof, and a real notification carries tab, type and src.
    {
      const pid = "ab".repeat(16);
      const jpeg = fs.readFileSync(path.join(root, "docs/qa/sample-photo.jpg"));
      const proofCase = async ({ test, webdriver }) => {
        const pg = await context.newPage();
        if (!webdriver) await pg.addInitScript(() => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }));
        const sheet = {
          v: 1, id: pid, createdAt: "2026-10-03T15:00:00.000Z", project: "QA deep link", preparedFor: "", notes: "", reference: "",
          typeId: "vinyl-door-hours", category: "vinyl", src: "gbp", options: null, size: null, sizeText: null, price: null,
          images: { day: { width: 900, height: 596 } }, comments: [], approval: null, ...(test ? { test: true } : {}),
        };
        const posts = [];
        await pg.route(`${BASE}/api/sign-proofs/${pid}**`, route => {
          const url = route.request().url();
          if (url.endsWith("/day")) return route.fulfill({ body: jpeg, contentType: "image/jpeg" });
          if (url.endsWith("/approve")) return route.fulfill({ json: { ...sheet, approval: { name: "QA Tester", at: "2026-10-03T15:05:00.000Z" } } });
          return route.fulfill({ json: sheet });
        });
        await pg.route(`${BASE}/`, route => {
          if (route.request().method() !== "POST") return route.continue();
          posts.push(Object.fromEntries(new URLSearchParams(route.request().postData())));
          return route.fulfill({ status: 200, body: "" });
        });
        await pg.goto(`${BASE}/tools/sign-mockup/proof/#${pid}`, { waitUntil: "networkidle" });
        await pg.waitForSelector("#approveBtn", { state: "visible" });
        const btn = (await pg.textContent("#approveBtn")).trim();
        await pg.fill("#approveName", "QA Tester");
        await pg.check("#approveOk");
        await pg.click("#approveBtn");
        await pg.waitForSelector("#approvedBox:not([hidden])");
        await pg.waitForTimeout(300);
        const box = (await pg.textContent("#approvedBox")).replace(/\s+/g, " ");
        const est = await pg.evaluate(() => {
          const card = document.getElementById("estimateCard"), f = card.querySelector(".ef-form");
          const v = n => f?.elements.namedItem(n)?.value;
          return { shown: !card.hidden, signType: v("sign_type"), src: v("src"), proof: v("proof"), name: v("name"), type: v("type") };
        });
        await pg.close();
        return { btn, box, posts, est };
      };
      const auto = await proofCase({ test: false, webdriver: true });
      auto.btn === "Concept approved, request a formal estimate" && auto.box.includes("Concept approved, request a formal estimate")
        ? ok("proof approve button and confirmation read \"Concept approved, request a formal estimate\"")
        : fail(`proof approval wording: ${JSON.stringify({ btn: auto.btn, box: auto.box })}`);
      const e = auto.est;
      e.shown && e.signType === "Window vinyl / graphics" && e.src === "gbp" && e.type === "vinyl-door-hours" && /\/proof\/#/.test(e.proof) && e.name === "QA Tester"
        ? ok("after approval the proof page shows the estimate form, prefilled from the proof")
        : fail(`proof estimate form: ${JSON.stringify(e)}`);
      auto.posts.length === 0 ? ok("automated browser: approving sends no notification") : fail(`automated browser sent ${auto.posts.length} notification(s)`);
      const flagged = await proofCase({ test: true, webdriver: false });
      flagged.posts.length === 0 ? ok("test proof: approving sends no notification") : fail(`test proof sent ${flagged.posts.length} notification(s)`);
      const real = await proofCase({ test: false, webdriver: false });
      const n = real.posts[0] || {};
      real.posts.length === 1 && n["form-name"] === "sign-proof-activity" && n.tab === "vinyl" && n.type === "vinyl-door-hours" && n.src === "gbp"
        ? ok("real proof: the notification carries tab, type and src (intercepted, not sent)")
        : fail(`real proof notification: ${JSON.stringify(real.posts)}`);
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

// node --test ./tools/visualizer.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compositeLogo } from "../visualize/js/composite.js";
import { decodePng, encodePng } from "../netlify/lib/visualizer/png.mjs";
import { quoteFor, QUOTE_LABEL } from "../netlify/lib/visualizer/pricing.mjs";
import { renderPrompt, editPrompt } from "../netlify/lib/visualizer/prompts.mjs";
import { assertPublicUrl, extractBusiness, isPrivateAddress } from "../netlify/lib/visualizer/scrape.mjs";
import { blankScene, toPng, imageBackend } from "../netlify/lib/visualizer/images.mjs";
import { leadEmail } from "../netlify/lib/visualizer/email.mjs";
import { ENV_KEYS, handleVisualizer } from "../netlify/lib/visualizer/handle.mjs";
import { memoryBlobs, memoryRecords } from "../netlify/lib/visualizer/records.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function solid(w, h, rgba) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgba[0]; data[i + 1] = rgba[1]; data[i + 2] = rgba[2]; data[i + 3] = rgba[3];
  }
  return { width: w, height: h, data };
}

test("opaque logo pixels survive an exact paste", () => {
  const base = solid(20, 12, [11, 29, 51, 255]);
  const logo = solid(4, 4, [200, 10, 20, 255]);
  const quad = [
    { x: 2, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 7 }, { x: 2, y: 7 },
  ];
  const out = compositeLogo(base, logo, quad);
  assert.equal(out.mode, "exact");
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const i = ((3 + y) * 20 + (2 + x)) * 4;
      assert.deepEqual([out.data[i], out.data[i + 1], out.data[i + 2], out.data[i + 3]], [200, 10, 20, 255]);
    }
  }
  assert.equal(out.data[0], 11);
});

test("png round trip keeps the logo bytes", () => {
  const logo = solid(4, 3, [8, 9, 10, 255]);
  const back = decodePng(encodePng(4, 3, logo.data));
  assert.equal(back.width, 4);
  assert.deepEqual(Array.from(back.data.slice(0, 4)), [8, 9, 10, 255]);
});

test("prompts leave a blank logo area and estimates invent no price", () => {
  const prompt = renderPrompt({
    category: "vehicle",
    business: { name: "North Bagels", phone: "718-555-1212", web: "https://north.example", services: "bagels" },
    subject: { year: "2024", make: "Ford", model: "Transit", body: "cargo-van", coverage: "partial" },
    variant: 0,
  });
  const other = renderPrompt({ category: "vehicle", business: { name: "North Bagels" }, subject: { year: "2024", make: "Ford", model: "Transit" }, variant: 1 });
  assert.match(prompt, /do not draw any logo/i);
  assert.doesNotMatch(prompt, /draw (the|a) logo/i);
  assert.notEqual(prompt, other);
  assert.match(editPrompt("make the van white"), /Do not draw any logo/);
  for (const env of [{}, { ARC_VISUALIZER_ESTIMATES: "1" }]) {
    const quote = quoteFor("vehicle", env);
    assert.equal(quote.label, QUOTE_LABEL);
    assert.equal(quote.low, undefined);
    assert.equal(JSON.stringify(quote).includes("$"), false);
  }
  assert.equal(imageBackend({}), "stub");
  assert.equal(imageBackend({ GEMINI_API_KEY: "x", OPENAI_API_KEY: "y", OPENAI_BASE_URL: "https://ai-gateway.netlify.app/v1" }), "gemini");
});

test("website scan rejects private addresses and reads a public page", async () => {
  assert.equal(isPrivateAddress("127.0.0.1"), true);
  assert.equal(isPrivateAddress("169.254.169.254"), true);
  assert.equal(isPrivateAddress("10.1.2.3"), true);
  assert.equal(isPrivateAddress("1.1.1.1"), false);
  await assert.rejects(() => assertPublicUrl("http://127.0.0.1/admin", async () => [{ address: "127.0.0.1" }]));
  await assert.rejects(() => assertPublicUrl("http://169.254.169.254/", async () => []));
  await assert.rejects(() => assertPublicUrl("https://shop.example", async () => [{ address: "192.168.0.4" }]));
  const found = extractBusiness(`<html><title>North Side Bagels | Home</title>
    <meta name="description" content="Bagels and coffee">
    <meta name="theme-color" content="#112233">
    <a href="tel:+17185551212">call</a></html>`, "https://north.example/");
  assert.equal(found.name, "North Side Bagels");
  assert.equal(found.phone, "+17185551212");
  assert.deepEqual(found.brand_colors, ["#112233"]);
});

function harness(env = {}) {
  let n = 0;
  let t = Date.parse("2026-11-03T15:00:00.000Z");
  const calls = [];
  const deps = {
    blobs: memoryBlobs(),
    records: memoryRecords(),
    env,
    deployContext: "deploy-preview",
    ip: "203.0.113.9",
    now: () => new Date(t),
    makeId: () => (++n).toString(16).padStart(32, "0"),
    fetchImpl: async () => { throw new Error("unexpected fetch"); },
    resolve: async () => [{ address: "1.1.1.1" }],
    imageClient: async (spec) => {
      calls.push({ prompt: spec.prompt, roles: (spec.references || []).map(r => r.role) });
      return { bytes: Buffer.from(toPng(blankScene(spec.category, spec.variant || 0))), model: "test-model", stub: false };
    },
  };
  const call = (pathname, { method = "GET", body, headers } = {}) => handleVisualizer(new Request(`https://preview.test${pathname}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: body == null ? undefined : JSON.stringify(body),
  }), deps);
  return { deps, calls, call, later: (ms = 4000) => { t += ms; } };
}

const logoPng = encodePng(4, 4, solid(4, 4, [200, 10, 20, 255]).data);

test("a session can render, place the real logo, and store a lead without a price", async () => {
  const { call, calls, later, deps } = harness();
  const session = await (await call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  const form = new FormData();
  form.set("sessionId", session.id);
  form.set("kind", "logo");
  form.set("file", new Blob([logoPng], { type: "image/png" }), "logo.png");
  const uploaded = await handleVisualizer(new Request("https://preview.test/api/visualize/upload", { method: "POST", body: form }), deps);
  assert.equal(uploaded.status, 201);
  later();
  const rendered = await call("/api/visualize/render", {
    method: "POST",
    body: { sessionId: session.id, business: { name: "North Bagels", phone: "7185551212" }, subject: { year: "2024", make: "Ford", model: "Transit", body: "cargo-van" } },
  });
  assert.equal(rendered.status, 200, await rendered.clone().text());
  const preview = await rendered.json();
  assert.equal(preview.variants.length, 2);
  assert.equal(preview.quote.label, "Custom quote");
  assert.equal(Object.hasOwn(preview.quote, "low"), false);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].roles, []);
  assert.match(calls[0].prompt, /do not draw any logo/i);
  assert.notEqual(calls[0].prompt, calls[1].prompt);
  const edited = await call("/api/visualize/edit", { method: "POST", body: { sessionId: session.id, renderId: preview.variants[0].id, request: "make the van white" } });
  assert.equal(edited.status, 200);
  assert.deepEqual((await edited.json(), calls[2].roles), ["previous"]);
  const again = await call("/api/visualize/edit", { method: "POST", body: { sessionId: session.id, renderId: preview.variants[0].id, request: "again" } });
  assert.equal(again.status, 409);
  const quad = [
    { x: 8 / 160, y: 8 / 100 },
    { x: 12 / 160, y: 8 / 100 },
    { x: 12 / 160, y: 12 / 100 },
    { x: 8 / 160, y: 12 / 100 },
  ];
  const leadRes = await call("/api/visualize/lead", {
    method: "POST",
    body: { sessionId: session.id, name: "Ada Baker", phone: "(718) 555-1212", email: "ada@north.example", timing: "this-month", renderId: preview.variants[0].id, quad },
  });
  assert.equal(leadRes.status, 201, await leadRes.clone().text());
  const lead = await leadRes.json();
  assert.equal(lead.quote.label, "Custom quote");
  const image = await call(lead.url);
  const png = decodePng(Buffer.from(await image.arrayBuffer()));
  const at = (x, y) => { const i = (y * png.width + x) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]]; };
  assert.deepEqual(at(8, 8), [200, 10, 20, 255]);
  assert.deepEqual(at(11, 11), [200, 10, 20, 255]);
  assert.notDeepEqual(at(7, 8), [200, 10, 20, 255]);
  const early = harness();
  const fresh = await (await early.call("/api/visualize/session", { method: "POST", body: { category: "sign" } })).json();
  const rushed = await early.call("/api/visualize/lead", { method: "POST", body: { sessionId: fresh.id, name: "A", phone: "7185551212", email: "a@b.co", timing: "exploring", renderId: "0".repeat(32) } });
  assert.equal(rushed.status, 400);
  const honey = await call("/api/visualize/lead", { method: "POST", body: { fax: "filled", sessionId: session.id, name: "Bot" } });
  assert.equal(honey.status, 200);
  assert.equal((await deps.records.listLeads()).length, 1);
  const denied = await call("/api/visualize/admin/leads");
  assert.equal(denied.status, 401);
  const bad = await call("/api/visualize/admin/login", { method: "POST", body: { password: "nope" } });
  assert.equal(bad.status, 503);
});

test("lead email goes to arc@ and is skipped cleanly without a key", async () => {
  const message = leadEmail({}, { name: "Ada", phone: "1", email: "a@b.co", category: "vehicle", quote: { label: "Custom quote", message: "Custom quote" }, links: [{ label: "Preview", url: "https://preview.test/api/visualize/asset/abc" }] });
  assert.equal(message.to, "arc@arcsignco.com");
  assert.match(message.html, /Custom quote/);
  assert.doesNotMatch(message.html, /\$\d/);
  const { call, later, deps } = harness({ RESEND_API_KEY: "re_test", VISUALIZER_EMAIL_FROM: "Arc <arc@arcsignco.com>", VISUALIZER_ADMIN_PASSWORD: "correct horse" });
  let posted;
  deps.fetchImpl = async (url, opts) => {
    posted = { url, body: JSON.parse(opts.body) };
    return new Response("{}", { status: 200 });
  };
  deps.imageClient = async (spec) => ({ bytes: Buffer.from(toPng(blankScene(spec.category, 0))), model: "test-model", stub: false });
  const session = await (await call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  later();
  const preview = await (await call("/api/visualize/render", { method: "POST", body: { sessionId: session.id, business: { name: "North" }, subject: { year: "2022", make: "Ram", model: "ProMaster" } } })).json();
  const lead = await call("/api/visualize/lead", { method: "POST", body: { sessionId: session.id, name: "Ada Baker", phone: "7185551212", email: "ada@north.example", timing: "few-months", renderId: preview.variants[0].id } });
  assert.equal(lead.status, 201, await lead.clone().text());
  assert.equal(posted.url, "https://api.resend.com/emails");
  assert.deepEqual(posted.body.to, ["arc@arcsignco.com"]);
  assert.equal(posted.body.attachments[0].filename, "preview.png");
  const login = await call("/api/visualize/admin/login", { method: "POST", body: { password: "correct horse" } });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie");
  const list = await call("/api/visualize/admin/leads", { headers: { cookie: cookie.split(";")[0] } });
  const rows = await list.json();
  assert.equal(rows.leads.length, 1);
  assert.equal(rows.leads[0].emailStatus, "sent");
  assert.equal(rows.leads[0].quoteLabel, "Custom quote");
});

test("docs name every env key and the page does not invent a price", () => {
  const doc = fs.readFileSync(path.join(root, "docs/arc-visualizer.md"), "utf8");
  for (const key of ENV_KEYS) assert.match(doc, new RegExp(key));
  const page = fs.readFileSync(path.join(root, "visualize/index.html"), "utf8");
  assert.match(page, /Custom quote/);
  assert.match(page, /AI-generated visual reference/);
  assert.doesNotMatch(page, /\$\d/);
  assert.doesNotMatch(page + fs.readFileSync(path.join(root, "visualize/js/app.js"), "utf8"), /wraplab/i);
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, /https:\/\/arcsignco\.com\/visualize\/</);
  assert.doesNotMatch(sitemap, /visualize\/admin/);
  const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
  assert.match(toml, /\/visualize\/admin/);
});

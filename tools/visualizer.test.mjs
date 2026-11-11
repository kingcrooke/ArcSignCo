// node --test ./tools/visualizer.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compositeLogo } from "../visualize/js/composite.js";
import { decodePng, encodePng } from "../netlify/lib/visualizer/png.mjs";
import { quoteFor, QUOTE_LABEL } from "../netlify/lib/visualizer/pricing.mjs";
import { inferBody, vehiclePhrase } from "../netlify/lib/visualizer/body.mjs";
import { vehiclePanel } from "../netlify/lib/visualizer/panel.mjs";
import { renderPrompt, editPrompt, vehiclePrompt } from "../netlify/lib/visualizer/prompts.mjs";
import { assertPublicUrl, extractBusiness, isPrivateAddress } from "../netlify/lib/visualizer/scrape.mjs";
import { blankScene, toPng, imageBackend, imageChain, xaiImagePlan, generateImage, identifyVehicle, XAI_IMAGE_MODEL } from "../netlify/lib/visualizer/images.mjs";
import { buildProofPdf } from "../visualize/js/proof.js";
import { leadEmail } from "../netlify/lib/visualizer/email.mjs";
import { ENV_KEYS, handleVisualizer } from "../netlify/lib/visualizer/handle.mjs";
import { blobRecords, memoryBlobs, memoryRecords } from "../netlify/lib/visualizer/records.mjs";

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

test("prompts name the real vehicle and invent no logo box or price", () => {
  const prompt = renderPrompt({
    category: "vehicle",
    business: { name: "North Bagels", phone: "718-555-1212", web: "https://north.example", services: "bagels" },
    subject: { year: "2024", make: "Ford", model: "Transit", body: "cargo-van", coverage: "partial" },
    variant: 0,
  });
  const other = renderPrompt({ category: "vehicle", business: { name: "North Bagels" }, subject: { year: "2024", make: "Ford", model: "Transit" }, variant: 1 });
  const camry = renderPrompt({
    category: "vehicle",
    business: { name: "Arc Signage Co", phone: "(347) 450-2110", web: "arcsignco.com" },
    subject: { year: "2023", make: "Toyota", model: "Camry", color: "white", coverage: "full" },
    variant: 0,
  });
  assert.match(prompt, /do not draw a logo/i);
  assert.doesNotMatch(prompt, /leave a (clear |blank )?rectangular/i);
  assert.match(prompt, /2024 Ford Transit cargo van/);
  assert.match(camry, /2023 Toyota Camry sedan/);
  assert.doesNotMatch(camry, /cargo van/i);
  assert.doesNotMatch(camry, /Custom Signs|Vehicle Wraps, Storefront/i);
  assert.match(vehiclePrompt({ year: "2023", make: "Toyota", model: "Camry", color: "white" }), /2023 Toyota Camry sedan/);
  assert.equal(inferBody({ make: "Toyota", model: "Camry" }), "car");
  assert.equal(inferBody({ make: "Ford", model: "Transit" }), "cargo-van");
  assert.match(vehiclePhrase({ year: "2023", make: "Toyota", model: "Camry" }), /sedan/);
  assert.notEqual(prompt, other);
  assert.match(other, /no services column/i);
  assert.match(editPrompt("gloss black with only thin gold pinstripes"), /Do not draw a logo/);
  assert.doesNotMatch(editPrompt("gloss black"), /blank rectangular/i);
  for (const env of [{}, { ARC_VISUALIZER_ESTIMATES: "1" }]) {
    const quote = quoteFor("vehicle", env);
    assert.equal(quote.label, QUOTE_LABEL);
    assert.equal(quote.low, undefined);
    assert.equal(JSON.stringify(quote).includes("$"), false);
  }
  assert.equal(imageBackend({}), "stub");
  assert.equal(imageBackend({ GEMINI_API_KEY: "x", OPENAI_API_KEY: "y", OPENAI_BASE_URL: "https://ai-gateway.netlify.app/v1" }), "gemini");
  assert.equal(imageBackend({ XAI_API_KEY: "x", GEMINI_API_KEY: "y" }), "xai");
  assert.deepEqual(imageChain({ XAI_API_KEY: "x", GEMINI_API_KEY: "y" }), ["xai", "gemini", "stub"]);
});

test("xAI edits an uploaded photo and never sends the logo", async () => {
  const png = Buffer.from(toPng(blankScene("sign", 0)));
  const plan = xaiImagePlan({ XAI_API_KEY: "test" }, {
    prompt: "leave the logo area blank",
    references: [
      { role: "photo", bytes: png, mime: "image/png" },
      { role: "logo", bytes: png, mime: "image/png" },
      { role: "inspo", bytes: png, mime: "image/png" },
    ],
  });
  assert.equal(plan.body.model, XAI_IMAGE_MODEL);
  assert.match(plan.url, /\/images\/edits$/);
  assert.equal(plan.body.images.length, 2);
  assert.equal(plan.body.image, undefined);
  assert.equal(plan.body.images.some(img => img.url.startsWith("data:image/png;base64,")), true);
  const textOnly = xaiImagePlan({}, { prompt: "a white van", references: [{ role: "logo", bytes: png }] });
  assert.match(textOnly.url, /\/images\/generations$/);
  assert.equal(textOnly.body.aspect_ratio, "3:2");

  let seen;
  const out = await generateImage({ XAI_API_KEY: "test" }, {
    prompt: "leave the logo area blank",
    category: "vehicle",
    variant: 0,
    references: [{ role: "photo", bytes: png, mime: "image/png" }, { role: "logo", bytes: png, mime: "image/png" }],
  }, async (url, opts) => {
    seen = { url, body: JSON.parse(opts.body), auth: opts.headers.Authorization };
    return new Response(JSON.stringify({ data: [{ b64_json: png.toString("base64") }] }), { status: 200 });
  });
  assert.match(seen.url, /api\.x\.ai\/v1\/images\/edits$/);
  assert.equal(seen.body.image.type, "image_url");
  assert.equal(seen.body.images, undefined);
  assert.equal(seen.auth, "Bearer test");
  assert.equal(out.stub, false);
  assert.equal(out.model, XAI_IMAGE_MODEL);

  const fallback = await generateImage({ XAI_API_KEY: "test", GEMINI_API_KEY: "" }, {
    prompt: "van",
    category: "vehicle",
    variant: 1,
    references: [],
  }, async () => new Response("no", { status: 503 }));
  assert.equal(fallback.stub, true);
  assert.equal(fallback.model, "stub");
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
  assert.equal(preview.variants.length, 3);
  assert.equal(preview.count, 3);
  assert.equal(preview.quote.label, "Custom quote");
  assert.equal(Object.hasOwn(preview.quote, "low"), false);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0].roles, []);
  assert.deepEqual(calls[1].roles, ["base"]);
  assert.deepEqual(calls[2].roles, ["base"]);
  assert.match(calls[0].prompt, /do not draw a logo/i);
  assert.match(calls[0].prompt, /Ford Transit/);
  assert.doesNotMatch(calls[0].prompt, /leave a (clear |blank )?rectangular/i);
  assert.notEqual(calls[0].prompt, calls[1].prompt);
  assert.notEqual(calls[1].prompt, calls[2].prompt);
  let lastEdit;
  for (let n = 0; n < 3; n++) {
    lastEdit = await call("/api/visualize/edit", { method: "POST", body: { sessionId: session.id, renderId: preview.variants[0].id, request: `change ${n} keep the van` } });
    assert.equal(lastEdit.status, 200, await lastEdit.clone().text());
  }
  assert.equal((await lastEdit.json()).editsLeft, 0);
  assert.deepEqual(calls.at(-1).roles, ["previous"]);
  const again = await call("/api/visualize/edit", { method: "POST", body: { sessionId: session.id, renderId: preview.variants[0].id, request: "again" } });
  assert.equal(again.status, 409);
  const quad = [
    { x: 8 / 160, y: 8 / 100 },
    { x: 12 / 160, y: 8 / 100 },
    { x: 12 / 160, y: 12 / 100 },
    { x: 8 / 160, y: 12 / 100 },
  ];
  const share = await call("/api/visualize/share", {
    method: "POST",
    body: { sessionId: session.id, renderId: preview.variants[0].id, quad },
  });
  assert.equal(share.status, 200, await share.clone().text());
  const sharedUrl = (await share.json()).url;
  const sharedImage = decodePng(Buffer.from(await (await call(sharedUrl)).arrayBuffer()));
  assert.ok(sharedImage.height > 100);
  const sharedAt = (x, y) => {
    const i = (y * sharedImage.width + x) * 4;
    return [sharedImage.data[i], sharedImage.data[i + 1], sharedImage.data[i + 2], sharedImage.data[i + 3]];
  };
  assert.deepEqual(sharedAt(8, 8), [200, 10, 20, 255]);
  assert.deepEqual(sharedAt(4, sharedImage.height - 2).slice(0, 3), [11, 31, 58]);
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

test("a vehicle shot is the reference for all 3 concepts and identify invents nothing", async () => {
  const { call, calls, later } = harness();
  const session = await (await call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  later();
  const shot = await call("/api/visualize/vehicle", {
    method: "POST",
    body: { sessionId: session.id, subject: { year: "2022", make: "Ford", model: "Transit", color: "white" } },
  });
  assert.equal(shot.status, 200, await shot.clone().text());
  const vehicle = await shot.json();
  assert.equal(vehicle.stub, false);
  assert.match(vehicle.label, /2022 Ford Transit/);
  const wrapped = await call("/api/visualize/render", {
    method: "POST",
    body: {
      sessionId: session.id,
      business: { name: "Acme Plumbing Co Extra Words Here", phone: "555 123 4567 extra", colors: ["#e23b3b", "#163a78", "#d4a53c", "#ffffff"] },
      subject: { coverage: "full", style: "bold", namePlaces: ["side", "doors"] },
    },
  });
  assert.equal(wrapped.status, 200, await wrapped.clone().text());
  const preview = await wrapped.json();
  assert.equal(preview.variants.length, 3);
  assert.deepEqual(calls[1].roles, ["photo"]);
  assert.deepEqual(calls[2].roles, ["base"]);
  assert.deepEqual(calls[3].roles, ["base"]);
  assert.match(calls[2].prompt, /identical vehicle/i);
  assert.match(calls[1].prompt, /bold and sporty/i);
  assert.match(calls[1].prompt, /Acme Plumbing Co Extra Words/);
  assert.doesNotMatch(calls[1].prompt, /Here/);
  assert.doesNotMatch(calls[1].prompt, /#ffffff/);
  const named = await call("/api/visualize/identify", { method: "POST", body: { sessionId: session.id } });
  assert.equal(named.status, 200);
  const id = await named.json();
  assert.equal(id.label, "your vehicle");
  assert.equal(id.vehicle.make, "");
});

test("a failed concept still comes back so the set stays at 3", async () => {
  const h = harness();
  let n = 0;
  h.deps.imageClient = async (spec) => {
    n += 1;
    if (n === 2) throw new Error("model down");
    return { bytes: Buffer.from(toPng(blankScene(spec.category, spec.variant || 0))), model: "test-model", stub: false };
  };
  const session = await (await h.call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  h.later();
  const rendered = await h.call("/api/visualize/render", {
    method: "POST",
    body: { sessionId: session.id, business: { name: "North" }, subject: { stock: true, coverage: "half", style: "clean" } },
  });
  assert.equal(rendered.status, 200, await rendered.clone().text());
  const preview = await rendered.json();
  assert.equal(preview.variants.length, 3);
  assert.equal(preview.variants.filter(item => item.stub).length, 1);
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

test("blob records keep a lead without a database", async () => {
  const records = blobRecords(memoryBlobs(), "v1/production");
  await records.createSession({ id: "abc", createdAt: "2026-11-03T00:00:00.000Z", category: "window" });
  await records.addLead({ id: "lead1", sessionId: "abc", createdAt: "2026-11-03T00:00:01.000Z", name: "Ada" });
  const leads = await records.listLeads();
  assert.equal(leads.length, 1);
  assert.equal(leads[0].name, "Ada");
  assert.equal(await records.bumpUsage("ip", "2026-11-03", "renders", 2), 2);
  assert.equal((await records.getUsage("ip", "2026-11-03")).renders, 2);
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

function paint(image, x, y, w, h, rgba) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      const i = (yy * image.width + xx) * 4;
      image.data[i] = rgba[0];
      image.data[i + 1] = rgba[1];
      image.data[i + 2] = rgba[2];
      image.data[i + 3] = rgba[3];
    }
  }
}

test("the logo panel sits on the vehicle and not on a person beside it", () => {
  const image = solid(220, 120, [220, 220, 220, 255]);
  paint(image, 50, 36, 140, 60, [248, 248, 248, 255]);
  paint(image, 70, 42, 40, 16, [30, 30, 30, 255]);
  paint(image, 145, 42, 36, 16, [30, 30, 30, 255]);
  paint(image, 64, 78, 22, 22, [16, 16, 16, 255]);
  paint(image, 155, 78, 22, 22, [16, 16, 16, 255]);
  paint(image, 4, 16, 14, 90, [180, 40, 40, 255]);
  const { zone, box } = vehiclePanel(image);
  const cx = (zone.x + zone.w / 2) * image.width;
  const cy = (zone.y + zone.h / 2) * image.height;
  assert.ok(cx > 55 && cx < 185, `logo center x ${cx}`);
  assert.ok(cy > 36 && cy < 100, `logo center y ${cy}`);
  assert.ok(box.x * image.width > 30, "vehicle box includes the person");
  assert.ok(zone.x > 0.15, "logo is still in the old rear-quarter box");
});

test("a pale vehicle is not reduced to its dark lower stripe", () => {
  const image = solid(300, 160, [232, 232, 232, 255]);
  paint(image, 30, 40, 240, 90, [250, 250, 250, 255]);
  paint(image, 30, 100, 240, 28, [24, 24, 24, 255]);
  paint(image, 50, 118, 30, 30, [16, 16, 16, 255]);
  paint(image, 210, 118, 30, 30, [16, 16, 16, 255]);
  const { zone } = vehiclePanel(image);
  const cy = (zone.y + zone.h / 2) * image.height;
  assert.ok(cy < 110, `logo sits on the stripe, y ${cy}`);
  assert.ok(cy > 45, `logo is above the body, y ${cy}`);
});

test("a Camry request is prompted as a Camry sedan", async () => {
  const { call, calls, later } = harness();
  const session = await (await call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  later();
  const shot = await call("/api/visualize/vehicle", {
    method: "POST",
    body: { sessionId: session.id, subject: { year: "2023", make: "Toyota", model: "Camry", color: "white", body: "cargo-van" } },
  });
  assert.equal(shot.status, 200, await shot.clone().text());
  const vehicle = await shot.json();
  assert.equal(vehicle.body, "car");
  assert.match(calls[0].prompt, /2023 Toyota Camry sedan/);
  assert.doesNotMatch(calls[0].prompt, /cargo van/i);
});

test("a photo of a Camry is identified and used on the wrap", async () => {
  const h = harness();
  h.deps.identify = async () => JSON.stringify({ year: "2023", make: "Toyota", model: "Camry", color: "white", body: "sedan" });
  const session = await (await h.call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  const form = new FormData();
  form.set("sessionId", session.id);
  form.set("kind", "photo");
  form.set("file", new Blob([logoPng], { type: "image/png" }), "camry.png");
  const uploaded = await handleVisualizer(new Request("https://preview.test/api/visualize/upload", { method: "POST", body: form }), h.deps);
  assert.equal(uploaded.status, 201);
  const named = await h.call("/api/visualize/identify", { method: "POST", body: { sessionId: session.id } });
  assert.equal(named.status, 200, await named.clone().text());
  const id = await named.json();
  assert.equal(id.vehicle.make, "Toyota");
  assert.equal(id.vehicle.model, "Camry");
  assert.equal(id.vehicle.body, "car");
  assert.match(id.label, /Camry/);
  h.later();
  const rendered = await h.call("/api/visualize/render", {
    method: "POST",
    body: { sessionId: session.id, business: { name: "Arc Signage Co", phone: "(347) 450-2110", web: "arcsignco.com", colors: ["#111111", "#d4a53c"] }, subject: { coverage: "full", style: "classic" } },
  });
  assert.equal(rendered.status, 200, await rendered.clone().text());
  assert.match(h.calls[0].prompt, /2023 Toyota Camry sedan/);
  assert.doesNotMatch(h.calls[0].prompt, /cargo van/i);
  assert.doesNotMatch(h.calls[0].prompt, /Custom Signs/i);
  assert.deepEqual(h.calls[1].roles, ["base"]);
});

test("concepts 2 and 3 can be requested after concept 1", async () => {
  const { call, calls, later } = harness();
  const session = await (await call("/api/visualize/session", { method: "POST", body: { category: "vehicle" } })).json();
  later();
  const first = await call("/api/visualize/render", {
    method: "POST",
    body: { sessionId: session.id, phase: "first", business: { name: "Arc Signage Co" }, subject: { year: "2023", make: "Toyota", model: "Camry", coverage: "full", style: "classic" } },
  });
  assert.equal(first.status, 200, await first.clone().text());
  const opened = await first.json();
  assert.equal(opened.partial, true);
  assert.equal(opened.variants.length, 1);
  assert.match(calls[0].prompt, /Camry sedan/);
  const rest = await call("/api/visualize/render", {
    method: "POST",
    body: { sessionId: session.id, phase: "rest", business: { name: "Arc Signage Co" }, subject: { coverage: "full", style: "classic" } },
  });
  assert.equal(rest.status, 200, await rest.clone().text());
  const more = await rest.json();
  assert.equal(more.variants.length, 2);
  assert.deepEqual(calls[1].roles, ["base"]);
  assert.deepEqual(calls[2].roles, ["base"]);
});

test("identify uses xAI vision when Gemini is not configured", async () => {
  let seen;
  const text = await identifyVehicle({ XAI_API_KEY: "test" }, Buffer.from([0xff, 0xd8, 0xff, 0xd9]), "image/jpeg", async (url, opts) => {
    seen = { url, body: JSON.parse(opts.body) };
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"year":"2023","make":"Toyota","model":"Camry","color":"white","body":"sedan"}' } }] }), { status: 200 });
  });
  assert.match(seen.url, /\/chat\/completions$/);
  assert.equal(seen.body.model, "grok-4.7");
  assert.equal(seen.body.messages[0].content[0].type, "image_url");
  assert.match(text, /Camry/);
});

test("proof pdf names the vehicle, colors, and Arc contact", () => {
  const jpeg = Buffer.from("ffd8ffe000104a46494600010100000100010000ffdb004300080606070605080707070909080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432ffc0000b080001000101011100ffc4001f0000010501010101010100000000000000000102030405060708090a0bffda00080001000100003f00fbffd9", "hex");
  const pdf = Buffer.from(buildProofPdf({
    jpeg,
    lines: [
      "Vehicle: 2023 Toyota Camry",
      "Coverage: Full wrap",
      "Style: Classic & Professional",
      "Colors: Black, Gold",
      "Contact Arc: arc@arcsignco.com · (347) 450-2110",
      "This is an AI-generated concept, not a measured proof or a quote.",
    ],
  }));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  const text = pdf.toString("latin1");
  assert.match(text, /2023 Toyota Camry/);
  assert.match(text, /Full wrap/);
  assert.match(text, /Classic & Professional/);
  assert.match(text, /Black, Gold/);
  assert.match(text, /arc@arcsignco.com/);
  assert.match(text, /450-2110/);
  assert.match(text, /not a measured proof/);
});

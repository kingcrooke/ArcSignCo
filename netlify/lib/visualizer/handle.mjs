// Request logic for /api/visualize/*, independent of the Netlify runtime so tests can call it
// with an in-memory database and blob store.
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { compositeLogo } from "../../../visualize/js/composite.js";
import { sendLeadEmail } from "./email.mjs";
import { decodeImage, generateImage, extractWithModel, identifyVehicle, imageBackend, toPng } from "./images.mjs";
import { isPng } from "./png.mjs";
import { quoteFor } from "./pricing.mjs";
import { editPrompt, renderPrompt, scrapePrompt, vehiclePrompt, zoneFor } from "./prompts.mjs";
import { assertPublicUrl, extractBusiness, fetchPublic, pageText } from "./scrape.mjs";
import { stampConcept } from "./watermark.mjs";

export const BLOB_STORE = "arc-visualizer";
export const DISCLAIMER = "AI-generated visual reference. Concept only, not a proof or a quote.";
export const LIMITS = {
  minSessionMs: 3000,
  ip: { scan: 30, render: 16, edit: 4, lead: 5, upload: 40, login: 10 },
  sessionVariants: 3,
  sessionBatches: 2,
  sessionEdits: 1,
  vehicleShots: 4,
  imageBytes: 4_500_000,
};
export const CONCEPT_COUNT = LIMITS.sessionVariants;
export const ENV_KEYS = [
  "VISUALIZER_ADMIN_PASSWORD",
  "VISUALIZER_LEAD_TO",
  "VISUALIZER_EMAIL_FROM",
  "VISUALIZER_IP_SALT",
  "RESEND_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_SITE_KEY",
  "ARC_VISUALIZER_ESTIMATES",
  "ARC_IMAGE_PROVIDER",
  "XAI_API_KEY",
  "XAI_BASE_URL",
  "ARC_XAI_IMAGE_MODEL",
  "ARC_XAI_IMAGE_RESOLUTION",
  "ARC_GEMINI_IMAGE_MODEL",
  "ARC_GEMINI_TEXT_MODEL",
  "ARC_OPENAI_IMAGE_MODEL",
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "GEMINI_API_KEY",
  "GOOGLE_GEMINI_BASE_URL",
];

const CATEGORIES = ["vehicle", "sign", "window"];
const BODIES = ["car", "suv", "pickup", "cargo-van", "sprinter", "box-truck", "trailer"];
const COVERAGE = ["lettering", "partial", "half", "full"];
const STYLES = ["clean", "bold", "tech", "classic"];
const PLACES = ["side", "hood", "rear", "doors", "fascia", "above-door", "wall", "window"];
const SIGNS = ["channel-letters", "lightbox", "blade", "flat-panel", "awning"];
const WINDOWS = ["perforated", "cut-vinyl", "frosted", "full-print"];
const TIMING = {
  asap: "ASAP",
  weeks: "Within the next few weeks",
  months: "1–3 months",
  planning: "Just planning",
  "this-month": "Ready to talk this month",
  "few-months": "Next few months",
  exploring: "Just exploring",
  "not-sure": "Not sure",
};

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...extra },
});
const fail = (status, error) => json(status, { error });

export function newId() {
  return randomBytes(16).toString("hex");
}

function clean(value, max) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

function words(value, maxWords, maxLen) {
  return clean(value, maxLen).split(" ").filter(Boolean).slice(0, maxWords).join(" ");
}

function places(raw) {
  const list = Array.isArray(raw) ? raw : String(raw || "").split(/[\s,]+/);
  return [...new Set(list.map(item => clean(item, 20)).filter(item => PLACES.includes(item)))].slice(0, 4);
}

export function contextSlug(ctx) {
  const s = String(ctx || "dev").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return s || "dev";
}

function hashIp(ip, salt) {
  return createHash("sha256").update(`${salt || "arc-visualizer"}|${ip || "unknown"}`).digest("hex").slice(0, 32);
}

function dayOf(now) {
  return now.toISOString().slice(0, 10);
}

function fileKey(ns, id) {
  return `${ns}/files/${id}`;
}

function sniff(bytes) {
  if (isPng(bytes)) return "image/png";
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length > 12 && Buffer.from(bytes).toString("ascii", 0, 4) === "RIFF" && Buffer.from(bytes).toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return "";
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function adminToken(password) {
  return createHmac("sha256", password).update("arc-visualizer-admin-v1").digest("hex");
}

function hasAdminCookie(req, password) {
  if (!password) return false;
  const raw = req.headers.get("cookie") || "";
  const m = /(?:^|;\s*)arc_viz_admin=([a-f0-9]{64})/.exec(raw);
  return !!(m && safeEqual(m[1], adminToken(password)));
}

function cookie(password, url, clear = false) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  const value = clear ? "" : adminToken(password);
  const age = clear ? 0 : 60 * 60 * 12;
  return `arc_viz_admin=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${secure}`;
}

async function readJson(req) {
  try { return await req.json(); } catch { return null; }
}

function tooSoon(session, now) {
  return now.getTime() - Date.parse(session.createdAt) < LIMITS.minSessionMs;
}

function assetPath(id) {
  return `/api/visualize/asset/${id}`;
}

function colorsOf(raw) {
  const list = Array.isArray(raw) ? raw : String(raw || "").split(/[\s,]+/);
  return list.map(c => clean(c, 7).toLowerCase()).filter(c => /^#[0-9a-f]{6}$/.test(c)).slice(0, 3);
}

function businessOf(raw = {}) {
  return {
    name: words(raw.name, 5, 120),
    phone: words(raw.phone, 3, 40),
    email: clean(raw.email, 160),
    web: words(raw.web, 4, 300),
    tagline: clean(raw.tagline, 180),
    services: clean(raw.services, 400),
    colors: colorsOf(raw.colors),
  };
}

function feet(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0.5 || n > 80) return false;
  return Math.round(n * 10) / 10;
}

function subjectOf(category, raw = {}) {
  if (category === "sign") {
    const widthFt = feet(raw.widthFt);
    const heightFt = feet(raw.heightFt);
    if (widthFt === false || heightFt === false) return { error: "Check the sign width and height. Use feet, or leave them blank." };
    return {
      signType: SIGNS.includes(raw.signType) ? raw.signType : "channel-letters",
      widthFt, heightFt,
      illuminated: raw.illuminated === true || raw.illuminated === "yes",
      photo: true,
      style: STYLES.includes(raw.style) ? raw.style : "",
      namePlaces: places(raw.namePlaces),
      phonePlaces: places(raw.phonePlaces),
      webPlaces: places(raw.webPlaces),
    };
  }
  if (category === "window") {
    return {
      windowType: WINDOWS.includes(raw.windowType) ? raw.windowType : "cut-vinyl",
      panes: clean(raw.panes, 80) || "the main storefront windows",
      photo: true,
      style: STYLES.includes(raw.style) ? raw.style : "",
      namePlaces: places(raw.namePlaces),
      phonePlaces: places(raw.phonePlaces),
      webPlaces: places(raw.webPlaces),
    };
  }
  const year = clean(raw.year, 4);
  if (year && !/^(19|20)\d{2}$/.test(year)) return { error: "Check the vehicle year." };
  return {
    year, make: clean(raw.make, 40), model: clean(raw.model, 40),
    body: BODIES.includes(raw.body) ? raw.body : "cargo-van",
    coverage: COVERAGE.includes(raw.coverage) ? raw.coverage : "partial",
    color: clean(raw.color, 40),
    photo: !!raw.photo,
    stock: raw.stock === true,
    style: STYLES.includes(raw.style) ? raw.style : "",
    namePlaces: places(raw.namePlaces),
    phonePlaces: places(raw.phonePlaces),
    webPlaces: places(raw.webPlaces),
  };
}

function cleanQuad(raw) {
  if (!Array.isArray(raw) || raw.length !== 4) return null;
  const pts = [];
  for (const p of raw) {
    const x = Number(p?.x), y = Number(p?.y);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x > 1 || y > 1) return null;
    pts.push({ x, y });
  }
  return pts;
}

function denorm(quad, w, h) {
  const snap = n => {
    const r = Math.round(n);
    return Math.abs(n - r) < 1e-4 ? r : n;
  };
  return quad.map(p => ({ x: snap(p.x * w), y: snap(p.y * h) }));
}

async function gate(records, ipHash, day, field, by = 1) {
  const cur = await records.getUsage(ipHash, day);
  if ((cur[field] || 0) + by > LIMITS.ip[field]) return false;
  await records.bumpUsage(ipHash, day, field, by);
  return true;
}

async function turnstileOk(env, token, ip, fetchImpl) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip || "" });
  const res = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return !!data.success;
}

async function loadFile(blobs, ns, id, sessionId) {
  if (!/^[0-9a-f]{32}$/.test(id || "")) return null;
  const got = await blobs.getWithMetadata(fileKey(ns, id), { type: "arrayBuffer" });
  if (!got?.data) return null;
  if (sessionId && got.metadata?.sessionId && got.metadata.sessionId !== sessionId) return null;
  return { bytes: Buffer.from(got.data), mime: got.metadata?.contentType || "image/png", kind: got.metadata?.kind || "" };
}

async function saveImage(blobs, ns, id, bytes, metadata) {
  await blobs.set(fileKey(ns, id), bytes, { metadata });
}

async function paintAndStore(deps, { ns, session, prompt, references, photoBytes, variant, kind, parentId }) {
  const started = Date.now();
  let out;
  const spec = { prompt, references, category: session.category, variant, photoBytes };
  try {
    out = deps.imageClient ? { ...(await deps.imageClient(spec)), zone: zoneFor(session.category) } : await generateImage(deps.env, spec);
  } catch (err) {
    console.error("visualizer image", err?.message || err);
    const { placeholderRender } = await import("./images.mjs");
    out = await placeholderRender({ category: session.category, variant, photoBytes });
  }
  if (!out?.bytes?.length) {
    const { placeholderRender } = await import("./images.mjs");
    out = await placeholderRender({ category: session.category, variant, photoBytes });
  }
  let image = await decodeImage(out.bytes);
  image = stampConcept(image);
  const png = Buffer.from(toPng(image));
  const id = deps.makeId();
  await saveImage(deps.blobs, ns, id, png, { contentType: "image/png", sessionId: session.id, kind });
  const row = {
    id,
    sessionId: session.id,
    parentId: parentId || null,
    kind,
    prompt,
    model: out.model || "stub",
    outputKey: id,
    zone: out.zone || zoneFor(session.category),
    quad: null,
    ms: Date.now() - started,
    stub: out.stub == null ? (out.model === "stub" || !out.model) : !!out.stub,
    createdAt: deps.now().toISOString(),
  };
  await deps.records.addRender(row);
  return row;
}

function publicRender(row) {
  const { x, y, w, h } = row.zone || zoneFor("vehicle");
  return {
    id: row.id,
    url: assetPath(row.id),
    kind: row.kind,
    stub: !!row.stub,
    model: row.model,
    zone: { x, y, w, h },
    ms: row.ms,
  };
}

function needRecords(records) {
  if (records) return null;
  return fail(503, "Saving is not available until Netlify Database is provisioned for this site.");
}

/**
 * @param {Request} req
 * @param {object} deps
 */
export async function handleVisualizer(req, deps) {
  const env = deps.env || {};
  const now = deps.now ? deps.now() : new Date();
  const makeId = deps.makeId || newId;
  deps = { ...deps, env, now: deps.now || (() => now), makeId, fetchImpl: deps.fetchImpl || fetch };
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");
  const method = req.method.toUpperCase();
  const ns = `v1/${contextSlug(deps.deployContext)}`;
  const ipHash = hashIp(deps.ip, env.VISUALIZER_IP_SALT);
  const day = dayOf(now);

  if (path === "/api/visualize/config" && method === "GET") {
    return json(200, {
      image: imageBackend(env),
      turnstileSiteKey: env.TURNSTILE_SITE_KEY || "",
      quote: quoteFor("vehicle", env),
      disclaimer: DISCLAIMER,
      storage: deps.records ? "blobs" : "unconfigured",
    });
  }

  const asset = path.match(/^\/api\/visualize\/asset\/([0-9a-f]{32})$/);
  if (asset && method === "GET") {
    const got = await deps.blobs.getWithMetadata(fileKey(ns, asset[1]), { type: "arrayBuffer" });
    if (!got?.data) return fail(404, "Image not found.");
    return new Response(got.data, {
      status: 200,
      headers: {
        "Content-Type": got.metadata?.contentType || "image/png",
        "Cache-Control": "private, max-age=3600",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  if (path === "/api/visualize/admin/login" && method === "POST") {
    const blocked = needRecords(deps.records);
    if (blocked) return blocked;
    if (!env.VISUALIZER_ADMIN_PASSWORD) return fail(503, "The leads list is locked until VISUALIZER_ADMIN_PASSWORD is set.");
    const cur = await deps.records.getUsage(ipHash, day);
    if ((cur.logins || 0) >= LIMITS.ip.login) return fail(429, "Too many sign-in attempts. Try again tomorrow.");
    const body = await readJson(req);
    if (!body || !safeEqual(body.password || "", env.VISUALIZER_ADMIN_PASSWORD)) {
      await deps.records.bumpUsage(ipHash, day, "logins", 1);
      return fail(401, "That password is not right.");
    }
    return json(200, { ok: true }, { "Set-Cookie": cookie(env.VISUALIZER_ADMIN_PASSWORD, url) });
  }

  if (path === "/api/visualize/admin/logout" && method === "POST") {
    return json(200, { ok: true }, { "Set-Cookie": cookie(env.VISUALIZER_ADMIN_PASSWORD || "x", url, true) });
  }

  if (path === "/api/visualize/admin/leads" && method === "GET") {
    const blocked = needRecords(deps.records);
    if (blocked) return blocked;
    if (!hasAdminCookie(req, env.VISUALIZER_ADMIN_PASSWORD)) return fail(401, "Sign in required.");
    const leads = await deps.records.listLeads();
    return json(200, { leads: leads.map(publicLead) });
  }

  const oneLead = path.match(/^\/api\/visualize\/admin\/leads\/([0-9a-f]{32})$/);
  if (oneLead && method === "GET") {
    const blocked = needRecords(deps.records);
    if (blocked) return blocked;
    if (!hasAdminCookie(req, env.VISUALIZER_ADMIN_PASSWORD)) return fail(401, "Sign in required.");
    const lead = await deps.records.getLead(oneLead[1]);
    if (!lead) return fail(404, "Lead not found.");
    return json(200, { lead: publicLead(lead) });
  }

  if (!deps.records && method === "POST") return needRecords(deps.records);

  if (path === "/api/visualize/session" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    if (clean(body.fax, 80)) return json(200, { ok: true, id: "0".repeat(32) });
    if (!CATEGORIES.includes(body.category)) return fail(400, "Pick a vehicle wrap, a storefront sign, or window graphics.");
    const id = makeId();
    const session = {
      id,
      createdAt: now.toISOString(),
      category: body.category,
      business: {},
      subject: {},
      logoKey: null,
      photoKey: null,
      inspoKey: null,
      ipHash,
      deployContext: contextSlug(deps.deployContext),
      rendersUsed: 0,
      editsUsed: 0,
      vehicleShots: 0,
      leadId: null,
    };
    await deps.records.createSession(session);
    await deps.records.addEvent({ id: makeId(), sessionId: id, name: "session", createdAt: now.toISOString(), detail: { category: body.category } });
    return json(201, { id, quote: quoteFor(body.category, env), disclaimer: DISCLAIMER });
  }

  if (path === "/api/visualize/upload" && method === "POST") {
    if (!(await gate(deps.records, ipHash, day, "uploads"))) return fail(429, "Too many uploads from this network today.");
    let form;
    try { form = await req.formData(); } catch { return fail(400, "The upload could not be read."); }
    const session = await deps.records.getSession(clean(form.get("sessionId"), 32));
    if (!session) return fail(404, "Start a new preview.");
    const kind = clean(form.get("kind"), 20);
    if (!["logo", "photo", "inspo"].includes(kind)) return fail(400, "Unknown upload.");
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function") return fail(400, "Choose an image file.");
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > LIMITS.imageBytes) return fail(413, "That image is too large. Use one under 4 MB.");
    const mime = sniff(bytes);
    if (!mime) return fail(415, "Use a PNG, JPEG, or WebP image.");
    const id = makeId();
    await saveImage(deps.blobs, ns, id, bytes, { contentType: mime, sessionId: session.id, kind });
    const patch = kind === "logo" ? { logoKey: id } : kind === "photo" ? { photoKey: id } : { inspoKey: id };
    await deps.records.updateSession(session.id, patch);
    return json(201, { id, url: assetPath(id) });
  }

  if (path === "/api/visualize/scan" && method === "POST") {
    if (!(await gate(deps.records, ipHash, day, "scans"))) return fail(429, "Too many website scans from this network today.");
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    let page;
    try {
      page = await fetchPublic(clean(body.url, 300), { fetchImpl: deps.fetchImpl, resolve: deps.resolve || defaultResolve });
    } catch (err) {
      return fail(err.status || 400, err.message || "That website could not be read.");
    }
    const html = page.body.toString("utf8");
    const found = extractBusiness(html, page.url);
    let source = "html";
    try {
      const raw = await extractWithModel(env, scrapePrompt(pageText(html)));
      const parsed = parseJson(raw);
      if (parsed) {
        source = "html+model";
        if (!found.name && parsed.name) found.name = clean(parsed.name, 120);
        if (!found.phone && parsed.phone) found.phone = clean(parsed.phone, 40);
        if (!found.email && parsed.email) found.email = clean(parsed.email, 160);
        if (!found.tagline && parsed.tagline) found.tagline = clean(parsed.tagline, 180);
        if (Array.isArray(parsed.services) && parsed.services.length) found.services = parsed.services.map(s => clean(s, 80)).filter(Boolean).slice(0, 8);
        if ((!found.brand_colors || !found.brand_colors.length) && Array.isArray(parsed.brand_colors)) found.brand_colors = colorsOf(parsed.brand_colors);
        if (!found.logo_url && parsed.logo_url) found.logo_url = clean(parsed.logo_url, 300);
      }
    } catch (err) {
      console.error("visualizer scan model", err?.message || err);
    }
    let logoId = null;
    if (found.logo_url) {
      try {
        await assertPublicUrl(found.logo_url, deps.resolve || defaultResolve);
        const logo = await fetchPublic(found.logo_url, { fetchImpl: deps.fetchImpl, resolve: deps.resolve || defaultResolve, maxBytes: 1_500_000 });
        const mime = sniff(logo.body);
        if (mime) {
          logoId = makeId();
          await saveImage(deps.blobs, ns, logoId, logo.body, { contentType: mime, sessionId: session.id, kind: "logo" });
          await deps.records.updateSession(session.id, { logoKey: logoId });
        }
      } catch { /* a logo candidate is optional */ }
    }
    const business = {
      name: found.name,
      phone: found.phone,
      email: found.email,
      web: page.url,
      tagline: found.tagline,
      services: Array.isArray(found.services) ? found.services.join(", ") : clean(found.services, 400),
      colors: found.brand_colors || [],
    };
    await deps.records.updateSession(session.id, { business });
    await deps.records.addEvent({ id: makeId(), sessionId: session.id, name: "scan", createdAt: now.toISOString(), detail: { source } });
    return json(200, { business, logoId, logoUrl: logoId ? assetPath(logoId) : "", source });
  }

  if (path === "/api/visualize/vehicle" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    if (session.category !== "vehicle") return fail(400, "This step is for a vehicle.");
    if ((session.vehicleShots || 0) >= LIMITS.vehicleShots) return fail(409, "This preview has already regenerated the vehicle a few times. Edit the year, make, and model, or send a photo.");
    if (tooSoon(session, now)) return fail(400, "Please take a moment and try again.");
    const subject = subjectOf("vehicle", body.subject || {});
    if (subject.error) return fail(400, subject.error);
    if (!(subject.year && subject.make && subject.model)) return fail(400, "Enter a year, make, and model.");
    if (!(await gate(deps.records, ipHash, day, "renders", 1))) return fail(429, "This network has reached today's preview limit. Call Arc and we'll mock it up with you.");
    const prompt = vehiclePrompt(subject);
    const row = await paintAndStore(deps, { ns, session, prompt, references: [], photoBytes: null, variant: 0, kind: "vehicle" });
    await deps.records.updateSession(session.id, {
      subject: { ...subject, photo: true },
      photoKey: row.id,
      vehicleShots: (session.vehicleShots || 0) + 1,
    });
    const label = [subject.year, subject.make, subject.model].filter(Boolean).join(" ");
    return json(200, { render: publicRender(row), label, stub: !!row.stub, disclaimer: DISCLAIMER });
  }

  if (path === "/api/visualize/identify" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    const photo = await optionalFile(deps, ns, body.photoId || session.photoKey, session.id);
    if (!photo) return fail(400, "Upload a photo first.");
    let parsed = null;
    try {
      const raw = await (deps.identify || identifyVehicle)(env, photo.bytes, photo.mime);
      parsed = parseJson(raw);
    } catch (err) {
      console.error("visualizer identify", err?.message || err);
    }
    const year = parsed && /^(19|20)\d{2}$/.test(clean(parsed.year, 4)) ? clean(parsed.year, 4) : "";
    const vehicle = {
      year,
      make: parsed ? clean(parsed.make, 40) : "",
      model: parsed ? clean(parsed.model, 40) : "",
      color: parsed ? clean(parsed.color, 40) : "",
    };
    const named = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ");
    if (named) {
      await deps.records.updateSession(session.id, {
        subject: { ...session.subject, ...vehicle, photo: true, color: vehicle.color || session.subject?.color || "" },
      });
    }
    await deps.records.addEvent({ id: makeId(), sessionId: session.id, name: "identify", createdAt: now.toISOString(), detail: { named: !!named } });
    return json(200, { vehicle: named ? vehicle : { year: "", make: "", model: "", color: "" }, label: named || "your vehicle" });
  }

  if (path === "/api/visualize/render" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    if (session.rendersUsed >= LIMITS.sessionBatches) return fail(409, "This preview already has its concepts. You can request one revision, or start a new one.");
    if (tooSoon(session, now)) return fail(400, "Please take a moment and try again.");
    if (!(await turnstileOk(env, body.turnstileToken, deps.ip, deps.fetchImpl))) return fail(400, "Confirm you are a person, then try again.");
    const business = businessOf(body.business);
    const subject = subjectOf(session.category, { ...body.subject, photo: !!(body.photoId || session.photoKey) });
    if (subject.error) return fail(400, subject.error);
    if (session.category === "vehicle" && !subject.photo && !subject.stock && !(subject.year && subject.make && subject.model)) {
      return fail(400, "Enter a year, make, and model, or upload a photo of the vehicle.");
    }
    if ((session.category === "sign" || session.category === "window") && !subject.photo) {
      return fail(400, "Upload a photo of the storefront.");
    }
    const photo = await optionalFile(deps, ns, body.photoId || session.photoKey, session.id);
    const inspo = await optionalFile(deps, ns, body.inspoId || session.inspoKey, session.id);
    const logo = await optionalFile(deps, ns, body.logoId || session.logoKey, session.id);
    if ((session.category === "sign" || session.category === "window") && !photo) return fail(400, "Upload a photo of the storefront.");
    const count = LIMITS.sessionVariants;
    if (!(await gate(deps.records, ipHash, day, "renders", count))) return fail(429, "This network has reached today's preview limit. Call Arc and we'll mock it up with you.");
    const references = [];
    if (photo) references.push({ bytes: photo.bytes, mime: photo.mime, role: "photo" });
    if (inspo) references.push({ bytes: inspo.bytes, mime: inspo.mime, role: "inspo" });
    await deps.records.updateSession(session.id, {
      business, subject, rendersUsed: (session.rendersUsed || 0) + 1,
      logoKey: logo ? (body.logoId || session.logoKey) : session.logoKey,
      photoKey: photo ? (body.photoId || session.photoKey) : session.photoKey,
    });
    const variants = await Promise.all(Array.from({ length: count }, (_, variant) => (async () => {
      const prompt = renderPrompt({ category: session.category, business, subject: { ...subject, photo: !!photo }, variant });
      const row = await paintAndStore(deps, { ns, session, prompt, references, photoBytes: photo?.bytes, variant, kind: "variant" });
      return publicRender(row);
    })()));
    if (variants.length !== count || variants.some(item => !item?.url)) {
      return fail(502, "The preview did not finish all 3 concepts. Try again.");
    }
    await deps.records.addEvent({ id: makeId(), sessionId: session.id, name: "render", createdAt: now.toISOString(), detail: { models: variants.map(v => v.model), stub: variants.every(v => v.stub), count } });
    return json(200, { variants, count, stub: variants.every(v => v.stub), quote: quoteFor(session.category, env), disclaimer: DISCLAIMER });
  }

  if (path === "/api/visualize/edit" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    if (session.editsUsed >= LIMITS.sessionEdits) return fail(409, "This preview already used its one revision. Send it to Arc, or start a new one.");
    const request = clean(body.request, 400);
    if (request.length < 3) return fail(400, "Say what you want changed.");
    if (!(await gate(deps.records, ipHash, day, "edits"))) return fail(429, "This network has reached today's revision limit.");
    const parent = await deps.records.getRender(clean(body.renderId, 32));
    if (!parent || parent.sessionId !== session.id) return fail(404, "That version was not found.");
    const previous = await loadFile(deps.blobs, ns, parent.outputKey, session.id);
    if (!previous) return fail(404, "That version was not found.");
    const prompt = editPrompt(request);
    const row = await paintAndStore(deps, {
      ns, session, prompt,
      references: [{ bytes: previous.bytes, mime: "image/png", role: "previous" }],
      photoBytes: previous.bytes, variant: 2, kind: "edit", parentId: parent.id,
    });
    await deps.records.updateSession(session.id, { editsUsed: session.editsUsed + 1 });
    await deps.records.addEvent({ id: makeId(), sessionId: session.id, name: "edit", createdAt: now.toISOString(), detail: { model: row.model } });
    return json(200, { render: publicRender(row), disclaimer: DISCLAIMER });
  }

  if (path === "/api/visualize/lead" && method === "POST") {
    const body = await readJson(req);
    if (!body) return fail(400, "Send JSON.");
    if (clean(body.fax, 80)) return json(200, { ok: true });
    const session = await deps.records.getSession(clean(body.sessionId, 32));
    if (!session) return fail(404, "Start a new preview.");
    if (session.leadId) return fail(409, "This preview was already sent.");
    if (tooSoon(session, now)) return fail(400, "Please take a moment and try again.");
    if (!(await turnstileOk(env, body.turnstileToken, deps.ip, deps.fetchImpl))) return fail(400, "Confirm you are a person, then try again.");
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160);
    const timing = TIMING[body.timing] ? body.timing : "";
    if (name.length < 2) return fail(400, "Enter your name.");
    if ((phone.match(/\d/g) || []).length < 7) return fail(400, "Enter a phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Enter an email address.");
    if (!timing) return fail(400, "Choose a timing.");
    const quad = cleanQuad(body.quad);
    if (body.quad && !quad) return fail(400, "Move the logo so it stays on the preview.");
    if (!(await gate(deps.records, ipHash, day, "leads"))) return fail(429, "This network has already sent several requests today. Call Arc and we'll pick it up.");
    const render = await deps.records.getRender(clean(body.renderId, 32));
    if (!render || render.sessionId !== session.id) return fail(400, "Pick one of the previews to send.");
    const baseFile = await loadFile(deps.blobs, ns, render.outputKey, session.id);
    if (!baseFile) return fail(400, "That preview is missing. Generate it again.");
    const quote = quoteFor(session.category, env);
    let compositeKey = render.id;
    const logo = await optionalFile(deps, ns, session.logoKey, session.id);
    if (logo && quad) {
      const base = await decodeImage(baseFile.bytes);
      const mark = await decodeImage(logo.bytes);
      let placed;
      try { placed = compositeLogo(base, mark, denorm(quad, base.width, base.height)); }
      catch { return fail(400, "Move the logo so it stays on the preview."); }
      const png = Buffer.from(toPng(placed));
      compositeKey = makeId();
      await saveImage(deps.blobs, ns, compositeKey, png, { contentType: "image/png", sessionId: session.id, kind: "composite" });
      await deps.records.addRender({
        id: compositeKey, sessionId: session.id, parentId: render.id, kind: "layout", prompt: "logo composite",
        model: "composite", outputKey: compositeKey, zone: render.zone, quad, ms: 0, stub: false, createdAt: now.toISOString(),
      });
    }
    const id = makeId();
    const links = [
      { label: "Preview", url: `${url.origin}${assetPath(render.id)}` },
      { label: "With logo", url: `${url.origin}${assetPath(compositeKey)}` },
    ];
    if (session.logoKey) links.push({ label: "Logo file", url: `${url.origin}${assetPath(session.logoKey)}` });
    if (session.photoKey) links.push({ label: "Original photo", url: `${url.origin}${assetPath(session.photoKey)}` });
    const files = [];
    const composed = compositeKey === render.id ? baseFile : await loadFile(deps.blobs, ns, compositeKey, session.id);
    if (composed) files.push({ filename: "preview.png", bytes: composed.bytes });
    if (logo) files.push({ filename: "logo.png", bytes: logo.bytes });
    const smsTransactional = body.smsTransactional === true;
    const smsPromo = body.smsPromo === true;
    const leadCore = {
      name, phone, email, timing, timingLabel: TIMING[timing], category: session.category,
      business: session.business, subject: session.subject, quote, links, files,
      smsTransactional, smsPromo,
    };
    const mailed = await (deps.sendEmail || sendLeadEmail)(env, leadCore, deps.fetchImpl);
    const lead = {
      id, sessionId: session.id, createdAt: now.toISOString(), name, phone, email, timing,
      category: session.category, renderId: render.id, compositeKey, quoteLabel: quote.label,
      emailStatus: mailed.status, payload: { business: session.business, subject: session.subject, quote, links, model: render.model, stub: render.stub, smsTransactional: body.smsTransactional === true, smsPromo: body.smsPromo === true },
    };
    await deps.records.addLead(lead);
    await deps.records.updateSession(session.id, { leadId: id });
    await deps.records.addEvent({ id: makeId(), sessionId: session.id, name: "lead", createdAt: now.toISOString(), detail: { emailStatus: mailed.status } });
    return json(201, { ok: true, id, url: assetPath(compositeKey), quote, disclaimer: DISCLAIMER });
  }

  return fail(404, "Not found.");
}

function publicLead(lead) {
  return {
    id: lead.id,
    createdAt: lead.createdAt,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    timing: TIMING[lead.timing] || lead.timing,
    category: lead.category,
    quoteLabel: lead.quoteLabel,
    emailStatus: lead.emailStatus,
    renderUrl: lead.renderId ? assetPath(lead.renderId) : "",
    compositeUrl: lead.compositeKey ? assetPath(lead.compositeKey) : "",
    payload: lead.payload || {},
  };
}

async function optionalFile(deps, ns, id, sessionId) {
  if (!id) return null;
  return loadFile(deps.blobs, ns, id, sessionId);
}

function parseJson(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

async function defaultResolve(host) {
  const { lookup } = await import("node:dns/promises");
  return lookup(host, { all: true });
}

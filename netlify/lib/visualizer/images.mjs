// Image helpers: placeholder scenes when no model is configured, plus provider calls.
// A missing key returns a layout placeholder. It does not throw the visitor out of the flow.
import { encodePng, decodePng, isPng } from "./png.mjs";
import { zoneFor } from "./prompts.mjs";

const NAVY = [11, 29, 51, 255];
const GOLD = [212, 168, 67, 255];
const STEEL = [26, 58, 92, 255];

function fill(data, w, x, y, rw, rh, color) {
  const x1 = Math.max(0, x), y1 = Math.max(0, y);
  const x2 = Math.min(w, x + rw), y2 = Math.min(data.length / (w * 4), y + rh);
  for (let yy = y1; yy < y2; yy++) {
    for (let xx = x1; xx < x2; xx++) {
      const i = (yy * w + xx) * 4;
      data[i] = color[0]; data[i + 1] = color[1]; data[i + 2] = color[2]; data[i + 3] = color[3];
    }
  }
}

function strokeZone(image, zone) {
  const x = Math.round(zone.x * image.width);
  const y = Math.round(zone.y * image.height);
  const w = Math.round(zone.w * image.width);
  const h = Math.round(zone.h * image.height);
  for (let i = 0; i < w; i += 6) {
    fill(image.data, image.width, x + i, y, 3, 2, GOLD);
    fill(image.data, image.width, x + i, y + h - 2, 3, 2, GOLD);
  }
  for (let i = 0; i < h; i += 6) {
    fill(image.data, image.width, x, y + i, 2, 3, GOLD);
    fill(image.data, image.width, x + w - 2, y + i, 2, 3, GOLD);
  }
}

export function blankScene(category, variant) {
  const width = 160, height = 100;
  const data = new Uint8ClampedArray(width * height * 4);
  fill(data, width, 0, 0, width, height, NAVY);
  fill(data, width, 0, 0, width, 8, variant === 0 ? GOLD : STEEL);
  const image = { width, height, data };
  strokeZone(image, zoneFor(category));
  return image;
}

export async function decodeImage(bytes) {
  const buf = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  if (isPng(buf)) {
    try { return decodePng(buf); } catch { /* sharp below */ }
  }
  const { default: sharp } = await import("sharp");
  let pipeline = sharp(buf).rotate().ensureAlpha();
  const meta = await pipeline.metadata();
  const side = Math.max(meta.width || 0, meta.height || 0);
  if (side > 1600) pipeline = sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside" }).ensureAlpha();
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const copy = new Uint8ClampedArray(data.length);
  copy.set(data);
  return { width: info.width, height: info.height, data: copy };
}

export function toPng(image) {
  return encodePng(image.width, image.height, image.data);
}

export async function placeholderRender({ category, variant, photoBytes }) {
  let image;
  if (photoBytes) {
    try {
      const photo = await decodeImage(photoBytes);
      image = { width: photo.width, height: photo.height, data: new Uint8ClampedArray(photo.data) };
      fill(image.data, image.width, 0, 0, image.width, Math.max(6, Math.round(image.height * 0.04)), variant === 0 ? GOLD : STEEL);
      strokeZone(image, zoneFor(category));
    } catch {
      image = blankScene(category, variant);
    }
  } else image = blankScene(category, variant);
  return { bytes: Buffer.from(toPng(image)), model: "stub", stub: true, zone: zoneFor(category) };
}

export const XAI_IMAGE_MODEL = "grok-imagine-image-2.0";

function geminiReady(env) {
  return !!(env.GEMINI_API_KEY || env.GOOGLE_GEMINI_BASE_URL);
}

function xaiReady(env) {
  return !!env.XAI_API_KEY;
}

function openaiDirect(env) {
  if (!env.OPENAI_API_KEY) return false;
  const base = env.OPENAI_BASE_URL || "";
  if (base.includes("netlify")) return false;
  return true;
}

/** Preferred order: xAI, then Gemini, then direct OpenAI, then the layout placeholder. */
export function imageChain(env) {
  const force = env.ARC_IMAGE_PROVIDER || "auto";
  const known = {
    xai: xaiReady(env),
    gemini: geminiReady(env),
    openai: !!env.OPENAI_API_KEY && (force === "openai" || openaiDirect(env)),
  };
  if (force === "stub") return ["stub"];
  if (force !== "auto") return known[force] ? [force, "stub"] : ["stub"];
  const chain = ["xai", "gemini", "openai"].filter(name => known[name]);
  chain.push("stub");
  return chain;
}

export function imageBackend(env) {
  return imageChain(env).find(name => name !== "stub") || "stub";
}

function dataUri(ref) {
  const mime = ref.mime || "image/png";
  return `data:${mime};base64,${Buffer.from(ref.bytes).toString("base64")}`;
}

/**
 * Build the xAI Imagine request. A photo, inspiration image, or previous render
 * goes to /images/edits. The logo is never included. With no picture, this is
 * a text generation.
 */
export function xaiImagePlan(env, { prompt, references = [] }) {
  const model = env.ARC_XAI_IMAGE_MODEL || XAI_IMAGE_MODEL;
  const base = (env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, "");
  const resolution = env.ARC_XAI_IMAGE_RESOLUTION === "2k" ? "2k" : "1k";
  const pictures = references.filter(ref => ref && ref.role !== "logo" && ref.bytes).slice(0, 3);
  if (!pictures.length) {
    return {
      url: `${base}/images/generations`,
      body: { model, prompt, response_format: "b64_json", aspect_ratio: "3:2", resolution, n: 1 },
    };
  }
  const images = pictures.map(ref => ({ type: "image_url", url: dataUri(ref) }));
  const body = { model, prompt, response_format: "b64_json", resolution };
  if (images.length === 1) body.image = images[0];
  else body.images = images;
  return { url: `${base}/images/edits`, body };
}

async function readXaiImage(res, fetchImpl) {
  if (!res.ok) throw new Error(`xai image ${res.status}`);
  const json = await res.json();
  const first = json.data?.[0];
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");
  if (first?.url) {
    const file = await fetchImpl(first.url);
    if (!file.ok) throw new Error(`xai image download ${file.status}`);
    return Buffer.from(await file.arrayBuffer());
  }
  throw new Error("xai image empty");
}

async function xaiImage(env, spec, fetchImpl) {
  const plan = xaiImagePlan(env, spec);
  const res = await fetchImpl(plan.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.XAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(plan.body),
    signal: AbortSignal.timeout(50000),
  });
  return { bytes: await readXaiImage(res, fetchImpl), model: plan.body.model, stub: false };
}

async function geminiImage(env, { prompt, references }) {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({});
  const model = env.ARC_GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
  const parts = [{ text: prompt }, ...references.map(ref => ({
    inlineData: { mimeType: ref.mime || "image/png", data: Buffer.from(ref.bytes).toString("base64") },
  }))];
  const response = await ai.models.generateContent({ model, contents: parts });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
  if (!part) throw new Error("image model returned no image");
  return { bytes: Buffer.from(part.inlineData.data, "base64"), model, stub: false };
}

async function openaiImage(env, { prompt, references }) {
  const base = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = env.ARC_OPENAI_IMAGE_MODEL || "gpt-image-1";
  const size = "1536x1024";
  let res;
  if (references[0]) {
    const form = new FormData();
    form.set("model", model);
    form.set("prompt", prompt);
    form.set("size", size);
    form.set("image", new Blob([references[0].bytes], { type: references[0].mime || "image/png" }), "photo.png");
    res = await fetch(`${base}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: form, signal: AbortSignal.timeout(45000) });
  } else {
    res = await fetch(`${base}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, size }),
      signal: AbortSignal.timeout(45000),
    });
  }
  if (!res.ok) throw new Error(`openai image ${res.status}`);
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("openai image empty");
  return { bytes: Buffer.from(b64, "base64"), model, stub: false };
}

export async function generateImage(env, spec, fetchImpl = fetch) {
  const { prompt, references = [], category, variant, photoBytes } = spec;
  const pictures = references.filter(ref => ref?.role !== "logo");
  const zone = zoneFor(category);
  for (const backend of imageChain(env)) {
    if (backend === "stub") break;
    try {
      const out = backend === "xai"
        ? await xaiImage(env, { prompt, references: pictures }, fetchImpl)
        : backend === "gemini"
          ? await geminiImage(env, { prompt, references: pictures })
          : await openaiImage(env, { prompt, references: pictures });
      return { ...out, zone };
    } catch (err) {
      console.error("visualizer image", backend, err?.message || err);
    }
  }
  return placeholderRender({ category, variant, photoBytes });
}

export async function extractWithModel(env, prompt) {
  if (env.GEMINI_API_KEY || env.GOOGLE_GEMINI_BASE_URL) {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({ model: env.ARC_GEMINI_TEXT_MODEL || "gemini-2.5-flash", contents: prompt });
    return response.text || "";
  }
  if (env.OPENAI_API_KEY) {
    const base = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`openai text ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content || "";
  }
  return "";
}

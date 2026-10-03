/**
 * Phone approval proofs.
 *
 * Each proof is one package: three image files plus a JSON sheet
 * (placement, placeholder price, comments, approval time). Images belong
 * in Netlify Blobs. The sheet is stored beside them because this site has
 * no database and nothing here is queried across proofs. A client opens
 * one unguessable link.
 *
 * Deploy previews and production share the site blob store. Creating a
 * test link on a preview writes a real object in the sign-proofs store. It does
 * not change the production site code.
 */
import { getStore } from "@netlify/blobs";
import {
  ARC_PRICING_PLACEHOLDERS,
  illuminationLabel,
  preliminaryPrice,
  signTypeLabel,
} from "../../tools/sign-mockup/pricing-config.js";

const STORE_NAME = "sign-proofs";
const MAX_IMAGE_BYTES = 2_500_000;
const MAX_COMMENTS = 40;

export default async (req, context) => {
  if (!sameOrigin(req)) return json({ error: "Forbidden." }, 403);
  const id = cleanId(context.params?.id);
  const action = context.params?.action || "";
  try {
    if (req.method === "POST" && !id) return createProof(req);
    if (!id) return json({ error: "Missing proof." }, 404);
    if (req.method === "GET" && !action) return readProof(id);
    if (req.method === "GET" && ["day", "night", "artwork"].includes(action)) return readImage(id, action);
    if (req.method === "POST" && action === "comment") return addComment(id, req);
    if (req.method === "POST" && action === "approve") return approveProof(id, req);
    return json({ error: "Not found." }, 404);
  } catch (err) {
    console.error("sign-proof", err);
    return json({ error: "The proof could not be saved. Try again." }, 500);
  }
};

export const config = {
  path: ["/api/sign-proof", "/api/sign-proof/:id", "/api/sign-proof/:id/:action"],
};

function blobs() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function sameOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function cleanId(value) {
  if (!value || !/^[a-f0-9]{32}$/.test(value)) return "";
  return value;
}

function cleanText(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function newId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function decodeImage(dataUrl) {
  const match = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=\s]+)$/.exec(String(dataUrl || ""));
  if (!match) return null;
  const buf = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!buf.length || buf.length > MAX_IMAGE_BYTES) return null;
  return { contentType: match[1] === "png" ? "image/png" : "image/jpeg", buf };
}

async function createProof(req) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Missing proof." }, 400);
  if (cleanText(body.company, 80)) return json({ id: newId(), path: "/tools/sign-mockup/" });

  const signType = body.signType;
  const illumination = body.illumination;
  if (!signTypeLabel(signType) || !illuminationLabel(illumination)) {
    return json({ error: "Choose a sign type and a light mode." }, 400);
  }
  const day = decodeImage(body.dayJpeg);
  const night = decodeImage(body.nightJpeg);
  const artwork = decodeImage(body.artwork);
  if (!day || !night || !artwork) {
    return json({ error: "The proof images were missing or too large." }, 413);
  }

  const calibrated = !!body.calibrated;
  const widthIn = calibrated ? Number(body.widthIn) : null;
  const heightIn = calibrated ? Number(body.heightIn) : null;
  const widthOk = Number.isFinite(widthIn) && widthIn > 0 && widthIn < 2000;
  const heightOk = Number.isFinite(heightIn) && heightIn > 0 && heightIn < 2000;
  const price = widthOk ? preliminaryPrice(signType, widthIn, illumination) : null;
  const neonColor = /^#[0-9a-fA-F]{6}$/.test(body.neonColor || "") ? body.neonColor : "#ff3b30";
  const id = newId();
  const meta = {
    id,
    createdAt: new Date().toISOString(),
    projectName: cleanText(body.projectName, 120),
    signType,
    signTypeLabel: signTypeLabel(signType),
    illumination,
    illuminationLabel: illuminationLabel(illumination),
    neonColor,
    widthIn: widthOk ? widthIn : null,
    heightIn: heightOk ? heightIn : null,
    calibrated: widthOk,
    price,
    disclaimer: ARC_PRICING_PLACEHOLDERS.disclaimer,
    artworkType: artwork.contentType,
    comments: [],
    approval: null,
  };

  const store = blobs();
  await store.set(`${id}/day`, day.buf, { metadata: { contentType: day.contentType } });
  await store.set(`${id}/night`, night.buf, { metadata: { contentType: night.contentType } });
  await store.set(`${id}/artwork`, artwork.buf, { metadata: { contentType: artwork.contentType } });
  await store.setJSON(`${id}/meta`, meta);
  return json({ id, path: `/tools/sign-mockup/proof/?id=${id}` });
}

function publicMeta(meta) {
  return {
    ...meta,
    images: {
      day: `/api/sign-proof/${meta.id}/day`,
      night: `/api/sign-proof/${meta.id}/night`,
      artwork: `/api/sign-proof/${meta.id}/artwork`,
    },
  };
}

async function readProof(id) {
  const meta = await blobs().get(`${id}/meta`, { type: "json" });
  if (!meta) return json({ error: "This proof link was not found." }, 404);
  return json(publicMeta(meta));
}

async function readImage(id, name) {
  const result = await blobs().getWithMetadata(`${id}/${name}`, { type: "arrayBuffer" });
  if (!result) return json({ error: "This proof link was not found." }, 404);
  return new Response(result.data, {
    headers: {
      "content-type": result.metadata?.contentType || "image/jpeg",
      "cache-control": "private, max-age=300",
    },
  });
}

async function addComment(id, req) {
  const body = await req.json().catch(() => null);
  if (!body || cleanText(body.company, 80)) return json({ error: "Could not save that comment." }, 400);
  const text = cleanText(body.text, 800);
  if (!text) return json({ error: "Write a comment first." }, 400);
  const store = blobs();
  const meta = await store.get(`${id}/meta`, { type: "json" });
  if (!meta) return json({ error: "This proof link was not found." }, 404);
  if (meta.comments.length >= MAX_COMMENTS) return json({ error: "This proof has too many comments." }, 400);
  meta.comments.push({
    id: newId(),
    name: cleanText(body.name, 80) || "Client",
    text,
    at: new Date().toISOString(),
  });
  await store.setJSON(`${id}/meta`, meta);
  return json(publicMeta(meta));
}

async function approveProof(id, req) {
  const body = await req.json().catch(() => null);
  if (!body || cleanText(body.company, 80)) return json({ error: "Could not record approval." }, 400);
  const name = cleanText(body.name, 80);
  if (!name) return json({ error: "Enter your name to approve." }, 400);
  const store = blobs();
  const meta = await store.get(`${id}/meta`, { type: "json" });
  if (!meta) return json({ error: "This proof link was not found." }, 404);
  if (!meta.approval) {
    meta.approval = { name, at: new Date().toISOString() };
    await store.setJSON(`${id}/meta`, meta);
  }
  return json(publicMeta(meta));
}

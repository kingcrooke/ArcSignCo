// Generates the three concepts after the visitor's request has already returned.
// A background function can run for 15 minutes, so one slow image does not end the whole set with a 504.
// It also stops when this handler returns, so runRenderJob awaits the concept email
// (20s cap) instead of leaving that send as a floating promise.
import { getStore } from "@netlify/blobs";
import { BLOB_STORE, ENV_KEYS, contextSlug, runRenderJob } from "../lib/visualizer/handle.mjs";
import { blobRecords } from "../lib/visualizer/records.mjs";

function envGet(name) {
  try {
    if (typeof Netlify !== "undefined" && Netlify.env) {
      const value = Netlify.env.get(name);
      if (value) return value;
    }
  } catch { /* running outside Netlify */ }
  return process.env[name] || "";
}

export default async (req, context) => {
  let body = null;
  try { body = await req.json(); } catch { body = null; }
  const jobId = String(body?.jobId || "");
  if (!/^[0-9a-f]{32}$/.test(jobId)) return new Response("missing", { status: 400 });
  const ns = /^v1\/[a-z0-9-]{1,32}$/.test(body?.ns || "") ? body.ns : `v1/${contextSlug(context.deploy?.context)}`;
  const env = Object.fromEntries(ENV_KEYS.map(key => [key, envGet(key)]));
  const blobs = getStore({ name: BLOB_STORE, consistency: "strong" });
  const records = blobRecords(blobs, ns);
  await runRenderJob({
    blobs,
    records,
    env,
    deployContext: context.deploy?.context,
    ip: context.ip,
    siteUrl: envGet("DEPLOY_PRIME_URL") || context.site?.url || "",
    now: () => new Date(),
    // Tracks the same bounded send runRenderJob already awaits. waitUntil alone
    // cannot keep a background function alive after this handler returns.
    waitUntil: typeof context.waitUntil === "function" ? (promise) => context.waitUntil(promise) : undefined,
  }, jobId);
  return new Response("ok");
};

export const config = {
  includedFiles: ["visualize/img/templates/*.jpg"],
};

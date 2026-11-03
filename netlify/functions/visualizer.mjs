// Arc Visualizer API. Images and lead records both live in one Netlify Blobs store.
// This account cannot provision Netlify Database, so records are JSON in Blobs.
import { getStore } from "@netlify/blobs";
import { BLOB_STORE, ENV_KEYS, contextSlug, handleVisualizer } from "../lib/visualizer/handle.mjs";
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
  const env = Object.fromEntries(ENV_KEYS.map(key => [key, envGet(key)]));
  const blobs = getStore({ name: BLOB_STORE, consistency: "strong" });
  const records = blobRecords(blobs, `v1/${contextSlug(context.deploy?.context)}`);
  try {
    return await handleVisualizer(req, {
      blobs,
      records,
      env,
      deployContext: context.deploy?.context,
      ip: context.ip,
    });
  } catch (err) {
    console.error("visualizer", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
};

export const config = {
  path: [
    "/api/visualize/config",
    "/api/visualize/session",
    "/api/visualize/scan",
    "/api/visualize/upload",
    "/api/visualize/render",
    "/api/visualize/edit",
    "/api/visualize/lead",
    "/api/visualize/asset/:id",
  ],
  method: ["GET", "POST"],
  rateLimit: { windowLimit: 40, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

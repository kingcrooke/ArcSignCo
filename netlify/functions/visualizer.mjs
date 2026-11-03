// Arc Visualizer API. Records go to Netlify Database. Image files go to Netlify Blobs.
import { getStore } from "@netlify/blobs";
import { BLOB_STORE, ENV_KEYS, handleVisualizer } from "../lib/visualizer/handle.mjs";

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
  if (env.NETLIFY_DB_URL && !process.env.NETLIFY_DB_URL) process.env.NETLIFY_DB_URL = env.NETLIFY_DB_URL;
  const blobs = getStore({ name: BLOB_STORE, consistency: "strong" });
  let records = null;
  if (env.NETLIFY_DB_URL) {
    try {
      const { drizzleRecords } = await import("../lib/visualizer/db-records.mjs");
      records = drizzleRecords();
    } catch (err) {
      console.error("visualizer database", err?.message || err);
    }
  }
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
    "/api/visualize/admin/login",
    "/api/visualize/admin/logout",
    "/api/visualize/admin/leads",
    "/api/visualize/admin/leads/:id",
  ],
  method: ["GET", "POST"],
  rateLimit: { windowLimit: 40, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

import { env } from "./env.mjs";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

/** Compare secrets in constant time-ish manner for ops password and webhook secret. */
export function safeEqual(a, b) {
  const x = String(a ?? "");
  const y = String(b ?? "");
  if (x.length !== y.length) return false;
  let out = 0;
  for (let i = 0; i < x.length; i += 1) out |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return out === 0;
}

export function verifyOpsAuth(req) {
  const expected = env("QUOTE_ENGINE_PASSWORD");
  if (!expected) return { ok: false, reason: "password_not_configured" };
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Bearer ")) return { ok: safeEqual(header.slice(7), expected), reason: "bearer" };
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const pass = decoded.includes(":") ? decoded.split(":").slice(1).join(":") : decoded;
      return { ok: safeEqual(pass, expected), reason: "basic" };
    } catch {
      return { ok: false, reason: "basic" };
    }
  }
  const q = new URL(req.url).searchParams.get("token");
  if (q) return { ok: safeEqual(q, expected), reason: "query" };
  return { ok: false, reason: "missing" };
}

export function verifyWebhook(req) {
  const secret = env("QUOTE_ENGINE_WEBHOOK_SECRET");
  if (!secret) return true;
  return safeEqual(req.headers.get("x-quote-engine-secret"), secret);
}

export const ROBOTS = { "X-Robots-Tag": "noindex, nofollow" };

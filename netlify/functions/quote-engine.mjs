import { handleQuoteEngine } from "../lib/quote-engine-api.mjs";

export default async (req, context) => {
  try {
    return await handleQuoteEngine(req, context);
  } catch (err) {
    console.error("quote-engine", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
};

/** Paths must be string literals here: Netlify registers routes from static analysis of this file. */
export const config = {
  path: [
    "/api/quote-engine/webhook",
    "/api/quote-engine/leads",
    "/api/quote-engine/leads/:id",
    "/api/quote-engine/calculate",
    "/api/quote-engine/rate-card",
    "/api/quote-engine/proposal/:id",
    "/api/quote-engine/health",
  ],
  method: ["GET", "POST", "PATCH"],
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

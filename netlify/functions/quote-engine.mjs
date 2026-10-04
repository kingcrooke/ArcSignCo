import { handleQuoteEngine, QUOTE_ENGINE_PATHS } from "../lib/quote-engine-api.mjs";

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

export const config = {
  path: QUOTE_ENGINE_PATHS,
  method: ["GET", "POST", "PATCH"],
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

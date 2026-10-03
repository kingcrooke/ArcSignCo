// Netlify Function for sign mockup approval links. The logic lives in ../lib/sign-proofs.mjs.
//   POST /api/sign-proofs                 create (multipart: sheet JSON + day/night/art JPEGs)
//   GET  /api/sign-proofs/:id             proof sheet
//   GET  /api/sign-proofs/:id/day|night|art
//   POST /api/sign-proofs/:id/comments    { name, text }
//   POST /api/sign-proofs/:id/approve     { name }  (timestamp is set here, not by the client)
import { getStore } from "@netlify/blobs";
import { handleSignProofs, STORE_NAME } from "../lib/sign-proofs.mjs";

export default async (req, context) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  try {
    return await handleSignProofs(req, { store, params: context.params, deployContext: context.deploy?.context });
  } catch (err) {
    console.error("sign-proofs", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
};

export const config = {
  path: ["/api/sign-proofs", "/api/sign-proofs/:id", "/api/sign-proofs/:id/:action"],
  method: ["GET", "POST"],
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

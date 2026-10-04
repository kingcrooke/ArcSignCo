import { getStore } from "@netlify/blobs";
import { PLACEHOLDER_RATE_CARD } from "./rate-card-placeholder.mjs";

export const RATE_CARD_STORE = "arc-quote-engine-rate-card";
const RATE_CARD_KEY = "rate-card/current.json";

export function rateCardStore() {
  return getStore({ name: RATE_CARD_STORE, consistency: "strong" });
}

export async function loadRateCard() {
  try {
    if (!process.env.NETLIFY && !process.env.NETLIFY_BLOBS_CONTEXT && !process.env.NETLIFY_SITE_ID) {
      return { card: PLACEHOLDER_RATE_CARD, source: "placeholder" };
    }
    const store = rateCardStore();
    const data = await store.get(RATE_CARD_KEY, { type: "json" });
    if (data?.meta?.version) return { card: data, source: "blob" };
  } catch (err) {
    if (err?.name !== "MissingBlobsEnvironmentError") console.error("rate-card load", err);
  }
  return { card: PLACEHOLDER_RATE_CARD, source: "placeholder" };
}

export async function saveRateCard(card) {
  if (!process.env.NETLIFY && !process.env.NETLIFY_BLOBS_CONTEXT && !process.env.NETLIFY_SITE_ID) {
    throw new Error("MissingBlobsEnvironmentError");
  }
  const store = rateCardStore();
  await store.setJSON(RATE_CARD_KEY, { ...card, importedAt: new Date().toISOString() });
}

export async function rateCardStatus() {
  const { card, source } = await loadRateCard();
  return {
    source,
    version: card.meta?.version,
    name: card.meta?.name,
    signTypeCount: card.sign_types?.length ?? 0,
    placeholder: source === "placeholder",
  };
}

/** In-memory card for unit tests (never persisted). */
let testCardOverride = null;
export function setTestRateCard(card) {
  testCardOverride = card;
}
export function clearTestRateCard() {
  testCardOverride = null;
}
export async function loadRateCardForCompute() {
  if (testCardOverride) return { card: testCardOverride, source: "test" };
  return loadRateCard();
}

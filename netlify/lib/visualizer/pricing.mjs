// Estimates stay off unless ARC_VISUALIZER_ESTIMATES=1, and even then there is no rate table.
// Do not put dollar amounts in this file. Jesus adds rates later; until then the only label is
// "Custom quote", the same idea as the sign mockup while its placeholder flag is on.
import { NO_PRICE_MESSAGE } from "../../../tools/sign-mockup/js/pricing-config.js";

export const QUOTE_LABEL = "Custom quote";

/** Empty on purpose. A category with no rate object cannot produce a number. */
export const VISUALIZER_RATES = {
  vehicle: null,
  sign: null,
  window: null,
};

export function quoteFor(category, env = {}) {
  const enabled = env.ARC_VISUALIZER_ESTIMATES === "1";
  const rate = VISUALIZER_RATES[category] || null;
  const hasRange = !!(rate && rate.low > 0 && rate.high > rate.low);
  if (!enabled || !hasRange) {
    return { enabled, label: QUOTE_LABEL, message: NO_PRICE_MESSAGE };
  }
  return {
    enabled,
    label: "Ballpark",
    message: "Final quote after a site survey.",
    low: rate.low,
    high: rate.high,
  };
}

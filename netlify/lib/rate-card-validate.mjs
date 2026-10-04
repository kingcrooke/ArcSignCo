/** Structural validation for imported rate cards. Does not inspect dollar amounts. */

const REQUIRED_ROOT = ["meta", "sign_types", "pricing_rule", "markup", "range_output"];

export function validateRateCard(data) {
  if (!data || typeof data !== "object") return { ok: false, error: "Rate card must be a JSON object." };
  for (const key of REQUIRED_ROOT) {
    if (!(key in data)) return { ok: false, error: `Missing required key: ${key}` };
  }
  if (!data.meta?.version) return { ok: false, error: "meta.version is required." };
  if (!Array.isArray(data.sign_types) || data.sign_types.length < 1) {
    return { ok: false, error: "sign_types must be a non-empty array." };
  }
  for (const row of data.sign_types) {
    if (!row.id || !row.label) return { ok: false, error: "Each sign_types row needs id and label." };
  }
  if (!data.markup?.rounding) return { ok: false, error: "markup.rounding is required." };
  return { ok: true };
}

/** Resolve which partner allowances are included in a quote (explicit checkboxes or PM defaults). */

const PERMIT_LINE_IDS = new Set([
  "filing_expediting",
  "drawings_with_stamp",
  "licensed_sign_hanger",
  "lpc",
]);

const INPUT_KEY = {
  filing_expediting: "allowFilingExpediting",
  drawings_with_stamp: "allowDrawingsStamp",
  licensed_sign_hanger: "allowSignHanger",
  lpc: "allowLpc",
};

function sizeSqFt(input) {
  if (!(input.sizeW > 0)) return 0;
  const mult = input.sizeUnit === "in" ? 1 : 12;
  const w = input.sizeW * mult;
  const h = (input.sizeH > 0 ? input.sizeH : input.sizeW * 0.2) * mult;
  return (w * h) / 144;
}

function triggerActive(triggerId, input) {
  const lit = input.lit === "Lit";
  const litMaybe = input.lit === "Not sure";
  switch (triggerId) {
    case "illuminated":
      return lit || litMaybe;
    case "over_6_sq_ft":
      return sizeSqFt(input) > 6;
    case "landmark_district":
      return Boolean(input.landmarkDistrict || input.landmarkRequested);
    case "projecting":
      return /blade|projecting/i.test(String(input.signType || input.projectType || ""));
    default:
      return false;
  }
}

function lineDefaultFromCard(pl, input) {
  if (pl.default_on === true) return true;
  if (pl.default_off === true) return false;
  const when = pl.default_when_triggers || pl.include_when_triggers;
  if (Array.isArray(when) && when.length) {
    return when.some(t => triggerActive(t, input));
  }
  if (Array.isArray(pl.trigger_ids) && pl.trigger_ids.length) {
    return pl.trigger_ids.some(t => triggerActive(t, input));
  }
  if (pl.id === "filing_expediting") return Boolean(input.permitsRequested);
  return false;
}

function explicitAllowance(input, lineId) {
  const key = INPUT_KEY[lineId];
  if (key && input[key] !== undefined) return Boolean(input[key]);
  const snake = `allow_${lineId}`;
  if (input[snake] !== undefined) return Boolean(input[snake]);
  return undefined;
}

export function resolveAllowances(input, card) {
  const permitsLikely = Boolean(input.permitsRequested);
  const lit = input.lit === "Lit";

  let electrical = input.allowElectrical;
  if (electrical === undefined) electrical = permitsLikely || lit;

  const permitLineIds = [];
  for (const pl of card?.permits?.lines || []) {
    if (pl.price_role === "city_pass_through_at_cost") continue;
    if (pl.low == null) continue;
    if (!PERMIT_LINE_IDS.has(pl.id)) continue;
    const explicit = explicitAllowance(input, pl.id);
    const on = explicit !== undefined ? explicit : lineDefaultFromCard(pl, input);
    if (on) permitLineIds.push(pl.id);
  }

  return {
    allowElectrical: Boolean(electrical),
    permitLineIds: new Set(permitLineIds),
  };
}

export const ALLOWANCE_FIELDS = [
  { id: "filing_expediting", inputKey: "allowFilingExpediting", label: "DOB sign permit — filing & expediting" },
  { id: "drawings_with_stamp", inputKey: "allowDrawingsStamp", label: "Drawings with PE/RA stamp" },
  { id: "licensed_sign_hanger", inputKey: "allowSignHanger", label: "Licensed Sign Hanger allowance" },
  { id: "lpc", inputKey: "allowLpc", label: "LPC / landmarks allowance" },
  { id: "electrical", inputKey: "allowElectrical", label: "Licensed electrician allowance" },
];

/** Defaults for calculator UI (checkboxes) before Jesus toggles them. */
export function allowanceCheckboxDefaults(input, card) {
  const resolved = resolveAllowances(
    {
      ...input,
      allowFilingExpediting: undefined,
      allowDrawingsStamp: undefined,
      allowSignHanger: undefined,
      allowLpc: undefined,
      allowElectrical: undefined,
    },
    card,
  );
  return {
    allowFilingExpediting: resolved.permitLineIds.has("filing_expediting"),
    allowDrawingsStamp: resolved.permitLineIds.has("drawings_with_stamp"),
    allowSignHanger: resolved.permitLineIds.has("licensed_sign_hanger"),
    allowLpc: resolved.permitLineIds.has("lpc"),
    allowElectrical: resolved.allowElectrical,
  };
}

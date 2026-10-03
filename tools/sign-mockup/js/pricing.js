// Preliminary estimate from the calibrated size and the type. Every number lives in
// pricing-config.js; a category module only maps each type id to a row there (pricing.row).
// While PLACEHOLDER is true, estimatePrice() and priceView() carry no dollar amounts at all.
import {
  PLACEHOLDER, RATES_VERSION, RATES_LABEL, NO_PRICE_MESSAGE, DISCLAIMER_FULL, TAX_NOTE, VALID_DAYS, validNote,
  ROUNDING, RANGE, ROWS, ADDERS, EXTRAS,
} from "./pricing-config.js";
import { getType, isKnownType, categoryOf, lightingOf } from "./catalog.js";

const STEP = ROUNDING.step;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;
const UNITS = { letters: "sq ft of letters", sqft: "sq ft", lf: "linear ft", projecting: "linear ft of width" };

/** The config row a type is priced from, as { id, ...row }, or null. */
export function rowFor(typeId) {
  if (!isKnownType(typeId)) return null;
  const type = getType(typeId);
  const id = categoryOf(type).pricing?.row?.[type.id];
  return id && ROWS[id] ? { id, ...ROWS[id] } : null;
}

/**
 * The full estimate with numbers, whatever PLACEHOLDER says (tests and Arc's own checks use it;
 * nothing client-facing shows it while PLACEHOLDER is true).
 * @param {string} typeId
 * @param {{width: number, height: number}} sizeIn  calibrated size in inches
 * @param {object} [opts]  the type's options (lighting and, for awnings, projection come from them)
 */
export function computeEstimate(typeId, sizeIn, opts = null) {
  const w = Number(sizeIn?.width), h = Number(sizeIn?.height);
  if (!(w > 0) || !(h > 0)) return null;
  const row = rowFor(typeId);
  if (!row) return null;
  const type = getType(typeId);
  const inputs = categoryOf(type).priceInputs(type, opts, { width: w, height: h });
  const widthFt = inputs.width / 12, areaFt = (inputs.width * inputs.height) / 144;
  const projFt = (inputs.projection || 0) / 12;
  const quantity = row.unit === "lf" || row.unit === "projecting" ? widthFt : areaFt;

  const sized = row.base + row.rate * quantity + (row.unit === "projecting" ? (row.projRate || 0) * widthFt * projFt : 0);
  const minimum = ceilTo(row.min);
  const minApplied = sized < minimum;
  const lighting = lightingOf(type, opts);
  const adders = Object.entries(ADDERS)
    .filter(([key, a]) => (row.adders || []).includes(key) || (a.lighting || []).includes(lighting))
    .map(([key, a]) => ({ key, label: a.label, amount: a.base + a.rate * (a.per === "lf" ? widthFt : areaFt) }));
  const total = Math.max(sized, minimum) + adders.reduce((s, a) => s + a.amount, 0);

  const low = Math.max(minimum, floorTo(total));
  const high = Math.max(low + STEP, ceilTo(low * RANGE.spread));
  return {
    low,
    high,
    row: row.id,
    rowLabel: row.label,
    unit: UNITS[row.unit],
    quantity: Math.round(quantity * 10) / 10,
    projection: row.unit === "projecting" ? Math.round(projFt * 10) / 10 : undefined,
    minimum,
    minApplied,
    lighting,
    adders: adders.map(a => ({ ...a, amount: Math.round(a.amount) })),
    extras: EXTRAS.map(e => ({ ...e })),
    perFoot: row.unit === "projecting" || row.unit === "lf" ? [Math.round(low / widthFt), Math.round(high / widthFt)] : undefined,
    version: RATES_VERSION,
  };
}

/**
 * What the server stores and the editor shows. While PLACEHOLDER is true: no numbers, only
 * { withheld: true, message, disclaimer }.
 */
export function estimatePrice(typeId, sizeIn, opts = null) {
  const est = computeEstimate(typeId, sizeIn, opts);
  if (!est) return null;
  const common = { label: RATES_LABEL, disclaimer: DISCLAIMER_FULL, version: RATES_VERSION, placeholder: PLACEHOLDER };
  if (PLACEHOLDER) return { withheld: true, message: NO_PRICE_MESSAGE, ...common };
  return { ...est, ...common, tax: TAX_NOTE, validDays: VALID_DAYS };
}

/** True once Arc's real rates are in and PLACEHOLDER is off: only then do numbers show anywhere. */
export const PRICES_LIVE = !PLACEHOLDER;

export const formatMoney = v => `$${Math.round(v).toLocaleString("en-US")}`;
export const formatRange = p => (p ? `${formatMoney(p.low)} – ${formatMoney(p.high)}` : "");

/**
 * The text every surface shows for a stored or fresh estimate: the editor, the proof page and
 * the PDF. Numbers only when real rates are on and the estimate has them; an older proof saved
 * with placeholder numbers shows the message instead.
 * @param {object|null} p  estimatePrice() output (or an older stored price)
 * @param {{date?: Date, live?: boolean}} [o]
 * @returns {{withheld: boolean, label: string, range: string, message: string, lines: string[],
 *            perFoot: string, disclaimer: string, tax: string, valid: string}}
 */
export function priceView(p, { date = new Date(), live = !PLACEHOLDER } = {}) {
  const base = { label: "Price", range: "", message: NO_PRICE_MESSAGE, lines: [], perFoot: "", disclaimer: DISCLAIMER_FULL, tax: "", valid: "" };
  if (!live || !p || p.withheld || p.placeholder || !(p.low > 0) || !(p.high > p.low)) return { withheld: true, ...base };
  const dateText = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines = [`${p.rowLabel}, about ${p.quantity} ${p.unit}${p.projection ? `, ${p.projection} ft projection` : ""}`];
  if (p.minApplied) lines.push(`Minimum job: ${formatMoney(p.minimum)}`);
  for (const a of p.adders || []) lines.push(`Includes ${a.label.charAt(0).toLowerCase()}${a.label.slice(1)}`);
  for (const e of p.extras || []) lines.push(`${e.label}: ${e.range ? `${formatMoney(e.range[0])} – ${formatMoney(e.range[1])}, not included` : e.confirm}`);
  return {
    withheld: false,
    ...base,
    label: RATES_LABEL,
    range: formatRange(p),
    message: "",
    lines,
    perFoot: p.perFoot ? `About ${formatMoney(p.perFoot[0])}–${formatMoney(p.perFoot[1])} per linear ft` : "",
    tax: TAX_NOTE,
    valid: validNote(dateText),
  };
}

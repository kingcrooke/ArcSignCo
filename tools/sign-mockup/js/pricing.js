// Preliminary estimate from the calibrated size and the type. Public metadata lives in
// pricing-config.js; numeric rates load only in Node (tools/pricing-rates-data.mjs).
// While PLACEHOLDER is true, estimatePrice() and priceView() carry no dollar amounts at all.
import {
  PLACEHOLDER, RATES_VERSION, RATES_LABEL, NO_PRICE_MESSAGE, DISCLAIMER_FULL,
  ROUNDING, RANGE, ROWS, ADDERS, EXTRAS,
} from "./pricing-config.js";
import { getType, isKnownType, categoryOf, lightingOf } from "./catalog.js";

const STEP = ROUNDING.step;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;
const UNITS = { letters: "sq ft of letters", sqft: "sq ft", lf: "linear ft", projecting: "linear ft of width" };

function rateBundle() {
  return globalThis.__ARC_PRICING_RATES__ || null;
}

function rowRates(id) {
  const rates = rateBundle()?.ROWS;
  return rates?.[id] || null;
}

/** The config row a type is priced from, as { id, ...row }, or null. */
export function rowFor(typeId) {
  if (!isKnownType(typeId)) return null;
  const type = getType(typeId);
  const id = categoryOf(type).pricing?.row?.[type.id];
  return id && ROWS[id] ? { id, ...ROWS[id] } : null;
}

/**
 * The full estimate with numbers (Node tests only unless PLACEHOLDER is off and rates are loaded).
 */
export function computeEstimate(typeId, sizeIn, opts = null) {
  const w = Number(sizeIn?.width), h = Number(sizeIn?.height);
  if (!(w > 0) || !(h > 0)) return null;
  const rowMeta = rowFor(typeId);
  if (!rowMeta) return null;
  const row = { ...rowMeta, ...rowRates(rowMeta.id) };
  if (!(row.base >= 0) || !(row.rate > 0) || !(row.min > 0)) return null;
  const type = getType(typeId);
  const inputs = categoryOf(type).priceInputs(type, opts, { width: w, height: h });
  const widthFt = inputs.width / 12, areaFt = (inputs.width * inputs.height) / 144;
  const projFt = (inputs.projection || 0) / 12;
  const quantity = row.unit === "lf" || row.unit === "projecting" ? widthFt : areaFt;

  const sized = row.base + row.rate * quantity + (row.unit === "projecting" ? (row.projRate || 0) * widthFt * projFt : 0);
  const minimum = ceilTo(row.min);
  const minApplied = sized < minimum;
  const lighting = lightingOf(type, opts);
  const rateAdders = rateBundle()?.ADDERS || {};
  const adders = Object.entries(ADDERS)
    .filter(([key, a]) => (row.adders || []).includes(key) || (a.lighting || []).includes(lighting))
    .map(([key, a]) => {
      const n = rateAdders[key];
      if (!n) return null;
      return { key, label: a.label, amount: n.base + n.rate * (a.per === "lf" ? widthFt : areaFt) };
    })
    .filter(Boolean);
  const total = Math.max(sized, minimum) + adders.reduce((s, a) => s + a.amount, 0);

  const low = Math.max(minimum, floorTo(total));
  const high = Math.max(low + STEP, ceilTo(low * RANGE.spread));
  const extrasRates = rateBundle()?.EXTRAS || EXTRAS;
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
    extras: extrasRates.map(e => ({ ...e })),
    perFoot: row.unit === "projecting" || row.unit === "lf" ? [Math.round(low / widthFt), Math.round(high / widthFt)] : undefined,
    version: RATES_VERSION,
  };
}

export function estimatePrice(typeId, sizeIn, opts = null) {
  const common = { label: RATES_LABEL, disclaimer: DISCLAIMER_FULL, version: RATES_VERSION, placeholder: PLACEHOLDER };
  const est = computeEstimate(typeId, sizeIn, opts);
  if (PLACEHOLDER) {
    if (!est) return null;
    return { withheld: true, message: NO_PRICE_MESSAGE, ...common };
  }
  if (!est) return null;
  const rates = rateBundle();
  return { ...est, ...common, tax: rates?.TAX_NOTE, validDays: rates?.VALID_DAYS };
}

export const PRICES_LIVE = !PLACEHOLDER;

export const formatMoney = v => `$${Math.round(v).toLocaleString("en-US")}`;
export const formatRange = p => (p ? `${formatMoney(p.low)} – ${formatMoney(p.high)}` : "");

export function priceView(p, { date = new Date(), live = !PLACEHOLDER } = {}) {
  const rates = rateBundle();
  const base = { label: "Price", range: "", message: NO_PRICE_MESSAGE, lines: [], perFoot: "", disclaimer: DISCLAIMER_FULL, tax: "", valid: "" };
  if (!live || !p || p.withheld || p.placeholder || !(p.low > 0) || !(p.high > p.low)) return { withheld: true, ...base };
  const dateText = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines = [`${p.rowLabel}, about ${p.quantity} ${p.unit}${p.projection ? `, ${p.projection} ft projection` : ""}`];
  lines.push(`Minimum job: ${formatMoney(p.minimum)}${p.minApplied ? " (applies at this size)" : ""}`);
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
    tax: rates?.TAX_NOTE || "",
    valid: rates?.validNote ? rates.validNote(dateText) : "",
  };
}

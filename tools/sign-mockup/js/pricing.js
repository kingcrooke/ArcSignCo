// Preliminary price range from the calibrated size and the type. The placeholder rates live in
// each category module's `pricing` block; labels and the version live in pricing-config.js.
import { RATES_LABEL, RATES_NOTE, RATES_VERSION, PLACEHOLDER } from "./pricing-config.js";
import { getType, isKnownType, categoryOf } from "./catalog.js";

const STEP = 50;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;
const UNITS = { area: "sq ft", width: "linear ft of width" };

/** The rate a type is priced at, with its basis filled in, or null. */
export function rateFor(typeId) {
  if (!isKnownType(typeId)) return null;
  const type = getType(typeId);
  const pricing = categoryOf(type).pricing;
  const rate = pricing?.rates?.[type.id];
  return rate ? { basis: pricing.basis || "width", ...rate } : null;
}

/**
 * @param {string} typeId
 * @param {{width: number, height: number}} sizeIn  calibrated size in inches
 * @param {object} [opts]  the type's options (a category adder can read them, e.g. awning backlighting)
 * @returns {{low: number, high: number, basis: string, quantity: number, unit: string,
 *            label: string, note: string, version: string, placeholder: boolean,
 *            perFoot?: [number, number], [adderKey]: boolean} | null}
 *   basis "area" is priced per square foot; any other basis per linear foot of width.
 */
export function estimatePrice(typeId, sizeIn, opts = null) {
  const w = Number(sizeIn?.width), h = Number(sizeIn?.height);
  if (!(w > 0) || !(h > 0)) return null;
  const rate = rateFor(typeId);
  if (!rate) return null;
  const type = getType(typeId);
  const pricing = categoryOf(type).pricing;
  const adder = pricing.adder;
  const added = !!adder && !!adder.applies(type, opts, rate);
  const rLow = rate.low + (added ? adder.low : 0), rHigh = rate.high + (added ? adder.high : 0);
  const quantity = rate.basis === "area" ? (w * h) / 144 : w / 12;
  let low = Math.max(rate.min[0], quantity * rLow);
  let high = Math.max(rate.min[1], quantity * rHigh);
  low = Math.max(STEP, floorTo(low));
  high = ceilTo(high);
  if (high <= low) high = low + STEP;
  const out = {
    low,
    high,
    basis: rate.basis,
    quantity: Math.round(quantity * 10) / 10,
    unit: UNITS[rate.basis] || (rate.basis === pricing.basis && pricing.unit) || UNITS.width,
    label: RATES_LABEL,
    note: pricing.note || RATES_NOTE,
    version: RATES_VERSION,
    placeholder: PLACEHOLDER && pricing.placeholder !== false,
  };
  if (pricing.perFoot) out.perFoot = [rLow, rHigh];
  if (adder) out[adder.key] = added;
  return out;
}

export const formatMoney = v => `$${Math.round(v).toLocaleString("en-US")}`;
export const formatRange = p => (p ? `${formatMoney(p.low)} – ${formatMoney(p.high)}` : "");
/** "$180–$320 per linear ft (estimate placeholder)" when the category shows a per-foot rate; else empty. */
export const formatPerFoot = p => (p?.perFoot ? `${formatMoney(p.perFoot[0])}–${formatMoney(p.perFoot[1])} per linear ft (estimate placeholder)` : "");

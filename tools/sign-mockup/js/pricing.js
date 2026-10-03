// Preliminary price range from the calibrated size and the type. Rates live in pricing-config.js.
import { RATES, RATES_LABEL, RATES_NOTE, RATES_VERSION, PLACEHOLDER, AWNING_RATES, BACKLIT_ADDER, AWNING_NOTE } from "./pricing-config.js";

const STEP = 50;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;

/**
 * @param {string} typeId
 * @param {{width: number, height: number}} sizeIn  calibrated size in inches
 * @param {object} [opts]  awning options (only `lit` is read: "backlit" adds the backlit rate)
 * @returns {{low: number, high: number, basis: string, quantity: number, unit: string,
 *            label: string, note: string, version: string, placeholder: boolean,
 *            perFoot?: [number, number], backlit?: boolean} | null}
 */
export function estimatePrice(typeId, sizeIn, opts = null) {
  const w = Number(sizeIn?.width), h = Number(sizeIn?.height);
  if (!(w > 0) || !(h > 0)) return null;
  const aw = AWNING_RATES[typeId];
  const rate = aw ? { basis: "awning", ...aw } : RATES[typeId];
  if (!rate) return null;
  const backlit = !!aw && !aw.lit && opts?.lit === "backlit";
  const rLow = rate.low + (backlit ? BACKLIT_ADDER.low : 0), rHigh = rate.high + (backlit ? BACKLIT_ADDER.high : 0);
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
    unit: rate.basis === "area" ? "sq ft" : rate.basis === "awning" ? "linear ft of awning width" : "linear ft of width",
    label: RATES_LABEL,
    note: aw ? AWNING_NOTE : RATES_NOTE,
    version: RATES_VERSION,
    placeholder: PLACEHOLDER,
  };
  if (aw) Object.assign(out, { perFoot: [rLow, rHigh], backlit });
  return out;
}

export const formatMoney = v => `$${Math.round(v).toLocaleString("en-US")}`;
export const formatRange = p => (p ? `${formatMoney(p.low)} – ${formatMoney(p.high)}` : "");
/** "$180–$320 per linear ft (estimate placeholder)" for awnings; empty for signs. */
export const formatPerFoot = p => (p?.perFoot ? `${formatMoney(p.perFoot[0])}–${formatMoney(p.perFoot[1])} per linear ft (estimate placeholder)` : "");

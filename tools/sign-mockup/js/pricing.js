// Preliminary price range from the calibrated size and the sign type. Rates live in pricing-config.js.
import { RATES, RATES_LABEL, RATES_NOTE, RATES_VERSION, PLACEHOLDER } from "./pricing-config.js";

const STEP = 50;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;

/**
 * @param {string} typeId
 * @param {{width: number, height: number}} sizeIn  calibrated sign size in inches
 * @returns {{low: number, high: number, basis: string, quantity: number, unit: string,
 *            label: string, note: string, version: string, placeholder: boolean} | null}
 */
export function estimatePrice(typeId, sizeIn) {
  const rate = RATES[typeId];
  const w = Number(sizeIn?.width), h = Number(sizeIn?.height);
  if (!rate || !(w > 0) || !(h > 0)) return null;
  const quantity = rate.basis === "area" ? (w * h) / 144 : w / 12;
  let low = Math.max(rate.min[0], quantity * rate.low);
  let high = Math.max(rate.min[1], quantity * rate.high);
  low = Math.max(STEP, floorTo(low));
  high = ceilTo(high);
  if (high <= low) high = low + STEP;
  return {
    low,
    high,
    basis: rate.basis,
    quantity: Math.round(quantity * 10) / 10,
    unit: rate.basis === "area" ? "sq ft" : "linear ft of width",
    label: RATES_LABEL,
    note: RATES_NOTE,
    version: RATES_VERSION,
    placeholder: PLACEHOLDER,
  };
}

export const formatMoney = v => `$${Math.round(v).toLocaleString("en-US")}`;
export const formatRange = p => (p ? `${formatMoney(p.low)} – ${formatMoney(p.high)}` : "");

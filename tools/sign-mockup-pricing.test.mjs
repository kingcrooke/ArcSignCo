// Unit tests for the preliminary price range.  node --test tools/
import test from "node:test";
import assert from "node:assert/strict";
import { RATES, PLACEHOLDER, RATES_LABEL, RATES_NOTE } from "./sign-mockup/js/pricing-config.js";
import { estimatePrice, formatRange } from "./sign-mockup/js/pricing.js";
import { SIGN_TYPES } from "./sign-mockup/js/sign-types.js";

const SIZES = [
  { width: 12, height: 6 },
  { width: 48, height: 18 },
  { width: 120, height: 24 },
  { width: 220, height: 30 },
  { width: 480, height: 60 },
];

test("every sign type has a rate and nothing else does", () => {
  assert.deepEqual(Object.keys(RATES).sort(), SIGN_TYPES.map(t => t.id).sort());
});

test("rates are labeled as placeholders", () => {
  assert.equal(PLACEHOLDER, true);
  assert.match(RATES_LABEL, /placeholder/i);
  assert.match(RATES_NOTE, /not a quote/i);
});

test("each configured rate and minimum has low below high", () => {
  for (const [id, r] of Object.entries(RATES)) {
    assert.ok(["width", "area"].includes(r.basis), `${id} basis`);
    assert.ok(r.low > 0 && r.low < r.high, `${id} rate low < high`);
    assert.ok(r.min[0] > 0 && r.min[0] < r.min[1], `${id} minimum low < high`);
  }
});

test("estimate low is always below estimate high", () => {
  for (const t of SIGN_TYPES) {
    for (const size of SIZES) {
      const p = estimatePrice(t.id, size);
      assert.ok(p, `${t.id} ${size.width}x${size.height}`);
      assert.ok(p.low > 0, `${t.id} low > 0`);
      assert.ok(p.low < p.high, `${t.id} ${size.width}x${size.height}: ${p.low} < ${p.high}`);
    }
  }
});

test("low stays below high even when rounding would collapse the range", () => {
  const p = estimatePrice("vinyl", { width: 1, height: 1 });
  assert.ok(p.low < p.high);
});

test("estimate grows with size", () => {
  for (const t of SIGN_TYPES) {
    const small = estimatePrice(t.id, { width: 60, height: 20 });
    const big = estimatePrice(t.id, { width: 600, height: 200 });
    assert.ok(big.low >= small.low && big.high > small.high, t.id);
  }
});

test("no estimate without a calibrated size or for an unknown type", () => {
  assert.equal(estimatePrice("trimcap", null), null);
  assert.equal(estimatePrice("trimcap", { width: 0, height: 10 }), null);
  assert.equal(estimatePrice("nope", { width: 100, height: 10 }), null);
});

test("range formats with an en dash", () => {
  assert.equal(formatRange({ low: 2400, high: 3850 }), "$2,400 – $3,850");
});

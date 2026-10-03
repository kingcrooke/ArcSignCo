// Unit tests for the preliminary price range.  node --test tools/
import test from "node:test";
import assert from "node:assert/strict";
import { RATES, PLACEHOLDER, RATES_LABEL, RATES_NOTE, AWNING_RATES, BACKLIT_ADDER, AWNING_NOTE } from "./sign-mockup/js/pricing-config.js";
import { estimatePrice, formatRange, formatPerFoot } from "./sign-mockup/js/pricing.js";
import { SIGN_TYPES } from "./sign-mockup/js/sign-types.js";
import { AWNING_TYPES } from "./sign-mockup/js/awning-types.js";
import { ALL_TYPES } from "./sign-mockup/js/catalog.js";

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

test("every awning shape has a per-linear-foot rate and nothing else does", () => {
  assert.deepEqual(Object.keys(AWNING_RATES).sort(), AWNING_TYPES.map(t => t.id).sort());
});

test("rates are labeled as placeholders", () => {
  assert.equal(PLACEHOLDER, true);
  assert.match(RATES_LABEL, /placeholder/i);
  assert.match(RATES_NOTE, /not a quote/i);
  assert.match(AWNING_NOTE, /estimate placeholder/i);
  assert.match(AWNING_NOTE, /not a quote/i);
});

test("each configured rate and minimum has low below high", () => {
  for (const [id, r] of Object.entries(RATES)) {
    assert.ok(["width", "area"].includes(r.basis), `${id} basis`);
    assert.ok(r.low > 0 && r.low < r.high, `${id} rate low < high`);
    assert.ok(r.min[0] > 0 && r.min[0] < r.min[1], `${id} minimum low < high`);
  }
});

test("each awning rate, minimum and the backlit adder has low below high", () => {
  for (const [id, r] of Object.entries(AWNING_RATES)) {
    assert.ok(r.low > 0 && r.low < r.high, `${id} rate low < high`);
    assert.ok(r.min[0] > 0 && r.min[0] < r.min[1], `${id} minimum low < high`);
  }
  assert.ok(BACKLIT_ADDER.low > 0 && BACKLIT_ADDER.low < BACKLIT_ADDER.high);
});

test("awnings are priced per linear foot of width, backlit adds the adder", () => {
  const plain = estimatePrice("aw-traditional", { width: 240, height: 40 });
  assert.equal(plain.basis, "awning");
  assert.equal(plain.quantity, 20);
  assert.equal(plain.unit, "linear ft of awning width");
  assert.deepEqual(plain.perFoot, [AWNING_RATES["aw-traditional"].low, AWNING_RATES["aw-traditional"].high]);
  assert.match(formatPerFoot(plain), /per linear ft \(estimate placeholder\)$/);
  assert.equal(plain.backlit, false);
  const lit = estimatePrice("aw-traditional", { width: 240, height: 40 }, { lit: "backlit" });
  assert.ok(lit.backlit && lit.low > plain.low && lit.high > plain.high);
  assert.equal(lit.perFoot[0], AWNING_RATES["aw-traditional"].low + BACKLIT_ADDER.low);
  // A shape whose rate already includes its lighting doesn't add it twice.
  const box = estimatePrice("aw-backlit", { width: 240, height: 40 }, { lit: "backlit" });
  assert.equal(box.backlit, false);
  assert.equal(formatPerFoot(estimatePrice("trimcap", { width: 120, height: 24 })), "");
});

test("estimate low is always below estimate high", () => {
  for (const t of ALL_TYPES) {
    for (const size of SIZES) {
      for (const opts of [null, { lit: "backlit" }]) {
        const p = estimatePrice(t.id, size, opts);
        assert.ok(p, `${t.id} ${size.width}x${size.height}`);
        assert.ok(p.low > 0, `${t.id} low > 0`);
        assert.ok(p.low < p.high, `${t.id} ${size.width}x${size.height}: ${p.low} < ${p.high}`);
      }
    }
  }
});

test("low stays below high even when rounding would collapse the range", () => {
  const p = estimatePrice("vinyl", { width: 1, height: 1 });
  assert.ok(p.low < p.high);
});

test("estimate grows with size", () => {
  for (const t of ALL_TYPES) {
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

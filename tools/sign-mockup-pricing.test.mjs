// Unit tests for the preliminary estimate.  node --test tools/
import test from "node:test";
import assert from "node:assert/strict";
import {
  PLACEHOLDER, RATES_LABEL, RATES_NOTE, NO_PRICE_MESSAGE, DISCLAIMER_FULL, TAX_NOTE, VALID_DAYS, ROUNDING, RANGE, ROWS, ADDERS, EXTRAS,
} from "./sign-mockup/js/pricing-config.js";
import { estimatePrice, computeEstimate, priceView, formatRange, rowFor, PRICES_LIVE } from "./sign-mockup/js/pricing.js";
import { ALL_TYPES, READY, getCategory } from "./sign-mockup/js/catalog.js";
import awnings from "./sign-mockup/js/categories/awnings.js";

const STEP = ROUNDING.step;
const SIZES = [
  { width: 12, height: 6 },
  { width: 48, height: 18 },
  { width: 120, height: 24 },
  { width: 220, height: 30 },
  { width: 480, height: 60 },
];
const DOLLARS = /\$\s?\d/;

test("every live type points at a row in pricing-config.js, and only types do", () => {
  for (const cat of READY) {
    assert.deepEqual(Object.keys(cat.pricing.row).sort(), cat.types.map(t => t.id).sort(), cat.id);
    for (const row of Object.values(cat.pricing.row)) assert.ok(ROWS[row], `${cat.id}: row ${row}`);
  }
  for (const t of ALL_TYPES) assert.ok(rowFor(t.id), t.id);
  assert.equal(rowFor("not-a-type"), null);
  assert.equal(estimatePrice("vinyl-window", { width: 48, height: 24 }), null, "coming-soon categories have nothing to price");
  assert.equal(getCategory("vinyl").status, "soon");
});

test("category modules hold no price numbers", () => {
  for (const cat of READY) {
    assert.deepEqual(Object.keys(cat.pricing), ["row"], cat.id);
    assert.ok(Object.values(cat.pricing.row).every(v => typeof v === "string"), cat.id);
  }
});

test("rows, adders and extras are well formed", () => {
  for (const [id, r] of Object.entries(ROWS)) {
    assert.ok(["letters", "sqft", "lf", "projecting"].includes(r.unit), `${id} unit`);
    assert.ok(r.base >= 0 && r.rate > 0 && r.min > 0, `${id} numbers`);
    assert.ok(r.label, `${id} label`);
    if (r.unit === "projecting") assert.ok(r.projRate > 0, `${id} prices projection`);
    for (const a of r.adders || []) assert.ok(ADDERS[a], `${id} adder ${a}`);
  }
  for (const [id, a] of Object.entries(ADDERS)) assert.ok(["sqft", "lf"].includes(a.per) && a.rate > 0 && a.label, id);
  for (const k of ["face-lit", "halo-lit", "raceway", "backlit"]) assert.ok(ADDERS[k], `illumination adder ${k}`);
  const keys = EXTRAS.map(e => e.key);
  for (const k of ["lift", "removal", "afterHours", "access", "permit", "survey"]) assert.ok(keys.includes(k), `extra line ${k}`);
  for (const e of EXTRAS) {
    if (["permit", "survey"].includes(e.key)) assert.equal(e.confirm, "confirmed after site survey", e.key);
    else assert.ok(e.range[0] > 0 && e.range[0] < e.range[1], e.key);
  }
  assert.equal(VALID_DAYS, 30);
  assert.equal(TAX_NOTE, "Sales tax extra where it applies (NYC combined rate on the final invoice).");
});

test("while the rates are placeholders, nothing client-facing carries a number", () => {
  assert.equal(PLACEHOLDER, true);
  assert.equal(PRICES_LIVE, false);
  assert.equal(RATES_LABEL, "Preliminary estimate");
  assert.equal(RATES_NOTE, DISCLAIMER_FULL);
  assert.equal(NO_PRICE_MESSAGE, "A price is prepared after a site survey. This is a concept only. It is not a quote or a contract.");
  for (const t of ALL_TYPES) {
    const p = estimatePrice(t.id, { width: 144, height: 30 }, { lit: "backlit" });
    assert.equal(p.withheld, true, t.id);
    assert.equal(p.low, undefined, t.id);
    assert.equal(p.high, undefined, t.id);
    assert.doesNotMatch(JSON.stringify(p), DOLLARS, t.id);
    const v = priceView(p);
    assert.equal(v.withheld, true);
    assert.equal(v.range, "");
    assert.equal(v.message, NO_PRICE_MESSAGE);
    assert.doesNotMatch(JSON.stringify(v), DOLLARS);
  }
  // An older proof saved with placeholder numbers shows the message, not its numbers.
  const old = priceView({ low: 3000, high: 5000, placeholder: true, label: "Arc placeholder rates" });
  assert.equal(old.withheld, true);
  assert.doesNotMatch(JSON.stringify(old), DOLLARS);
  assert.equal(priceView(null).message, NO_PRICE_MESSAGE);
});

test("the full disclaimer is the one Sales Ops approved", () => {
  assert.equal(DISCLAIMER_FULL, "Preliminary estimate only. Not a quote or a contract. Subject to a site survey, final artwork, permits and fees, electrical and install conditions, and sales tax. The mockup is illustrative, not to scale, and not a shop drawing. Permit requirements are confirmed after a site survey; approval is not guaranteed.");
});

test("an estimate is base plus size rate, with the minimum rounded up and adders after it", () => {
  // Non-lit flat cut-out letters, 10 ft × 2 ft = 20 sq ft of letters.
  const fco = computeEstimate("fco", { width: 120, height: 24 });
  const r = ROWS["letters-fco"];
  const raw = r.base + r.rate * 20;
  assert.equal(fco.quantity, 20);
  assert.equal(fco.low, Math.max(Math.ceil(r.min / STEP) * STEP, Math.floor(raw / STEP) * STEP));
  assert.equal(fco.high, Math.ceil((fco.low * RANGE.spread) / STEP) * STEP);
  assert.deepEqual(fco.adders, []);
  // Tiny job: the minimum applies, and the low end never drops below it.
  const tiny = computeEstimate("vinyl", { width: 1, height: 1 });
  assert.equal(tiny.minApplied, true);
  assert.equal(tiny.low, Math.ceil(ROWS["graphics-vinyl"].min / STEP) * STEP);
  // Face-lit letters add the face-lit adder on top of the minimum.
  const small = computeEstimate("trimcap", { width: 12, height: 6 });
  assert.equal(small.minApplied, true);
  assert.deepEqual(small.adders.map(a => a.key), ["face-lit"]);
  assert.ok(small.low > ROWS["letters-trimcap"].min, "adders land after the minimum");
  assert.deepEqual(computeEstimate("combo", { width: 120, height: 24 }).adders.map(a => a.key), ["face-lit", "halo-lit"]);
  assert.deepEqual(computeEstimate("halo", { width: 120, height: 24 }).adders.map(a => a.key), ["halo-lit"]);
  assert.deepEqual(computeEstimate("raceway", { width: 120, height: 24 }).adders.map(a => a.key).sort(), ["face-lit", "raceway"]);
});

test("awnings price width and projection, and backlighting is an adder", () => {
  const plain = computeEstimate("aw-traditional", { width: 240, height: 40 });
  assert.equal(plain.unit, "linear ft of width");
  assert.equal(plain.quantity, 20);
  assert.ok(plain.projection > 0);
  assert.deepEqual(plain.adders, []);
  const deeper = computeEstimate("aw-traditional", { width: 240, height: 40 }, { ...awnings.defaultOptions(awnings.types[0]), projection: 72 });
  assert.ok(deeper.low > plain.low, "a deeper awning costs more");
  const lit = computeEstimate("aw-traditional", { width: 240, height: 40 }, { lit: "backlit" });
  assert.deepEqual(lit.adders.map(a => a.key), ["backlit"]);
  assert.ok(lit.low > plain.low && lit.high > plain.high);
  const box = computeEstimate("aw-backlit", { width: 240, height: 40 });
  assert.deepEqual(box.adders.map(a => a.key), ["backlit"], "a backlit shape carries the adder once");
  assert.ok(plain.perFoot[0] > 0 && plain.perFoot[0] < plain.perFoot[1]);
});

test("the range rule: high is low × spread rounded out, and low < high always", () => {
  for (const t of ALL_TYPES) {
    for (const size of SIZES) {
      for (const opts of [null, { lit: "backlit" }]) {
        const p = computeEstimate(t.id, size, opts);
        assert.ok(p, `${t.id} ${size.width}x${size.height}`);
        assert.ok(p.low >= p.minimum && p.low % STEP === 0 && p.high % STEP === 0, `${t.id} rounding`);
        assert.ok(p.low < p.high, `${t.id} ${size.width}x${size.height}: ${p.low} < ${p.high}`);
        assert.ok(p.high >= p.low * RANGE.spread && p.high < p.low * RANGE.spread + STEP + 1e-9 || p.high === p.low + STEP, `${t.id} spread`);
      }
    }
  }
});

test("estimate grows with size", () => {
  for (const t of ALL_TYPES) {
    const small = computeEstimate(t.id, { width: 60, height: 20 });
    const big = computeEstimate(t.id, { width: 600, height: 200 });
    assert.ok(big.low >= small.low && big.high > small.high, t.id);
  }
});

test("with real rates on, the view shows the range, the separate lines, tax and the valid-days note", () => {
  const est = computeEstimate("aw-traditional", { width: 240, height: 40 }, { lit: "backlit" });
  const v = priceView(est, { live: true, date: new Date(2026, 9, 3) });
  assert.equal(v.withheld, false);
  assert.equal(v.label, "Preliminary estimate");
  assert.equal(v.range, formatRange(est));
  assert.doesNotMatch(JSON.stringify(v), /placeholder/i, "\"(estimate placeholder)\" is gone");
  assert.ok(v.lines.some(l => /^Lift or boom truck.*\$\d.*not included$/.test(l)));
  assert.ok(v.lines.some(l => /^Permit and filing fees: confirmed after site survey$/.test(l)));
  assert.ok(v.lines.some(l => /^Includes backlighting/.test(l)));
  assert.equal(v.tax, TAX_NOTE);
  assert.equal(v.valid, "Preliminary estimate valid 30 days from October 3, 2026. Arc re-prices after that.");
  assert.equal(v.disclaimer, DISCLAIMER_FULL);
});

test("no estimate without a calibrated size or for an unknown type", () => {
  assert.equal(estimatePrice("trimcap", null), null);
  assert.equal(computeEstimate("trimcap", { width: 0, height: 10 }), null);
  assert.equal(estimatePrice("nope", { width: 100, height: 10 }), null);
});

test("range formats with an en dash", () => {
  assert.equal(formatRange({ low: 2400, high: 3850 }), "$2,400 – $3,850");
});

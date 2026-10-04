import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test, beforeEach, afterEach } from "node:test";
import {
  computeQuoteFromCard,
  computePathBLine,
  computeQuote,
  roundLine,
  roundTotal,
  TBD_LABEL,
} from "../netlify/lib/quote-engine-pricing.mjs";
import { setTestRateCard, clearTestRateCard } from "../netlify/lib/rate-card-store.mjs";
import { validateRateCard } from "../netlify/lib/rate-card-validate.mjs";

const SYNTHETIC_CARD = {
  meta: { version: "test-synthetic-1", name: "Unit test card" },
  pricing_rule: { paths: { A_book: "book", B_cost: "cost", exclusive: "one" } },
  markup: {
    materials_markup: { suggested: 0.5, status: "market_estimate_TBD" },
    contingency: { suggested_on_cost_buildup_while_preliminary: 0.1, suggested_on_book_ranges: 0 },
    rounding: { line: "nearest 10", total: "next 25" },
    deposit: { wording: "50/50" },
    quote_validity_days: { suggested: 30 },
  },
  range_output: {
    label: "Preliminary",
    client_sentence: "Preliminary until survey.",
  },
  sign_types: [
    {
      id: "test_letters",
      label: "Test letters",
      basis: "per_letter_inch",
      low: 10,
      high: 20,
      minimum: 500,
      status: "market_estimate_TBD",
    },
    {
      id: "wall_mural_painted",
      label: "Mural",
      basis: "quote_only",
      quote_only: true,
      status: "market_estimate_TBD",
    },
  ],
  install: {
    access: {
      scaffold_per_day: { low: 100, high: 200, delivery_low: 50, delivery_high: 50, status: "market_estimate_TBD" },
    },
  },
  height_access_adders: {
    tiers: [
      { id: "under_12_ft" },
      { id: "12_to_25_ft" },
      { id: "over_25_ft", quote_only: true },
    ],
    status: "market_estimate_TBD",
  },
  travel: { zones: [{ id: "default", label: "Default", flat_low: 25, flat_high: 40, status: "market_estimate_TBD" }] },
  electrical: { label: "Electric", low: 80, high: 120, status: "market_estimate_TBD" },
  permits: { lines: [] },
  design_and_survey: { survey_fee: { low: 30, high: 40, status: "market_estimate_TBD" } },
  job_minimums: { overall_minimum_order: { low: 400, high: 600, status: "market_estimate_TBD" } },
  tax: { engine_until_confirmed: "Tax extra." },
};

beforeEach(() => clearTestRateCard());
afterEach(() => clearTestRateCard());

test("path A book line does not apply materials markup", () => {
  const q = computeQuoteFromCard(SYNTHETIC_CARD, {
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    height: "Ground floor, under 12 ft",
    boroughZone: "brooklyn",
  });
  const main = q.lines.find(l => l.key === "test_letters");
  assert.equal(main.path, "A");
  assert.ok(main.low >= 500);
  assert.equal(main.tbd, true);
});

test("path B uses cost × (1 + markup) with preliminary contingency", () => {
  const line = computePathBLine({
    label: "Materials",
    materialCost: 100,
    markupRate: 0.5,
    preliminary: true,
    contingencyRate: 0.1,
    status: "market_estimate_TBD",
  });
  assert.equal(line.path, "B");
  assert.equal(line.low, 170);
});

test("rounding line and total", () => {
  assert.equal(roundLine(127), 130);
  assert.equal(roundLine(123), 120);
  assert.equal(roundTotal(801), 825);
});

test("preliminary range vs survey confirmed single total", () => {
  const input = {
    signType: "Channel letters",
    sizeW: 8,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    height: "Ground floor, under 12 ft",
    boroughZone: "brooklyn",
  };
  const prelim = computeQuoteFromCard(SYNTHETIC_CARD, input, { surveyConfirmed: false });
  assert.equal(prelim.preliminary, true);
  assert.ok(prelim.high >= prelim.low);
  assert.equal(prelim.total, null);
  const final = computeQuoteFromCard(SYNTHETIC_CARD, input, { surveyConfirmed: true });
  assert.equal(final.preliminary, false);
  assert.ok(final.total >= final.low);
});

test("quote-only mural and height over 25 ft", () => {
  const mural = computeQuoteFromCard(SYNTHETIC_CARD, { signType: "Wall mural", lit: "Non-lit", boroughZone: "brooklyn" });
  assert.ok(mural.quoteRequiredAny);
  assert.ok(mural.lines.some(l => l.quoteRequired));

  const high = computeQuoteFromCard(SYNTHETIC_CARD, {
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    height: "2nd floor or higher",
    boroughZone: "brooklyn",
  });
  assert.ok(high.lines.some(l => l.key === "height_quote" && l.quoteRequired));
});

test("12–25 ft adds scaffold access line, ground floor does not", () => {
  const ground = computeQuoteFromCard(SYNTHETIC_CARD, {
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    height: "Ground floor, under 12 ft",
    boroughZone: "brooklyn",
  });
  assert.equal(ground.lines.some(l => l.key === "access_scaffold"), false);

  const mid = computeQuoteFromCard(SYNTHETIC_CARD, {
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    height: "12–25 ft",
    boroughZone: "brooklyn",
  });
  assert.ok(mid.lines.some(l => l.key === "access_scaffold"));
});

test("TBD banner counts internal lines only", () => {
  const q = computeQuoteFromCard(SYNTHETIC_CARD, {
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    boroughZone: "brooklyn",
  });
  assert.match(q.tbdBanner, new RegExp(TBD_LABEL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("placeholder computeQuote marks placeholder source", async () => {
  const q = await computeQuote({
    signType: "Channel letters",
    sizeW: 10,
    sizeH: 2,
    sizeUnit: "ft",
    lit: "Lit",
    boroughZone: "brooklyn",
  });
  assert.equal(q.placeholder, true);
  assert.ok(q.low > 0);
});

test("validateRateCard rejects incomplete payloads", () => {
  assert.equal(validateRateCard({}).ok, false);
  assert.equal(validateRateCard(SYNTHETIC_CARD).ok, true);
});

test("optional imported PM card file (local only)", { skip: !process.env.ARC_RATE_CARD_TEST_PATH }, async () => {
  const card = JSON.parse(readFileSync(process.env.ARC_RATE_CARD_TEST_PATH, "utf8"));
  assert.equal(validateRateCard(card).ok, true);
  setTestRateCard(card);
  const q = await computeQuote(
    {
      signType: "Channel letters",
      sizeW: 12,
      sizeH: 2.5,
      sizeUnit: "ft",
      lit: "Lit",
      height: "Ground floor, under 12 ft",
      boroughZone: "brooklyn",
      permitsRequested: true,
    },
    { surveyConfirmed: false },
  );
  assert.ok(q.tbdCount >= 1);
  assert.equal(q.preliminary, true);
});

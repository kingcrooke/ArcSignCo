import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test, beforeEach, afterEach } from "node:test";
import { computeQuoteFromCard } from "../netlify/lib/quote-engine-pricing.mjs";
import { resolveAllowances } from "../netlify/lib/allowance-input.mjs";
import { setTestRateCard, clearTestRateCard } from "../netlify/lib/rate-card-store.mjs";
import { handleQuoteEngine } from "../netlify/lib/quote-engine-api.mjs";
import { canRenderProposalPdf } from "../netlify/lib/proposal-pdf.mjs";

const BROOKLYN_CHANNEL = {
  signType: "Channel letters",
  sizeW: 14,
  sizeH: 2.5,
  sizeUnit: "ft",
  lit: "Lit",
  height: "Ground floor, under 12 ft",
  boroughZone: "brooklyn",
  permitsRequested: true,
};

const SYNTHETIC_PM_SHAPED = {
  meta: { version: "allowance-test" },
  pricing_rule: { paths: {} },
  markup: { rounding: {}, quote_validity_days: { suggested: 30 } },
  range_output: { label: "Preliminary" },
  sign_types: [
    {
      id: "channel_letters_front_lit",
      label: "Channel letters",
      basis: "per_letter_inch",
      low: 10,
      high: 20,
      minimum: 500,
    },
  ],
  install: { access: { scaffold_per_day: { low: 1, high: 2 } } },
  height_access_adders: { tiers: [{ id: "under_12_ft" }, { id: "12_to_25_ft" }, { id: "over_25_ft", quote_only: true }] },
  travel: { zones: [{ id: "outer_boroughs", label: "Outer boroughs", flat_low: 5, flat_high: 9 }] },
  electrical: { low: 8, high: 12 },
  design_and_survey: { survey_fee: { low: 3, high: 5 } },
  permits: {
    lines: [
      { id: "filing_expediting", label: "Filing", low: 10, high: 20, price_role: "preliminary_sell_allowance" },
      { id: "drawings_with_stamp", label: "Drawings", low: 10, high: 20, price_role: "preliminary_sell_allowance" },
      { id: "licensed_sign_hanger", label: "Hanger", low: 10, high: 20, price_role: "preliminary_sell_allowance" },
      { id: "lpc", label: "LPC", low: 10, high: 20, price_role: "preliminary_sell_allowance" },
      { id: "dob_fee", label: "DOB fee", price_role: "city_pass_through_at_cost", low: 0 },
    ],
  },
  job_minimums: { overall_minimum_order: { low: 100, high: 200 } },
  tax: {},
};

function loadCard() {
  const path = process.env.ARC_RATE_CARD_TEST_PATH;
  if (path && existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  return SYNTHETIC_PM_SHAPED;
}

beforeEach(() => {
  clearTestRateCard();
  setTestRateCard(loadCard());
});
afterEach(() => clearTestRateCard());

test("Brooklyn defaults: filing + electrical only, not LPC/hanger/drawings", () => {
  const card = loadCard();
  const resolved = resolveAllowances(BROOKLYN_CHANNEL, card);
  assert.ok(resolved.permitLineIds.has("filing_expediting"));
  assert.equal(resolved.permitLineIds.has("lpc"), false);
  assert.equal(resolved.permitLineIds.has("licensed_sign_hanger"), false);
  assert.equal(resolved.permitLineIds.has("drawings_with_stamp"), false);
  assert.ok(resolved.allowElectrical);

  const q = computeQuoteFromCard(card, BROOKLYN_CHANNEL);
  assert.ok(q.lines.some(l => l.key === "filing_expediting"));
  assert.equal(q.lines.some(l => l.key === "lpc"), false);
  assert.equal(q.lines.some(l => l.key === "licensed_sign_hanger"), false);
  assert.equal(q.lines.some(l => l.key === "drawings_with_stamp"), false);
});

test("explicit allowance checkboxes add only selected partner lines", () => {
  const card = loadCard();
  const q = computeQuoteFromCard(card, {
    ...BROOKLYN_CHANNEL,
    allowFilingExpediting: false,
    allowElectrical: false,
    allowLpc: true,
    allowSignHanger: true,
    allowDrawingsStamp: true,
  });
  assert.equal(q.lines.some(l => l.key === "filing_expediting"), false);
  assert.equal(q.lines.some(l => l.key === "electrical"), false);
  assert.ok(q.lines.some(l => l.key === "lpc"));
  assert.ok(q.lines.some(l => l.key === "licensed_sign_hanger"));
  assert.ok(q.lines.some(l => l.key === "drawings_with_stamp"));
});

test("pdf route returns HTML fallback when Netlify (no Playwright)", async () => {
  process.env.NETLIFY = "true";
  process.env.QUOTE_ENGINE_PASSWORD = "test-ops-pass";
  assert.equal(canRenderProposalPdf(), false);
  const res = await handleQuoteEngine(
    new Request("http://localhost/api/quote-engine/proposal/demo.pdf", {
      headers: { Authorization: "Bearer test-ops-pass" },
    }),
    {},
  );
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") || "", /text\/html/);
  assert.equal(res.headers.get("X-Quote-Engine-Pdf-Fallback"), "html");
  const html = await res.text();
  assert.match(html, /Print or save as PDF/);
  assert.match(html, /Server PDF is not available/);
  delete process.env.NETLIFY;
  delete process.env.QUOTE_ENGINE_PASSWORD;
});

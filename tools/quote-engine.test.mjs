import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";
import { resetMockSheet, mockSheetRows, appendLeadRow } from "../netlify/lib/google-sheets.mjs";
import { normalizeLead, isQuoteEngineForm, leadToSheetRow } from "../netlify/lib/quote-leads.mjs";
import { computeQuote, formatMoney } from "../netlify/lib/quote-compute.mjs";
import { buildProposalHtml } from "../netlify/lib/proposal.mjs";
import { handleQuoteEngine } from "../netlify/lib/quote-engine-api.mjs";
import { PLACEHOLDER } from "../netlify/lib/quote-rates.mjs";

beforeEach(() => {
  resetMockSheet();
  delete process.env.QUOTE_ENGINE_SHEET_ID;
  delete process.env.QUOTE_ENGINE_GOOGLE_CREDENTIALS;
  delete process.env.QUOTE_ENGINE_PASSWORD;
  delete process.env.QUOTE_ENGINE_WEBHOOK_SECRET;
});

test("recognizes quote engine forms", () => {
  assert.equal(isQuoteEngineForm("quote-request"), true);
  assert.equal(isQuoteEngineForm("sign-estimate-request"), true);
  assert.equal(isQuoteEngineForm("sign-proof-activity"), false);
});

test("normalizes quote-request with scope-finder", () => {
  const lead = normalizeLead({
    number: 42,
    form_name: "quote-request",
    data: {
      name: "Alex GC",
      email: "alex@gc.com",
      type: "Channel letters",
      "project-address": "100 Broadway",
      borough: "Manhattan",
      "scope-finder": "Exterior Signage Package",
      message: "Need bid by Friday",
    },
  });
  assert.equal(lead.id, "quote-request-42");
  assert.match(lead.scopeSummary, /Exterior Signage Package/);
  assert.equal(lead.calculatorInput.boroughZone, "manhattan");
});

test("computeQuote uses placeholder rates and minimum job charge", () => {
  assert.equal(PLACEHOLDER, true);
  const quote = computeQuote({
    signType: "Channel letters",
    quantity: 1,
    sizeW: 12,
    sizeH: 2.5,
    sizeUnit: "ft",
    lit: "Lit",
    height: "2nd floor or higher",
    permitsRequested: true,
    boroughZone: "brooklyn",
  });
  assert.ok(quote.total >= 850);
  assert.ok(quote.lines.length >= 4);
  assert.equal(quote.placeholder, true);
});

test("appendLeadRow falls back to mock sheet without credentials", async () => {
  const lead = normalizeLead({ number: 1, form_name: "quote-request", data: { name: "Test" } });
  const row = leadToSheetRow(lead);
  const result = await appendLeadRow(row);
  assert.equal(result.mode, "mock");
  assert.equal(mockSheetRows.length, 1);
  assert.equal(mockSheetRows[0][0], lead.id);
});

test("proposal html is client-safe copy", () => {
  const lead = { name: "Client", company: "Sample Co", address: "1 Main St, Brooklyn", scopeSummary: "Channel letters" };
  const quote = computeQuote({ signType: "Channel letters", sizeW: 10, sizeH: 2, sizeUnit: "ft", lit: "Lit", boroughZone: "brooklyn" });
  const html = buildProposalHtml({ lead, quote });
  assert.match(html, /\(347\) 450-2110/);
  assert.match(html, /jc@arcsignco\.com/);
  assert.match(html, /Mon–Fri 8 AM–6 PM/);
  assert.doesNotMatch(html, /\bvendor\b/i);
  assert.doesNotMatch(html, />\s*I\s+/);
  assert.ok(html.includes(formatMoney(quote.total)));
});

test("calculate API requires password", async () => {
  process.env.QUOTE_ENGINE_PASSWORD = "test-ops-pass";
  const deny = await handleQuoteEngine(
    new Request("http://localhost/api/quote-engine/calculate", { method: "POST", body: "{}" }),
    {},
  );
  assert.equal(deny.status, 401);
  const ok = await handleQuoteEngine(
    new Request("http://localhost/api/quote-engine/calculate", {
      method: "POST",
      headers: { Authorization: "Bearer test-ops-pass", "Content-Type": "application/json" },
      body: JSON.stringify({ input: { signType: "Awning", sizeW: 8, sizeH: 3, sizeUnit: "ft", lit: "Non-lit", boroughZone: "queens" } }),
    }),
    {},
  );
  assert.equal(ok.status, 200);
  const json = await ok.json();
  assert.ok(json.quote.total > 0);
});

test("webhook skips unknown forms", async () => {
  const res = await handleQuoteEngine(
    new Request("http://localhost/api/quote-engine/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form_name: "other", data: {} }),
    }),
    {},
  );
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.skipped, true);
});

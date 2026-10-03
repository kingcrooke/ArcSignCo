import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const dir = dirname(fileURLToPath(import.meta.url));
const pricingSource = readFileSync(join(dir, "pricing-config.js"), "utf8");
// eslint-disable-next-line no-new-func
new Function("globalThis", pricingSource)(globalThis);

const compute = globalThis.computeArcPreliminaryEstimate;

test("estimate low is always less than high", () => {
  const cases = [
    ["channelLetters", "halo", 48, 12],
    ["channelLetters", "none", 24, 6],
    ["flatPanel", "none", 20, 5],
    ["lightbox", "internal", 96, 24],
    ["blade", "face", 36, 48],
  ];
  for (const [type, illum, w, h] of cases) {
    const est = compute(type, illum, w, h);
    assert.ok(est, `expected estimate for ${type}`);
    assert.ok(est.low < est.high, `${type}: low ${est.low} must be < high ${est.high}`);
  }
});

test("minEstimate floor never inverts the range (regression)", () => {
  const est = compute("channelLetters", "halo", 24, 6);
  assert.ok(est.low < est.high);
  assert.ok(est.low >= 2800);
});

test("small flat panel keeps ordered range above minEstimate", () => {
  const est = compute("flatPanel", "none", 20, 5);
  assert.equal(est.low, 1400);
  assert.ok(est.high > est.low);
});

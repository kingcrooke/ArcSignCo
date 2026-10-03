import assert from "node:assert/strict";
import test from "node:test";
import { preliminaryPrice } from "./sign-mockup/pricing-config.js";

test("channel letters use base, width, and no face-lit adder", () => {
  const price = preliminaryPrice("channel-letters", 48, "face-lit");
  assert.equal(price.amountUsd, 2970);
  assert.equal(price.baseUsd, 950);
  assert.equal(price.illuminationUsd, 0);
  assert.equal(price.label, "Arc placeholder rate");
});

test("halo-lit adds the placeholder illumination amount", () => {
  const price = preliminaryPrice("channel-letters", 48, "halo-lit");
  assert.equal(price.amountUsd, 3190);
  assert.equal(price.illuminationLabel, "Halo-lit");
});

test("flat panel neon rounds to the nearest ten", () => {
  const price = preliminaryPrice("flat-panel", 24, "neon");
  assert.equal(price.amountUsd, 1000);
});

test("missing calibration or an unknown type has no price", () => {
  assert.equal(preliminaryPrice("lightbox", 0, "internal"), null);
  assert.equal(preliminaryPrice("pylon", 36, "face-lit"), null);
  assert.equal(preliminaryPrice("blade", 36, "back-lit"), null);
});

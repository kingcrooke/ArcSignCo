/**
 * Arc Signage Co — preliminary pricing PLACEHOLDERS.
 *
 * This is the only price list the sign mockup tool reads.
 * The browser loads this file, so it is public. Do not put vendor names,
 * vendor costs, or confidential shop rates in it.
 *
 * The figures are stand-ins so a proof can show a rough number from the
 * same calibrated width as the picture. They are not a quote, not a
 * contract, and not current shop rates. Replace the numbers in this file
 * before sending approval links to clients.
 */

export const CONCEPT_DISCLAIMER = "Concept only \u2013 not a shop drawing.";

/** ASCII form for the PDF, whose standard fonts mishandle some punctuation. */
export const CONCEPT_DISCLAIMER_PDF =
  "Concept only - not a shop drawing. Not to scale for fabrication.";

export const ARC_PRICING_PLACEHOLDERS = {
  version: "2026-10-placeholder",
  label: "Arc placeholder rate",
  disclaimer:
    "Preliminary placeholder only. Not a quote. Arc confirms the price after a survey.",
  types: {
    "channel-letters": {
      label: "Channel letters",
      baseUsd: 950,
      perInchOfWidthUsd: 42,
    },
    lightbox: {
      label: "Lightbox / cabinet",
      baseUsd: 700,
      perInchOfWidthUsd: 26,
    },
    blade: {
      label: "Blade sign",
      baseUsd: 1100,
      perInchOfWidthUsd: 48,
    },
    "flat-panel": {
      label: "Flat panel",
      baseUsd: 280,
      perInchOfWidthUsd: 14,
    },
  },
  illuminationUsd: {
    "face-lit": 0,
    "halo-lit": 220,
    internal: 160,
    neon: 380,
  },
};

export const SIGN_TYPES = [
  { id: "channel-letters", label: "Channel letters", note: "Returns and a raceway" },
  { id: "lightbox", label: "Lightbox / cabinet", note: "Depth and trim" },
  { id: "blade", label: "Blade sign", note: "Projects from the wall" },
  { id: "flat-panel", label: "Flat panel", note: "Standoffs, thin face" },
];

export const ILLUMINATION_MODES = [
  { id: "face-lit", label: "Face-lit", note: "Lit face, spill on the wall" },
  { id: "halo-lit", label: "Halo-lit", note: "Light behind the sign" },
  { id: "internal", label: "Internal", note: "Light inside the face" },
  { id: "neon", label: "Neon", note: "Tube glow and wall spill" },
];

export function signTypeLabel(id) {
  return ARC_PRICING_PLACEHOLDERS.types[id]?.label || "";
}

export function illuminationLabel(id) {
  return ILLUMINATION_MODES.find((mode) => mode.id === id)?.label || "";
}

/**
 * Rough preliminary price from calibrated width, sign type, and illumination.
 * Returns null when the width is missing or the type is unknown.
 * Rounded to the nearest $10 so it does not look like a measured bid.
 */
export function preliminaryPrice(signType, widthInches, illumination) {
  const pricing = ARC_PRICING_PLACEHOLDERS;
  const type = pricing.types[signType];
  const illum = pricing.illuminationUsd[illumination];
  if (!type || illum === undefined || !Number.isFinite(widthInches) || widthInches <= 0) {
    return null;
  }
  const widthPart = widthInches * type.perInchOfWidthUsd;
  const raw = type.baseUsd + widthPart + illum;
  const amountUsd = Math.round(raw / 10) * 10;
  return {
    amountUsd,
    signType,
    signTypeLabel: type.label,
    illumination,
    illuminationLabel: illuminationLabel(illumination),
    widthInches,
    baseUsd: type.baseUsd,
    perInchOfWidthUsd: type.perInchOfWidthUsd,
    widthPartUsd: amountUsd - type.baseUsd - illum,
    illuminationUsd: illum,
    label: pricing.label,
    version: pricing.version,
    disclaimer: pricing.disclaimer,
  };
}

export function formatUsd(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Arc Signage Co — sign mockup preliminary pricing placeholders.
 * Edit these values in one place; labels are client-facing (no vendor costs).
 */
(function (global) {
  "use strict";

  global.ARC_SIGN_MOCKUP_PRICING = {
    currency: "USD",
    estimateLabel: "Preliminary estimate (Arc placeholder rates)",
    estimateDisclaimer:
      "Rough budget range from calibrated size and sign type only. Final quote follows site survey, permits, electrical, and fabrication drawings.",
    contact: {
      phone: "(347) 450-2110",
      emailPrimary: "jc@arcsignco.com",
      emailStudio: "arc@arcsignco.com",
      site: "arcsignco.com",
    },
    /** Flat fees added to every estimate (install mobilization placeholder). */
    baseMobilization: 650,
    /** Per linear foot of sign width (placeholder). */
    perLinearFootWidth: 95,
    signTypes: {
      channelLetters: {
        label: "Channel letters",
        multiplier: 1.35,
        minEstimate: 2800,
      },
      lightbox: {
        label: "Lightbox / cabinet",
        multiplier: 1.15,
        minEstimate: 2200,
      },
      blade: {
        label: "Blade sign",
        multiplier: 1.25,
        minEstimate: 2400,
      },
      flatPanel: {
        label: "Flat panel",
        multiplier: 0.95,
        minEstimate: 1400,
      },
    },
    illumination: {
      none: { label: "Non-illuminated", multiplier: 1 },
      face: { label: "Face-lit", multiplier: 1.08 },
      halo: { label: "Halo-lit", multiplier: 1.18 },
      internal: { label: "Internal / lightbox glow", multiplier: 1.12 },
      neon: { label: "Exposed neon / tube glow", multiplier: 1.28 },
    },
  };

  /**
   * @param {string} signTypeKey
   * @param {string} illuminationKey
   * @param {number} widthInches
   * @param {number} heightInches
   * @returns {{ low: number, high: number, label: string, detail: string } | null}
   */
  global.computeArcPreliminaryEstimate = function (signTypeKey, illuminationKey, widthInches, heightInches) {
    const cfg = global.ARC_SIGN_MOCKUP_PRICING;
    const type = cfg.signTypes[signTypeKey];
    const illum = cfg.illumination[illuminationKey] || cfg.illumination.none;
    if (!type || !widthInches || !heightInches || widthInches <= 0 || heightInches <= 0) {
      return null;
    }
    const widthFt = widthInches / 12;
    const areaSqFt = (widthInches * heightInches) / 144;
    const core =
      cfg.baseMobilization +
      widthFt * cfg.perLinearFootWidth +
      areaSqFt * 120 * type.multiplier * illum.multiplier;
    const low = Math.max(type.minEstimate, Math.round(core * 0.92));
    const high = Math.round(core * 1.18);
    return {
      low,
      high,
      label: cfg.estimateLabel,
      detail: `${type.label} · ${illum.label} · ~${widthInches.toFixed(1)}″ × ${heightInches.toFixed(1)}″`,
    };
  };
})(typeof window !== "undefined" ? window : globalThis);

// ============================================================================================
//  PUBLIC PRICING CONFIG — no rate numbers (those live in tools/pricing-rates-data.mjs, not served on the web).
//
//  While PLACEHOLDER is true the tool, proof page, PDF and server show NO_PRICE_MESSAGE only.
// ============================================================================================

export const PLACEHOLDER = true;
export const RATES_VERSION = "placeholder-2026-10-04";
export const RATES_LABEL = "Preliminary estimate";

export const NO_PRICE_MESSAGE = "Pricing comes in a formal written estimate after a site survey. This preview is a concept only.";
export const DISCLAIMER_FULL = "Concept preview only, not to scale. Final size, materials, survey, permits and fees, electrical and install conditions are confirmed in a formal written estimate. Permit approval is not guaranteed. Work is coordinated through Arc's licensed partners.";
export const RATES_NOTE = DISCLAIMER_FULL;

export const ROUNDING = { step: 50 };
export const RANGE = { spread: 1.35 };

// Row metadata only (label + unit). Numeric rates are not published.
export const ROWS = {
  "letters-trimcap": { label: "Channel letters, trim cap", unit: "letters" },
  "letters-trimless": { label: "Channel letters, trimless", unit: "letters" },
  "letters-halo": { label: "Reverse channel letters", unit: "letters" },
  "letters-combo": { label: "Front and back lit letters", unit: "letters" },
  "letters-raceway": { label: "Channel letters on a raceway", unit: "letters", adders: ["raceway"] },
  "letters-openneon": { label: "Open-face neon letters", unit: "letters" },
  "letters-fco": { label: "Flat cut-out letters", unit: "letters" },
  "letters-fabmetal": { label: "Fabricated metal letters", unit: "letters" },
  "cabinet-lightbox": { label: "Light box", unit: "sqft" },
  "cabinet-pushthru": { label: "Push-through cabinet", unit: "sqft" },
  "blade-lit": { label: "Lit blade sign", unit: "sqft" },
  "blade-nonlit": { label: "Non-lit blade sign", unit: "sqft" },
  "panel-flat": { label: "Flat panel", unit: "sqft" },
  "panel-gooseneck": { label: "Panel with gooseneck lights", unit: "sqft" },
  "neon-backer": { label: "Neon on a backer", unit: "lf" },
  "graphics-vinyl": { label: "Applied vinyl", unit: "sqft" },
  "graphics-painted": { label: "Painted wall sign", unit: "sqft" },

  "awning-slope": { label: "Fabric or vinyl awning, simple shape", unit: "projecting" },
  "awning-faceted": { label: "Fabric or vinyl awning, faceted shape", unit: "projecting" },
  "awning-round": { label: "Dome, cone or barrel awning", unit: "projecting" },
  "awning-seam": { label: "Standing-seam metal awning", unit: "projecting" },
  "awning-face": { label: "Sign-face awning", unit: "projecting" },
  "canopy-metal": { label: "Metal canopy", unit: "projecting" },
  "canopy-marquee": { label: "Marquee", unit: "projecting" },
  "canopy-glass": { label: "Glass or polycarbonate canopy", unit: "projecting" },
  "canopy-entrance": { label: "Entrance canopy", unit: "projecting" },
  "canopy-freestanding": { label: "Freestanding canopy", unit: "projecting" },
  "retractable": { label: "Retractable awning", unit: "projecting" },
  "droparm": { label: "Drop-arm awning", unit: "projecting" },
};

export const ADDERS = {
  "face-lit": { label: "Face-lit LEDs and power supply", per: "sqft", lighting: ["face", "face-sides", "face-halo"] },
  "halo-lit": { label: "Halo-lit LEDs and standoffs", per: "sqft", lighting: ["halo", "face-halo"] },
  raceway: { label: "Raceway", per: "lf" },
  neon: { label: "Neon or LED neon and power supply", per: "lf", lighting: ["neon"] },
  "internal-lit": { label: "Internal LEDs and power supply", per: "sqft", lighting: ["internal", "internal-letters"] },
  gooseneck: { label: "Gooseneck fixtures", per: "lf", lighting: ["external"] },
  backlit: { label: "Backlighting inside the frame", per: "lf", lighting: ["backlit"] },
  "fascia-lit": { label: "Internally lit fascia", per: "lf", lighting: ["fascia"] },
};

export const EXTRAS = [
  { key: "lift", label: "Lift or boom truck, if needed" },
  { key: "removal", label: "Removing an existing sign or awning, if needed" },
  { key: "afterHours", label: "After-hours install, if required" },
  { key: "access", label: "Difficult access (scaffold, sidewalk shed, roof)" },
  { key: "permit", label: "Permit and filing fees", confirm: "confirmed after site survey" },
  { key: "survey", label: "Site survey", confirm: "confirmed after site survey" },
];

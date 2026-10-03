// ============================================================================================
//  PLACEHOLDER RATES. NOT ARC'S REAL PRICING. NOT A QUOTE.
//
//  Every price number the tool uses lives in this file: the rows, the minimums, the adders, the
//  extra lines, the rounding step, the range rule, the tax line and how long an estimate is good
//  for. Category modules only point each type id at a row here (their `pricing.row` map).
//
//  While PLACEHOLDER is true the tool, the phone proof page, the PDF and the server show NO dollar
//  amounts: they show NO_PRICE_MESSAGE and the full disclaimer instead. Replace the numbers with
//  Arc's own, bump RATES_VERSION, then set PLACEHOLDER to false to show "Preliminary estimate".
//
//  How an estimate is built (pricing.js computeEstimate):
//    1. size quantity, from the calibrated mockup, by the row's unit:
//         "letters"  sq ft of the letter box: width × letter height
//         "sqft"     sq ft of the face: width × height
//         "lf"       linear ft of width
//         "projecting" linear ft of width, plus sq ft of cover (width × projection) at projRate
//    2. low = base + rate × quantity (+ projRate × width × projection for awnings)
//    3. the row minimum: low never goes below min (the minimum itself is rounded UP to the step)
//    4. illumination adders after the minimum: each adder is base + rate × its own quantity
//       ("sqft" = the face or letter-box area, "lf" = linear ft of width)
//    5. round low DOWN to ROUNDING.step, but never below the rounded minimum
//    6. high = low × RANGE.spread, rounded UP to the step (and at least one step above low)
//  Extra lines (lift, removal, after-hours, access) are listed separately with their own range and
//  are not in the main range. Permit and survey are "confirmed after site survey", never priced.
// ============================================================================================

export const PLACEHOLDER = true;
export const RATES_VERSION = "placeholder-2026-10-03b";
export const RATES_LABEL = "Preliminary estimate";

export const NO_PRICE_MESSAGE = "A price is prepared after a site survey. This is a concept only. It is not a quote or a contract.";
export const DISCLAIMER_FULL = "Preliminary estimate only. Not a quote or a contract. Subject to a site survey, final artwork, permits and fees, electrical and install conditions, and sales tax. The mockup is illustrative, not to scale, and not a shop drawing. Permit requirements are confirmed after a site survey; approval is not guaranteed.";
export const RATES_NOTE = DISCLAIMER_FULL;
export const TAX_NOTE = "Sales tax extra where it applies (NYC combined rate on the final invoice).";
export const VALID_DAYS = 30;
export const validNote = dateText => `Preliminary estimate valid ${VALID_DAYS} days from ${dateText}. Arc re-prices after that.`;

export const ROUNDING = { step: 50 };
/** The range rule: high = low × spread, rounded out to the step. */
export const RANGE = { spread: 1.35 };

// A row: { label, unit, base, rate, min, projRate? (awning only) }. Dollars.
export const ROWS = {
  "letters-trimcap": { label: "Channel letters, trim cap", unit: "letters", base: 600, rate: 95, min: 1800 },
  "letters-trimless": { label: "Channel letters, trimless", unit: "letters", base: 700, rate: 120, min: 2200 },
  "letters-halo": { label: "Reverse channel letters", unit: "letters", base: 700, rate: 115, min: 2400 },
  "letters-combo": { label: "Front and back lit letters", unit: "letters", base: 800, rate: 125, min: 2800 },
  "letters-raceway": { label: "Channel letters on a raceway", unit: "letters", base: 600, rate: 95, min: 2000, adders: ["raceway"] },
  "letters-openneon": { label: "Open-face neon letters", unit: "letters", base: 700, rate: 110, min: 2600 },
  "letters-fco": { label: "Flat cut-out letters", unit: "letters", base: 300, rate: 40, min: 600 },
  "letters-fabmetal": { label: "Fabricated metal letters", unit: "letters", base: 400, rate: 65, min: 1200 },
  "cabinet-lightbox": { label: "Light box", unit: "sqft", base: 500, rate: 55, min: 1800 },
  "cabinet-pushthru": { label: "Push-through cabinet", unit: "sqft", base: 700, rate: 95, min: 2600 },
  "blade-lit": { label: "Lit blade sign", unit: "sqft", base: 600, rate: 110, min: 2400 },
  "blade-nonlit": { label: "Non-lit blade sign", unit: "sqft", base: 400, rate: 90, min: 900 },
  "panel-flat": { label: "Flat panel", unit: "sqft", base: 150, rate: 28, min: 450 },
  "panel-gooseneck": { label: "Panel with gooseneck lights", unit: "sqft", base: 300, rate: 35, min: 1400 },
  "neon-backer": { label: "Neon on a backer", unit: "lf", base: 300, rate: 120, min: 700 },
  "graphics-vinyl": { label: "Applied vinyl", unit: "sqft", base: 100, rate: 12, min: 200 },
  "graphics-painted": { label: "Painted wall sign", unit: "sqft", base: 300, rate: 18, min: 800 },

  "awning-slope": { label: "Fabric or vinyl awning, simple shape", unit: "projecting", base: 400, rate: 70, projRate: 20, min: 1200 },
  "awning-faceted": { label: "Fabric or vinyl awning, faceted shape", unit: "projecting", base: 500, rate: 85, projRate: 24, min: 1500 },
  "awning-round": { label: "Dome, cone or barrel awning", unit: "projecting", base: 600, rate: 90, projRate: 26, min: 1400 },
  "awning-seam": { label: "Standing-seam metal awning", unit: "projecting", base: 700, rate: 110, projRate: 30, min: 2000 },
  "awning-face": { label: "Sign-face awning", unit: "projecting", base: 600, rate: 95, projRate: 22, min: 1600 },
  "canopy-metal": { label: "Metal canopy", unit: "projecting", base: 1200, rate: 160, projRate: 40, min: 3000 },
  "canopy-marquee": { label: "Marquee", unit: "projecting", base: 3000, rate: 380, projRate: 60, min: 8000 },
  "canopy-glass": { label: "Glass or polycarbonate canopy", unit: "projecting", base: 2000, rate: 260, projRate: 55, min: 5000 },
  "canopy-entrance": { label: "Entrance canopy", unit: "projecting", base: 2000, rate: 180, projRate: 30, min: 4500 },
  "canopy-freestanding": { label: "Freestanding canopy", unit: "projecting", base: 2000, rate: 170, projRate: 30, min: 4500 },
  "retractable": { label: "Retractable awning", unit: "projecting", base: 900, rate: 110, projRate: 18, min: 2500 },
  "droparm": { label: "Drop-arm awning", unit: "projecting", base: 300, rate: 70, projRate: 10, min: 900 },
};

// Illumination adders, applied after the minimum. `lighting`: the lighting keys (lighting.js) that
// switch an adder on; a row's own `adders` list switches one on for that row regardless.
export const ADDERS = {
  "face-lit": { label: "Face-lit LEDs and power supply", per: "sqft", base: 250, rate: 30, lighting: ["face", "face-sides", "face-halo"] },
  "halo-lit": { label: "Halo-lit LEDs and standoffs", per: "sqft", base: 300, rate: 35, lighting: ["halo", "face-halo"] },
  raceway: { label: "Raceway", per: "lf", base: 150, rate: 45 },
  neon: { label: "Neon or LED neon and power supply", per: "lf", base: 250, rate: 40, lighting: ["neon"] },
  "internal-lit": { label: "Internal LEDs and power supply", per: "sqft", base: 250, rate: 22, lighting: ["internal", "internal-letters"] },
  gooseneck: { label: "Gooseneck fixtures", per: "lf", base: 200, rate: 60, lighting: ["external"] },
  backlit: { label: "Backlighting inside the frame", per: "lf", base: 300, rate: 120, lighting: ["backlit"] },
};

// Separate lines, never part of the main range. `range` lines carry their own [low, high];
// `confirm` lines are confirmed after the site survey and carry no number.
export const EXTRAS = [
  { key: "lift", label: "Lift or boom truck, if needed", range: [450, 1200] },
  { key: "removal", label: "Removing an existing sign or awning, if needed", range: [300, 1500] },
  { key: "afterHours", label: "After-hours install, if required", range: [250, 900] },
  { key: "access", label: "Difficult access (scaffold, sidewalk shed, roof)", range: [400, 2000] },
  { key: "permit", label: "Permit and filing fees", confirm: "confirmed after site survey" },
  { key: "survey", label: "Site survey", confirm: "confirmed after site survey" },
];

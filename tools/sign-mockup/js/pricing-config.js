// ============================================================================================
//  PLACEHOLDER RATES. NOT ARC'S REAL PRICING. NOT A QUOTE.
//
//  This is the only file that holds price numbers for the sign mockup tool and its phone
//  proof page. Every number below is a stand-in so the preliminary range can be shown and
//  tested. Replace them with Arc's own rates before showing a range to a client.
//
//  Each sign type has:
//    basis  "width" = dollars per linear foot of sign width
//           "area"  = dollars per square foot (width × height)
//    low / high     the rate range for that basis (low must be less than high)
//    min            [low, high] minimum job amount, used when the rate gives less
//
//  Awnings are priced per linear foot of awning width (the pinned width), by shape. A shape
//  that can be backlit adds BACKLIT_ADDER per linear foot when backlighting is chosen;
//  shapes marked lit: true already include their lighting.
//
//  Sizes come from the calibrated mockup. Permits, surveys, electrical work, removal of an
//  old sign, lifts and engineering are not included in any of these numbers.
// ============================================================================================

export const PLACEHOLDER = true;
export const RATES_VERSION = "placeholder-2026-10-03";
export const RATES_LABEL = "Arc placeholder rates";
export const RATES_NOTE = "Rough preliminary range from placeholder rates, not a quote. Permits, survey, electrical, removal and lift work are not included. Arc confirms pricing after field measurements.";

export const RATES = {
  trimcap: { basis: "width", low: 260, high: 420, min: [1800, 2800] },
  trimless: { basis: "width", low: 320, high: 520, min: [2200, 3400] },
  halo: { basis: "width", low: 340, high: 560, min: [2400, 3800] },
  combo: { basis: "width", low: 400, high: 650, min: [2800, 4400] },
  raceway: { basis: "width", low: 280, high: 450, min: [2000, 3200] },
  openneon: { basis: "width", low: 360, high: 600, min: [2600, 4200] },
  fco: { basis: "width", low: 90, high: 170, min: [600, 1100] },
  fabmetal: { basis: "width", low: 180, high: 320, min: [1200, 2200] },
  lightbox: { basis: "area", low: 75, high: 125, min: [1800, 3000] },
  pushthru: { basis: "area", low: 120, high: 200, min: [2600, 4200] },
  bladelit: { basis: "area", low: 160, high: 260, min: [2400, 3800] },
  blade: { basis: "area", low: 90, high: 160, min: [900, 1600] },
  panel: { basis: "area", low: 28, high: 50, min: [450, 850] },
  gooseneck: { basis: "area", low: 40, high: 70, min: [1400, 2400] },
  neonbacker: { basis: "width", low: 150, high: 260, min: [700, 1300] },
  vinyl: { basis: "area", low: 12, high: 24, min: [200, 400] },
  painted: { basis: "area", low: 18, high: 35, min: [800, 1500] },
};

// Awnings: dollars per linear foot of width. ESTIMATE PLACEHOLDERS, not Arc's pricing.
export const AWNING_RATES = {
  "aw-traditional": { low: 180, high: 320, min: [1200, 2000] },
  "aw-quarter": { low: 200, high: 340, min: [1300, 2200] },
  "aw-convex": { low: 210, high: 350, min: [1300, 2200] },
  "aw-concave": { low: 210, high: 350, min: [1300, 2200] },
  "aw-bullnose": { low: 220, high: 360, min: [1400, 2300] },
  "aw-hip": { low: 230, high: 380, min: [1500, 2500] },
  "aw-mansard": { low: 260, high: 420, min: [1800, 3000] },
  "aw-bay": { low: 260, high: 430, min: [1800, 3000] },
  "aw-gable": { low: 250, high: 420, min: [1600, 2700] },
  "aw-seam": { low: 280, high: 460, min: [2000, 3300] },
  "aw-spear": { low: 240, high: 400, min: [1600, 2700] },
  "aw-dutch": { low: 150, high: 260, min: [900, 1500] },
  "aw-dome": { low: 260, high: 440, min: [1400, 2400] },
  "aw-longdome": { low: 260, high: 430, min: [1600, 2700] },
  "aw-cone": { low: 250, high: 420, min: [1400, 2400] },
  "aw-halfbarrel": { low: 240, high: 400, min: [1500, 2500] },
  "aw-barrel": { low: 420, high: 700, min: [3500, 6000] },
  "aw-waterfall": { low: 240, high: 400, min: [1600, 2700] },
  "aw-box": { low: 230, high: 380, min: [1500, 2500] },
  "aw-backlit": { low: 380, high: 620, min: [3000, 5000], lit: true },
  "aw-wedge": { low: 260, high: 430, min: [1800, 3000] },
  "aw-flat": { low: 420, high: 700, min: [3000, 5000] },
  "aw-marquee": { low: 900, high: 1500, min: [8000, 14000], lit: true },
  "aw-louver": { low: 380, high: 640, min: [2800, 4600] },
  "aw-glass": { low: 650, high: 1100, min: [5000, 8500] },
  "aw-entrance": { low: 500, high: 850, min: [4500, 8000] },
  "aw-freestanding": { low: 450, high: 780, min: [4500, 7500] },
  "aw-retractable": { low: 250, high: 450, min: [2500, 4200] },
  "aw-droparm": { low: 160, high: 280, min: [900, 1600] },
};
export const BACKLIT_ADDER = { low: 120, high: 220 };
export const AWNING_NOTE = "Estimate placeholder per linear foot of awning width, not a quote. Permits, electrical, removal and lift work are not included.";

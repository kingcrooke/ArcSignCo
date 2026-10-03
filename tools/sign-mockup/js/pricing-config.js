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
  awning: { basis: "width", low: 300, high: 500, min: [1800, 3000] },
  painted: { basis: "area", low: 18, high: 35, min: [800, 1500] },
};

// ============================================================================================
//  PLACEHOLDER RATES. NOT ARC'S REAL PRICING. NOT A QUOTE.
//
//  The rate numbers live in each category module's `pricing` block (js/categories/signs.js,
//  js/categories/awnings.js, …), next to the types they price; every block is marked
//  placeholder: true. This file holds what all of them share: the label, the version and the
//  note shown with every range. Replace the rates with Arc's own before showing a range to a
//  client, then set PLACEHOLDER to false here and placeholder: false in each block.
//
//  A rate is { basis, low, high, min: [low, high] }:
//    basis  "width" = dollars per linear foot of width; "area" = dollars per square foot
//           (a category can name its own basis, e.g. "awning", priced per linear foot)
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

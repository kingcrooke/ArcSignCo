// ============================================================================================
//  INTERNAL QUOTE ENGINE RATES — PLACEHOLDER ONLY until Arc Signage Construction PM supplies real numbers.
//  Swap values here (and bump RATES_VERSION); no calculator code changes required.
// ============================================================================================

export const PLACEHOLDER = true;
export const RATES_VERSION = "internal-placeholder-2026-10-04";
export const RATES_LABEL = PLACEHOLDER ? "Internal placeholder estimate" : "Written estimate";

export const ROUNDING = { step: 50 };
export const MARKUP = { percent: 18 };
export const MIN_JOB_CHARGE = 850;

/** Borough / area → survey + travel allowance (placeholder dollars). */
export const TRAVEL_ZONES = {
  manhattan: { label: "Manhattan", surveyTravel: 275 },
  brooklyn: { label: "Brooklyn", surveyTravel: 225 },
  queens: { label: "Queens", surveyTravel: 225 },
  bronx: { label: "Bronx", surveyTravel: 250 },
  staten: { label: "Staten Island", surveyTravel: 300 },
  ny_other: { label: "Elsewhere in New York", surveyTravel: 350 },
  nj: { label: "New Jersey", surveyTravel: 325 },
  ct: { label: "Connecticut", surveyTravel: 375 },
  default: { label: "Tri-State", surveyTravel: 300 },
};

/** Map quote-request `type` or sign-estimate `sign_type` to a fabrication row id. */
export const TYPE_MAP = {
  "exterior sign": "letters-trimcap",
  "channel letters": "letters-trimcap",
  "led and illuminated": "letters-trimcap",
  "storefront / fascia": "letters-trimcap",
  "blade / projecting": "blade-lit",
  "lightbox / cabinet": "cabinet-lightbox",
  "window vinyl / graphics": "graphics-vinyl",
  "awning": "awning-slope",
  "ada / interior wayfinding": "panel-flat",
  "ada signage": "panel-flat",
  "interior wayfinding": "panel-flat",
  "mural / painted": "graphics-painted",
  "construction / temporary site signs": "panel-flat",
  "permits and code questions": "panel-flat",
  "monument / pylon": "panel-flat",
  "several of these": "letters-trimcap",
  "not sure": "letters-trimcap",
  other: "letters-trimcap",
};

// Row: { label, unit, base, rate, min, projRate? }. Dollars — PLACEHOLDER.
export const ROWS = {
  "letters-trimcap": { label: "Channel letters, trim cap", unit: "sqft", base: 600, rate: 95, min: 1800 },
  "letters-trimless": { label: "Channel letters, trimless", unit: "sqft", base: 700, rate: 120, min: 2200 },
  "cabinet-lightbox": { label: "Light box", unit: "sqft", base: 500, rate: 55, min: 1800 },
  "blade-lit": { label: "Lit blade sign", unit: "sqft", base: 600, rate: 110, min: 2400 },
  "blade-nonlit": { label: "Non-lit blade sign", unit: "sqft", base: 400, rate: 90, min: 900 },
  "panel-flat": { label: "Flat panel / wayfinding", unit: "sqft", base: 150, rate: 28, min: 450 },
  "graphics-vinyl": { label: "Applied vinyl", unit: "sqft", base: 100, rate: 12, min: 200 },
  "graphics-painted": { label: "Painted wall sign", unit: "sqft", base: 300, rate: 18, min: 800 },
  "awning-slope": { label: "Fabric awning, simple shape", unit: "projecting", base: 400, rate: 70, projRate: 20, min: 1200 },
};

export const ADDERS = {
  "face-lit": { label: "Face-lit LEDs and power supply", per: "sqft", base: 250, rate: 30 },
  "halo-lit": { label: "Halo-lit LEDs and standoffs", per: "sqft", base: 300, rate: 35 },
  raceway: { label: "Raceway", per: "lf", base: 150, rate: 45 },
};

export const ACCESS = {
  ground: { label: "Ground floor install (under 12 ft)", lift: 0, access: 0 },
  mid: { label: "Mid-height (12–25 ft)", lift: 650, access: 0 },
  high: { label: "Second floor or higher", lift: 950, access: 450 },
  default: { label: "Install access (to be confirmed)", lift: 0, access: 0 },
};

export const ELECTRICAL = {
  lit_new: { label: "Electrical allowance (new circuit, placeholder)", amount: 850 },
  lit_existing: { label: "Electrical tie-in allowance (existing power)", amount: 425 },
  none: { label: "Non-lit — no electrical allowance", amount: 0 },
};

export const PERMIT_LINE = {
  label: "Permit and filing coordination (allowance — confirmed after survey)",
  amount: 650,
  clientNote: "Permit and agency fees are confirmed after site survey and scope review.",
};

export const PROPOSAL = {
  validDays: 30,
  taxNote: "Sales tax applies where required on the final invoice.",
  disclaimer:
    "This written estimate is subject to site survey, final artwork, permit and agency requirements, electrical and structural conditions at the install location, and applicable sales tax. Approval by the owner's design professional and authorities is not guaranteed.",
};

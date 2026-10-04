import {
  PLACEHOLDER,
  RATES_VERSION,
  RATES_LABEL,
  ROUNDING,
  MARKUP,
  MIN_JOB_CHARGE,
  TRAVEL_ZONES,
  TYPE_MAP,
  ROWS,
  ADDERS,
  ACCESS,
  ELECTRICAL,
  PERMIT_LINE,
} from "./quote-rates.mjs";

const STEP = ROUNDING.step;
const floorTo = v => Math.floor(v / STEP) * STEP;
const ceilTo = v => Math.ceil(v / STEP) * STEP;

function normType(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function rowIdForInput(input) {
  const mock = String(input?.mockupType || "").trim();
  if (mock && ROWS[mock.replace(/^letters-/, "letters-")]) {
    const key = Object.keys(ROWS).find(k => mock.includes(k.split("-")[0]));
    if (key) return key;
  }
  const mapped = TYPE_MAP[normType(input?.signType)] || TYPE_MAP.other;
  if (input?.lit === "Non-lit" && normType(input?.signType).includes("blade")) return "blade-nonlit";
  return mapped;
}

function sizeToFeet(input) {
  if (input?.sizeNotSure || !(input?.sizeW > 0) || !(input?.sizeH > 0)) {
    return { widthFt: 8, heightFt: 2.5, assumed: true };
  }
  const unit = input.sizeUnit === "in" ? 1 / 12 : 1;
  return {
    widthFt: input.sizeW * unit,
    heightFt: input.sizeH * unit,
    assumed: false,
  };
}

function accessBand(height) {
  const h = String(height || "").toLowerCase();
  if (h.includes("2nd") || h.includes("higher")) return ACCESS.high;
  if (h.includes("12") || h.includes("25")) return ACCESS.mid;
  if (h.includes("ground") || h.includes("under 12")) return ACCESS.ground;
  return ACCESS.default;
}

function electricalLine(input) {
  if (input?.lit === "Non-lit") return ELECTRICAL.none;
  if (input?.power === "Yes") return ELECTRICAL.lit_existing;
  if (input?.lit === "Lit") return ELECTRICAL.lit_new;
  return ELECTRICAL.lit_new;
}

/**
 * @param {object} input calculatorInput from normalizeLead or admin overrides
 * @param {object} [overrides] optional field overrides from admin
 */
export function computeQuote(input = {}, overrides = {}) {
  const merged = { ...input, ...overrides };
  const rowId = rowIdForInput(merged);
  const row = ROWS[rowId] || ROWS["letters-trimcap"];
  const qty = Math.max(1, Number(merged.quantity) || 1);
  const { widthFt, heightFt, assumed } = sizeToFeet(merged);
  const areaFt = widthFt * heightFt;
  const projFt = heightFt * 0.5;

  let fab = row.base;
  if (row.unit === "sqft") fab += row.rate * areaFt;
  else if (row.unit === "lf") fab += row.rate * widthFt;
  else if (row.unit === "projecting") fab += row.rate * widthFt + (row.projRate || 0) * widthFt * projFt;
  else fab += row.rate * areaFt;

  fab = Math.max(fab, ceilTo(row.min));
  const lines = [
    {
      key: "fabrication",
      label: `${row.label}${qty > 1 ? ` (×${qty})` : ""}${assumed ? " — size assumed pending survey" : ""}`,
      amount: floorTo(fab * qty),
      clientLabel: row.label,
    },
  ];

  if (merged.lit === "Lit" || merged.lit === "Not sure") {
    const add = ADDERS["face-lit"];
    const addAmt = add.base + add.rate * areaFt;
    lines.push({
      key: "illumination",
      label: add.label,
      amount: floorTo(addAmt * qty),
      clientLabel: "Illumination and power supply",
    });
  }

  const access = accessBand(merged.height);
  if (access.lift > 0) {
    lines.push({ key: "lift", label: access.label, amount: access.lift, clientLabel: "Lift or boom access" });
  }
  if (access.access > 0) {
    lines.push({ key: "access", label: "Difficult access allowance", amount: access.access, clientLabel: "Access and protection" });
  }

  const elec = electricalLine(merged);
  if (elec.amount > 0) {
    lines.push({ key: "electrical", label: elec.label, amount: elec.amount, clientLabel: "Electrical coordination allowance" });
  }

  const zone = TRAVEL_ZONES[merged.boroughZone] || TRAVEL_ZONES.default;
  lines.push({
    key: "survey",
    label: `Site survey and travel (${zone.label})`,
    amount: zone.surveyTravel,
    clientLabel: "Site survey and travel",
  });

  if (merged.permitsRequested) {
    lines.push({
      key: "permit",
      label: PERMIT_LINE.label,
      amount: PERMIT_LINE.amount,
      clientLabel: "Permit and filing coordination",
      note: PERMIT_LINE.clientNote,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const withMarkup = floorTo(subtotal * (1 + MARKUP.percent / 100));
  const total = Math.max(withMarkup, MIN_JOB_CHARGE);

  return {
    placeholder: PLACEHOLDER,
    version: RATES_VERSION,
    label: RATES_LABEL,
    rowId,
    assumedSize: assumed,
    lines,
    subtotal,
    markupPercent: MARKUP.percent,
    total,
    clientLines: lines.map(l => ({
      label: l.clientLabel || l.label,
      amount: l.amount,
      note: l.note,
    })),
  };
}

export function formatMoney(v) {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

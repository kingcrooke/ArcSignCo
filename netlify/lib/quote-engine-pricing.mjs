import { loadRateCardForCompute } from "./rate-card-store.mjs";
import { resolveAllowances } from "./allowance-input.mjs";

export const TBD_LABEL = "TBD — Jesus to confirm";
export const CLIENT_TAX_LINE = "Sales tax: to be determined";

export function formatMoney(v) {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

export function roundLine(amount) {
  const n = Number(amount) || 0;
  const base = Math.floor(n / 10) * 10;
  const rem = n - base;
  return rem >= 5 ? base + 10 : base;
}

export function roundTotal(amount) {
  const n = Number(amount) || 0;
  if (n <= 0) return 0;
  const step = 25;
  return n % step === 0 ? n : Math.ceil(n / step) * step;
}

export function isTbd(item) {
  return item?.status === "market_estimate_TBD";
}

function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Map intake fields to a sign_types.id in the imported card. */
export function resolveSignTypeId(input, card) {
  const t = norm(input.signType || input.projectType || "");
  const byId = id => card.sign_types?.find(r => r.id === id)?.id;
  if (/monument|pylon/.test(t)) return byId("monument_pylon") || "monument_pylon";
  if (/mural|painted wall/.test(t)) return byId("wall_mural_painted") || "wall_mural_painted";
  if (/awning/.test(t)) return byId("awning_new") || byId("awning_recover");
  if (/ada|wayfinding|room id/.test(t)) return byId("ada_tactile_room_id") || byId("interior_wayfinding_plaque");
  if (/vinyl|window|graphics/.test(t)) return byId("window_vinyl_graphics") || byId("wall_graphics_printed_vinyl");
  if (/blade|projecting/.test(t)) {
    return input.lit === "Non-lit" ? byId("blade_projecting_non_lit") : byId("blade_projecting_lit");
  }
  if (/lightbox|cabinet/.test(t)) return byId("lightbox_cabinet_single_face");
  if (/flat panel|fascia|construction|panel/.test(t)) return byId("flat_panel_fascia_acm");
  if (/channel|storefront|exterior|led|illumin/.test(t)) {
    if (input.lit === "Non-lit") return byId("channel_letters_non_lit") || byId("placeholder_channel");
    if (/halo|reverse/.test(t)) return byId("channel_letters_halo");
    return byId("channel_letters_front_lit") || byId("placeholder_channel");
  }
  return byId("placeholder_channel") || card.sign_types?.[0]?.id;
}

function sizeToInches(input) {
  if (input.sizeNotSure || !(input.sizeW > 0)) return { widthIn: 144, heightIn: 30, assumed: true };
  const mult = input.sizeUnit === "in" ? 1 : 12;
  return {
    widthIn: input.sizeW * mult,
    heightIn: (input.sizeH > 0 ? input.sizeH : input.sizeW * 0.2) * mult,
    assumed: false,
  };
}

function quantityForBasis(basis, input) {
  const { widthIn, heightIn } = sizeToInches(input);
  const qty = Math.max(1, Number(input.quantity) || Number(input.sign_count) || 1);
  switch (basis) {
    case "per_letter_inch": {
      const letters = Number(input.letterCount) || Math.max(4, Math.round(widthIn / 10));
      const h = Math.max(6, Math.round(heightIn));
      return { qty: letters * h, note: `${letters} letters × ${h}" height` };
    }
    case "per_sqft":
      return { qty: (widthIn * heightIn) / 144, note: `${Math.round(widthIn)}" × ${Math.round(heightIn)}" face` };
    case "per_linear_ft":
      return { qty: widthIn / 12, note: `${(widthIn / 12).toFixed(1)} lf` };
    case "per_sign":
      return { qty, note: `${qty} sign(s)` };
    default:
      return { qty: 1, note: "" };
  }
}

function heightTier(input, card) {
  const h = norm(input.height);
  const tiers = card.height_access_adders?.tiers || [];
  if (h.includes("2nd") || h.includes("higher") || h.includes("over 25")) {
    return tiers.find(t => t.id === "over_25_ft") || { id: "over_25_ft", quote_only: true };
  }
  if (h.includes("12") && h.includes("25")) return tiers.find(t => t.id === "12_to_25_ft") || { id: "12_to_25_ft" };
  if (h.includes("ground") || h.includes("under 12")) return tiers.find(t => t.id === "under_12_ft") || { id: "under_12_ft" };
  return tiers.find(t => t.id === "under_12_ft") || { id: "under_12_ft" };
}

function travelZone(input, card) {
  const z = norm(input.boroughZone || input.zone || "");
  const zones = card.travel?.zones || [];
  if (z.includes("manhattan")) return zones.find(x => x.id === "manhattan") || zones[0];
  if (z.includes("brooklyn") || z.includes("queens") || z.includes("bronx") || z.includes("staten") || z.includes("outer")) {
    return zones.find(x => x.id === "outer_boroughs") || zones[0];
  }
  if (z.includes("jersey") || z === "nj") return zones.find(x => x.id === "new_jersey") || zones[0];
  if (z.includes("connecticut") || z === "ct") return zones.find(x => x.id === "connecticut") || zones[0];
  return zones.find(x => x.id === "default") || zones[0];
}

function bookLine(row, quantity, { path = "A" } = {}) {
  if (row.quote_only || row.basis === "quote_only") {
    return {
      key: row.id,
      label: row.label,
      clientLabel: row.label,
      quoteRequired: true,
      path,
      tbd: isTbd(row),
      low: 0,
      high: 0,
    };
  }
  const lowRaw = quantity * (row.low ?? 0);
  const highRaw = quantity * (row.high ?? row.low ?? 0);
  let low = roundLine(Math.max(lowRaw, row.minimum ?? 0));
  let high = roundLine(Math.max(highRaw, row.minimum ?? 0));
  if (high < low) high = low;
  return {
    key: row.id,
    label: row.label,
    clientLabel: row.label,
    path,
    tbd: isTbd(row),
    low,
    high,
    quantity,
  };
}

function addLine(lines, line) {
  if (line) lines.push(line);
}

/** Path B: cost × (1 + markup), optional preliminary contingency. */
export function computePathBLine({ label, materialCost, markupRate, preliminary, contingencyRate, status }) {
  const cost = Number(materialCost) || 0;
  let sell = cost * (1 + markupRate);
  if (preliminary) sell *= 1 + contingencyRate;
  const amount = roundLine(sell);
  return {
    key: "path_b_materials",
    label,
    clientLabel: label,
    path: "B",
    tbd: status === "market_estimate_TBD",
    low: amount,
    high: amount,
    amount,
  };
}

export function computeQuoteFromCard(card, input = {}, options = {}) {
  const surveyConfirmed = Boolean(options.surveyConfirmed);
  const allowances = resolveAllowances(input, card);
  const lines = [];
  let quoteRequiredAny = false;

  const typeId = resolveSignTypeId(input, card);
  const row = card.sign_types?.find(r => r.id === typeId) || card.sign_types[0];
  const { qty, note: qtyNote } = quantityForBasis(row?.basis, input);
  addLine(lines, bookLine(row, qty, { path: "A" }));
  if (lines.at(-1)?.quoteRequired) quoteRequiredAny = true;

  if (input.materialCost > 0) {
    addLine(
      lines,
      computePathBLine({
        label: "Materials (path B cost build-up)",
        materialCost: input.materialCost,
        markupRate: card.markup?.materials_markup?.suggested ?? 0.55,
        preliminary: !surveyConfirmed,
        contingencyRate: card.markup?.contingency?.suggested_on_cost_buildup_while_preliminary ?? 0.1,
        status: card.markup?.materials_markup?.status,
      }),
    );
  }

  const tier = heightTier(input, card);
  if (tier.quote_only) {
    addLine(lines, {
      key: "height_quote",
      label: "Install height over 25 ft",
      clientLabel: "Install access over 25 ft",
      quoteRequired: true,
      path: "A",
      tbd: isTbd(card.height_access_adders),
      low: 0,
      high: 0,
    });
    quoteRequiredAny = true;
  } else if (tier.id === "12_to_25_ft") {
    const sc = card.install?.access?.scaffold_per_day;
    if (sc && !sc.quote_only) {
      addLine(lines, {
        key: "access_scaffold",
        label: "Scaffold or scissor access (12–25 ft)",
        clientLabel: "Access equipment",
        path: "A",
        tbd: isTbd(sc),
        low: roundLine((sc.low ?? 0) + (sc.delivery_low ?? 0)),
        high: roundLine((sc.high ?? 0) + (sc.delivery_high ?? 0)),
      });
    }
  }

  if (allowances.allowElectrical) {
    const elec = card.electrical;
    if (elec?.low != null) {
      addLine(lines, {
        key: "electrical",
        label: elec.label || "Licensed electrician allowance",
        clientLabel: "Electrical coordination allowance",
        path: "A",
        tbd: isTbd(elec),
        low: roundLine(elec.low),
        high: roundLine(elec.high ?? elec.low),
      });
    }
  }

  const zone = travelZone(input, card);
  if (zone?.flat_low != null) {
    addLine(lines, {
      key: "travel",
      label: `Trip fee (${zone.label || "zone"})`,
      clientLabel: zone.label ? `Travel — ${zone.label}` : "Travel and trip fee",
      path: "A",
      tbd: isTbd(zone) || isTbd(card.travel),
      low: roundLine(zone.flat_low),
      high: roundLine(zone.flat_high ?? zone.flat_low),
    });
  }

  const survey = card.design_and_survey?.survey_fee;
  if (survey?.low != null) {
    addLine(lines, {
      key: "survey",
      label: "Site survey fee",
      clientLabel: "Site survey",
      path: "A",
      tbd: isTbd(survey),
      low: roundLine(survey.low),
      high: roundLine(survey.high ?? survey.low),
    });
  }

  for (const pl of card.permits?.lines || []) {
    if (pl.price_role === "city_pass_through_at_cost") continue;
    if (pl.low == null) continue;
    if (!allowances.permitLineIds.has(pl.id)) continue;
    addLine(lines, {
      key: pl.id,
      label: pl.label,
      clientLabel: pl.label,
      path: "A",
      tbd: isTbd(pl),
      low: roundLine(pl.low),
      high: roundLine(pl.high ?? pl.low),
    });
  }

  const priced = lines.filter(l => !l.quoteRequired);
  let lowSum = priced.reduce((s, l) => s + (l.low || 0), 0);
  let highSum = priced.reduce((s, l) => s + (l.high || l.low || 0), 0);

  for (const m of [card.job_minimums?.overall_minimum_order, card.job_minimums?.install_only_minimum].filter(Boolean)) {
    if (m.low) lowSum = Math.max(lowSum, m.low);
    if (m.high) highSum = Math.max(highSum, m.high ?? m.low);
  }
  lowSum = roundTotal(lowSum);
  highSum = roundTotal(Math.max(highSum, lowSum));

  const total = surveyConfirmed ? roundTotal((lowSum + highSum) / 2) : null;
  const tbdCount = lines.filter(l => l.tbd).length;

  const clientLines = priced.map(l => ({
    label: l.clientLabel || l.label,
    low: l.low,
    high: l.high,
    amount: surveyConfirmed ? roundLine((l.low + l.high) / 2) : undefined,
  }));

  return {
    version: card.meta?.version,
    source: options.source || "card",
    placeholder: options.source === "placeholder",
    preliminary: !surveyConfirmed,
    rangeLabel: card.range_output?.label || "Preliminary",
    preliminaryNotice: surveyConfirmed ? "" : card.range_output?.client_sentence,
    low: lowSum,
    high: highSum,
    total,
    lines,
    clientLines,
    tbdCount,
    tbdBanner: tbdCount ? `${TBD_LABEL} (${tbdCount} rate${tbdCount === 1 ? "" : "s"} in this quote)` : "",
    quoteRequiredAny,
    taxClientLine: CLIENT_TAX_LINE,
    validityDays: card.markup?.quote_validity_days?.suggested ?? 30,
    depositWording: card.markup?.deposit?.wording,
    qtyNote,
    signTypeId: typeId,
    signTypeLabel: row?.label,
  };
}

export async function computeQuote(input = {}, options = {}) {
  const { card, source } = await loadRateCardForCompute();
  return computeQuoteFromCard(card, input, { ...options, source });
}

/** Fallback rate card in repo — obviously fake numbers. Import the real card via admin (stored in Blobs only). */
export const PLACEHOLDER_RATE_CARD = {
  meta: {
    version: "placeholder-repo-0",
    name: "Placeholder — import rate card in Quote Engine admin",
    status_values: { market_estimate_TBD: "TBD — Jesus to confirm" },
  },
  pricing_rule: {
    paths: {
      A_book: "quantity × book rate (sell price — no markup)",
      B_cost: "cost × (1 + markup)",
      exclusive: "One path per line",
    },
    sell_price_warning: "Book rates are sell prices. Do not mark up again on path A.",
  },
  markup: {
    materials_markup: { suggested: 0.5, status: "market_estimate_TBD", tbd_note: "TBD — Jesus to confirm" },
    subcontractor_passthrough_markup: { suggested: 0.15, status: "market_estimate_TBD" },
    city_fee_markup: { suggested: 0, status: "market_estimate_TBD" },
    contingency: { suggested_on_cost_buildup_while_preliminary: 0.1, suggested_on_book_ranges: 0, status: "market_estimate_TBD" },
    rounding: {
      line: "Nearest $10",
      total: "Next $25",
      status: "market_estimate_TBD",
    },
    deposit: { split: "50/50", wording: "50% to start the work. 50% before installation." },
    quote_validity_days: { suggested: 30, status: "market_estimate_TBD" },
  },
  range_output: {
    label: "Preliminary",
    client_sentence: "This is a preliminary range. It holds until a site survey and confirmed sizes.",
  },
  company: {
    name: "Arc Signage Co",
    email: "jc@arcsignco.com",
    phone_display: "(347) 450-2110",
    hours: "Mon–Fri 8:00 AM–6:00 PM",
  },
  sign_types: [
    {
      id: "placeholder_channel",
      label: "Channel letters (placeholder)",
      basis: "per_letter_inch",
      low: 9,
      high: 18,
      minimum: 99,
      minimum_basis: "per_set",
      status: "market_estimate_TBD",
      tbd_note: "TBD — Jesus to confirm",
    },
    {
      id: "wall_mural_painted",
      label: "Wall mural, painted",
      basis: "quote_only",
      quote_only: true,
      low: null,
      high: null,
      status: "market_estimate_TBD",
    },
    {
      id: "monument_pylon",
      label: "Monument / pylon",
      basis: "quote_only",
      quote_only: true,
      status: "market_estimate_TBD",
    },
  ],
  install: {
    crew: {
      two_person_crew_per_hour: { low: 9, high: 14, status: "market_estimate_TBD" },
      evening_weekend_multiplier: { suggested: 1.5, status: "market_estimate_TBD" },
    },
    access: {
      ladder: { adder: 0, treatment: "included", status: "market_estimate_TBD" },
      scaffold_per_day: { low: 9, high: 18, delivery_low: 3, delivery_high: 6, status: "market_estimate_TBD" },
      boom_lift: { quote_only: true, status: "market_estimate_TBD" },
    },
  },
  height_access_adders: {
    tiers: [
      { id: "under_12_ft", label: "Under 12 ft", access: "ladder_included", equipment_adder: 0 },
      { id: "12_to_25_ft", label: "12–25 ft", access: "scaffold_or_scissor" },
      { id: "over_25_ft", label: "Over 25 ft", quote_only: true },
    ],
  },
  travel: {
    suggested_method: "flat_trip_fee",
    zones: [
      { id: "default", label: "Tri-State", flat_low: 5, flat_high: 9, status: "market_estimate_TBD" },
      { id: "manhattan", label: "Manhattan", flat_low: 6, flat_high: 11, status: "market_estimate_TBD" },
      { id: "outer_boroughs", label: "Outer boroughs", flat_low: 4, flat_high: 8, status: "market_estimate_TBD" },
    ],
  },
  electrical: {
    label: "Licensed electrician allowance",
    low: 9,
    high: 18,
    status: "market_estimate_TBD",
  },
  permits: {
    lines: [
      {
        id: "filing_expediting",
        label: "DOB sign permit — filing and expediting allowance",
        low: 9,
        high: 18,
        price_role: "preliminary_sell_allowance",
        status: "market_estimate_TBD",
      },
      {
        id: "drawings_with_stamp",
        label: "Drawings with PE/RA stamp",
        low: 9,
        high: 18,
        price_role: "preliminary_sell_allowance",
        status: "market_estimate_TBD",
      },
      {
        id: "licensed_sign_hanger",
        label: "Licensed Sign Hanger allowance",
        low: 9,
        high: 18,
        price_role: "preliminary_sell_allowance",
        status: "market_estimate_TBD",
      },
      {
        id: "lpc",
        label: "LPC / landmarks allowance",
        low: 9,
        high: 18,
        price_role: "preliminary_sell_allowance",
        status: "market_estimate_TBD",
      },
    ],
  },
  design_and_survey: {
    survey_fee: { low: 4, high: 8, status: "market_estimate_TBD" },
  },
  job_minimums: {
    precedence: "Single highest minimum",
    overall_minimum_order: { low: 40, high: 55, status: "market_estimate_TBD" },
    install_only_minimum: { low: 45, high: 60, status: "market_estimate_TBD" },
  },
  tax: {
    engine_until_confirmed: "Show prices before tax. Print a tax line of “to be determined.”",
    topics_to_confirm: ["Sales tax is extra unless this document shows a tax amount."],
  },
};

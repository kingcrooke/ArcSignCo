/** Normalize Netlify form webhook payloads into a lead record. */

const QUOTE_FORMS = new Set(["quote-request", "sign-estimate-request"]);

export function isQuoteEngineForm(formName) {
  return QUOTE_FORMS.has(String(formName || "").trim());
}

export function leadIdFromPayload(payload) {
  const num = payload?.number ?? payload?.id;
  const form = payload?.form_name || payload?.formName || "unknown";
  if (num != null) return `${form}-${num}`;
  return `${form}-${Date.now()}`;
}

function pick(data, ...keys) {
  for (const k of keys) {
    const v = data?.[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function boroughZone(borough) {
  const b = String(borough || "").toLowerCase();
  if (b.includes("manhattan")) return "manhattan";
  if (b.includes("brooklyn")) return "brooklyn";
  if (b.includes("queens")) return "queens";
  if (b.includes("bronx")) return "bronx";
  if (b.includes("staten")) return "staten";
  if (b.includes("jersey") || b === "new jersey") return "nj";
  if (b.includes("connecticut")) return "ct";
  if (b.includes("elsewhere")) return "ny_other";
  return "default";
}

/** @param {object} payload Netlify webhook body */
export function normalizeLead(payload) {
  const formName = payload?.form_name || payload?.formName || "";
  const data = payload?.data || payload?.fields || {};
  const id = leadIdFromPayload(payload);
  const receivedAt = payload?.created_at || payload?.createdAt || new Date().toISOString();

  if (formName === "sign-estimate-request") {
    const street = pick(data, "street");
    const city = pick(data, "city");
    const zip = pick(data, "zip");
    const address = [street, city, zip].filter(Boolean).join(", ");
    const scopeParts = [
      pick(data, "sign_type") && `Sign type: ${pick(data, "sign_type")}`,
      pick(data, "lit") && `Lighting: ${pick(data, "lit")}`,
      pick(data, "services") && `Services: ${pick(data, "services")}`,
      pick(data, "height") && `Height: ${pick(data, "height")}`,
      pick(data, "scope-finder") || pick(data, "notes"),
    ].filter(Boolean);
    return {
      id,
      receivedAt,
      source: formName,
      status: "New",
      quotedValue: "",
      nextStep: "Review submission and run calculator",
      name: pick(data, "name"),
      email: pick(data, "email"),
      phone: pick(data, "phone"),
      company: pick(data, "business", "company"),
      address,
      projectType: pick(data, "sign_type"),
      scopeSummary: scopeParts.join(" · ") || pick(data, "notes"),
      boroughZone: boroughZone(city),
      raw: data,
      calculatorInput: {
        signType: pick(data, "sign_type"),
        mockupType: pick(data, "type"),
        quantity: Number(pick(data, "sign_count")) || 1,
        sizeW: Number(pick(data, "size_w")) || 0,
        sizeH: Number(pick(data, "size_h")) || 0,
        sizeUnit: pick(data, "size_unit") || "ft",
        sizeNotSure: pick(data, "size_not_sure") === "Yes",
        lit: pick(data, "lit"),
        height: pick(data, "height"),
        power: pick(data, "power"),
        services: pick(data, "services"),
        permitsRequested: /permit/i.test(pick(data, "services")),
        boroughZone: boroughZone(city),
      },
    };
  }

  // quote-request (includes scope-finder hidden field)
  const scopeFinder = pick(data, "scope-finder");
  const message = pick(data, "message");
  const scopeSummary = scopeFinder || message;
  const borough = pick(data, "borough");
  return {
    id,
    receivedAt,
    source: formName,
    status: "New",
    quotedValue: "",
    nextStep: "Review submission and run calculator",
    name: pick(data, "name"),
    email: pick(data, "email"),
    phone: pick(data, "phone"),
    company: pick(data, "company"),
    address: [pick(data, "project-address"), borough].filter(Boolean).join(", "),
    projectType: pick(data, "type"),
    scopeSummary: scopeSummary.slice(0, 4000),
    boroughZone: boroughZone(borough),
    raw: data,
    calculatorInput: {
      signType: pick(data, "type"),
      mockupType: "",
      quantity: 1,
      sizeW: 0,
      sizeH: 0,
      sizeUnit: "ft",
      sizeNotSure: true,
      lit: /led|illumin/i.test(pick(data, "type")) ? "Lit" : "Not sure",
      height: "",
      power: "",
      services: Array.isArray(data["permit[]"]) ? data["permit[]"].join(", ") : pick(data, "permit[]"),
      permitsRequested: Boolean(data["permit[]"]?.length) || /permit/i.test(message),
      boroughZone: boroughZone(borough),
    },
  };
}

export const SHEET_HEADERS = [
  "lead_id",
  "received_at",
  "source",
  "status",
  "quoted_value",
  "next_step",
  "name",
  "email",
  "phone",
  "company",
  "address",
  "project_type",
  "scope_summary",
];

export function leadToSheetRow(lead) {
  return [
    lead.id,
    lead.receivedAt,
    lead.source,
    lead.status,
    lead.quotedValue,
    lead.nextStep,
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.address,
    lead.projectType,
    lead.scopeSummary,
  ];
}

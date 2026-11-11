// Body style from the year, make, and model the visitor typed or a photo identified.
// A named passenger car is never described as a cargo van.

export const BODY_KEYS = ["car", "suv", "pickup", "cargo-van", "sprinter", "box-truck", "trailer"];

const BODY_WORDS = {
  car: "sedan",
  suv: "SUV",
  pickup: "pickup truck",
  "cargo-van": "cargo van",
  sprinter: "high-roof sprinter van",
  "box-truck": "box truck",
  trailer: "trailer",
};

const RULES = [
  [/sprinter/, "sprinter"],
  [/transit|promaster|pro master|savana|\bexpress\b|nv200|metris|econoline|e-series|nv cargo/, "cargo-van"],
  [/f-?\d{3}|silverado|sierra|ram [12]\d{3}|tacoma|tundra|\branger\b|colorado|canyon|ridgeline|frontier|\btitan\b|gladiator|maverick|cybertruck/, "pickup"],
  [/rav-?4|cr-?v|hr-?v|highlander|\bpilot\b|4runner|sequoia|explorer|\bescape\b|\bedge\b|expedition|bronco|tahoe|suburban|traverse|equinox|blazer|acadia|yukon|pathfinder|rogue|murano|armada|wrangler|cherokee|durango|cx-?[359]\b|cx-50|cx-90|tucson|santa fe|palisade|sportage|telluride|sorento|outback|forester|ascent|crosstrek|model y|model x|\bq[3578]\b|\bx[1357]\b|gl[abces]|passport|\bvenue\b|\bkicks\b|seltos/, "suv"],
  [/camry|corolla|avalon|prius|accord|civic|altima|sentra|maxima|fusion|taurus|malibu|impala|cruze|charger|challenger|mustang|model 3|model s|sonata|elantra|optima|\bk5\b|jetta|passat|arteon|mazda3|mazda6|impreza|legacy|\bwrx\b|\ba[3468]\b|\bct[45]\b|\bes\b|\bis\b|g70|g80/, "car"],
];

function clean(value, max) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function normalizeBody(value) {
  const text = clean(value, 40).toLowerCase();
  if (!text) return "";
  if (BODY_KEYS.includes(text)) return text;
  if (/sedan|coupe|hatch|saloon|passenger car/.test(text)) return "car";
  if (/suv|crossover|cuv/.test(text)) return "suv";
  if (/pickup|pick-up/.test(text)) return "pickup";
  if (/sprinter/.test(text)) return "sprinter";
  if (/box/.test(text)) return "box-truck";
  if (/trailer/.test(text)) return "trailer";
  if (/van/.test(text)) return "cargo-van";
  return "";
}

export function inferBody(subject = {}) {
  const named = normalizeBody(subject.body);
  if (named && subject.body && BODY_KEYS.includes(clean(subject.body, 20))) return clean(subject.body, 20);
  const text = `${clean(subject.make, 40)} ${clean(subject.model, 40)}`.toLowerCase();
  if (!text.trim()) return "";
  for (const [rule, key] of RULES) {
    if (rule.test(text)) return key;
  }
  return named;
}

export function bodyWord(key) {
  return BODY_WORDS[key] || "";
}

export function vehiclePhrase(subject = {}) {
  const year = clean(subject.year, 4);
  const make = clean(subject.make, 40);
  const model = clean(subject.model, 40);
  const named = [year, make, model].filter(Boolean).join(" ");
  const key = BODY_KEYS.includes(subject.body) ? subject.body : inferBody(subject);
  const word = BODY_WORDS[key] || "";
  if (named && word) return `${named} ${word}`;
  if (named) return named;
  if (word) return word;
  if (subject.stock) return "cargo van";
  return "vehicle";
}

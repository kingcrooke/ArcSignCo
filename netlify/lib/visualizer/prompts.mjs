// Prompt text for the image model. The logo file is never described as something to redraw.

const ZONES = {
  vehicle: { x: 0.1, y: 0.35, w: 0.25, h: 0.3, name: "driver-side door" },
  sign: { x: 0.28, y: 0.12, w: 0.44, h: 0.22, name: "left side of the sign face" },
  window: { x: 0.18, y: 0.32, w: 0.3, h: 0.36, name: "upper-left pane" },
};

const BODIES = {
  car: "car",
  suv: "SUV",
  pickup: "pickup truck",
  "cargo-van": "cargo van",
  sprinter: "high-roof sprinter van",
  "box-truck": "box truck",
  trailer: "trailer",
};

const COVERAGE = {
  lettering: "lettering",
  partial: "partial",
  full: "full",
};

const SIGNS = {
  "channel-letters": "channel letters",
  lightbox: "lightbox cabinet",
  blade: "blade projecting",
  "flat-panel": "flat panel",
  awning: "awning",
};

const WINDOWS = {
  perforated: "perforated one-way",
  "cut-vinyl": "cut vinyl lettering",
  frosted: "frosted privacy film",
  "full-print": "full print",
};

export function zoneFor(category) {
  return { ...(ZONES[category] || ZONES.vehicle) };
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function colorsOf(colors) {
  const list = Array.isArray(colors) ? colors : [];
  const hex = list.map(c => clean(c, 7)).filter(c => /^#[0-9a-fA-F]{6}$/.test(c));
  return hex.length ? hex.join(", ") : "navy and gold";
}

function layoutLine(variant) {
  return variant === 0
    ? "Layout A: company name as the largest line, phone and website smaller beneath it."
    : "Layout B: a short services column, with the company name as the headline.";
}

function blankLogo(zone) {
  return `Leave a clear empty rectangular area on the ${zone.name} for a logo. Do not draw any logo, icon, or mark in that area. Do not invent a logo.`;
}

export function renderPrompt({ category, business = {}, subject = {}, variant = 0 }) {
  const zone = zoneFor(category);
  const name = clean(business.name, 120) || "the business";
  const phone = clean(business.phone, 40);
  const web = clean(business.web, 180);
  const services = clean(business.services, 400);
  const tagline = clean(business.tagline, 180);
  const colors = colorsOf(business.colors);
  const brief = [tagline, layoutLine(variant)].filter(Boolean).join(" ");
  let body;
  if (category === "sign") {
    const kind = SIGNS[subject.signType] || "storefront";
    const size = subject.widthFt && subject.heightFt ? `about ${subject.widthFt} by ${subject.heightFt} ft, ` : "";
    const light = subject.illuminated ? "internally illuminated, evening glow" : "non-illuminated";
    body = `Edit this storefront photo: add a ${kind} sign, ${size}above the entrance on the fascia, ${light}. Sign reads '${name}' in a style matching colors ${colors}. Keep building, perspective and surroundings unchanged; realistic mounting, shadows and scale. Leave a logo area at the ${zone.name}.`;
  } else if (category === "window") {
    const kind = WINDOWS[subject.windowType] || "window vinyl";
    const panes = clean(subject.panes, 80) || "the main storefront windows";
    const content = [name, phone, web, services].filter(Boolean).join(", ");
    body = `Edit this storefront photo: apply ${kind} vinyl to the ${panes} windows: ${content}. Keep glass reflections and the interior visible where appropriate (perforated = 50/50 see-through look). Realistic scale; nothing outside the glass changes. Leave a logo area at the ${zone.name}.`;
  } else if (subject.photo) {
    const coverage = COVERAGE[subject.coverage] || "partial";
    body = `Apply a professional commercial ${coverage} vinyl wrap to this exact vehicle (keep shape, wheels, glass, angle, background unchanged). Brand: ${name}. Colors: ${colors}. Include company name '${name}'${phone ? `, phone '${phone}'` : ""}${web ? `, website '${web}'` : ""}${services ? `, services '${services}'` : ""} as clean legible lettering on the side panels. Leave a clear rectangular area on the ${zone.name} for the logo; do not draw any logo. Style: ${brief}. Photoreal, print-ready look.`;
  } else {
    const year = clean(subject.year, 4);
    const make = clean(subject.make, 40);
    const model = clean(subject.model, 40);
    const bodyType = BODIES[subject.body] || "van";
    const color = clean(subject.color, 40) || "white";
    const coverage = COVERAGE[subject.coverage] || "partial";
    body = `Studio product photo of a ${[year, make, model].filter(Boolean).join(" ")} ${bodyType}, ${color} paint, 3/4 front-left view, plain light-gray background, even lighting. Apply a professional commercial ${coverage} vinyl wrap. Brand: ${name}. Colors: ${colors}. Include company name '${name}'${phone ? `, phone '${phone}'` : ""}${web ? `, website '${web}'` : ""}${services ? `, services '${services}'` : ""} as clean legible lettering on the side panels. Leave a clear rectangular area on the ${zone.name} for the logo; do not draw any logo. Style: ${brief}. Photoreal, print-ready look.`;
  }
  return `${body} ${blankLogo(zone)} ${layoutLine(variant)} No watermark text, no mockup frame.`;
}

export function editPrompt(request) {
  const ask = clean(request, 400);
  return `Modify the previous image only as follows: ${ask}. Keep everything else identical. Do not draw any logo. Leave the blank rectangular logo area empty.`;
}

export function scrapePrompt(text) {
  return [
    "Extract public business details from this web page text.",
    "Return JSON only with keys name, phone, email, services, brand_colors, tagline, logo_url.",
    "services is an array of short strings. brand_colors is an array of #rrggbb values.",
    "Use empty strings or empty arrays when the page does not say. Do not invent a phone number or email.",
    "",
    text.slice(0, 8000),
  ].join("\n");
}

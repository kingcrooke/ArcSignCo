// Prompt text for the image model. The logo file is never described as something to redraw.
// Every vehicle variant repeats the wrap coverage so a layout change cannot shrink it.

const ZONES = {
  vehicle: { x: 0.7, y: 0.54, w: 0.12, h: 0.16, name: "lower rear of the side panel" },
  sign: { x: 0.78, y: 0.16, w: 0.14, h: 0.16, name: "right end of the sign face" },
  window: { x: 0.7, y: 0.58, w: 0.14, h: 0.16, name: "lower-right window pane" },
};

const BODIES = {
  car: "sedan",
  suv: "SUV",
  pickup: "pickup truck",
  "cargo-van": "cargo van",
  sprinter: "high-roof cargo van",
  "box-truck": "box truck",
  trailer: "trailer",
};

const COVERAGE = {
  lettering: "lettering",
  partial: "partial",
  half: "half",
  full: "full",
};

const COVERAGE_DETAIL = {
  lettering: "words only on the factory paint, with no extra color panels",
  partial: "color and lettering on the doors and the panel beside them, with the rest of the body left in the vehicle color",
  half: "the front half of the side, from the nose through the front doors, with the rear half left in the vehicle color",
  full: "the whole side, including the doors, the rear quarter, and any hood or rear in frame",
};

const STYLES = {
  clean: "Style direction: clean and minimal, open space, one type family.",
  bold: "Style direction: bold and sporty, strong diagonals, large type.",
  tech: "Style direction: tech and futuristic, thin lines, a precise grid.",
  classic: "Style direction: classic and professional, calm alignment.",
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

const PHOTO = "Photorealistic photograph from a real camera. Real paint, glass, metal, and rubber, with natural shadows. Not an illustration, not a cartoon, not a vector drawing, not a diagram, and not a 3D render.";

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

function arrangement(variant) {
  if (variant === 1) return "Arrange the words as a short column under the company name.";
  if (variant === 2) return "Arrange the company name as a large wordmark, with the phone and website in a lower band.";
  return "Arrange the company name as the largest line, with the phone and website smaller beneath it.";
}

export function coverageClause(coverage) {
  const key = COVERAGE[coverage] ? coverage : "partial";
  return `Wrap coverage is ${COVERAGE[key]}: ${COVERAGE_DETAIL[key]}. Keep this exact coverage in this layout. Do not reduce a full or half wrap to lettering, and do not expand a smaller wrap.`;
}

function styleLine(style) {
  return STYLES[style] || "";
}

function placementLine(subject) {
  const bits = [];
  if (subject.namePlaces?.length) bits.push(`Place the business name on the ${subject.namePlaces.join(" and ")}.`);
  if (subject.phonePlaces?.length) bits.push(`Place the phone on the ${subject.phonePlaces.join(" and ")}.`);
  if (subject.webPlaces?.length) bits.push(`Place the website on the ${subject.webPlaces.join(" and ")}.`);
  return bits.join(" ");
}

function logoReserve(zone) {
  return `Reserve an empty rectangle on the ${zone.name} for a logo that will be added later. That rectangle must contain no letters, numbers, phone, or website. Put the company name, phone, and website outside that rectangle, in the upper part of the panel, so the logo cannot cover the lettering. Do not draw any logo, icon, or mark.`;
}

export function vehiclePrompt(subject = {}, { hasPhoto = false } = {}) {
  const year = clean(subject.year, 4);
  const make = clean(subject.make, 40);
  const model = clean(subject.model, 40);
  const named = [year, make, model].filter(Boolean).join(" ");
  const bodyType = BODIES[subject.body] || "cargo van";
  const color = clean(subject.color, 40) || "white";
  const ask = `${named || "modern"} ${bodyType}, ${color} paint, exact side profile facing right, the full vehicle in frame. ${PHOTO} No wrap, no lettering, no logo, no people.`;
  if (!hasPhoto) return `Photorealistic side-view photograph of a ${ask}`;
  return `Edit the supplied photograph so the vehicle reads as a ${ask} Keep the photograph real. Do not redraw the vehicle as a cartoon.`;
}

function lettering(name, phone, web, services) {
  return `Include company name '${name}'${phone ? `, phone '${phone}'` : ""}${web ? `, website '${web}'` : ""}${services ? `, services '${services}'` : ""} as clean legible vinyl lettering outside the reserved logo rectangle.`;
}

export function renderPrompt({ category, business = {}, subject = {}, variant = 0 }) {
  const zone = zoneFor(category);
  const name = clean(business.name, 120) || "the business";
  const phone = clean(business.phone, 40);
  const web = clean(business.web, 180);
  const services = clean(business.services, 400);
  const tagline = clean(business.tagline, 180);
  const colors = colorsOf(business.colors);
  const words = [tagline, arrangement(variant)].filter(Boolean).join(" ");
  let body;
  if (category === "sign") {
    const kind = SIGNS[subject.signType] || "storefront";
    const size = subject.widthFt && subject.heightFt ? `about ${subject.widthFt} by ${subject.heightFt} ft, ` : "";
    const light = subject.illuminated ? "internally illuminated, evening glow" : "non-illuminated";
    body = `Edit this storefront photograph. ${PHOTO} Add a ${kind} sign, ${size}above the entrance on the fascia, ${light}. The sign reads '${name}' in colors ${colors}. Keep the building, perspective, and surroundings unchanged. Realistic mounting, shadows, and scale. Keep this same sign type. ${words}`;
  } else if (category === "window") {
    const kind = WINDOWS[subject.windowType] || "window vinyl";
    const panes = clean(subject.panes, 80) || "the main storefront windows";
    const content = [name, phone, web, services].filter(Boolean).join(", ");
    body = `Edit this storefront photograph. ${PHOTO} Apply ${kind} vinyl to the ${panes} windows: ${content}. Keep glass reflections and the interior visible where appropriate. Realistic scale. Nothing outside the glass changes. Keep this same window graphic. ${words}`;
  } else {
    const coverage = coverageClause(subject.coverage);
    const letters = lettering(name, phone, web, services);
    const brand = `Brand: ${name}. Colors: ${colors}. ${letters} ${coverage} ${words}`;
    if (subject.photo) {
      body = `Edit this photograph. Keep the same vehicle, wheels, glass, camera angle, and background. ${PHOTO} Apply a commercial vinyl wrap onto the photograph. Do not redraw the vehicle. ${brand}`;
    } else {
      const year = clean(subject.year, 4);
      const make = clean(subject.make, 40);
      const model = clean(subject.model, 40);
      const named = [year, make, model].filter(Boolean).join(" ");
      const bodyType = BODIES[subject.body] || "cargo van";
      const color = clean(subject.color, 40) || "white";
      body = `Photorealistic side-view photograph of a ${named ? `${named} ` : ""}${bodyType}, ${color} paint, the full vehicle in frame, plain light-gray background. ${PHOTO} Apply a commercial vinyl wrap. ${brand}`;
    }
  }
  const extra = [styleLine(subject.style), placementLine(subject)].filter(Boolean).join(" ");
  return `${body} ${extra} ${logoReserve(zone)} No watermark text, no mockup frame.`.replace(/[ \t]{2,}/g, " ").trim();
}

export function editPrompt(request) {
  const ask = clean(request, 400);
  return `Modify the previous photograph only as follows: ${ask}. Keep everything else identical, including the wrap coverage. Keep it a photograph. Do not turn it into an illustration. Do not draw any logo. Leave the blank rectangular logo area empty of letters.`;
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

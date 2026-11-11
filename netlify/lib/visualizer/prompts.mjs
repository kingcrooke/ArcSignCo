// Prompt text for the image model. The uploaded logo is composited later, so the model is
// told not to draw one and not to leave a blank box. Lettering is only what the visitor typed.

import { vehiclePhrase } from "./body.mjs";

const ZONES = {
  vehicle: { x: 0.4, y: 0.42, w: 0.2, h: 0.22, name: "driver-side door" },
  sign: { x: 0.28, y: 0.12, w: 0.44, h: 0.22, name: "left side of the sign face" },
  window: { x: 0.18, y: 0.32, w: 0.3, h: 0.36, name: "upper-left pane" },
};

const COVERAGE = {
  lettering: "lettering",
  partial: "partial",
  half: "half",
  full: "full",
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

const CLEAN = "Do not draw a logo, icon, or emblem. Do not draw blank rectangles, white boxes, empty frames, or placeholder panels. Do not invent services, slogans, phone numbers, websites, or any other text.";

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
  const hex = list.map(item => clean(item, 7)).filter(item => /^#[0-9a-fA-F]{6}$/.test(item));
  return hex.length ? hex.join(", ") : "navy and gold";
}

function layoutLine(variant, services) {
  if (variant === 1 && services) return "Layout B: a short column listing only the services written above, with the company name as the headline.";
  if (variant === 1) return "Layout B: the company name as the headline, with the phone and website underneath. There is no services column.";
  if (variant === 2) return "Layout C: the company name as a large side wordmark, with the phone and website in a lower band.";
  return "Layout A: company name as the largest line, phone and website smaller beneath it.";
}

function lettering(business) {
  const name = clean(business.name, 120);
  const phone = clean(business.phone, 40);
  const web = clean(business.web, 180);
  const services = clean(business.services, 400);
  const bits = [];
  if (name) bits.push(`company name '${name}'`);
  if (phone) bits.push(`phone '${phone}'`);
  if (web) bits.push(`website '${web}'`);
  if (services) bits.push(`services '${services}'`);
  if (!bits.length) return "Do not add any words.";
  return `Render only this lettering, spelled exactly: ${bits.join(", ")}.`;
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

function exactLine(subject) {
  const phrase = vehiclePhrase(subject);
  const named = [clean(subject.year, 4), clean(subject.make, 40), clean(subject.model, 40)].filter(Boolean).join(" ");
  if (!named) return `The vehicle is a ${phrase}. Keep that body style.`;
  return `The vehicle must be a ${phrase}. Match that model's real body, proportions, glass, lights, and wheels. Do not replace it with a different kind of vehicle.`;
}

export function vehiclePrompt(subject = {}) {
  const phrase = vehiclePhrase(subject);
  const color = clean(subject.color, 40) || "white";
  return `Studio product photo of a ${phrase}, ${color} paint, exact side profile facing right, plain light-gray seamless background, even soft lighting. ${exactLine(subject)} No wrap, no lettering, no logo, no people. Photoreal, the full vehicle in frame.`;
}

export function renderPrompt({ category, business = {}, subject = {}, variant = 0 }) {
  const name = clean(business.name, 120) || "the business";
  const colors = colorsOf(business.colors);
  const services = clean(business.services, 400);
  const tagline = clean(business.tagline, 180);
  const brief = [tagline, layoutLine(variant, services)].filter(Boolean).join(" ");
  const words = lettering(business);
  let body;
  if (category === "sign") {
    const kind = SIGNS[subject.signType] || "storefront";
    const size = subject.widthFt && subject.heightFt ? `about ${subject.widthFt} by ${subject.heightFt} ft, ` : "";
    const light = subject.illuminated ? "internally illuminated, evening glow" : "non-illuminated";
    body = `Edit this storefront photo: add a ${kind} sign, ${size}above the entrance on the fascia, ${light}. Sign reads '${name}'. Colors: ${colors}. ${words} Keep the building, perspective, and surroundings unchanged. Realistic mounting, shadows, and scale.`;
  } else if (category === "window") {
    const kind = WINDOWS[subject.windowType] || "window vinyl";
    const panes = clean(subject.panes, 80) || "the main storefront windows";
    body = `Edit this storefront photo: apply ${kind} vinyl to the ${panes} windows. ${words} Colors: ${colors}. Keep glass reflections and the interior visible where appropriate (perforated = 50/50 see-through look). Realistic scale; nothing outside the glass changes.`;
  } else if (subject.photo) {
    const coverage = COVERAGE[subject.coverage] || "partial";
    const phrase = vehiclePhrase(subject);
    const named = [clean(subject.year, 4), clean(subject.make, 40), clean(subject.model, 40)].filter(Boolean).join(" ");
    body = `Apply a professional commercial ${coverage} vinyl wrap to this exact vehicle. Keep its shape, wheels, glass, angle, people, and background unchanged. ${named ? `This vehicle is a ${phrase}. Do not replace it with a different vehicle.` : "Do not replace the vehicle."} Colors: ${colors}. ${words} Put the lettering on the vehicle body only. Style: ${brief}. Photoreal, print-ready look.`;
  } else {
    const phrase = vehiclePhrase(subject);
    const color = clean(subject.color, 40) || "white";
    const coverage = COVERAGE[subject.coverage] || "partial";
    body = `Studio product photo of a ${phrase}, ${color} paint, exact side profile facing right, plain light-gray seamless background, even lighting. ${exactLine(subject)} Apply a professional commercial ${coverage} vinyl wrap. Colors: ${colors}. ${words} Put the lettering on the vehicle body only. Style: ${brief}. Photoreal, print-ready look.`;
  }
  const extra = [styleLine(subject.style), placementLine(subject), layoutLine(variant, services), CLEAN].filter(Boolean).join(" ");
  return `${body} ${extra} No watermark text, no mockup frame.`.replace(/[ \t]{2,}/g, " ").trim();
}

export function variantPrompt({ category, business = {}, subject = {}, variant = 1 }) {
  const services = clean(business.services, 400);
  const colors = colorsOf(business.colors);
  const keep = category === "vehicle"
    ? "Keep the identical vehicle, body shape, wheels, glass, lights, camera angle, and background. Do not change the make or model."
    : "Keep the identical building, perspective, and surroundings.";
  const extra = [styleLine(subject.style), placementLine(subject), lettering(business), layoutLine(variant, services), CLEAN].filter(Boolean).join(" ");
  return `Edit this image. ${keep} Change only the graphic layout. Colors stay ${colors}. ${extra}`.replace(/[ \t]{2,}/g, " ").trim();
}

export function editPrompt(request) {
  const ask = clean(request, 400);
  return `Modify the previous image only as follows: ${ask}. Keep the same vehicle or building, the same angle, and the same background. Do not draw a logo. Do not add blank rectangles, white boxes, or text that was not requested.`;
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

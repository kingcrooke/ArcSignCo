// The category contract. Every tab in the mockup tool (Signs, Awnings, and anything added later)
// is one module that default-exports defineCategory({...}); categories/index.js lists them.
// The engine (editor, renderer, PDF, proof page, approval-link server, pricing, checks) only talks
// to a category through the fields below, so a new tab never touches engine code.
// docs/ADDING-A-CATEGORY.md walks through adding one.
//
// Pure data and functions: no DOM access at import time (the server and the Node checks load it).
import { LIGHTING } from "../lighting.js";
import { buildKind, kindDefaults, kindFields, kindFaceArt, kindAspect, KINDS } from "../kinds.js";
import { formatArea } from "../geometry.js";

/**
 * An option field the editor shows (returned by optionFields):
 *   { key, label, kind: "color" | "select" | "range", value,
 *     choices: [[value, text], …]          select only
 *     auto: "Match artwork", fallback      color only: a checkbox for "automatic" (stored as "")
 *     min, max, step, format: v => text    range only: format is shown next to the label
 *     refresh: true }                      re-draw the fields after a change (other choices depend on it)
 */

const capital = s => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Fills in everything a category may leave out and stamps each type with its category id.
 * Required: id, label, noun. A "ready" category also needs groups, types and diagram().
 */
export function defineCategory(spec) {
  const noun = spec.noun || "item";
  const typeWord = spec.typeWord || "type";
  const lightingOf = spec.lightingOf || (type => type.lighting || "none");
  const cat = {
    status: "ready",
    title: `Choose ${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun} ${typeWord}`,
    intro: "",
    groups: [],
    types: [],
    aliases: {},
    examples: [],
    spillReach: 0.7,
    defaultOptions: kindDefaults,
    sanitizeOptions: () => null,
    optionFields: kindFields,
    details: () => [],
    parts: type => type.parts || [],
    cardNote: type => LIGHTING[lightingOf(type, null)]?.label || "",
    build: buildKind,
    faceArt: kindFaceArt,
    aspect: kindAspect,
    pricing: null,
    ...spec,
    noun,
    typeWord,
    lightingOf,
  };
  cat.ui = {
    textLabel: `${capital(noun)} text`,
    placeTip: `Drag the four corner handles onto the wall so the ${noun} follows its perspective. Drag inside the ${noun} to move it. Switch to <strong>Night</strong> on the photo to see it lit.`,
    heightLabel: "Height",
    heightShort: "H",
    flatLabel: `The ${noun} artwork, flat`,
    hangs: false,
    sizeExtra: (type, opts, size) => (size ? { label: "Area", value: formatArea(size.width, size.height).replace(" sq ft", ""), unit: "sq ft" } : null),
    ...spec.ui,
  };
  cat.Noun = capital(noun);
  cat.typeLabel = capital(typeWord);
  cat.types = cat.types.map(t => ({
    ...t,
    category: cat.id,
    lightingLabel: t.lightingLabel || LIGHTING[t.lighting || "none"]?.label || "",
  }));
  cat.defaultType ||= cat.types[0]?.id || "";
  return Object.freeze(cat);
}

/**
 * A placeholder tab: shown with a "Soon" badge, lists what it will cover, and places nothing.
 * examples: [{ name, note }]
 */
export function comingSoon({ id, label, noun, intro, examples, icon = "" }) {
  return defineCategory({ id, label, noun, status: "soon", intro, examples, icon, title: `${label}: coming soon` });
}

/** Problems with a category, as readable strings (empty when it is valid). Used by the checks. */
export function validateCategory(cat) {
  const out = [];
  const bad = msg => out.push(`${cat?.id || "?"}: ${msg}`);
  if (!cat || typeof cat !== "object") return ["not a category object"];
  if (!/^[a-z][a-z0-9-]*$/.test(cat.id || "")) bad("id must be lowercase letters, digits or dashes");
  for (const k of ["label", "noun", "title"]) if (!cat[k] || typeof cat[k] !== "string") bad(`${k} is missing`);
  if (!["ready", "soon"].includes(cat.status)) bad(`status must be "ready" or "soon"`);
  if (cat.status === "soon") {
    if (cat.types.length) bad("a coming-soon category has no types");
    if (!cat.examples.length || !cat.examples.every(e => e.name && e.note)) bad("list examples as { name, note }");
    if (!cat.intro) bad("intro is missing");
    return out;
  }
  if (!cat.types.length) bad("no types");
  if (typeof cat.diagram !== "function") bad("diagram(type) is missing");
  const ids = cat.types.map(t => t.id);
  if (new Set(ids).size !== ids.length) bad("type ids repeat");
  if (!cat.types.some(t => t.id === cat.defaultType)) bad(`defaultType "${cat.defaultType}" is not one of its types`);
  for (const g of cat.groups) if (!cat.types.some(t => t.group === g.id)) bad(`group "${g.id}" has no types`);
  for (const t of cat.types) {
    const at = msg => bad(`${t.id}: ${msg}`);
    if (!/^[a-z][a-z0-9-]*$/.test(t.id || "")) at("id must be lowercase letters, digits or dashes");
    if (!t.name || !t.summary) at("name and summary are required");
    if (!Array.isArray(t.parts) || t.parts.length < 3) at("list at least 3 parts");
    if (!cat.groups.some(g => g.id === t.group)) at(`group "${t.group}" is not in groups`);
    if (!LIGHTING[cat.lightingOf(t, null)]) at(`lighting "${cat.lightingOf(t, null)}" is not in lighting.js`);
    if (!t.render?.kind) at("render.kind is missing");
    else if (cat.build === buildKind && !KINDS.includes(t.render.kind)) at(`render.kind "${t.render.kind}" is not one of ${KINDS.join(", ")}`);
    if (t.aspect !== undefined && !(t.aspect > 0)) at("aspect (height / width) must be a positive number");
    let svg = "";
    try { svg = cat.diagram(t); } catch (e) { at(`diagram failed: ${e.message}`); }
    if (svg && !/^<svg[^>]+viewBox="0 0 320 200"/.test(svg)) at("diagram must be a 320 × 200 card from diagram-kit.js");
    const r = cat.pricing?.rates?.[t.id];
    if (!r) at("no placeholder rate in pricing.rates");
    else if (!(r.low > 0 && r.low < r.high && r.min?.[0] > 0 && r.min[0] < r.min[1])) at("rate needs low < high and min: [low, high]");
    const def = cat.defaultOptions(t);
    if (!def || typeof def !== "object") at("defaultOptions must return an object");
    else {
      const fields = cat.optionFields(t, def, { width: 120, height: 36 });
      if (!Array.isArray(fields) || !fields.every(f => f.key && f.label && ["color", "select", "range"].includes(f.kind))) at("optionFields must return { key, label, kind } fields");
    }
  }
  if (cat.pricing) {
    if (cat.pricing.placeholder !== true) bad("pricing.placeholder must be true until Arc sets real rates");
    for (const id of Object.keys(cat.pricing.rates || {})) if (!ids.includes(id)) bad(`pricing.rates has "${id}", which is not a type`);
  } else bad("pricing is missing");
  return out;
}

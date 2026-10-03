// The engine's view of the category registry (categories/index.js): every type the tool can
// place, id lookup, and the per-type questions the editor, renderer, PDF, proof page, server and
// checks ask. Everything here dispatches to the type's category, so nothing in the engine needs
// to know which categories exist. Pure data helpers (no DOM).
import { CATEGORIES } from "./categories/index.js";
import { lightingInfo } from "./lighting.js";

export { CATEGORIES };
/** Categories with something to place (not "coming soon"). */
export const READY = CATEGORIES.filter(c => c.status === "ready");
export const ALL_TYPES = READY.flatMap(c => c.types);
export const TYPE_IDS = ALL_TYPES.map(t => t.id);
export const GROUPS = READY.flatMap(c => c.groups.map(g => ({ ...g, category: c.id })));
export const DEFAULT_TYPE = READY[0].defaultType;

const ALIASES = Object.assign({}, ...READY.map(c => c.aliases));
const BY_ID = new Map(ALL_TYPES.map(t => [t.id, t]));
const BY_CAT = new Map(CATEGORIES.map(c => [c.id, c]));

export const isKnownType = id => BY_ID.has(ALIASES[id] || id);
export const getType = id => BY_ID.get(ALIASES[id] || id) || BY_ID.get(DEFAULT_TYPE);
export const getCategory = id => BY_CAT.get(id) || READY[0];
/** The category module a type belongs to. */
export const categoryOf = type => getCategory(type?.category);

/** The lighting key in effect for a type with these options (a key of lighting.js). */
export const lightingOf = (type, opts) => categoryOf(type).lightingOf(type, opts);
export const litWith = (type, opts) => lightingOf(type, opts) !== "none";
export const defaultOptions = type => categoryOf(type).defaultOptions(type);
/** Only the options that matter for the type, cleaned; null when the category stores none. */
export const cleanOptions = (type, opts) => categoryOf(type).sanitizeOptions(type, opts);
export const optionFields = (type, opts, size) => categoryOf(type).optionFields(type, opts, size);
/** Code limits the drawing may run into, as [{ text, over }]. */
export const codeWarnings = (type, opts, size) => categoryOf(type).warnings(type, opts, size);
export const diagramSvg = type => categoryOf(type).diagram(type);
/** The flat artwork the type uses as its face (fab source; sets the aspect). */
export const faceArt = (type, art, opts = {}, size = null) => categoryOf(type).faceArt(type, art, opts, size);
/** Height / width the pinned quad should have for this type and artwork. */
export const aspectFor = (type, art, opts) => categoryOf(type).aspect(type, art, opts);

/**
 * What the editor card, the proof page and the PDF say about the chosen type.
 * size: { width, height } in inches when known.
 */
export function describe(type, opts, size = null) {
  const cat = categoryOf(type);
  const lighting = lightingOf(type, opts);
  const info = lightingInfo(lighting);
  return {
    id: type.id,
    category: cat.id,
    categoryLabel: cat.label,
    noun: cat.noun,
    Noun: cat.Noun,
    typeLabel: cat.typeLabel,
    heightLabel: cat.ui.heightLabel,
    name: type.name,
    group: cat.groups.find(g => g.id === type.group)?.label || "",
    lighting,
    lightingLabel: info.label,
    night: info.night,
    summary: type.summary,
    parts: cat.parts(type, opts),
    details: cat.details(type, opts, size),
  };
}

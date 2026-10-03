// Everything the tool can place: the sign types and the awning shapes, in two categories.
// Pure data helpers (no DOM), shared by the editor, the renderer, the PDF, the proof page,
// the approval-link server and the Node checks.
import { SIGN_TYPES, GROUPS as SIGN_GROUPS, LIGHTING, DEFAULT_TYPE } from "./sign-types.js";
import {
  AWNING_TYPES, AWNING_GROUPS, DEFAULT_AWNING, isAwning, sanitizeAwningOptions, awningDetails, AWNING_LIGHTS, COVER_PART,
} from "./awning-types.js";

export { isAwning };

export const CATEGORIES = [
  { id: "sign", label: "Signs", title: "Choose a sign type", def: DEFAULT_TYPE },
  { id: "awning", label: "Awnings", title: "Choose an awning shape", def: DEFAULT_AWNING },
];

export const ALL_TYPES = [
  ...SIGN_TYPES.map(t => ({ ...t, category: "sign" })),
  ...AWNING_TYPES.map(t => ({ ...t, lightingLabel: AWNING_LIGHTS[t.lighting] })),
];
export const TYPE_IDS = ALL_TYPES.map(t => t.id);
export const GROUPS = [...SIGN_GROUPS.map(g => ({ ...g, category: "sign" })), ...AWNING_GROUPS.map(g => ({ ...g, category: "awning" }))];

// Ids that older links may still carry.
const ALIASES = { awning: "aw-traditional" };

export const isKnownType = id => TYPE_IDS.includes(ALIASES[id] || id);

export function getType(id) {
  const key = ALIASES[id] || id;
  return ALL_TYPES.find(t => t.id === key) || ALL_TYPES.find(t => t.id === DEFAULT_TYPE);
}

/** The lighting key in effect: awnings only light up when backlit is chosen. */
export function lightingOf(type, opts) {
  if (!isAwning(type)) return type.lighting;
  return sanitizeAwningOptions(type, opts).lit === "backlit" ? "backlit" : "none";
}
export const litWith = (type, opts) => lightingOf(type, opts) !== "none";

/** Only the options that matter for the type, cleaned. Signs keep none (their look is in the images). */
export function cleanOptions(type, opts) {
  return isAwning(type) ? sanitizeAwningOptions(type, opts) : null;
}

/**
 * What the editor card, the proof page and the PDF say about the chosen type.
 * size: { width, height } in inches when known (awning projection can depend on it).
 */
export function describe(type, opts, size = null) {
  const lighting = lightingOf(type, opts);
  const base = {
    id: type.id,
    category: isAwning(type) ? "awning" : "sign",
    name: type.name,
    group: GROUPS.find(g => g.id === type.group)?.label || "",
    lighting,
    lightingLabel: isAwning(type) ? AWNING_LIGHTS[lighting] : type.lightingLabel,
    night: LIGHTING[lighting].night,
    summary: type.summary,
    parts: type.parts,
    details: [],
  };
  if (isAwning(type)) {
    base.details = awningDetails(type, opts, size?.width || 144, size?.height || 36);
    if (lighting === "backlit") base.parts = [...type.parts.filter(p => !p.startsWith("Cover:")), "Cover: translucent backlit vinyl", "LED lighting inside the frame"];
    else {
      const cover = COVER_PART[sanitizeAwningOptions(type, opts).cover];
      base.parts = type.parts.map(p => (p.startsWith("Cover:") || p.startsWith("Plate:") ? cover : p));
    }
  }
  return base;
}

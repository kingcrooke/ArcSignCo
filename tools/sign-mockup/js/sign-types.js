// Sign type library. Pure data (no DOM): used by the editor, the renderer, the PDF, the proof page,
// the pricing estimate and tools/check-sign-mockup.mjs.
//
// Dimensions are in inches and are typical values used to draw the picture, not specifications.
// `render.kind` picks the construction the renderer builds; the remaining render fields tune it.

export const LIGHTING = {
  face: { label: "Face-lit", night: "The faces glow; returns stay dark." },
  "face-sides": { label: "Face and sides lit", night: "Faces and sides glow; there is no trim cap to break the edge." },
  halo: { label: "Halo-lit (reverse-lit)", night: "Light washes the wall behind the letters; the faces stay dark." },
  "face-halo": { label: "Face + halo", night: "The faces glow and a halo washes the wall behind." },
  neon: { label: "Exposed LED neon", night: "The neon line itself glows, with colored spill on the wall." },
  internal: { label: "Internally lit", night: "The whole face glows from LEDs inside the cabinet." },
  "internal-letters": { label: "Internally lit (copy only)", night: "Only the push-through copy glows; the metal face stays dark." },
  external: { label: "External lights", night: "Gooseneck lamps wash the face from above." },
  none: { label: "Non-lit", night: "No light of its own; it reads by street and storefront light." },
};

export const GROUPS = [
  { id: "channel", label: "Channel letters" },
  { id: "nonlit", label: "Non-lit letters" },
  { id: "cabinet", label: "Light boxes" },
  { id: "blade", label: "Blade signs" },
  { id: "panel", label: "Panels" },
  { id: "graphics", label: "Neon, graphics and awnings" },
];

const T = [
  {
    id: "trimcap",
    group: "channel",
    name: "Trim cap channel letters",
    lighting: "face",
    summary: "The classic lit letter: a colored acrylic face held by a plastic trim cap on aluminum returns, with LED modules inside.",
    parts: ["Acrylic face", "Trim cap around the face edge", "Aluminum returns, about 5\" deep", "Aluminum back", "LED modules inside", "Studs into the wall; remote power supply"],
    render: { kind: "letters", depth: 5, gap: 0.5, trim: 0.75, face: "art", returns: "#202226", trimColor: "#202226" },
    options: ["returns", "trim"],
  },
  {
    id: "trimless",
    group: "channel",
    name: "Trimless channel letters",
    lighting: "face-sides",
    summary: "Acrylic face and sides with no trim cap, so the letter edge is clean and the sides light up along with the face.",
    parts: ["Acrylic face bonded to acrylic sides (no trim cap)", "Sides light with the face", "Aluminum back", "LED modules inside", "Studs into the wall; remote power supply"],
    render: { kind: "letters", depth: 3.5, gap: 0.5, trim: 0, face: "art", returns: "art", sidesLit: true },
    options: [],
  },
  {
    id: "halo",
    group: "channel",
    name: "Halo-lit (back-lit) channel letters",
    lighting: "halo",
    summary: "Reverse channel letters: solid metal faces and returns, open or clear backs, and LEDs aimed at the wall, mounted on standoffs so the light rings each letter.",
    parts: ["Solid aluminum face (painted or metal finish)", "Aluminum returns, about 3\" deep", "Clear polycarbonate back", "LEDs facing the wall", "Standoffs hold letters 1½\"–2\" off the wall"],
    render: { kind: "letters", depth: 3, gap: 1.75, trim: 0, face: "art", returns: "#2a2b30", halo: true, standoffs: true },
    options: ["returns", "light"],
  },
  {
    id: "combo",
    group: "channel",
    name: "Front & back-lit channel letters",
    lighting: "face-halo",
    summary: "A face-lit letter with a clear back on standoffs, so the face glows and a halo washes the wall behind it.",
    parts: ["Acrylic face with trim cap", "Aluminum returns, about 4\" deep", "Clear back", "LEDs light the face and the wall", "Standoffs about 1½\" off the wall"],
    render: { kind: "letters", depth: 4, gap: 1.5, trim: 0.75, face: "art", returns: "#202226", trimColor: "#202226", halo: true, standoffs: true },
    options: ["returns", "trim", "light"],
  },
  {
    id: "raceway",
    group: "channel",
    name: "Channel letters on raceway",
    lighting: "face",
    summary: "Trim cap letters mounted to a narrow painted box (raceway or wireway) that holds the wiring and power supply, so there are fewer holes in the facade.",
    parts: ["Acrylic face with trim cap", "Aluminum returns, about 5\" deep", "Raceway about 8\" tall × 6\" deep", "Power supply inside the raceway", "Raceway painted to match the wall"],
    render: { kind: "letters", depth: 5, gap: 0, trim: 0.75, face: "art", returns: "#202226", trimColor: "#202226", raceway: { height: 8, depth: 6 } },
    options: ["returns", "trim", "raceway"],
  },
  {
    id: "openneon",
    group: "channel",
    name: "Open-face neon-style channel letters",
    lighting: "neon",
    summary: "Channel letters with no face: you see inside the returns, where LED neon flex runs along each stroke for a vintage look.",
    parts: ["No face (open channel)", "Aluminum returns, about 3\" deep, painted inside", "LED neon flex along the strokes", "Aluminum back", "Studs into the wall; remote power supply"],
    render: { kind: "letters", depth: 3, gap: 0.5, trim: 0, face: "open", returns: "#1d1f24", tube: 0.5 },
    options: ["returns"],
  },
  {
    id: "fco",
    group: "nonlit",
    name: "Flat cut-out letters",
    lighting: "none",
    summary: "Letters cut from flat acrylic or aluminum sheet, ¼\"–½\" thick, pinned to the wall on studs with small spacers.",
    parts: ["Cut acrylic or aluminum, about ½\" thick", "Painted or metal finish", "Threaded studs into the wall", "Spacers hold it about ½\" off the wall", "No lighting"],
    render: { kind: "letters", depth: 0.5, gap: 0.5, trim: 0, face: "art", returns: "art-dark" },
    options: [],
  },
  {
    id: "fabmetal",
    group: "nonlit",
    name: "Fabricated metal letters",
    lighting: "none",
    summary: "Hollow letters built from sheet metal with a sealed back, so they have real depth without the cost of lighting.",
    parts: ["Aluminum or stainless face", "Metal returns, about 2\" deep", "Sealed back panel", "Studs into the wall", "No lighting"],
    render: { kind: "letters", depth: 2, gap: 0.25, trim: 0, face: "art", returns: "art-dark" },
    options: [],
  },
  {
    id: "lightbox",
    group: "cabinet",
    name: "Single-face light box (cabinet)",
    lighting: "internal",
    summary: "An aluminum cabinet with a translucent face (flex or polycarbonate) printed with the artwork and lit from inside.",
    parts: ["Translucent face: flex or polycarbonate", "Printed or vinyl graphics on the face", "Extruded aluminum cabinet, about 6\" deep", "LED modules inside", "Bolted to the wall"],
    render: { kind: "cabinet", depth: 6, gap: 0, frame: 1.25, frameColor: "#24262b", face: "panel" },
    options: ["panel", "frame"],
  },
  {
    id: "pushthru",
    group: "cabinet",
    name: "Routed light box with push-through letters",
    lighting: "internal-letters",
    summary: "An aluminum cabinet whose face is routed out where the copy goes; thick acrylic letters push through the holes and glow, while the metal face stays solid.",
    parts: ["Routed aluminum face", "Acrylic letters push through, standing about ¾\" proud", "Aluminum cabinet, about 4\" deep", "LEDs inside light only the copy", "Bolted to the wall"],
    render: { kind: "cabinet", depth: 4, gap: 0, frame: 0, frameColor: "#24262b", face: "routed", push: 0.75 },
    options: ["panel"],
  },
  {
    id: "bladelit",
    group: "blade",
    name: "Double-sided lit blade sign",
    lighting: "internal",
    summary: "A projecting cabinet with a lit face on each side, fixed to the wall with a mounting bracket so it reads from up and down the street.",
    parts: ["Two translucent faces, one each side", "Aluminum cabinet, about 8\" thick", "LED modules inside", "Steel mounting arms and wall plate", "Wiring through the wall plate"],
    pinHint: "Pin the four corners on the blade's face, not on the wall.",
    render: { kind: "blade", thick: 8, lit: true, arm: 6, face: "panel", frameColor: "#24262b" },
    options: ["panel", "frame", "side"],
  },
  {
    id: "blade",
    group: "blade",
    name: "Blade sign on decorative bracket",
    lighting: "none",
    summary: "A flat two-sided panel hung from a decorative bracket, a traditional storefront look with no wiring.",
    parts: ["Aluminum or ACM panel, printed both sides", "About 1\" thick with a painted edge", "Decorative steel bracket", "Two hanging rings", "Wall plate bolted to the facade"],
    pinHint: "Pin the four corners on the blade's face, not on the wall.",
    render: { kind: "blade", thick: 1, lit: false, arm: 8, face: "panel", frameColor: "#1b1c1f", bracket: true },
    options: ["panel", "side"],
  },
  {
    id: "panel",
    group: "panel",
    name: "Flat ACM panel on standoffs",
    lighting: "none",
    summary: "An aluminum composite (ACM) panel printed or vinyl-faced, held off the wall on metal standoffs at the corners.",
    parts: ["ACM panel, about ⅛\" thick", "Printed or vinyl graphics", "Metal standoffs at the corners", "About 1½\" off the wall", "No lighting"],
    render: { kind: "panel", thick: 0.125, gap: 1.5, standoffs: true, face: "panel" },
    options: ["panel"],
  },
  {
    id: "gooseneck",
    group: "panel",
    name: "Panel sign with gooseneck lights",
    lighting: "external",
    summary: "A flat panel sign lit from above by gooseneck lamps on curved arms, washing the face with light.",
    parts: ["ACM or aluminum panel", "Printed or vinyl graphics", "Gooseneck arms and shades above", "LED lamps aimed at the face", "Wiring through the wall at each lamp"],
    render: { kind: "panel", thick: 0.25, gap: 0.25, standoffs: false, face: "panel", lamps: true },
    options: ["panel"],
  },
  {
    id: "neonbacker",
    group: "graphics",
    name: "LED neon flex on clear backer",
    lighting: "neon",
    summary: "LED neon flex bent to the artwork and fixed to a clear acrylic backer, held off the wall on standoffs.",
    parts: ["LED neon flex along the artwork lines", "Clear acrylic backer, about ⅜\" thick", "Standoffs at the corners", "Low-voltage power supply", "Dimmer optional"],
    render: { kind: "neon", thick: 0.375, gap: 1, tube: 0.5 },
    options: [],
  },
  {
    id: "vinyl",
    group: "graphics",
    name: "Window vinyl graphics",
    lighting: "none",
    summary: "Cut or printed vinyl applied to the storefront glass.",
    pinHint: "Pin the four corners on the glass.",
    parts: ["Cut or printed vinyl film", "Applied to the glass", "Inside or outside face", "No depth", "No lighting"],
    render: { kind: "flat", surface: "glass" },
    options: [],
  },
  {
    id: "awning",
    group: "graphics",
    name: "Awning with valance lettering",
    lighting: "none",
    summary: "A traditional sloped awning: fabric stretched over a welded tube frame with closed sides, and the business name on the rigid valance along the front.",
    pinHint: "Pin the wall area the awning covers: top corners where the frame meets the wall, bottom corners level with the bottom of the valance.",
    notice: "NYC generally limits awning lettering to the business name and address, with letters up to 12\" tall and 12 sq ft in total; more copy makes it a sign. Verify before ordering.",
    parts: ["Acrylic canvas or vinyl cover", "Welded square-tube frame", "Projects about 3'–4' from the wall", "Rigid valance, about 10\" tall, carries the lettering", "Closed side panels", "Brackets bolted to the wall"],
    render: { kind: "awning", projection: 36, valance: 10 },
    options: ["panel", "fabric", "edge"],
  },
  {
    id: "painted",
    group: "graphics",
    name: "Painted wall sign",
    lighting: "none",
    summary: "Artwork painted straight onto the wall, so the brick or stucco texture shows through.",
    parts: ["Exterior paint on the wall", "Primer as needed", "No depth", "No hardware", "No lighting"],
    render: { kind: "flat", surface: "paint" },
    options: [],
  },
];

export const SIGN_TYPES = T.map(t => ({ ...t, lightingLabel: LIGHTING[t.lighting].label }));
export const TYPE_IDS = SIGN_TYPES.map(t => t.id);
export const DEFAULT_TYPE = "trimcap";

export function getType(id) {
  return SIGN_TYPES.find(t => t.id === id) || SIGN_TYPES.find(t => t.id === DEFAULT_TYPE);
}

// True when the type puts its own light on the scene at night.
export const isLit = type => type.lighting !== "none";

// Types whose artwork is cut-out shapes rather than a printed rectangle.
export const usesLetterShapes = type => ["letters", "neon"].includes(type.render.kind) || type.render.face === "routed";

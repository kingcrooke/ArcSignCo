// Awning shape library for the Awnings category (categories/awnings.js). Pure data (no DOM).
// The research behind each shape is docs/awnings-research.md (section 12 maps ids to sections).
//
// Lengths are inches. Projection and valance heights are typical drawing values, not
// specifications. The pinned patch on the wall sets the width (W) and the drop (D): the top edge
// is where the frame meets the wall, the bottom edge is the lowest framed part at the front.

export const COVERS = {
  fabric: { label: "Woven acrylic canvas", short: "Acrylic canvas" },
  vinyl: { label: "Coated vinyl", short: "Vinyl" },
  metal: { label: "Painted metal", short: "Metal" },
  glass: { label: "Laminated glass", short: "Glass" },
  poly: { label: "Polycarbonate", short: "Polycarbonate" },
};

export const PATTERNS = {
  solid: "Solid",
  stripes: "Wide stripes",
  pinstripe: "Narrow stripes",
};

export const VALANCES = {
  none: "No valance",
  straight: "Straight",
  scalloped: "Scalloped",
  wave: "Wave",
  serpentine: "Serpentine",
  parisian: "Parisian notch",
};

export const LETTERING = {
  valance: "On the valance",
  face: "On the face",
};

export const SIDES = { closed: "Closed sides", open: "Open sides" };
export const AWNING_LIGHTS = { none: "Non-lit", backlit: "Backlit" };

export const AWNING_GROUPS = [
  { id: "aw-slope", label: "Sloped and curved awnings" },
  { id: "aw-round", label: "Domes, cones and arches" },
  { id: "aw-face", label: "Sign-face and backlit awnings" },
  { id: "aw-canopy", label: "Canopies and marquees" },
  { id: "aw-retract", label: "Retractable" },
];

const FABRIC_VALANCES = ["straight", "scalloped", "wave", "serpentine", "parisian", "none"];
const SOFT = ["fabric", "vinyl"];
const PIN = "Pin the wall area the awning covers: top corners where the frame meets the wall, bottom corners level with the bottom of the front.";
const PIN_RODS = "Pin the wall area from where the rods meet the wall (top) down to the bottom of the front fascia.";
const PIN_POSTS = "Pin the wall behind it: top corners at the highest point of the roof, bottom corners level with the bottom of the valance. Posts are drawn to 8' below that.";

// d: projection {def, min, max} (def 0 = automatic, half the width); aspect: default drop / width;
// vr: valance or fascia height; covers: allowed covers, first is the default; valances: allowed
// valance styles, first is the default (empty = the shape has no valance); letter: allowed
// lettering spots, first is the default; sides: allowed side styles; backlit: can be backlit.
const S = [
  {
    id: "aw-traditional", group: "aw-slope", name: "Traditional slope",
    summary: "The standard storefront awning: one straight sloped panel from the wall to a front bar, usually with closed side panels and a valance along the front.",
    frame: ["Welded square-tube frame: wall bar, front bar and rafters", "Projection bars at the ends (closed sides) or diagonal arms (open sides)"],
    d: { def: 42, min: 18, max: 96 }, aspect: 0.27, vr: 10,
    covers: ["fabric", "vinyl", "metal"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed", "open"], backlit: true,
  },
  {
    id: "aw-quarter", group: "aw-slope", name: "Quarter-round",
    summary: "A full quarter-circle front: the cover leaves the wall level and curves down until it meets the valance straight up and down. Flat side panels close the ends.",
    frame: ["Bent-tube bows between a wall bar and a front bar", "Flat welded side frames"],
    d: { def: 36, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-convex", group: "aw-slope", name: "Convex",
    summary: "A softer outward curve than the quarter-round: the cover leaves the wall already sloping and rounds over into the front.",
    frame: ["Curved rafters (bows) between a wall bar and a front bar", "Flat welded side frames"],
    d: { def: 40, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-concave", group: "aw-slope", name: "Concave",
    summary: "The cover curves inward: steep where it leaves the wall and nearly level at the front. Sides can be closed for shade or open for a lighter look.",
    frame: ["Inward-bent rafters between a wall bar and a front bar", "Closed side frames, or open sides with support arms"],
    d: { def: 40, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed", "open"], backlit: false,
  },
  {
    id: "aw-bullnose", group: "aw-slope", name: "Bullnose",
    summary: "A shallow top that rolls over a tight round nose into the front, with squared, flat ends. Some shops use the same name for an elongated dome.",
    frame: ["Straight rafters into bent nose bows", "Flat welded side frames"],
    d: { def: 42, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-hip", group: "aw-slope", name: "Hip",
    summary: "Like half a pyramid: the front and both ends slope out and down from the top, so rain runs off three sides. The valance wraps all three.",
    frame: ["Welded tube frame with hip rafters at the corners", "Wall bar shorter than the front bar"],
    d: { def: 40, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: ["fabric", "vinyl", "metal"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-mansard", group: "aw-slope", name: "Mansard",
    summary: "A short flat cap at the top, then a steep front and hipped ends, finished with a fascia band. A formal look common on commercial buildings.",
    frame: ["Welded square aluminum tube, built in three sections", "Optional soffit panels underneath"],
    d: { def: 30, min: 18, max: 54 }, aspect: 0.32, vr: 10,
    covers: ["metal", "fabric"], valances: ["straight"], letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-bay", group: "aw-slope", name: "Bay (faceted)",
    summary: "A sloped awning whose front breaks into three mitered facets, the way it would follow a bay or angled storefront. The valance runs around all three.",
    frame: ["Welded tube frame with mitered corners", "Rafters at each facet seam"],
    d: { def: 40, min: 18, max: 72 }, aspect: 0.28, vr: 10,
    covers: ["fabric", "vinyl", "metal"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: ["closed"], backlit: false,
  },
  {
    id: "aw-gable", group: "aw-slope", name: "Gable",
    summary: "A peaked roof with the ridge running out from the wall, so the front shows a small triangle like a roof end. Valances run along both eaves and the front.",
    frame: ["Ridge bar, two eave bars and gable-end rafters", "Front posts if it projects far"],
    d: { def: 42, min: 24, max: 84 }, aspect: 0.36, vr: 10,
    covers: ["fabric", "vinyl", "metal"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-seam", group: "aw-slope", name: "Standing-seam metal",
    summary: "A sloped awning clad in metal roof panels with raised seams running down the slope, and a metal fascia in place of a fabric valance.",
    frame: ["Square aluminum tube frame", "Tie-backs or hanger rods on deeper projections"],
    d: { def: 36, min: 18, max: 72 }, aspect: 0.26, vr: 6,
    covers: ["metal"], valances: ["straight"], letter: ["valance", "face"], sides: ["closed", "open"], backlit: false,
  },
  {
    id: "aw-spear", group: "aw-slope", name: "Spear-arm",
    summary: "An open-sided sloped awning held up by ornamental iron arms that run past the front and end in spear finials. A classic café look.",
    frame: ["Wall bar and front bar", "Ornamental iron arms with spear finials", "No side panels"],
    d: { def: 40, min: 24, max: 72 }, aspect: 0.26, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-dutch", group: "aw-slope", name: "Dutch hood",
    summary: "A quarter-round hood made of hoops that pivot at the sides, giving pleated fabric and fan-shaped ends. It can fold up when not needed.",
    frame: ["Steel hoops pivoting on side hinges", "Wall bar at the top"],
    d: { def: 0, min: 0, max: 0 }, aspect: 0.3, vr: 0,
    covers: SOFT, valances: ["none", "straight", "scalloped"], letter: ["face", "valance"], sides: [], backlit: false,
  },
  {
    id: "aw-dome", group: "aw-round", name: "Dome",
    summary: "A quarter-sphere over a door, window or arch, built on ribs that radiate from the top center. The valance follows the curved rim.",
    frame: ["Curved wall bar", "Radial ribs from the top center", "Curved front hoop"],
    d: { def: 0, min: 18, max: 72 }, aspect: 0.5, vr: 8,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: true,
  },
  {
    id: "aw-longdome", group: "aw-round", name: "Elongated dome",
    summary: "A dome stretched for long windows and entries: a curved center section with rounded quarter-sphere ends.",
    frame: ["Straight bows along the center", "Dome-style ribs at each end"],
    d: { def: 36, min: 18, max: 72 }, aspect: 0.3, vr: 10,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: true,
  },
  {
    id: "aw-cone", group: "aw-round", name: "Cone",
    summary: "A half-cone that fans out from a point at the top center of the wall, like half an umbrella. Used over decorative entries.",
    frame: ["Straight ribs from a top hub", "Curved front hoop"],
    d: { def: 0, min: 18, max: 72 }, aspect: 0.5, vr: 8,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-halfbarrel", group: "aw-round", name: "Half-barrel",
    summary: "An arched awning: seen from the street the top is a round arch, and it runs straight back to the wall. Often used over arched doors and windows.",
    frame: ["Bent arch bows on a wall frame", "No posts"],
    d: { def: 30, min: 18, max: 54 }, aspect: 0.42, vr: 8,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-barrel", group: "aw-round", name: "Barrel canopy",
    summary: "A deeper arched canopy over an entrance: a barrel vault that runs out from the wall on two front posts, with a flat arched nose for the name.",
    frame: ["Bent arch bows on a wall frame", "Front posts in their own footings"],
    d: { def: 72, min: 36, max: 144 }, aspect: 0.45, vr: 10, posts: true,
    covers: ["fabric", "vinyl", "poly"], valances: FABRIC_VALANCES, letter: ["face", "valance"], sides: [], backlit: false,
  },
  {
    id: "aw-waterfall", group: "aw-face", name: "Waterfall (curved front)",
    summary: "A nearly flat top that rolls over a rounded nose into a tall vertical face, which carries the sign. Often made in vinyl and backlit.",
    frame: ["Extruded or welded aluminum frame", "Rounded nose bows"],
    d: { def: 36, min: 18, max: 60 }, aspect: 0.3, vr: 0,
    covers: SOFT, valances: ["none", "straight", "scalloped", "wave"], letter: ["face", "valance"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-box", group: "aw-face", name: "Box (flat front)",
    summary: "A near-rectangular section: an almost flat top, a sharp front corner and a vertical face. It reads as a fabric sign box.",
    frame: ["Welded square aluminum tube", "Top, front and end frames"],
    d: { def: 30, min: 12, max: 48 }, aspect: 0.26, vr: 0,
    covers: SOFT, valances: ["none", "straight"], letter: ["face", "valance"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-backlit", group: "aw-face", name: "Backlit awning",
    summary: "A waterfall-style frame covered in translucent vinyl with lights inside, so the whole cover glows and the graphics read at night.",
    frame: ["Welded aluminum frame, rated for damp locations", "LED lighting inside", "Open or grid bottom for service"],
    d: { def: 36, min: 18, max: 60 }, aspect: 0.3, vr: 0, lit: "backlit",
    covers: ["vinyl"], valances: ["none", "straight"], letter: ["face", "valance"], sides: ["closed"], backlit: true,
  },
  {
    id: "aw-wedge", group: "aw-face", name: "Wedge",
    summary: "A closed metal awning shaped like a crisp triangle: a sloped top, closed ends and a flat soffit underneath, with no valance.",
    frame: ["Welded tube frame", "Metal skin on top, ends and soffit"],
    d: { def: 30, min: 12, max: 48 }, aspect: 0.3, vr: 0,
    covers: ["metal"], valances: [], letter: ["face"], sides: [], backlit: false,
  },
  {
    id: "aw-flat", group: "aw-canopy", name: "Flat metal canopy",
    summary: "A near-level aluminum deck with a front fascia, hung from the wall on diagonal hanger rods. Clean and modern; the fascia carries the name.",
    frame: ["Extruded aluminum deck and fascia", "Stainless hanger rods to wall plates", "Gutter in the fascia"],
    d: { def: 54, min: 24, max: 108 }, aspect: 0.42, vr: 10, rods: true,
    covers: ["metal"], valances: [], letter: ["face"], sides: [], backlit: false,
  },
  {
    id: "aw-marquee", group: "aw-canopy", name: "Marquee",
    summary: "A heavy, permanent projecting canopy with a deep fascia for the name, supported from the building. The face can be lit from inside.",
    frame: ["Steel or aluminum box frame", "Hanger rods or chains to the wall", "Deep fascia on three sides"],
    d: { def: 72, min: 36, max: 120 }, aspect: 0.48, vr: 30, rods: true, lit: "backlit",
    covers: ["metal"], valances: [], letter: ["face"], sides: [], backlit: true,
  },
  {
    id: "aw-louver", group: "aw-canopy", name: "Louvered sunshade",
    summary: "A flat aluminum frame filled with angled blades that cut sun and glare but let light and air through, hung on rods.",
    frame: ["Extruded aluminum fascia and side channels", "Angled blades between them", "Hanger rods"],
    d: { def: 48, min: 24, max: 96 }, aspect: 0.4, vr: 8, rods: true,
    covers: ["metal"], valances: [], letter: ["face"], sides: [], backlit: false,
  },
  {
    id: "aw-glass", group: "aw-canopy", name: "Glass or polycarbonate canopy",
    summary: "A thin glass or polycarbonate plate over an entrance, hung from stainless tension rods. Lettering is a frosted print on the plate.",
    frame: ["Stainless wall fittings and tension rods", "Clamps along the back edge"],
    d: { def: 40, min: 30, max: 60 }, aspect: 0.36, vr: 0, rods: true,
    covers: ["glass", "poly"], valances: [], letter: ["face"], sides: [], backlit: false,
  },
  {
    id: "aw-entrance", group: "aw-canopy", name: "Entrance canopy",
    summary: "A long canopy over the walkway to an entrance, with a bowed top on posts and the name on the street end.",
    frame: ["Light tube frame with a bowed top", "Steel posts in their own footings"],
    d: { def: 120, min: 60, max: 240 }, aspect: 0.3, vr: 10, posts: true,
    covers: SOFT, valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-freestanding", group: "aw-canopy", name: "Freestanding canopy",
    summary: "A peaked roof on four posts that stands on its own in front of the building, for a walkway, café seating or an entry.",
    frame: ["Four posts, galvanized or powder-coated", "Ridge and eave bars", "Not tied to the wall"],
    d: { def: 96, min: 60, max: 180 }, aspect: 0.4, vr: 10, posts: true,
    covers: ["fabric", "vinyl", "metal"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-retractable", group: "aw-retract", name: "Retractable lateral-arm",
    summary: "Fabric on a roller in a box on the wall, pushed out by folding arms to a front bar, with a loose valance. It rolls back when not needed.",
    frame: ["Cassette box with roller", "Two folding lateral arms", "Front load bar"],
    d: { def: 96, min: 48, max: 156 }, aspect: 0.3, vr: 9,
    covers: ["fabric"], valances: FABRIC_VALANCES, letter: ["valance", "face"], sides: [], backlit: false,
  },
  {
    id: "aw-droparm", group: "aw-retract", name: "Drop-arm",
    summary: "A window awning whose fabric drops from a box and is pushed out by two pivoting side arms, so it sits at a steep angle in front of the glass.",
    frame: ["Box with roller above the window", "Two pivoting side arms", "Front rail"],
    d: { def: 30, min: 18, max: 48 }, aspect: 0.36, vr: 8,
    covers: ["fabric"], valances: FABRIC_VALANCES, letter: ["face", "valance"], sides: [], backlit: false,
  },
];

export const COVER_PART = {
  fabric: "Cover: woven acrylic canvas, sewn in widths about 46\" wide",
  vinyl: "Cover: coated vinyl, heat-welded seams",
  metal: "Cover: painted metal panels",
  glass: "Plate: laminated safety glass, about ⅝\" thick",
  poly: "Plate: polycarbonate sheet, UV-stable",
};

function partsFor(s) {
  const proj = s.d.def ? `Projects about ${Math.round(s.d.def / 12 * 2) / 2}' from the wall` : "Projection about half the width";
  const out = [COVER_PART[s.covers[0]], ...s.frame, proj];
  if (s.valances.length && s.valances[0] !== "none") out.push(s.vr >= 12 ? `Fascia about ${s.vr}" tall` : `Valance about ${s.vr}" tall`);
  if (s.rods) out.push("Wall plates bolted to the facade");
  else if (!s.posts) out.push("Brackets bolted to the wall");
  return out;
}

export const AWNING_TYPES = S.map(s => ({
  ...s,
  category: "awning",
  lighting: s.lit || "none",
  parts: partsFor(s),
  pinHint: s.posts ? PIN_POSTS : s.rods ? PIN_RODS : PIN,
  notice: "NYC generally limits awning lettering to the business name and address, letters up to 12\" tall and 12 sq ft in total, and treats lit or heavily lettered awnings as signs. Verify before ordering.",
  render: { kind: "awning", shape: s.id },
}));
export const AWNING_IDS = AWNING_TYPES.map(t => t.id);
export const DEFAULT_AWNING = "aw-traditional";
export const isAwning = type => !!type && type.category === "awning";

const HEX = /^#[0-9a-f]{6}$/i;

/** Projection in inches for a shape at width W (automatic shapes use half the width). */
export function projectionFor(type, opts, W, D) {
  const d = type.d;
  if (!d.max) return Math.max(6, D - (type.vr || 0));
  const v = Number(opts?.projection) || d.def || Math.min(d.max, Math.max(d.min, W / 2));
  return Math.min(d.max, Math.max(d.min, v));
}

export function defaultAwningOptions(type) {
  return {
    panel: type.covers[0] === "metal" ? "#2f3338" : "#7a1f1f",
    pattern: "solid",
    stripe: "#efe8d6",
    cover: type.covers[0],
    valance: type.valances[0] || "none",
    letterOn: type.letter[0],
    sides: type.sides[0] || "closed",
    lit: type.lit || "none",
    projection: type.d.def || 0,
    frame: "#2b2d31",
  };
}

/** Only the values the shape allows; anything else falls back to the default. Used by the server too. */
export function sanitizeAwningOptions(type, input) {
  const raw = input && typeof input === "object" ? input : {};
  const def = defaultAwningOptions(type);
  const pick = (k, allowed) => (allowed.includes(raw[k]) ? raw[k] : def[k]);
  const o = {
    panel: HEX.test(raw.panel || "") ? raw.panel.toLowerCase() : def.panel,
    stripe: HEX.test(raw.stripe || "") ? raw.stripe.toLowerCase() : def.stripe,
    frame: HEX.test(raw.frame || "") ? raw.frame.toLowerCase() : def.frame,
    cover: pick("cover", type.covers),
    valance: type.valances.length ? pick("valance", type.valances) : "none",
    letterOn: pick("letterOn", type.letter),
    sides: type.sides.length ? pick("sides", type.sides) : def.sides,
    lit: type.backlit ? pick("lit", ["none", "backlit"]) : "none",
    pattern: pick("pattern", Object.keys(PATTERNS)),
    projection: def.projection,
  };
  const p = Number(raw.projection);
  if (type.d.max && Number.isFinite(p) && p > 0) o.projection = Math.round(Math.min(type.d.max, Math.max(type.d.min, p)));
  if (o.lit === "backlit" && type.id !== "aw-marquee") o.cover = "vinyl";
  if (!SOFT.includes(o.cover)) o.pattern = "solid";
  if (o.valance === "none" && o.letterOn === "valance" && type.letter.includes("face")) o.letterOn = "face";
  return o;
}

/** Option keys the editor shows for this shape with these choices. */
export function awningOptionKeys(type, opts) {
  const keys = [];
  if (type.d.max) keys.push("projection");
  if (type.covers.length > 1) keys.push("cover");
  if (type.backlit) keys.push("lit");
  if (!["glass", "poly"].includes(opts.cover)) keys.push("panel");
  if (SOFT.includes(opts.cover)) keys.push("pattern");
  if (SOFT.includes(opts.cover) && opts.pattern !== "solid") keys.push("stripe");
  if (type.valances.length > 1) keys.push("valance");
  if (type.letter.length > 1) keys.push("letterOn");
  if (type.sides.length > 1) keys.push("sides");
  if (type.posts || type.rods || opts.sides === "open" || ["aw-spear", "aw-retractable", "aw-droparm"].includes(type.id)) keys.push("frame");
  return keys;
}

const ft = inches => {
  const f = Math.floor(inches / 12), i = Math.round(inches - f * 12);
  return i === 12 ? `${f + 1}' 0"` : f ? `${f}' ${i}"` : `${i}"`;
};

/** Human-readable rows for the chosen options (editor card, proof page, PDF). */
export function awningDetails(type, opts, W = 144, D = 36) {
  const o = sanitizeAwningOptions(type, opts);
  const rows = [["Cover", COVERS[o.cover].label]];
  if (SOFT.includes(o.cover)) rows.push(["Pattern", PATTERNS[o.pattern]]);
  if (type.valances.length) rows.push([type.vr >= 12 || type.valances.length === 1 ? "Fascia" : "Valance", o.valance === "none" ? "None" : type.valances.length === 1 ? `About ${type.vr}" tall` : `${VALANCES[o.valance]}, about ${type.vr}" tall`]);
  rows.push(["Lettering", o.letterOn === "valance" ? (type.valances.length === 1 ? "On the fascia" : "On the valance") : "On the face"]);
  if (type.sides.length) rows.push(["Sides", SIDES[o.sides]]);
  rows.push(["Projection", type.d.max ? `About ${ft(projectionFor(type, o, W, D))}` : "Same as the drop"]);
  rows.push(["Lighting", AWNING_LIGHTS[o.lit]]);
  return rows;
}

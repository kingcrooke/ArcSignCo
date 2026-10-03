// Awnings: 29 shapes in five families, with cover, pattern, valance, lettering, sides, projection
// and backlighting options. Types and options: awnings/types.js. 3D mesh: awnings/geometry.js.
// Render rules: awnings/build.js. Side-profile cards: awnings/diagrams.js.
import { defineCategory } from "./define.js";
import {
  AWNING_TYPES, AWNING_GROUPS, DEFAULT_AWNING, COVERS, PATTERNS, VALANCES, LETTERING, SIDES, AWNING_LIGHTS, COVER_PART,
  defaultAwningOptions, sanitizeAwningOptions, awningOptionKeys, awningDetails, projectionFor,
} from "./awnings/types.js";
import { buildAwning, awningFlat } from "./awnings/build.js";
import { awningDiagram } from "./awnings/diagrams.js";
import { formatFeetInches } from "../geometry.js";

const fascia = type => type.vr >= 12;
const DEFAULT_SIZE = { width: 144, height: 36 };

const FIELDS = {
  projection: (t, o, size) => ({
    label: "Projection", kind: "range", min: t.d.min, max: t.d.max, step: 1,
    value: Math.round(projectionFor(t, o, size.width, size.height)), format: v => `${formatFeetInches(v)} from the wall`,
  }),
  cover: t => ({ label: "Cover", kind: "select", choices: t.covers.map(c => [c, COVERS[c].short]) }),
  lit: () => ({ label: "Lighting", kind: "select", choices: Object.entries(AWNING_LIGHTS) }),
  panel: (t, o) => ({ label: o.cover === "metal" ? "Panel color" : "Fabric color", kind: "color" }),
  pattern: () => ({ label: "Pattern", kind: "select", choices: Object.entries(PATTERNS) }),
  stripe: () => ({ label: "Stripe color", kind: "color" }),
  valance: t => ({ label: fascia(t) ? "Fascia" : "Valance", kind: "select", choices: t.valances.map(v => [v, VALANCES[v]]) }),
  letterOn: t => ({ label: "Lettering", kind: "select", choices: t.letter.map(v => [v, v === "valance" && fascia(t) ? "On the fascia" : LETTERING[v]]) }),
  sides: t => ({ label: "Sides", kind: "select", choices: t.sides.map(v => [v, SIDES[v]]) }),
  frame: () => ({ label: "Frame", kind: "color" }),
};

const lightingOf = (type, opts) => (sanitizeAwningOptions(type, opts).lit === "backlit" ? "backlit" : "none");

export default defineCategory({
  id: "awning",
  label: "Awnings",
  noun: "awning",
  typeWord: "shape",
  title: "Choose an awning shape",
  intro: "Each shape is drawn from the side: the frame in dark lines, the cover in color, the wall on the left. Not to scale. Pick one, then set the projection, cover, pattern, valance and lettering.",
  groups: AWNING_GROUPS,
  types: AWNING_TYPES,
  defaultType: DEFAULT_AWNING,
  // Ids older approval links may still carry.
  aliases: { awning: "aw-traditional" },
  diagram: awningDiagram,
  cardNote: t => (t.lighting === "backlit" ? "Backlit" : t.backlit ? "Non-lit · backlit option" : "Non-lit"),

  defaultOptions: defaultAwningOptions,
  sanitizeOptions: sanitizeAwningOptions,
  optionFields(type, opts, size = DEFAULT_SIZE) {
    const o = sanitizeAwningOptions(type, opts);
    return awningOptionKeys(type, o).map(key => {
      const f = FIELDS[key](type, o, size);
      return { key, value: o[key], refresh: f.kind === "select", ...f };
    });
  },
  lightingOf,
  details: (type, opts, size) => awningDetails(type, opts, size?.width || 144, size?.height || 36),
  parts(type, opts) {
    if (lightingOf(type, opts) === "backlit") return [...type.parts.filter(p => !p.startsWith("Cover:")), "Cover: translucent backlit vinyl", "LED lighting inside the frame"];
    const cover = COVER_PART[sanitizeAwningOptions(type, opts).cover];
    return type.parts.map(p => (p.startsWith("Cover:") || p.startsWith("Plate:") ? cover : p));
  },

  build: buildAwning,
  faceArt: (type, art, opts, size) => awningFlat(type, art, opts, size?.width || 144, size?.height || 40),
  aspect: type => type.aspect,
  spillReach: 1.6,

  ui: {
    textLabel: "Lettering",
    placeTip: "Drag the four corner handles onto the wall area the awning covers; it is drawn out from the wall in perspective. Drag inside to move it. Switch to <strong>Night</strong> to see it after dark: only backlit awnings glow.",
    heightLabel: "Drop",
    heightShort: "drop",
    flatLabel: "The awning lettering surface, flat",
    hangs: true,
    sizeExtra: (type, opts, size) => ({ label: "Projection", value: formatFeetInches(projectionFor(type, opts, size?.width || 0, size?.height || 0)) }),
  },

  // Each shape's row in js/pricing-config.js, where every price number lives. Width and
  // projection are both priced; backlighting is an adder there, switched on by the lighting.
  priceInputs: (type, opts, size) => ({ width: size.width, height: size.height, projection: projectionFor(type, opts, size.width, size.height) }),
  pricing: {
    row: {
      "aw-traditional": "awning-slope",
      "aw-quarter": "awning-slope",
      "aw-convex": "awning-slope",
      "aw-concave": "awning-slope",
      "aw-bullnose": "awning-slope",
      "aw-dutch": "awning-slope",
      "aw-hip": "awning-faceted",
      "aw-mansard": "awning-faceted",
      "aw-bay": "awning-faceted",
      "aw-gable": "awning-faceted",
      "aw-spear": "awning-faceted",
      "aw-seam": "awning-seam",
      "aw-dome": "awning-round",
      "aw-longdome": "awning-round",
      "aw-cone": "awning-round",
      "aw-halfbarrel": "awning-round",
      "aw-barrel": "awning-round",
      "aw-waterfall": "awning-face",
      "aw-box": "awning-face",
      "aw-backlit": "awning-face",
      "aw-wedge": "awning-face",
      "aw-flat": "canopy-metal",
      "aw-louver": "canopy-metal",
      "aw-marquee": "canopy-marquee",
      "aw-glass": "canopy-glass",
      "aw-entrance": "canopy-entrance",
      "aw-freestanding": "canopy-freestanding",
      "aw-retractable": "retractable",
      "aw-droparm": "droparm",
    },
  },
});

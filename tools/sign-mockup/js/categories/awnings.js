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

  // ==========================================================================================
  //  ESTIMATE PLACEHOLDERS. NOT ARC'S REAL PRICING. NOT A QUOTE.
  //  Dollars per linear foot of awning width (the pinned width), by shape. A shape that can be
  //  backlit adds the adder per linear foot when backlighting is chosen; lit: true means the
  //  rate already includes its lighting.
  // ==========================================================================================
  pricing: {
    placeholder: true,
    basis: "awning",
    unit: "linear ft of awning width",
    perFoot: true,
    note: "Estimate placeholder per linear foot of awning width, not a quote. Permits, electrical, removal and lift work are not included.",
    adder: { key: "backlit", low: 120, high: 220, applies: (type, opts, rate) => !rate.lit && opts?.lit === "backlit" },
    rates: {
      "aw-traditional": { low: 180, high: 320, min: [1200, 2000] },
      "aw-quarter": { low: 200, high: 340, min: [1300, 2200] },
      "aw-convex": { low: 210, high: 350, min: [1300, 2200] },
      "aw-concave": { low: 210, high: 350, min: [1300, 2200] },
      "aw-bullnose": { low: 220, high: 360, min: [1400, 2300] },
      "aw-hip": { low: 230, high: 380, min: [1500, 2500] },
      "aw-mansard": { low: 260, high: 420, min: [1800, 3000] },
      "aw-bay": { low: 260, high: 430, min: [1800, 3000] },
      "aw-gable": { low: 250, high: 420, min: [1600, 2700] },
      "aw-seam": { low: 280, high: 460, min: [2000, 3300] },
      "aw-spear": { low: 240, high: 400, min: [1600, 2700] },
      "aw-dutch": { low: 150, high: 260, min: [900, 1500] },
      "aw-dome": { low: 260, high: 440, min: [1400, 2400] },
      "aw-longdome": { low: 260, high: 430, min: [1600, 2700] },
      "aw-cone": { low: 250, high: 420, min: [1400, 2400] },
      "aw-halfbarrel": { low: 240, high: 400, min: [1500, 2500] },
      "aw-barrel": { low: 420, high: 700, min: [3500, 6000] },
      "aw-waterfall": { low: 240, high: 400, min: [1600, 2700] },
      "aw-box": { low: 230, high: 380, min: [1500, 2500] },
      "aw-backlit": { low: 380, high: 620, min: [3000, 5000], lit: true },
      "aw-wedge": { low: 260, high: 430, min: [1800, 3000] },
      "aw-flat": { low: 420, high: 700, min: [3000, 5000] },
      "aw-marquee": { low: 900, high: 1500, min: [8000, 14000], lit: true },
      "aw-louver": { low: 380, high: 640, min: [2800, 4600] },
      "aw-glass": { low: 650, high: 1100, min: [5000, 8500] },
      "aw-entrance": { low: 500, high: 850, min: [4500, 8000] },
      "aw-freestanding": { low: 450, high: 780, min: [4500, 7500] },
      "aw-retractable": { low: 250, high: 450, min: [2500, 4200] },
      "aw-droparm": { low: 160, high: 280, min: [900, 1600] },
    },
  },
});

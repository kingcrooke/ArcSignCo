// Signs: channel letters, light boxes, blades, panels, neon and applied graphics.
// Types: categories/signs/types.js. Cards: categories/signs/diagrams.js. Render rules: the shared
// construction kinds in js/kinds.js (the defaults, so nothing is set here).
import { defineCategory } from "./define.js";
import { SIGN_TYPES, GROUPS, DEFAULT_TYPE } from "./signs/types.js";
import { diagramSvg } from "./signs/diagrams.js";

export default defineCategory({
  id: "sign",
  label: "Signs",
  noun: "sign",
  typeWord: "type",
  title: "Choose a sign type",
  intro: "Each type is drawn the way it's built: depth, mounting and where the light comes from. The drawings are cross-sections, not to scale.",
  groups: GROUPS,
  types: SIGN_TYPES,
  defaultType: DEFAULT_TYPE,
  diagram: diagramSvg,

  // ==========================================================================================
  //  PLACEHOLDER RATES. NOT ARC'S REAL PRICING. NOT A QUOTE.
  //  basis "width" = dollars per linear foot of sign width; "area" = dollars per square foot.
  //  low / high = the rate range; min = [low, high] minimum job amount.
  // ==========================================================================================
  pricing: {
    placeholder: true,
    rates: {
      trimcap: { basis: "width", low: 260, high: 420, min: [1800, 2800] },
      trimless: { basis: "width", low: 320, high: 520, min: [2200, 3400] },
      halo: { basis: "width", low: 340, high: 560, min: [2400, 3800] },
      combo: { basis: "width", low: 400, high: 650, min: [2800, 4400] },
      raceway: { basis: "width", low: 280, high: 450, min: [2000, 3200] },
      openneon: { basis: "width", low: 360, high: 600, min: [2600, 4200] },
      fco: { basis: "width", low: 90, high: 170, min: [600, 1100] },
      fabmetal: { basis: "width", low: 180, high: 320, min: [1200, 2200] },
      lightbox: { basis: "area", low: 75, high: 125, min: [1800, 3000] },
      pushthru: { basis: "area", low: 120, high: 200, min: [2600, 4200] },
      bladelit: { basis: "area", low: 160, high: 260, min: [2400, 3800] },
      blade: { basis: "area", low: 90, high: 160, min: [900, 1600] },
      panel: { basis: "area", low: 28, high: 50, min: [450, 850] },
      gooseneck: { basis: "area", low: 40, high: 70, min: [1400, 2400] },
      neonbacker: { basis: "width", low: 150, high: 260, min: [700, 1300] },
      vinyl: { basis: "area", low: 12, high: 24, min: [200, 400] },
      painted: { basis: "area", low: 18, high: 35, min: [800, 1500] },
    },
  },
});

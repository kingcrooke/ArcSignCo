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

  // Each type's row in js/pricing-config.js, where every price number lives.
  pricing: {
    row: {
      trimcap: "letters-trimcap",
      trimless: "letters-trimless",
      halo: "letters-halo",
      combo: "letters-combo",
      raceway: "letters-raceway",
      openneon: "letters-openneon",
      fco: "letters-fco",
      fabmetal: "letters-fabmetal",
      lightbox: "cabinet-lightbox",
      pushthru: "cabinet-pushthru",
      bladelit: "blade-lit",
      blade: "blade-nonlit",
      panel: "panel-flat",
      gooseneck: "panel-gooseneck",
      neonbacker: "neon-backer",
      vinyl: "graphics-vinyl",
      painted: "graphics-painted",
    },
  },
});

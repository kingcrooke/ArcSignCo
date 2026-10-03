// Vinyl & Stickers: coming soon. To make it live, follow docs/ADDING-A-CATEGORY.md (the "flat"
// construction kind already draws vinyl on glass and walls).
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "vinyl",
  label: "Vinyl & Stickers",
  noun: "decal",
  intro: "Cut and printed vinyl for windows, walls, floors and glass, placed on your photo the same way as a sign.",
  icon: '<path d="M10 8h22l8 8v24H10z"/><path d="M32 8v8h8"/><path d="M17 30l6-8 5 6 3-4 4 6"/>',
  examples: [
    { name: "Window lettering", note: "Hours, logos and contact lines in cut vinyl on storefront glass." },
    { name: "Glass decals and frosted film", note: "Etched-look film for doors and partitions, with clear cut-out logos." },
    { name: "Perforated window film", note: "Full-color graphics outside that you can still see through from inside." },
    { name: "Wall graphics", note: "Printed wall wraps, murals and feature walls, matte or gloss laminate." },
    { name: "Floor decals", note: "Laminated, slip-resistant floor graphics for promotions and queue lines." },
  ],
});

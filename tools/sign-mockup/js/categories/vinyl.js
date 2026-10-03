// Vinyl & Stickers: cut and printed film on glass, walls and doors.
import { defineCategory } from "./define.js";
import { vinylDiagram } from "./vinyl/diagrams.js";
import {
  defaultVinylOptions, sanitizeVinylOptions, vinylOptionFields, vinylDetails, parseSize, placeWidthIn,
} from "./vinyl/options.js";
import { kindFaceArt, kindAspect } from "../kinds.js";

export default defineCategory({
  id: "vinyl",
  label: "Vinyl & Stickers",
  noun: "vinyl graphic",
  title: "Choose a vinyl graphic",
  intro: "Cut and printed vinyl for windows, walls and doors. The drawings are sections, not to scale.",
  groups: [
    { id: "window", label: "Window film" },
    { id: "wall", label: "Walls" },
    { id: "door", label: "Doors and decals" },
  ],
  defaultType: "vinyl-window-lettering",
  types: [
    {
      id: "vinyl-window-lettering",
      group: "window",
      name: "Window lettering",
      lighting: "none",
      summary: "Cut or printed vinyl on storefront glass for logos, hours and contact lines.",
      parts: ["Cast or calendared vinyl film", "Applied to the glass face", "Matte or gloss finish", "No depth", "No lighting"],
      pinHint: "Pin the four corners on the glass.",
      render: { kind: "flat", surface: "glass" },
      options: [],
      aspect: 0.22,
    },
    {
      id: "vinyl-window-perf",
      group: "window",
      name: "Perforated window film",
      lighting: "none",
      summary: "Full-color graphics on the outside that stay see-through from inside the store.",
      parts: ["Perforated print film with laminate", "About 50% open area typical", "Black or printed backer", "On glass or polycarbonate", "No lighting"],
      pinHint: "Pin the four corners on the window opening.",
      render: { kind: "flat", surface: "glass" },
      options: [],
      aspect: 0.55,
    },
    {
      id: "vinyl-frosted",
      group: "window",
      name: "Frosted / etched glass film",
      lighting: "none",
      summary: "Etched-look film for privacy bands, doors and conference glass, with optional clear-cut logos.",
      parts: ["Frosted polyester film", "Etched, dot or band patterns", "Cut-outs stay clear", "Interior-mounted typical", "No lighting"],
      pinHint: "Pin the four corners on the glass area to cover.",
      render: { kind: "flat", surface: "glass" },
      options: [],
      aspect: 0.65,
    },
    {
      id: "vinyl-wall-mural",
      group: "wall",
      name: "Wall graphics / mural",
      lighting: "none",
      summary: "Printed wall wraps and murals on brick, CMU or drywall, with a protective laminate.",
      parts: ["Printed wall vinyl or fabric", "Matte or gloss laminate", "Installed flat to the wall", "No standoffs", "No lighting"],
      render: { kind: "flat", surface: "paint" },
      options: [],
      aspect: 0.5,
    },
    {
      id: "vinyl-glass-decal",
      group: "door",
      name: "Glass decal or sticker",
      lighting: "none",
      summary: "Printed or cut decals for door glass, sidelites and partitions.",
      parts: ["Clear or white vinyl", "Printed or spot-color cut", "Removable or permanent adhesive", "No depth", "No lighting"],
      pinHint: "Pin the four corners on the decal area.",
      render: { kind: "flat", surface: "glass" },
      options: [],
      aspect: 1,
    },
    {
      id: "vinyl-door-hours",
      group: "door",
      name: "Hours and door decal",
      lighting: "none",
      summary: "Small cut or printed panels for business hours, suite numbers and door instructions.",
      parts: ["Cut or printed vinyl", "On glass or painted door", "Matte finish reduces glare", "No depth", "No lighting"],
      pinHint: "Pin the four corners on the door glass or panel.",
      render: { kind: "flat", surface: "glass" },
      options: [],
      aspect: 1.35,
    },
  ],
  diagram: vinylDiagram,
  defaultOptions: defaultVinylOptions,
  sanitizeOptions: sanitizeVinylOptions,
  optionFields: vinylOptionFields,
  details: (type, opts) => vinylDetails(type, opts),
  faceArt: kindFaceArt,
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeVinylOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    return type.aspect || kindAspect(type, art, opts);
  },
  ui: {
    tabLabel: "Vinyl",
    placeWidthIn,
    textLabel: "Graphic text",
    placeTip: "Drag the four corner handles onto the glass or wall. Drag inside to move it. Vinyl has no depth; night view shows ambient light only.",
    flatLabel: "The vinyl artwork, flat",
  },
  pricing: {
    row: {
      "vinyl-window-lettering": "graphics-vinyl",
      "vinyl-window-perf": "graphics-vinyl",
      "vinyl-frosted": "graphics-vinyl",
      "vinyl-wall-mural": "graphics-painted",
      "vinyl-glass-decal": "graphics-vinyl",
      "vinyl-door-hours": "graphics-vinyl",
    },
  },
});

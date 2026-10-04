// ADA & Code Signs: tactile, Braille and life-safety layouts (preview only).
import { defineCategory } from "./define.js";
import { adaDiagram } from "./ada/diagrams.js";
import {
  defaultAdaOptions, sanitizeAdaOptions, adaOptionFields, adaDetails, parseSize, placeWidthIn,
} from "./ada/options.js";
import { buildKind, kindFaceArt, kindAspect } from "../kinds.js";
import { tactileFace } from "./ada/face.js";

const LAYOUT_NOTICE = "Layout preview prepared for architect and inspector review. Tactile copy and Grade 2 Braille spacing are confirmed in shop drawings before fabrication, and code requirements are confirmed during survey.";

export default defineCategory({
  id: "ada",
  label: "ADA & Code Signs",
  noun: "sign",
  titleNoun: "ADA and code sign",
  title: "Choose a code-related sign",
  intro: "Tactile, Braille and life-safety sign layouts for architect and inspector review. Arc confirms final details before ordering.",
  groups: [
    { id: "room", label: "Room and restroom" },
    { id: "life", label: "Stairs and exits" },
  ],
  defaultType: "ada-restroom",
  types: [
    {
      id: "ada-room",
      group: "room",
      name: "Tactile room sign",
      lighting: "none",
      summary: "Raised letters with a Grade 2 Braille band, mounted beside the door.",
      notice: LAYOUT_NOTICE,
      parts: ["Photopolymer or acrylic tactile copy", "Grade 2 Braille cells below", "Standoffs beside the door", "Matte or satin finish", "No lighting"],
      pinHint: "Pin the four corners on the plaque beside the door.",
      render: { kind: "letters", depth: 0.1875, gap: 0.5, trim: 0, face: "art", returns: "#2a2b30", tactile: true },
      options: ["returns"],
      aspect: 0.65,
    },
    {
      id: "ada-restroom",
      group: "room",
      name: "Restroom sign",
      lighting: "none",
      summary: "6 in pictogram field with tactile text and Braille outside the field.",
      notice: LAYOUT_NOTICE,
      parts: ["6 in pictogram field", "Tactile text and Braille outside the field", "Aluminum or acrylic plaque", "Standoff mount", "No lighting"],
      pinHint: "Pin the four corners on the plaque beside the door.",
      render: { kind: "letters", depth: 0.1875, gap: 0.5, trim: 0, face: "art", returns: "#2a2b30", tactile: true },
      options: ["returns"],
      aspect: 1.2,
    },
    {
      id: "ada-stair",
      group: "life",
      name: "Stair identification",
      lighting: "none",
      summary: "18×12 in min floor-identification sign at 5 ft AFF, plus a separate tactile floor sign (BC 1023.9).",
      notice: LAYOUT_NOTICE,
      parts: ["18×12 in min floor ID sign", "Top of sign about 5 ft above landing", "Separate tactile floor sign at the door", "Aluminum or acrylic", "No lighting"],
      render: { kind: "panel", gap: 0.5, thick: 0.125, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.667,
    },
    {
      id: "ada-exit-tactile",
      group: "life",
      name: "Tactile EXIT sign",
      lighting: "none",
      summary: "Raised EXIT with Grade 2 Braille (BC 1013.4). Not the illuminated exit sign.",
      notice: LAYOUT_NOTICE,
      parts: ["Tactile EXIT copy", "Grade 2 Braille", "Standoff mount beside the door", "Matte or satin finish", "No lighting"],
      pinHint: "Pin the four corners on the plaque beside the door.",
      render: { kind: "letters", depth: 0.1875, gap: 0.5, trim: 0, face: "art", returns: "#2a2b30", tactile: true },
      options: ["returns"],
      aspect: 0.65,
    },
    {
      id: "ada-exit",
      group: "life",
      name: "Illuminated exit sign",
      lighting: "internal",
      summary: "Red letters, UL 924 listed, always lit with 90-minute emergency power. Connected by the project's licensed electrician.",
      notice: `${LAYOUT_NOTICE} Illuminated exits require electrical coordination by the project's licensed electrician.`,
      parts: ["Listed exit cabinet (UL 924)", "Red translucent face", "LED modules inside", "90-minute emergency power, always on", "Wired by the project's licensed electrician"],
      render: { kind: "cabinet", depth: 4, gap: 0, frame: 0.75, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame"],
      aspect: 0.333,
    },
  ],
  diagram: adaDiagram,
  defaultOptions: defaultAdaOptions,
  sanitizeOptions: sanitizeAdaOptions,
  optionFields: adaOptionFields,
  details: (type, opts) => adaDetails(type, opts),
  build: buildKind,
  faceArt(type, art, opts) {
    if (type.render.tactile) return tactileFace(art, sanitizeAdaOptions(type, opts));
    return kindFaceArt(type, art, opts);
  },
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeAdaOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    if (type.render.tactile) {
      const base = kindAspect(type, art, opts);
      return base * 1.28;
    }
    return type.aspect || kindAspect(type, art, opts);
  },
  spillReach: 0.9,
  ui: {
    tabLabel: "ADA",
    plaque: true,
    placeWidthIn,
    textLabel: "Sign text",
    placeTip: "Drag the four corner handles beside the door or on the wall. Tactile and Braille are shown for layout. Switch to <strong>Night</strong> to see lit exit faces.",
    flatLabel: "The sign artwork, flat",
  },
  pricing: {
    row: {
      "ada-room": "panel-flat",
      "ada-restroom": "panel-flat",
      "ada-stair": "panel-flat",
      "ada-exit-tactile": "panel-flat",
      "ada-exit": "cabinet-lightbox",
    },
  },
});

// ADA & Code Signs: tactile, Braille and life-safety layouts (preview only).
import { defineCategory } from "./define.js";
import { adaDiagram } from "./ada/diagrams.js";
import {
  defaultAdaOptions, sanitizeAdaOptions, adaOptionFields, adaDetails, parseSize,
} from "./ada/options.js";
import { buildKind, kindFaceArt, kindAspect } from "../kinds.js";
import { tactileFace } from "./ada/face.js";

const LAYOUT_NOTICE = "Layout preview only. Tactile copy and Grade 2 Braille spacing are confirmed in shop drawings before fabrication. This tool does not determine ADA or code compliance.";

export default defineCategory({
  id: "ada",
  label: "ADA & Code Signs",
  noun: "sign",
  title: "Choose a code-related sign",
  intro: "Tactile, Braille and life-safety sign layouts for architect and inspector review. Arc confirms final details before ordering.",
  groups: [
    { id: "room", label: "Room and restroom" },
    { id: "life", label: "Stairs and exits" },
  ],
  defaultType: "ada-room",
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
      summary: "Pictogram, raised text and Braille on a matching plaque.",
      notice: LAYOUT_NOTICE,
      parts: ["Pictogram and tactile text", "Grade 2 Braille band", "Aluminum or acrylic plaque", "Standoff mount", "No lighting"],
      pinHint: "Pin the four corners on the plaque beside the door.",
      render: { kind: "letters", depth: 0.1875, gap: 0.5, trim: 0, face: "art", returns: "#2a2b30", tactile: true },
      options: ["returns"],
      aspect: 0.85,
    },
    {
      id: "ada-stair",
      group: "life",
      name: "Stair identification",
      lighting: "none",
      summary: "Stair letter, floor level and tactile/Braille lines at the landing.",
      notice: LAYOUT_NOTICE,
      parts: ["Tactile stair ID copy", "Grade 2 Braille", "Aluminum or acrylic plaque", "Mount at landing", "No lighting"],
      render: { kind: "panel", gap: 0.5, thick: 0.125, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.65,
    },
    {
      id: "ada-exit",
      group: "life",
      name: "Exit / egress sign",
      lighting: "internal",
      summary: "An internally lit exit cabinet. Electrical coordination and backup power are confirmed for the project.",
      notice: `${LAYOUT_NOTICE} Electrical coordination is required for illuminated exits.`,
      parts: ["Aluminum cabinet", "Translucent red or green face", "LED modules inside", "Battery backup optional", "Wiring to the line"],
      render: { kind: "cabinet", depth: 4, gap: 0, frame: 0.75, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame"],
      aspect: 0.65,
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
    textLabel: "Sign text",
    placeTip: "Drag the four corner handles beside the door or on the wall. Tactile and Braille are shown for layout. Switch to <strong>Night</strong> to see lit exit faces.",
    flatLabel: "The sign artwork, flat",
  },
  pricing: {
    row: {
      "ada-room": "panel-flat",
      "ada-restroom": "panel-flat",
      "ada-stair": "panel-flat",
      "ada-exit": "cabinet-lightbox",
    },
  },
});

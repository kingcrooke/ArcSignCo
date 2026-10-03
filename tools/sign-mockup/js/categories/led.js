// LED Displays: programmable cabinets, window displays and LED neon flex.
import { defineCategory } from "./define.js";
import { ledDiagram } from "./led/diagrams.js";
import {
  defaultLedOptions, sanitizeLedOptions, ledOptionFields, ledDetails, parseSize, placeWidthIn,
} from "./led/options.js";
import { kindAspect } from "../kinds.js";

const ELECTRICAL_NOTICE = "Electrical coordination is required for power, data and any battery backup. Arc confirms feeds and mounting during the site survey.";

export default defineCategory({
  id: "led",
  label: "LED Displays",
  noun: "LED display",
  title: "Choose an LED display",
  intro: "Programmable message centers, video boards and LED neon for storefronts. Switch to night view to see the glow.",
  groups: [
    { id: "displays", label: "Cabinets and video" },
    { id: "accent", label: "Window and neon" },
  ],
  defaultType: "led-message-center",
  types: [
    {
      id: "led-message-center",
      group: "displays",
      name: "LED message center",
      lighting: "internal",
      summary: "A programmable full-color cabinet for scrolling messages, logos and promotions.",
      notice: ELECTRICAL_NOTICE,
      parts: ["Aluminum cabinet", "LED tile modules", "Power and data supply", "Wall or monument mount", "Internally lit face"],
      render: { kind: "cabinet", depth: 6, gap: 0, frame: 1.25, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame", "light"],
      aspect: 0.5,
    },
    {
      id: "led-video-board",
      group: "displays",
      name: "LED video board",
      lighting: "internal",
      summary: "A high-brightness video wall cabinet for outdoor or storefront viewing distances.",
      notice: ELECTRICAL_NOTICE,
      parts: ["Ventilated aluminum cabinet", "Outdoor-rated LED tiles", "Mounting frame to structure", "Power distribution", "Internally lit face"],
      render: { kind: "cabinet", depth: 8, gap: 0, frame: 1.5, frameColor: "#1b1c1f", face: "panel" },
      options: ["panel", "frame", "light"],
      aspect: 0.58,
    },
    {
      id: "led-window",
      group: "accent",
      name: "LED window display",
      lighting: "internal",
      summary: "A see-through LED mesh or panel hung behind storefront glass for menus and motion graphics.",
      notice: ELECTRICAL_NOTICE,
      pinHint: "Pin the four corners on the glass opening behind the display.",
      parts: ["Transparent LED mesh or panel", "Hung behind glass", "High-brightness modules", "Low-profile power feed", "Internally lit face"],
      render: { kind: "cabinet", depth: 3, gap: 1, frame: 0.5, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame", "light"],
      aspect: 1.2,
    },
    {
      id: "led-open-neon",
      group: "accent",
      name: "Open sign / LED neon flex",
      lighting: "neon",
      summary: "LED neon flex bent to open hours, logos or script lines on a clear backer.",
      notice: ELECTRICAL_NOTICE,
      parts: ["LED neon flex", "Clear acrylic backer", "Low-voltage power supply", "Standoffs optional", "Exposed neon glow"],
      render: { kind: "neon", thick: 0.375, gap: 0.75, tube: 0.5 },
      options: ["light"],
      aspect: 0.35,
    },
    {
      id: "led-ticker",
      group: "displays",
      name: "LED ticker strip",
      lighting: "internal",
      summary: "A narrow scrolling message strip over a door or window.",
      notice: ELECTRICAL_NOTICE,
      parts: ["Aluminum extrusion", "Single-line LED modules", "Power supply in line", "Surface mount", "Internally lit face"],
      render: { kind: "cabinet", depth: 4, gap: 0, frame: 0.75, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame", "light"],
      aspect: 0.14,
    },
  ],
  diagram: ledDiagram,
  defaultOptions: defaultLedOptions,
  sanitizeOptions: sanitizeLedOptions,
  optionFields: ledOptionFields,
  details: (type, opts) => ledDetails(type, opts),
  lightingOf: (type, opts) => type.lighting,
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeLedOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    return type.aspect || kindAspect(type, art, opts);
  },
  spillReach: 1.4,
  ui: {
    tabLabel: "LED",
    placeWidthIn,
    textLabel: "Display text",
    placeTip: "Drag the four corner handles onto the wall or window area. Switch to <strong>Night</strong> to see the LED glow and spill on the facade.",
    flatLabel: "The LED display artwork, flat",
  },
  pricing: {
    row: {
      "led-message-center": "cabinet-lightbox",
      "led-video-board": "cabinet-lightbox",
      "led-window": "cabinet-lightbox",
      "led-open-neon": "neon-backer",
      "led-ticker": "cabinet-lightbox",
    },
  },
});

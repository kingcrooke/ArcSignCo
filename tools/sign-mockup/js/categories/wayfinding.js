// Interior Wayfinding: lobby, directory and room identification.
import { defineCategory } from "./define.js";
import { wayfindingDiagram } from "./wayfinding/diagrams.js";
import {
  defaultWayfindingOptions, sanitizeWayfindingOptions, wayfindingOptionFields, wayfindingDetails, parseSize, placeWidthIn,
} from "./wayfinding/options.js";
import { kindAspect } from "../kinds.js";

export default defineCategory({
  id: "wayfinding",
  label: "Interior Wayfinding",
  noun: "wayfinding sign",
  titleNoun: "Interior wayfinding sign",
  title: "Choose a wayfinding sign",
  intro: "Lobby, directory and room signs for corridors and elevators. The drawings are sections, not to scale.",
  groups: [
    { id: "lobby", label: "Lobby" },
    { id: "direction", label: "Direction" },
    { id: "ids", label: "Room and floor IDs" },
  ],
  defaultType: "wf-lobby",
  types: [
    {
      id: "wf-lobby",
      group: "lobby",
      name: "Lobby sign",
      lighting: "none",
      summary: "A primary identification panel at the entrance with the building or tenant name and logo.",
      parts: ["Brushed aluminum or painted ACM", "Standoffs about ½\"–1\" off the wall", "Logo and lettering", "Matte or satin clear coat", "No lighting"],
      render: { kind: "panel", gap: 0.75, thick: 0.125, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.33,
    },
    {
      id: "wf-directory",
      group: "lobby",
      name: "Building directory",
      lighting: "none",
      summary: "A wall-mounted directory with changeable tenant strips or inserts.",
      parts: ["Aluminum frame", "Clear acrylic or metal face", "Printed tenant inserts", "Keyed or screw-off frame", "Optional internal LEDs"],
      render: { kind: "cabinet", depth: 3, gap: 0, frame: 1, frameColor: "#24262b", face: "panel" },
      options: ["panel", "frame"],
      aspect: 0.75,
    },
    {
      id: "wf-directional",
      group: "direction",
      name: "Directional sign",
      lighting: "none",
      summary: "Wall signs with arrows pointing to suites, restrooms and exits.",
      parts: ["Printed aluminum or ACM", "Arrow graphics", "Flush or standoff mount", "Matte laminate", "No lighting"],
      render: { kind: "panel", gap: 0.25, thick: 0.125, face: "panel" },
      options: ["panel"],
      aspect: 0.35,
    },
    {
      id: "wf-floor-id",
      group: "ids",
      name: "Floor identification",
      lighting: "none",
      summary: "Large level numerals at elevator lobbies and stair landings.",
      parts: ["Painted metal or acrylic", "Stud or adhesive mount", "High-contrast numerals", "No standoffs typical", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.25, face: "panel" },
      options: ["panel"],
      aspect: 1,
    },
    {
      id: "wf-elevator",
      group: "ids",
      name: "Elevator lobby sign",
      lighting: "none",
      summary: "A plaque beside the elevator bank listing suites and floor ranges.",
      parts: ["Brushed aluminum plaque", "Engraved or printed copy", "Adhesive or stud mount", "Satin finish", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.125, face: "panel" },
      options: ["panel"],
      aspect: 1.4,
    },
    {
      id: "wf-room-id",
      group: "ids",
      name: "Room ID plaque",
      lighting: "none",
      summary: "A door-side plaque with room name, number and optional insert window.",
      parts: ["Aluminum or acrylic plaque", "Standoff beside the door", "Printed or engraved copy", "Optional window insert", "No lighting"],
      render: { kind: "panel", gap: 0.5, thick: 0.125, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.4,
    },
  ],
  diagram: wayfindingDiagram,
  defaultOptions: defaultWayfindingOptions,
  sanitizeOptions: sanitizeWayfindingOptions,
  optionFields: wayfindingOptionFields,
  details: (type, opts) => wayfindingDetails(type, opts),
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeWayfindingOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    return type.aspect || kindAspect(type, art, opts);
  },
  ui: {
    tabLabel: "Wayfinding",
    plaque: true,
    placeWidthIn,
    textLabel: "Sign text",
    placeTip: "Drag the four corner handles onto the wall in the corridor or lobby. Drag inside to move the sign. Switch to <strong>Night</strong> for ambient light on the face.",
    flatLabel: "The wayfinding sign artwork, flat",
  },
  pricing: {
    row: {
      "wf-lobby": "panel-flat",
      "wf-directory": "cabinet-lightbox",
      "wf-directional": "panel-flat",
      "wf-floor-id": "panel-flat",
      "wf-elevator": "panel-flat",
      "wf-room-id": "panel-flat",
    },
  },
});

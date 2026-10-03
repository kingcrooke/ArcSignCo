import { card, PALETTE as C } from "../../diagram-kit.js";

const DRAW = {
  "wf-lobby"(s) {
    s.wall();
    s.rect(50, 42, 4, 116, "#f4f6f8", C.ink, 1);
    s.rect(54, 42, 2, 116, C.paint);
    for (const y of [58, 142]) s.rect(44, y - 2, 10, 4, C.metalLight).circle(56, y, 2.6, C.metal);
    s.label("Lobby ID panel", 56, 100, 34)
      .label("Painted or brushed", 52, 70, 58)
      .label("Standoffs about ½\"–1\"", 56, 120, 82)
      .label("Logo and tenant name", 70, 90, 108)
      .label("No lighting", 56, 150, 140);
    return "Section";
  },
  "wf-directory"(s) {
    s.wall();
    s.rect(48, 36, 6, 128, C.metal, C.ink, 0.8);
    s.rect(54, 40, 2, 120, "#f8fafc", C.ink, 0.6);
    s.rect(56, 48, 1.5, 104, C.clear, C.clearEdge, 0.5);
    s.label("Directory cabinet", 58, 100, 34)
      .label("Changeable inserts", 70, 70, 58)
      .label("Aluminum frame", 51, 90, 82)
      .label("Wall-mounted", 48, 130, 108)
      .label("Optional internal light", 58, 110, 132);
    return "Section";
  },
  "wf-directional"(s) {
    s.wall();
    s.rect(48, 55, 3, 70, "#f4f6f8", C.ink, 1);
    s.path("M70 90 h30 l-8-8 v16 l8-8", "none", C.ink, 2);
    s.label("Directional wall sign", 72, 90, 34)
      .label("Printed metal or ACM", 52, 75, 58)
      .label("Arrows to rooms, exits", 72, 95, 82)
      .label("Flush or standoff mount", 50, 120, 108)
      .label("No lighting", 52, 140, 132);
    return "Section";
  },
  "wf-floor-id"(s) {
    s.wall();
    s.rect(46, 48, 4, 104, C.metalLight, C.ink, 0.8);
    s.rect(50, 52, 2, 96, "#0b1d33");
    s.add(`<text x="52" y="108" font-size="28" fill="#ffffff" font-family="sans-serif">3</text>`);
    s.label("Floor level numeral", 52, 100, 34)
      .label("Painted metal or acrylic", 52, 80, 58)
      .label("At elevator or stair", 48, 120, 82)
      .label("Studs or adhesive", 50, 140, 108)
      .label("No lighting", 52, 150, 140);
    return "Section";
  },
  "wf-elevator"(s) {
    s.wall();
    s.rect(48, 50, 3, 90, "#f4f6f8", C.ink, 1);
    s.rect(51, 54, 1.5, 82, C.paint);
    s.path("M58 70 h24 M58 82 h18 M58 94 h12", "none", C.muted, 0.9);
    s.label("Elevator lobby sign", 54, 90, 34)
      .label("Suite and floor range", 62, 75, 58)
      .label("Brushed aluminum", 52, 110, 82)
      .label("Beside elevator bank", 48, 130, 108)
      .label("No lighting", 52, 140, 132);
    return "Section";
  },
  "wf-room-id"(s) {
    s.wall();
    s.rect(50, 58, 3, 72, "#f4f6f8", C.ink, 1);
    s.rect(53, 60, 1.5, 68, C.paint);
    s.rect(44, 72, 8, 3, C.metalLight).circle(56, 73.5, 2.2, C.metal);
    s.label("Room ID plaque", 55, 90, 34)
      .label("Name and number", 62, 75, 58)
      .label("Standoff beside door", 56, 73, 82)
      .label("Optional window insert", 55, 105, 108)
      .label("No lighting", 52, 125, 132);
    return "Section";
  },
};

export const wayfindingDiagram = type => card(type, DRAW[type.id]);

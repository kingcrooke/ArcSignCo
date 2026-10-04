import { card, PALETTE as C } from "../../diagram-kit.js";

const DRAW = {
  "led-message-center"(s) {
    s.wall();
    s.rect(48, 52, 6, 88, C.metal, C.ink, 0.8);
    s.rect(54, 56, 2, 80, "#101820");
    s.led(56, 70); s.led(56, 100); s.led(56, 130);
    s.rays(62, 95, 1, 60, 0.4);
    s.label("LED message cabinet", 56, 95, 34)
      .label("Full-color LED modules", 70, 75, 58)
      .label("Aluminum cabinet", 51, 90, 82)
      .label("Power and data feed", 56, 120, 108)
      .label("Electrical coordination", 56, 140, 140);
    return "Section";
  },
  "led-video-board"(s) {
    s.wall();
    s.rect(46, 44, 8, 104, C.metal, C.ink, 0.8);
    s.rect(54, 48, 3, 96, "#0a0f14");
    for (let y = 52; y < 140; y += 8) s.line(54, y, 57, y, C.muted, 0.3);
    s.led(58, 80); s.led(58, 110);
    s.rays(64, 95, 1, 70, 0.45);
    s.label("Video board cabinet", 58, 95, 34)
      .label("Bright LED tiles", 70, 70, 58)
      .label("Ventilated depth", 50, 100, 82)
      .label("Frame to structure", 48, 130, 108)
      .label("Electrical coordination", 58, 145, 140);
    return "Section";
  },
  "led-window"(s) {
    s.wall();
    s.rect(44, 36, 3, 128, C.glass, C.clearEdge, 0.8);
    s.rect(48, 44, 2, 112, "#101820", C.ink, 0.5);
    s.led(50, 80); s.led(50, 110);
    s.rays(54, 95, 1, 40, 0.35);
    s.label("Window LED display", 50, 95, 34)
      .label("See-through LED mesh", 62, 70, 58)
      .label("Hung behind glass", 48, 60, 82)
      .label("Brightness for daylight", 62, 110, 108)
      .label("Electrical coordination", 50, 130, 140);
    return "Section";
  },
  "led-open-neon"(s) {
    s.wall();
    s.rect(48, 58, 3, 64, C.clear, C.clearEdge, 0.6);
    s.path("M52 78 q20-18 40 0 t20 0", "none", "#ff4a8a", 2.2);
    s.rays(72, 78, 1, 50, 0.5);
    s.label("LED neon flex", 72, 78, 34)
      .label("Line on clear backer", 72, 65, 58)
      .label("Low-voltage supply", 62, 100, 82)
      .label("Standoffs optional", 50, 90, 108)
      .label("Glows at night", 72, 110, 132);
    return "Section";
  },
  "led-ticker"(s) {
    s.wall();
    s.rect(48, 62, 5, 28, C.metal, C.ink, 0.8);
    s.rect(53, 66, 2, 20, "#101820");
    s.led(55, 76);
    s.rays(59, 76, 1, 35, 0.35);
    s.label("LED ticker strip", 55, 76, 34)
      .label("Scrolling message line", 70, 70, 58)
      .label("Over door or window", 48, 62, 82)
      .label("Aluminum extrusion", 51, 85, 108)
      .label("Electrical coordination", 55, 95, 132);
    return "Section";
  },
};

export const ledDiagram = type => card(type, DRAW[type.id]);

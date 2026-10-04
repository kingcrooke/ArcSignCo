import { card, PALETTE as C } from "../../diagram-kit.js";

const DRAW = {
  "ada-room"(s) {
    s.wall();
    s.rect(50, 52, 3, 76, "#f4f6f8", C.ink, 1);
    s.rect(53, 55, 1.5, 20, C.metalLight);
    s.rect(53, 78, 1.5, 14, C.metalLight);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) s.circle(58 + i * 4, 100 + j * 5, 0.9, C.ink);
    s.label("Raised tactile copy", 55, 70, 34)
      .label("Grade 2 Braille below", 62, 102, 58)
      .label("Acrylic or photopolymer", 55, 85, 82)
      .label("Standoff beside door", 56, 73, 108)
      .label("Layout preview only", 55, 120, 140);
    return "Section";
  },
  "ada-restroom"(s) {
    s.wall();
    s.rect(50, 54, 3, 72, "#f4f6f8", C.ink, 1);
    s.circle(54, 68, 5, "none", C.ink, 1.2);
    s.path("M54 74 v12 M49 80 h10", "none", C.ink, 1.2);
    for (let i = 0; i < 5; i++) s.circle(58 + i * 3.5, 108, 0.8, C.ink);
    s.label("Pictogram, tactile text", 56, 80, 34)
      .label("Matching Braille band", 62, 108, 58)
      .label("Same as room IDs", 55, 95, 82)
      .label("Mount beside door", 56, 73, 108)
      .label("Spacing set in drawings", 55, 120, 140);
    return "Section";
  },
  "ada-stair"(s) {
    s.wall();
    s.rect(48, 50, 3, 80, "#f4f6f8", C.ink, 1);
    s.path("M52 62 h28 M52 74 h22 M52 86 h16", "none", C.ink, 1);
    for (let i = 0; i < 4; i++) s.circle(56 + i * 4, 104, 0.8, C.ink);
    s.label("Stair identification", 54, 80, 34)
      .label("Stair letter and floor", 62, 68, 58)
      .label("Tactile and Braille", 62, 104, 82)
      .label("At stair landing", 48, 120, 108)
      .label("Layout preview only", 54, 130, 140);
    return "Section";
  },
  "ada-exit-tactile"(s) {
    s.wall();
    s.rect(50, 52, 3, 76, "#f4f6f8", C.ink, 1);
    s.rect(53, 58, 1.5, 18, C.metalLight);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) s.circle(58 + i * 4, 100 + j * 5, 0.9, C.ink);
    s.label("Tactile EXIT", 55, 70, 34)
      .label("Grade 2 Braille", 62, 102, 58)
      .label("Not illuminated", 55, 85, 82)
      .label("BC 1013.4", 56, 73, 108)
      .label("Layout preview only", 55, 120, 140);
    return "Section";
  },
  "ada-exit"(s) {
    s.wall();
    s.rect(48, 48, 5, 84, C.metal, C.ink, 0.8);
    s.rect(53, 52, 2, 76, "#cc2a2a");
    s.led(56, 70); s.led(56, 100);
    s.rays(60, 85, 1, 50, 0.35);
    s.label("Illuminated exit face", 55, 85, 34)
      .label("UL 924 listed cabinet", 50, 90, 58)
      .label("Red letters, always on", 56, 100, 82)
      .label("90-min backup power", 56, 70, 108)
      .label("Licensed electrician", 55, 120, 140);
    return "Section";
  },
};

export const adaDiagram = type => card(type, DRAW[type.id]);

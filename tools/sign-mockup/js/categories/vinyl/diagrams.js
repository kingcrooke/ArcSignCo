import { card, PALETTE as C } from "../../diagram-kit.js";

const DRAW = {
  "vinyl-window-lettering"(s) {
    s.wall();
    s.rect(44, 28, 3, 144, C.glass, C.clearEdge, 0.8);
    s.rect(47, 50, 2, 100, "#e8f4fc", C.clearEdge, 0.6);
    s.path("M58 70 h70 M58 90 h55 M58 110 h62", "none", C.ink, 2.2);
    s.label("Cut vinyl on glass", 70, 90, 34)
      .label("Outside or inside face", 48, 60, 58)
      .label("No depth", 49, 120, 82)
      .label("Matte or gloss film", 65, 100, 108)
      .label("Applied to shop glass", 48, 150, 140);
    return "Section";
  },
  "vinyl-window-perf"(s) {
    s.wall();
    s.rect(44, 28, 3, 144, C.glass, C.clearEdge, 0.8);
    s.rect(47, 40, 2, 120, "#1a3a52", C.ink, 0.5);
    for (let y = 44; y < 156; y += 5) for (let x = 50; x < 120; x += 5) s.circle(x, y, 0.8, C.ink);
    s.label("Perforated print film", 90, 90, 34)
      .label("Clear view from inside", 70, 70, 58)
      .label("Laminated face", 75, 110, 82)
      .label("About 50% open area", 90, 130, 108)
      .label("On glass or acrylic", 48, 150, 140);
    return "Section";
  },
  "vinyl-frosted"(s) {
    s.wall();
    s.rect(44, 28, 3, 144, C.glass, C.clearEdge, 0.8);
    s.rect(47, 40, 2, 120, "#dfe8ef", C.clearEdge, 0.6, ` opacity="0.85"`);
    s.path("M60 95 h50 M60 115 h36", "none", C.muted, 1.4, ` opacity="0.7"`);
    s.label("Etched-look frosted film", 85, 100, 34)
      .label("Band or full pane", 70, 60, 58)
      .label("Cut logo stays clear", 62, 80, 82)
      .label("No adhesive pattern", 75, 120, 108)
      .label("Applied to interior glass", 48, 150, 140);
    return "Section";
  },
  "vinyl-wall-mural"(s) {
    s.wall();
    s.rect(44, 36, 6, 128, C.wall, C.hatch, 0.4);
    s.rect(50, 40, 4, 120, "#f4f6f8", C.ink, 0.6);
    s.rect(54, 44, 2, 112, C.paint);
    s.label("Printed wall wrap", 56, 90, 34)
      .label("Matte or gloss laminate", 56, 110, 58)
      .label("Over brick or drywall", 47, 130, 82)
      .label("No standoffs", 50, 150, 108)
      .label("Installed flat to the wall", 56, 70, 132);
    return "Section";
  },
  "vinyl-glass-decal"(s) {
    s.wall();
    s.rect(44, 32, 3, 136, C.glass, C.clearEdge, 0.8);
    s.circle(70, 90, 22, "#e8f4fc", C.ink, 1.2);
    s.path("M70 78 v24 M58 90 h24", "none", C.ink, 2);
    s.label("Printed or cut decal", 70, 90, 34)
      .label("Clear or white vinyl", 68, 70, 58)
      .label("Removable or long-term", 70, 110, 82)
      .label("On doors or sidelites", 48, 130, 108)
      .label("No depth", 49, 150, 140);
    return "Section";
  },
  "vinyl-door-hours"(s) {
    s.wall();
    s.rect(44, 30, 4, 140, C.metalLight, C.ink, 0.8);
    s.rect(48, 34, 2, 132, C.glass, C.clearEdge, 0.6);
    s.rect(50, 70, 2, 48, "#f8fafc", C.ink, 0.5);
    s.path("M54 82 h30 M54 94 h26 M54 106 h20", "none", C.ink, 1.2);
    s.label("Hours and door decal", 66, 94, 34)
      .label("Cut or printed vinyl", 66, 80, 58)
      .label("On glass or a door", 50, 120, 82)
      .label("Matte reduces glare", 66, 100, 108)
      .label("Typical 8\"–12\" wide", 66, 110, 132);
    return "Section";
  },
};

export const vinylDiagram = type => card(type, DRAW[type.id]);

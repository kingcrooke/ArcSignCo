import { card, PALETTE as C } from "../../diagram-kit.js";

const DRAW = {
  "constr-site-board"(s) {
    s.wall();
    s.rect(44, 30, 5, 140, "#f4f6f8", C.ink, 1);
    s.rect(49, 30, 2, 140, C.paint);
    s.circle(46.5, 50, 2, C.metal).circle(46.5, 150, 2, C.metal);
    s.label("Aluminum composite board, about ¼\" thick", 47, 90, 40)
      .label("Printed face, laminated", 50, 120, 90)
      .label("Screwed through to fence or hoarding", 46.5, 150, 140);
    return "Section";
  },
  "constr-project-panel"(s) {
    s.wall();
    s.rect(50, 40, 4, 120, "#f4f6f8", C.ink, 1);
    s.rect(54, 40, 2, 120, C.paint);
    for (const y of [56, 144]) s.rect(44, y - 2, 10, 4, C.metalLight).circle(56, y, 2.6, C.metal);
    s.label("Standoff caps", 56, 56, 34)
      .label("Printed panel, about 1\" off the wall", 52, 100, 92)
      .label("Standoff barrels into anchors", 47, 144, 150);
    return "Section";
  },
  "constr-shed-parapet"(s) {
    s.wall();
    s.rect(44, 70, 8, 50, C.metal, C.ink, 0.8);
    s.rect(52, 68, 3, 54, "#f4f6f8", C.ink, 0.8);
    s.rect(55, 68, 1.5, 54, C.paint);
    s.label("Parapet panel on shed", 56, 90, 34)
      .label("Sized to the shed run", 70, 75, 58)
      .label("Printed ACM or banner", 56, 95, 82)
      .label("Bolted to shed framing", 48, 70, 108)
      .label("Weather-resistant laminate", 56, 110, 132);
    return "Section";
  },
  "constr-fence-wrap"(s) {
    s.wall();
    s.rect(44, 32, 6, 136, C.metalLight, C.ink, 0.6);
    for (let y = 36; y < 164; y += 6) s.line(44, y, 50, y, C.muted, 0.4);
    s.rect(50, 36, 2, 128, C.fabric);
    s.label("Mesh or banner on fence", 52, 90, 34)
      .label("Grommets or zip ties", 48, 50, 58)
      .label("Wind slits as needed", 52, 110, 82)
      .label("Printed scrim or mesh", 52, 130, 108)
      .label("Temporary install typical", 48, 150, 140);
    return "Section";
  },
  "constr-safety-sign"(s) {
    s.wall();
    s.rect(48, 50, 3, 90, "#fff8e6", C.ink, 1);
    s.rect(51, 52, 1.5, 86, C.paint);
    s.circle(52.5, 60, 4, C.ink);
    s.path("M52.5 64 v10 M52.5 78 v6", "none", "#fff8e6", 1.5);
    s.label("Rigid safety sign", 54, 90, 34)
      .label("Aluminum or ACM", 52, 70, 58)
      .label("Screws or straps to fence", 48, 130, 82)
      .label("OSHA-style layouts typical", 54, 100, 108)
      .label("No lighting", 52, 140, 132);
    return "Section";
  },
  "constr-permit-board"(s) {
    s.wall();
    s.rect(50, 38, 4, 124, "#f4f6f8", C.ink, 1);
    s.rect(54, 38, 2, 124, C.paint);
    for (const y of [54, 146]) s.rect(44, y - 2, 10, 4, C.metalLight).circle(56, y, 2.6, C.metal);
    s.path("M58 60 h40 M58 72 h36 M58 84 h30", "none", C.muted, 0.8);
    s.label("Permit posting board", 56, 100, 34)
      .label("Owner, architect, contractor lines", 70, 70, 58)
      .label("Standoffs about 1\" off wall", 52, 120, 82)
      .label("Wording confirmed with permit holder", 70, 90, 108)
      .label("Laminated printed face", 56, 140, 140);
    return "Section";
  },
};

export const constructionDiagram = type => card(type, DRAW[type.id]);

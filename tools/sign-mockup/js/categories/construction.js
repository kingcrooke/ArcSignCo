// Construction Signs: printed boards and panels for job sites.
import { defineCategory } from "./define.js";
import { constructionDiagram } from "./construction/diagrams.js";
import {
  defaultConstructionOptions, sanitizeConstructionOptions, constructionOptionFields, constructionDetails, constructionWarnings, parseSize, placeWidthIn,
} from "./construction/options.js";
import { kindAspect } from "../kinds.js";

const FENCE_WRAP_NOTICE = "Allowed only if the code or another law says so. NYC BC §3301.9.7 generally prohibits other signs on fences and sidewalk sheds.";

export default defineCategory({
  id: "construction",
  label: "Construction Signs",
  noun: "construction sign",
  titleNoun: "Construction sign",
  title: "Choose a construction sign",
  intro: "Printed boards, parapet panels and safety notices for job sites. The drawings are sections, not to scale.",
  groups: [
    { id: "boards", label: "Site boards" },
    { id: "site", label: "Fence and shed" },
    { id: "safety", label: "Safety and permits" },
  ],
  defaultType: "constr-project-panel",
  types: [
    {
      id: "constr-site-board",
      group: "boards",
      name: "Site board",
      lighting: "none",
      summary: "A large printed board on a fence or hoarding. Not the DOB-required project information panel.",
      notice: FENCE_WRAP_NOTICE,
      parts: ["Aluminum composite board", "Printed, laminated face", "Screws through to the fence or wall", "About ¼\" thick", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.25, face: "panel" },
      options: ["panel"],
      aspect: 0.5,
    },
    {
      id: "constr-project-panel",
      group: "boards",
      name: "Fence project information panel",
      lighting: "none",
      summary: "The 6×4 ft DOB fence panel: white uppercase copy on Pantone 296 blue, bottom edge 4 ft above the ground.",
      parts: ["Aluminum or ACM panel", "White letters ≥1 in on Pantone 296 blue", "Flush to the construction fence", "NFPA 701 or UL 214 material", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.25, face: "panel" },
      options: ["panel"],
      aspect: 0.667,
    },
    {
      id: "constr-shed-parapet",
      group: "site",
      name: "Sidewalk shed parapet panel",
      lighting: "none",
      summary: "Required 3×6 ft parapet panel: street address, contractor or owner, and the nyc.gov/buildings line.",
      parts: ["ACM or aluminum panel", "White copy on Pantone 296 blue", "Bolted to shed framing", "No rendering or advertising", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.125, face: "panel" },
      options: ["panel"],
      aspect: 2,
    },
    {
      id: "constr-fence-wrap",
      group: "site",
      name: "Fence wrap / mesh banner",
      lighting: "none",
      summary: "Printed mesh on chain-link fence. Generally not allowed on NYC construction fences unless another section applies.",
      notice: FENCE_WRAP_NOTICE,
      parts: ["Printed mesh or banner scrim", "Grommets or zip ties", "Wind slits as needed", "Temporary install typical", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.05, face: "panel" },
      options: ["panel"],
      aspect: 0.2,
    },
    {
      id: "constr-safety-sign",
      group: "safety",
      name: "Safety / notice sign",
      lighting: "none",
      summary: "Hard hat, PPE, no trespassing and emergency contact signs for the site perimeter.",
      parts: ["Aluminum or ACM panel", "Printed safety layout", "Screws or straps to fence", "Matte laminate", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.125, face: "panel" },
      options: ["panel"],
      aspect: 1.33,
    },
    {
      id: "constr-permit-board",
      group: "safety",
      name: "Architect / owner project board (not the DOB fence panel)",
      lighting: "none",
      summary: "Optional standoff board for owner, architect or GC details. Not the §3301.9.1 fence panel.",
      parts: ["Aluminum composite panel", "Printed project layout", "Four standoffs into wall anchors", "About 1\" off the wall", "No lighting"],
      render: { kind: "panel", gap: 1, thick: 0.25, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.67,
    },
  ],
  diagram: constructionDiagram,
  defaultOptions: defaultConstructionOptions,
  sanitizeOptions: sanitizeConstructionOptions,
  optionFields: constructionOptionFields,
  details: (type, opts) => constructionDetails(type, opts),
  warnings: (type) => constructionWarnings(type),
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeConstructionOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    return type.aspect || kindAspect(type, art, opts);
  },
  ui: {
    tabLabel: "Construction",
    placeWidthIn,
    textLabel: "Board text",
    placeTip: "Drag the four corner handles onto the fence, hoarding or wall. Drag inside to move the board. Switch to <strong>Night</strong> to see ambient light on the face.",
    flatLabel: "The construction sign artwork, flat",
  },
  pricing: {
    row: {
      "constr-site-board": "panel-flat",
      "constr-project-panel": "panel-flat",
      "constr-shed-parapet": "panel-flat",
      "constr-fence-wrap": "panel-flat",
      "constr-safety-sign": "panel-flat",
      "constr-permit-board": "panel-flat",
    },
  },
});

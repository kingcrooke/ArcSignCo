// Construction Signs: printed boards and panels for job sites.
import { defineCategory } from "./define.js";
import { constructionDiagram } from "./construction/diagrams.js";
import {
  defaultConstructionOptions, sanitizeConstructionOptions, constructionOptionFields, constructionDetails, parseSize,
} from "./construction/options.js";
import { kindAspect } from "../kinds.js";

export default defineCategory({
  id: "construction",
  label: "Construction Signs",
  noun: "construction sign",
  title: "Choose a construction sign",
  intro: "Printed boards, parapet panels and safety notices for job sites. The drawings are sections, not to scale.",
  groups: [
    { id: "boards", label: "Site boards" },
    { id: "site", label: "Fence and shed" },
    { id: "safety", label: "Safety and permits" },
  ],
  defaultType: "constr-site-board",
  types: [
    {
      id: "constr-site-board",
      group: "boards",
      name: "Site board",
      lighting: "none",
      summary: "A large printed board screwed flat to the fence, hoarding or wall: project name, rendering and team.",
      parts: ["Aluminum composite board", "Printed, laminated face", "Screws through to the fence or wall", "About ¼\" thick", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.25, face: "panel" },
      options: ["panel"],
      aspect: 0.5,
    },
    {
      id: "constr-project-panel",
      group: "boards",
      name: "Project information panel",
      lighting: "none",
      summary: "A printed panel on standoffs with the owner, architect, contractor and permit details.",
      parts: ["Aluminum composite panel", "Printed, laminated face", "Four standoffs into wall anchors", "About 1\" off the wall", "No lighting"],
      render: { kind: "panel", gap: 1, thick: 0.25, standoffs: true, face: "panel" },
      options: ["panel"],
      aspect: 0.75,
    },
    {
      id: "constr-shed-parapet",
      group: "site",
      name: "Sidewalk shed parapet panel",
      lighting: "none",
      summary: "A long printed panel on the parapet of a sidewalk shed, sized to the shed run.",
      parts: ["ACM or aluminum panel", "Printed project name and rendering", "Bolted to shed framing", "Weather-resistant laminate", "No lighting"],
      render: { kind: "panel", gap: 0, thick: 0.125, face: "panel" },
      options: ["panel"],
      aspect: 0.15,
    },
    {
      id: "constr-fence-wrap",
      group: "site",
      name: "Fence wrap / mesh banner",
      lighting: "none",
      summary: "A printed mesh or scrim banner on chain-link fence or plywood hoarding, with grommets or ties.",
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
      name: "Permit posting board",
      lighting: "none",
      summary: "The owner, architect and contractor board required at the site. Wording is confirmed with the permit holder after review.",
      notice: "Required wording is confirmed with the permit holder after a site review. This mockup does not set permit text.",
      parts: ["Aluminum composite panel", "Printed permit layout", "Standoffs into the wall", "Laminated face", "No lighting"],
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
  aspect(type, art, opts) {
    const preset = parseSize(sanitizeConstructionOptions(type, opts).size);
    if (preset) return preset.height / preset.width;
    return type.aspect || kindAspect(type, art, opts);
  },
  ui: {
    tabLabel: "Construction",
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

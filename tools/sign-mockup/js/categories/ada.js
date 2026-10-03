// ADA & Code Signs: coming soon. To make it live, follow docs/ADDING-A-CATEGORY.md. Wording about
// codes stays factual: Arc prepares the layout for review; the tool makes no compliance claims.
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "ada",
  label: "ADA & Code Signs",
  noun: "sign",
  intro: "Tactile, Braille, and life-safety signs. Arc prepares the layout for architect and inspector review. This tool does not determine ADA or code compliance.",
  icon: '<rect x="10" y="8" width="28" height="32" rx="3"/><circle cx="19" cy="31" r="1.4"/><circle cx="24" cy="31" r="1.4"/><circle cx="29" cy="31" r="1.4"/><path d="M17 16h14M17 21h10"/>',
  examples: [
    { name: "Tactile room signs", note: "Raised letters with Grade 2 Braille, mounted beside the door." },
    { name: "Restroom signs", note: "Pictograms, raised text and Braille on matching plaques." },
    { name: "Stair and exit IDs", note: "Stair identification, level and exit signs for each landing." },
    { name: "Evacuation maps", note: "Floor plans with you-are-here, exits and assembly points." },
    { name: "Occupancy and notice placards", note: "Capacity, fire safety and building notices." },
  ],
});

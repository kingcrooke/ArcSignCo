// Construction Signs: coming soon. To make it live, follow docs/ADDING-A-CATEGORY.md (the
// "panel" construction kind already draws flat boards on standoffs or flush).
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "construction",
  label: "Construction Signs",
  noun: "construction sign",
  intro: "Boards and panels for job sites and sidewalk sheds, mocked up on a photo of the site.",
  icon: '<path d="M8 40h32"/><path d="M12 40V14h24v26"/><path d="M12 22h24"/><path d="M18 14l-4-6M30 14l4-6"/><path d="M17 28h14M17 33h9"/>',
  examples: [
    { name: "Site boards", note: "Large printed boards for fences and hoarding: project name, rendering, team." },
    { name: "Project information panels", note: "Owner, architect, contractor and permit details; Arc confirms the required wording before ordering." },
    { name: "Shed parapet panels", note: "Printed panels for the parapet of a sidewalk shed, sized to the shed run." },
    { name: "Safety notices", note: "Hard hat, PPE, no-entry and emergency contact signs for the site." },
  ],
});

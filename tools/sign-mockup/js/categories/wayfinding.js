// Interior Wayfinding: coming soon. To make it live, follow docs/ADDING-A-CATEGORY.md.
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "wayfinding",
  label: "Interior Wayfinding",
  noun: "wayfinding sign",
  intro: "Signs that move people through a building, mocked up on a photo of the lobby, corridor or office.",
  icon: '<path d="M24 6v36"/><path d="M24 12h14l4 4-4 4H24"/><path d="M24 24H10l-4 4 4 4h14"/>',
  examples: [
    { name: "Lobby directories", note: "Tenant and floor directories with changeable inserts." },
    { name: "Directional signs", note: "Wall, hanging and projecting signs with arrows to rooms and exits." },
    { name: "Room and suite IDs", note: "Door-side plaques with names, numbers and optional window inserts." },
    { name: "Floor and level IDs", note: "Large level numbers at elevators and stair landings." },
  ],
});

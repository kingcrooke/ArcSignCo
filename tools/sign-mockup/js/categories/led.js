// LED Displays: coming soon. To make it live, follow docs/ADDING-A-CATEGORY.md (the "cabinet"
// construction kind already draws a lit box; a display adds its own face).
import { comingSoon } from "./define.js";

export default comingSoon({
  id: "led",
  label: "LED Displays",
  noun: "LED display",
  intro: "Programmable and video displays for storefronts and windows, shown on your photo day and night.",
  icon: '<rect x="6" y="12" width="36" height="22" rx="2"/><path d="M18 40h12M24 34v6"/><path d="M12 19h2M17 19h2M22 19h2M12 24h2M17 24h2M22 24h2M27 24h2M12 29h2"/>',
  examples: [
    { name: "Message centers", note: "Programmable full-color displays in a cabinet, single or double sided." },
    { name: "Storefront screens", note: "High-brightness screens for windows, menus and promotions." },
    { name: "Window LED displays", note: "Light, see-through LED panels hung behind the glass." },
    { name: "Ticker strips", note: "Narrow scrolling message strips over doors and windows." },
  ],
});

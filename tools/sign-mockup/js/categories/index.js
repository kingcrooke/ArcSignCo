// The category registry: the one place tabs are listed. Order here is the order of the tabs.
// To add a tab: write categories/<name>.js (see docs/ADDING-A-CATEGORY.md), import it below and
// add it to the list. Nothing else in the engine changes.
import signs from "./signs.js";
import awnings from "./awnings.js";
import vinyl from "./vinyl.js";
import construction from "./construction.js";
import wayfinding from "./wayfinding.js";
import ada from "./ada.js";
import led from "./led.js";

export const CATEGORIES = [signs, awnings, vinyl, construction, wayfinding, ada, led];

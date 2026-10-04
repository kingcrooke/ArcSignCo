// Default placement anchors for product-line types when the photo has no scale line yet.
// Positions are fractions of the photo (x, y = center), assuming a typical 10 ft storefront width.

const FASCIA = { x: 0.5, y: 0.28 };
const WINDOW_UPPER = { x: 0.5, y: 0.22 };
const WINDOW_CENTER = { x: 0.5, y: 0.45 };
const WINDOW_LOWER = { x: 0.5, y: 0.66 };
const FROST_BAND = { x: 0.5, y: 0.52 };
const SILL = { x: 0.5, y: 0.74 };
const FENCE_LINE = { x: 0.5, y: 0.88 };
const FENCE_MID = { x: 0.5, y: 0.72 };
const EYE = { x: 0.5, y: 0.55 };
const HIGH_WALL = { x: 0.5, y: 0.34 };
const FEATURE_WALL = { x: 0.5, y: 0.4 };
const CENTER = { x: 0.5, y: 0.45 };

/** type id → anchor key or "door" | "plaque" for scale-aware mounts */
export const PLACE_ANCHOR = {
  "vinyl-window-lettering": WINDOW_UPPER,
  "vinyl-window-perf": WINDOW_CENTER,
  "vinyl-frosted": FROST_BAND,
  "vinyl-wall-mural": CENTER,
  "vinyl-glass-decal": CENTER,
  "vinyl-door-hours": "door",
  "constr-site-board": FENCE_LINE,
  "constr-project-panel": EYE,
  "constr-shed-parapet": FASCIA,
  "constr-fence-wrap": FENCE_LINE,
  "constr-safety-sign": EYE,
  "constr-permit-board": FENCE_MID,
  "wf-lobby": FEATURE_WALL,
  "wf-directional": HIGH_WALL,
  "wf-floor": EYE,
  "wf-elevator": FEATURE_WALL,
  "wf-tenant": EYE,
  "ada-room": "plaque",
  "ada-restroom": "plaque",
  "ada-stair": "plaque",
  "ada-exit": "plaque",
  "led-message-center": FASCIA,
  "led-video-board": FASCIA,
  "led-window": SILL,
  "led-open-neon": WINDOW_LOWER,
  "led-ticker": FASCIA,
};

/** Typical storefront width (in) used to size presets before a scale line exists. */
export const STOREFRONT_WIDTH_IN = 120;

const FASCIA_TYPES = new Set(["led-message-center", "led-video-board", "led-ticker", "constr-shed-parapet"]);

export function usesFasciaBand(type) {
  return FASCIA_TYPES.has(type.id);
}

export function anchorCenter(photo, type, { home, door, plaque } = {}) {
  const key = PLACE_ANCHOR[type.id];
  if (key === "door" && door) return door;
  if (key === "plaque" && plaque) return plaque;
  const frac = typeof key === "object" ? key : CENTER;
  return { x: photo.width * frac.x, y: photo.height * frac.y };
}

// Default placement anchors for product-line types (with or without a scale line).
// Generic photos use fractions of the frame; the built-in sample storefront uses pixel regions.

const FASCIA = { x: 0.5, y: 0.28 };
const WINDOW_GLASS_LOWER = { x: 0.42, y: 0.62 };
const WINDOW_GLASS_MID = { x: 0.42, y: 0.52 };
const WINDOW_GLASS_BAND = { x: 0.42, y: 0.48 };
const FENCE_LINE = { x: 0.5, y: 0.88 };
const FENCE_MID = { x: 0.5, y: 0.72 };
const EYE = { x: 0.5, y: 0.55 };
const HIGH_WALL = { x: 0.5, y: 0.34 };
const FEATURE_WALL = { x: 0.5, y: 0.4 };
const CENTER = { x: 0.5, y: 0.45 };

/** type id → anchor key or "door" | "plaque" for scale-aware mounts */
export const PLACE_ANCHOR = {
  "vinyl-window-lettering": WINDOW_GLASS_LOWER,
  "vinyl-window-perf": WINDOW_GLASS_MID,
  "vinyl-frosted": WINDOW_GLASS_BAND,
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
  "wf-directory": FEATURE_WALL,
  "wf-directional": HIGH_WALL,
  "wf-floor-id": EYE,
  "wf-elevator": FEATURE_WALL,
  "wf-room-id": "plaque",
  "ada-room": "plaque",
  "ada-restroom": "plaque",
  "ada-stair": "plaque",
  "ada-exit": "plaque",
  "ada-exit-tactile": "plaque",
  "led-message-center": FASCIA,
  "led-video-board": FASCIA,
  "led-window": WINDOW_GLASS_LOWER,
  "led-open-neon": WINDOW_GLASS_LOWER,
  "led-ticker": FASCIA,
};

/** Typical storefront width (in) used to size presets before a scale line exists. */
export const STOREFRONT_WIDTH_IN = 120;

const FASCIA_TYPES = new Set(["led-message-center", "led-video-board", "led-ticker", "constr-shed-parapet"]);

const WINDOW_GLASS_TYPES = new Set([
  "vinyl-window-lettering",
  "vinyl-window-perf",
  "vinyl-frosted",
  "led-window",
  "led-open-neon",
]);

const GROUND_CONSTRUCTION = new Set([
  "constr-site-board",
  "constr-fence-wrap",
  "constr-permit-board",
]);

/** Fractional center within the sample storefront window glass (lower-middle default). */
const SAMPLE_WINDOW_FRAC = {
  "vinyl-window-lettering": { x: 0.5, y: 0.62 },
  "vinyl-window-perf": { x: 0.5, y: 0.52 },
  "vinyl-frosted": { x: 0.5, y: 0.42 },
  "led-window": { x: 0.5, y: 0.58 },
  "led-open-neon": { x: 0.5, y: 0.72 },
};

export function usesFasciaBand(type) {
  return FASCIA_TYPES.has(type.id);
}

export function hasPlaceAnchor(type) {
  return Object.prototype.hasOwnProperty.call(PLACE_ANCHOR, type.id);
}

export function isWindowGlassType(type) {
  return WINDOW_GLASS_TYPES.has(type.id);
}

function centerInRect(rect, frac) {
  return { x: rect.x + rect.w * frac.x, y: rect.y + rect.h * frac.y };
}

/** Max sign width/height (px) so window film stays inside the sample glass. */
export function windowGlassMaxSize(photo, type, { sample } = {}) {
  if (!isWindowGlassType(type)) return null;
  const win = sample?.window;
  if (!win) return null;
  const margin = 0.06;
  return {
    maxW: win.w * (1 - 2 * margin),
    maxH: win.h * (1 - 2 * margin),
  };
}

export function anchorCenter(photo, type, { home, door, plaque, sample } = {}) {
  const key = PLACE_ANCHOR[type.id];
  if (key === "door" && door) return door;
  if (key === "plaque" && plaque) return plaque;

  if (sample?.window && isWindowGlassType(type)) {
    const frac = SAMPLE_WINDOW_FRAC[type.id] || { x: 0.5, y: 0.62 };
    return centerInRect(sample.window, frac);
  }
  if (sample?.ground && GROUND_CONSTRUCTION.has(type.id)) {
    return centerInRect(sample.ground, { x: 0.5, y: 0.55 });
  }

  const frac = typeof key === "object" ? key : CENTER;
  return { x: photo.width * frac.x, y: photo.height * frac.y };
}

import type { PublishedSlide } from './publishedSlides'
import { publishSlideBasename } from './publishedSlides'

const SLIDE_SIZE = { width: 1080, height: 1350 }

function slide(id: string, title: string): PublishedSlide {
  return { id, title, basename: publishSlideBasename(id), ...SLIDE_SIZE }
}

/** Frankie Zone gallery — add new slide ids here as graphics ship. */
export const FRANKIE_ZONE_SLIDE_IDS: { id: string; title: string }[] = [
  { id: 'results-w4-m2', title: 'Frankie 144.8 – Kayser 128.4' },
  { id: 'results-w1-m5', title: 'Steven 199.4 – Frankie 135.4' },
  { id: 'results-w2-m6', title: 'Eric 142.7 – Frankie 105.2' },
  { id: 'results-w3-m6', title: 'Jamil 113.6 – Frankie 95.8' },
]

export function getFrankieZoneSlides(): PublishedSlide[] {
  return FRANKIE_ZONE_SLIDE_IDS.map((s) => slide(s.id, s.title))
}

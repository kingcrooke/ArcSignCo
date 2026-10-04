export type PublishedSlide = {
  id: string
  title: string
  basename: string
  width: number
  height: number
}

/** Slides withheld from the gallery (see PR). */
export const HELD_BACK_SLIDES: { id: string; reason: string }[] = [
  {
    id: 'w4-slide-16',
    reason:
      'Closing paragraph re-typeset and footer band still differ from untouched W4 slides at 100% zoom (body weight + bottom art).',
  },
  {
    id: 'results-w2-m1',
    reason:
      'FINAL headline HADY→HADI glyph repair still visible at 100% (needs full line re-typeset).',
  },
  {
    id: 'results-w3-m2',
    reason:
      'FINAL headline HADY→HADI glyph repair still visible at 100% (needs full line re-typeset).',
  },
]

const base = import.meta.env.BASE_URL

export function slideAssetUrl(
  basename: string,
  variant: 'full' | 'thumb',
  ext: 'webp' | 'jpg',
) {
  return `${base}slides/${basename}.${variant}.${ext}`
}

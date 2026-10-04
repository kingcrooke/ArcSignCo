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
    id: 'vs-m3-hadi-manny',
    reason:
      'Hady→Hadi repair visible at 100% (glyph swap); held until full-line re-typeset passes QA.',
  },
  {
    id: 'w4-slide-06',
    reason:
      'Hady→Hadi repair visible at 100% (glyph swap); held until full-line re-typeset passes QA.',
  },
  {
    id: 'w4-slide-14',
    reason:
      'Hady→Hadi repair visible at 100% (glyph swap); held until full-line re-typeset passes QA.',
  },
  {
    id: 'w4-slide-16',
    reason:
      'Hady→Hadi + closing/footer re-layout not yet indistinguishable from untouched W4 slides.',
  },
  {
    id: 'results-w1-m2',
    reason:
      'FINAL headline Hady→Hadi glyph repair visible at 100% (needs full line re-typeset).',
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

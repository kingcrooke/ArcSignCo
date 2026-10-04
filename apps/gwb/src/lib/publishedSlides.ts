export type PublishedSlide = {
  id: string
  title: string
  basename: string
  width: number
  height: number
}

export type SlideGroup = {
  id: string
  heading: string
  slides: PublishedSlide[]
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

const SLIDE_SIZE = { width: 1080, height: 1350 }

function w4(id: string, title: string): PublishedSlide {
  return {
    id,
    title,
    basename: id,
    ...SLIDE_SIZE,
  }
}

function vs(id: string, title: string): PublishedSlide {
  return {
    id,
    title,
    basename: id,
    ...SLIDE_SIZE,
  }
}

function result(id: string, title: string): PublishedSlide {
  return {
    id,
    title,
    basename: id,
    ...SLIDE_SIZE,
  }
}

const RESULTS_W1: PublishedSlide[] = [
  result('results-w1-m1', 'W1: Mauricio 137.1 – Crooke 124.5'),
  result('results-w1-m2', 'W1: Kayser 138.7 – Hadi 119.4'),
  result('results-w1-m3', 'W1: Matt 175.1 – Narking 158.2'),
  result('results-w1-m4', 'W1: Jamil 171.7 – Danny 111.9'),
  result('results-w1-m5', 'W1: Steven 199.4 – Frankie 135.4'),
  result('results-w1-m6', 'W1: Manny 133.2 – Eric 129.1'),
]

const RESULTS_W2: PublishedSlide[] = [
  result('results-w2-m1', 'W2: Hadi 151.0 – Crooke 123.7'),
  result('results-w2-m2', 'W2: Narking 131.9 – Mauricio 99.8'),
  result('results-w2-m3', 'W2: Kayser 170.9 – Danny 143.0'),
  result('results-w2-m4', 'W2: Steven 134.9 – Matt 130.5'),
  result('results-w2-m5', 'W2: Manny 184.0 – Jamil 138.9'),
  result('results-w2-m6', 'W2: Eric 142.7 – Frankie 105.2'),
]

const RESULTS_W3: PublishedSlide[] = [
  result('results-w3-m1', 'W3: Crooke 167.7 – Narking 136.7'),
  result('results-w3-m2', 'W3: Hadi 132.0 – Danny 121.7'),
  result('results-w3-m3', 'W3: Steven 199.2 – Mauricio 123.9'),
  result('results-w3-m4', 'W3: Kayser 151.9 – Manny 129.7'),
  result('results-w3-m5', 'W3: Eric 130.4 – Matt 128.6'),
  result('results-w3-m6', 'W3: Jamil 113.6 – Frankie 95.8'),
]

export const SLIDE_GROUPS: SlideGroup[] = [
  {
    id: 'week4-report',
    heading: 'Week 4 Report',
    slides: [
      w4('w4-slide-01', 'Waivers, injuries & panic'),
      w4('w4-slide-02', 'Slide 2'),
      w4('w4-slide-03', 'Slide 3'),
      w4('w4-slide-04', 'The rest of the wire'),
      w4('w4-slide-05', 'Slide 5'),
      w4('w4-slide-06', 'Slide 6'),
      w4('w4-slide-07', 'Slide 7'),
      w4('w4-slide-08', 'Slide 8'),
      w4('w4-slide-09', 'Slide 9'),
      w4('w4-slide-10', 'Hadi vs Manny (matchup 3)'),
      w4('w4-slide-11', 'Slide 11'),
      w4('w4-slide-12', 'Slide 12'),
      w4('w4-slide-13', 'Slide 13'),
      w4('w4-slide-14', 'QB heat check'),
      w4('w4-slide-15', 'Waiver awards'),
      w4('w4-slide-16', "Crooke's picks"),
    ],
  },
  {
    id: 'week4-matchups',
    heading: 'Week 4 Matchups',
    slides: [
      vs('vs-m1-narking-steven', 'Narking vs Steven'),
      vs('vs-m2-kayser-frankie', 'Kayser vs Frankie'),
      vs('vs-m3-hadi-manny', 'Hadi vs Manny'),
      vs('vs-m4-jamil-matt', 'Jamil vs Matt'),
      vs('vs-m5-mauricio-eric', 'Mauricio vs Eric'),
      vs('vs-m6-danny-crooke', 'Danny vs Crooke'),
    ],
  },
  {
    id: 'results-week-1',
    heading: 'Results · Week 1',
    slides: RESULTS_W1,
  },
  {
    id: 'results-week-2',
    heading: 'Results · Week 2',
    slides: RESULTS_W2,
  },
  {
    id: 'results-week-3',
    heading: 'Results · Week 3',
    slides: RESULTS_W3,
  },
]

const HELD_BACK_IDS = new Set(HELD_BACK_SLIDES.map((s) => s.id))

export const ALL_PUBLISHED_SLIDES: PublishedSlide[] = SLIDE_GROUPS.flatMap(
  (g) => g.slides,
).filter((s) => !HELD_BACK_IDS.has(s.id))

const base = import.meta.env.BASE_URL

export function slideAssetUrl(
  basename: string,
  variant: 'full' | 'thumb',
  ext: 'webp' | 'jpg',
) {
  return `${base}slides/${basename}.${variant}.${ext}`
}

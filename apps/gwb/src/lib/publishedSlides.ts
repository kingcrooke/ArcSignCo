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
  { id: 'w4-slide-16', reason: 'Footer overlap with gwb_fantasy_football' },
  {
    id: 'w4-slide-06',
    reason: 'Needs Hadi spelling fix (Hady baked into artwork)',
  },
  {
    id: 'w4-slide-10',
    reason: 'Needs Hadi spelling fix (Hady baked into artwork)',
  },
  {
    id: 'w4-slide-14',
    reason: 'Needs Hadi spelling fix (Hady baked into artwork)',
  },
  {
    id: 'vs-m3-hadi-manny',
    reason: 'Needs Hadi spelling fix (Hady baked into artwork)',
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

export const SLIDE_GROUPS: SlideGroup[] = [
  {
    id: 'week4-report',
    heading: 'Week 4 Report',
    slides: [
      w4('w4-slide-01', 'Waivers, injuries & panic'),
      w4('w4-slide-02', 'Slide 2'),
      w4('w4-slide-03', 'Slide 3'),
      w4('w4-slide-04', 'Slide 4'),
      w4('w4-slide-05', 'Slide 5'),
      w4('w4-slide-07', 'Slide 7'),
      w4('w4-slide-08', 'Slide 8'),
      w4('w4-slide-09', 'Slide 9'),
      w4('w4-slide-11', 'Slide 11'),
      w4('w4-slide-12', 'Slide 12'),
      w4('w4-slide-13', 'Slide 13'),
      w4('w4-slide-15', 'Slide 15'),
    ],
  },
  {
    id: 'week4-matchups',
    heading: 'Week 4 Matchups',
    slides: [
      vs('vs-m1-narking-steven', 'Narking vs Steven'),
      vs('vs-m2-kayser-frankie', 'Kayser vs Frankie'),
      vs('vs-m4-jamil-matt', 'Jamil vs Matt'),
      vs('vs-m5-mauricio-eric', 'Mauricio vs Eric'),
      vs('vs-m6-danny-crooke', 'Danny vs Crooke'),
    ],
  },
]

export const ALL_PUBLISHED_SLIDES: PublishedSlide[] = SLIDE_GROUPS.flatMap(
  (g) => g.slides,
)

const base = import.meta.env.BASE_URL

export function slideAssetUrl(
  basename: string,
  variant: 'full' | 'thumb',
  ext: 'webp' | 'jpg',
) {
  return `${base}slides/${basename}.${variant}.${ext}`
}

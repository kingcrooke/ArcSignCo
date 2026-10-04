import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'

export type GraphicsSectionKind = 'matchups' | 'results' | 'report'

export type WeekGraphicsSection = {
  kind: GraphicsSectionKind
  heading: string
  slides: PublishedSlide[]
}

const HELD = new Set(HELD_BACK_SLIDES.map((s) => s.id))

function publish(slides: PublishedSlide[]): PublishedSlide[] {
  return slides.filter((s) => !HELD.has(s.id))
}

/** Slides for a week in lightbox order: matchups → results → report. */
export function getWeekGraphicsSlides(week: number): PublishedSlide[] {
  return getWeekGraphicsSections(week).flatMap((s) => s.slides)
}

export function getWeekGraphicsSections(week: number): WeekGraphicsSection[] {
  const sections: WeekGraphicsSection[] = []

  if (week === 4) {
    const matchups = publish(WEEK_4_MATCHUPS)
    if (matchups.length) {
      sections.push({ kind: 'matchups', heading: 'Matchups', slides: matchups })
    }
    const report = publish(WEEK_4_REPORT)
    if (report.length) {
      sections.push({ kind: 'report', heading: 'Report', slides: report })
    }
    return sections
  }

  const resultsByWeek: Record<number, PublishedSlide[]> = {
    1: publish(RESULTS_W1),
    2: publish(RESULTS_W2),
    3: publish(RESULTS_W3),
  }
  const results = resultsByWeek[week]
  if (results?.length) {
    sections.push({ kind: 'results', heading: 'Results', slides: results })
  }

  return sections
}

const SLIDE_SIZE = { width: 1080, height: 1350 }

function w4(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

function vs(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

function result(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

const WEEK_4_REPORT: PublishedSlide[] = [
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
]

const WEEK_4_MATCHUPS: PublishedSlide[] = [
  vs('vs-m1-narking-steven', 'Narking vs Steven'),
  vs('vs-m2-kayser-frankie', 'Kayser vs Frankie'),
  vs('vs-m3-hadi-manny', 'Hadi vs Manny'),
  vs('vs-m4-jamil-matt', 'Jamil vs Matt'),
  vs('vs-m5-mauricio-eric', 'Mauricio vs Eric'),
  vs('vs-m6-danny-crooke', 'Danny vs Crooke'),
]

const RESULTS_W1: PublishedSlide[] = [
  result('results-w1-m1', 'Mauricio 137.1 – Crooke 124.5'),
  result('results-w1-m2', 'Kayser 138.7 – Hadi 119.4'),
  result('results-w1-m3', 'Matt 175.1 – Narking 158.2'),
  result('results-w1-m4', 'Jamil 171.7 – Danny 111.9'),
  result('results-w1-m5', 'Steven 199.4 – Frankie 135.4'),
  result('results-w1-m6', 'Manny 133.2 – Eric 129.1'),
]

const RESULTS_W2: PublishedSlide[] = [
  result('results-w2-m1', 'Hadi 151.0 – Crooke 123.7'),
  result('results-w2-m2', 'Narking 131.9 – Mauricio 99.8'),
  result('results-w2-m3', 'Kayser 170.9 – Danny 143.0'),
  result('results-w2-m4', 'Steven 134.9 – Matt 130.5'),
  result('results-w2-m5', 'Manny 184.0 – Jamil 138.9'),
  result('results-w2-m6', 'Eric 142.7 – Frankie 105.2'),
]

const RESULTS_W3: PublishedSlide[] = [
  result('results-w3-m1', 'Crooke 167.7 – Narking 136.7'),
  result('results-w3-m2', 'Hadi 132.0 – Danny 121.7'),
  result('results-w3-m3', 'Steven 199.2 – Mauricio 123.9'),
  result('results-w3-m4', 'Kayser 151.9 – Manny 129.7'),
  result('results-w3-m5', 'Eric 130.4 – Matt 128.6'),
  result('results-w3-m6', 'Jamil 113.6 – Frankie 95.8'),
]

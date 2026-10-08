import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES, publishSlideBasename } from './publishedSlides'
import { slideHeadline } from './slideHeadlines'

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

/** Finished week: results, then report. Matchup cards are for an upcoming week only. */
export function getWeekGraphicsSlides(week: number): PublishedSlide[] {
  return getWeekGraphicsSections(week).flatMap((s) => s.slides)
}

export function getWeekGraphicsSections(week: number): WeekGraphicsSection[] {
  const sections: WeekGraphicsSection[] = []

  const matchupsByWeek: Record<number, PublishedSlide[]> = {
    5: publish(WEEK_5_MATCHUPS),
  }
  const matchups = matchupsByWeek[week]
  if (matchups?.length) {
    sections.push({ kind: 'matchups', heading: 'Matchups', slides: matchups })
  }

  const resultsByWeek: Record<number, PublishedSlide[]> = {
    1: publish(RESULTS_W1),
    2: publish(RESULTS_W2),
    3: publish(RESULTS_W3),
    4: publish(RESULTS_W4),
  }
  const results = resultsByWeek[week]
  if (results?.length) {
    sections.push({ kind: 'results', heading: 'Results', slides: results })
  }

  const reportByWeek: Record<number, PublishedSlide[]> = {
    1: publish(WEEK_1_REPORT),
    2: publish(WEEK_2_REPORT),
    3: publish(WEEK_3_REPORT),
    4: publish(WEEK_4_REPORT),
  }
  const report = reportByWeek[week]
  if (report?.length) {
    sections.push({ kind: 'report', heading: 'Report', slides: report })
  }

  return sections
}

const SLIDE_SIZE = { width: 1080, height: 1350 }

function titled(id: string, fallback: string): PublishedSlide {
  return {
    id,
    title: slideHeadline(id, fallback),
    basename: publishSlideBasename(id),
    ...SLIDE_SIZE,
  }
}

function w4(id: string, title: string): PublishedSlide {
  return titled(id, title)
}

function reportSlide(week: 1 | 2 | 3, index: number, title: string): PublishedSlide {
  const id = `w${week}-slide-${String(index).padStart(2, '0')}`
  return titled(id, title)
}

function finalReportDeck(week: 1 | 2 | 3, titles: string[]): PublishedSlide[] {
  return titles.map((title, i) => reportSlide(week, i + 1, title))
}

const WEEK_1_REPORT: PublishedSlide[] = finalReportDeck(1, [
  'We are so back',
  'Slide 2',
  'Slide 3',
  'Slide 4',
  'Slide 5',
  'Slide 6',
  'Slide 7',
  'Slide 8',
  'Slide 9',
  'Slide 10',
  'Slide 11',
  'Slide 12',
  'Slide 13',
  'Slide 14',
  'Slide 15',
  'Slide 16',
])

const WEEK_2_REPORT: PublishedSlide[] = finalReportDeck(2, [
  'Week 2 final report',
  'Slide 2',
  'Slide 3',
  'Slide 4',
  'Slide 5',
  'Slide 6',
  'Slide 7',
  'Slide 8',
  'Slide 9',
  'Slide 10',
  'Slide 11',
  'Slide 12',
  'Slide 13',
  'Slide 14',
  'Slide 15',
  'Slide 16',
])

const WEEK_3_REPORT: PublishedSlide[] = finalReportDeck(3, [
  'Week 3 final report',
  'Slide 2',
  'Slide 3',
  'Slide 4',
  'Slide 5',
  'Slide 6',
  'Slide 7',
  'Slide 8',
  'Slide 9',
  'Slide 10',
  'Slide 11',
  'Slide 12',
  'Slide 13',
  'Slide 14',
  'Slide 15',
  'Slide 16',
])

function vs(id: string, title: string): PublishedSlide {
  return titled(id, title)
}

function result(id: string, title: string): PublishedSlide {
  return titled(id, title)
}

const WEEK_5_MATCHUPS: PublishedSlide[] = [
  vs('vs-w5-m1', 'Steven vs Crooke'),
  vs('vs-w5-m2', 'Danny vs Manny'),
  vs('vs-w5-m3', 'Narking vs Eric'),
  vs('vs-w5-m4', 'Hady vs Frankie'),
  vs('vs-w5-m5', 'Mauricio vs Jamil'),
  vs('vs-w5-m6', 'Kayser vs Matt'),
]

const WEEK_4_REPORT: PublishedSlide[] = [
  w4('w4-slide-01', 'The Frankie Zone Has Been Evacuated'),
  w4('w4-slide-02', 'Steven 180.56 def Narking'),
  w4('w4-slide-03', 'Mauricio 141.24 def Eric'),
  w4('w4-slide-04', 'Frankie 144.80 def Kayser'),
  w4('w4-slide-05', 'Danny 163.91 def Crooke'),
  w4('w4-slide-06', 'Hady 141.65 def Manny'),
  w4('w4-slide-07', 'Jamil 162.83 def Matt'),
  w4('w4-slide-08', 'Kayser Mulligan #7: Good Mulligan, Lost Anyway'),
  w4('w4-slide-09', 'Frankie Zone Temporarily Closed'),
  w4('w4-slide-10', 'But One Very Nice Website'),
  w4('w4-slide-11', 'Final Week 4 Scoring'),
  w4('w4-slide-12', 'Stat of the Week: 0.03'),
  w4('w4-slide-13', 'Standings After Week 4'),
  w4('w4-slide-14', 'AI Hady Got Cooked'),
  w4('w4-slide-15', 'Week 4 Awards'),
  w4('w4-slide-16', 'Week 5: We Run It Back'),
]

const RESULTS_W1: PublishedSlide[] = [
  result('results-w1-m1', 'Mauricio 137.1 – Crooke 124.5'),
  result('results-w1-m2', 'Kayser 138.7 – Hady 119.4'),
  result('results-w1-m3', 'Matt 175.1 – Narking 158.2'),
  result('results-w1-m4', 'Jamil 171.7 – Danny 111.9'),
  result('results-w1-m5', 'Steven 199.4 – Frankie 135.4'),
  result('results-w1-m6', 'Manny 133.2 – Eric 129.1'),
]

const RESULTS_W2: PublishedSlide[] = [
  result('results-w2-m1', 'Hady 151.0 – Crooke 123.7'),
  result('results-w2-m2', 'Narking 131.9 – Mauricio 99.8'),
  result('results-w2-m3', 'Kayser 170.9 – Danny 143.0'),
  result('results-w2-m4', 'Steven 134.9 – Matt 130.5'),
  result('results-w2-m5', 'Manny 184.0 – Jamil 138.9'),
  result('results-w2-m6', 'Eric 142.7 – Frankie 105.2'),
]

const RESULTS_W3: PublishedSlide[] = [
  result('results-w3-m1', 'Crooke 167.7 – Narking 136.7'),
  result('results-w3-m2', 'Hady 132.0 – Danny 121.7'),
  result('results-w3-m3', 'Steven 199.2 – Mauricio 123.9'),
  result('results-w3-m4', 'Kayser 151.9 – Manny 129.7'),
  result('results-w3-m5', 'Eric 130.4 – Matt 128.6'),
  result('results-w3-m6', 'Jamil 113.6 – Frankie 95.8'),
]

const RESULTS_W4: PublishedSlide[] = [
  result('results-w4-m1', 'Steven 180.6 – Narking 141.2'),
  result('results-w4-m2', 'Frankie 144.8 – Kayser 128.4'),
  result('results-w4-m3', 'Hady 141.7 – Manny 134.9'),
  result('results-w4-m4', 'Jamil 162.8 – Matt 143.6'),
  result('results-w4-m5', 'Mauricio 141.2 – Eric 123.7'),
  result('results-w4-m6', 'Danny 163.9 – Crooke 121.3'),
]

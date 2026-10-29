import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'
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

/** Finished week: optional preview matchups, then results and report; upcoming weeks may be matchups only. */
export function getWeekGraphicsSlides(week: number): PublishedSlide[] {
  return getWeekGraphicsSections(week).flatMap((s) => s.slides)
}

export function getWeekGraphicsSections(week: number): WeekGraphicsSection[] {
  const sections: WeekGraphicsSection[] = []

  const matchupsByWeek: Record<number, PublishedSlide[]> = {
    1: publish(WEEK_1_MATCHUPS),
    2: publish(WEEK_2_MATCHUPS),
    3: publish(WEEK_3_MATCHUPS),
    4: publish(WEEK_4_MATCHUPS),
    5: publish(WEEK_5_MATCHUPS),
    6: publish(WEEK_6_MATCHUPS),
    7: publish(WEEK_7_MATCHUPS),
    8: publish(WEEK_8_MATCHUPS),
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
    5: publish(RESULTS_W5),
    6: publish(RESULTS_W6),
    7: publish(RESULTS_W7),
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
    5: publish(WEEK_5_REPORT),
  }
  const report = reportByWeek[week]
  if (report?.length) {
    sections.push({ kind: 'report', heading: 'Report', slides: report })
  }

  return sections
}

/** Recap deck slides (wN-slide-NN) — 4:5 at 1080×1350. */
const RECAP_SLIDE_SIZE = { width: 1080, height: 1350 }

/** Muse designer result / matchup cards — 5:7 at 1000×1400. */
export const MUSE_CARD_SLIDE_SIZE = { width: 1000, height: 1400 }

function titled(
  id: string,
  fallback: string,
  size: { width: number; height: number } = RECAP_SLIDE_SIZE,
): PublishedSlide {
  return {
    id,
    title: slideHeadline(id, fallback),
    basename: id,
    ...size,
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
  return titled(id, title, MUSE_CARD_SLIDE_SIZE)
}

function result(id: string, title: string): PublishedSlide {
  return titled(id, title, MUSE_CARD_SLIDE_SIZE)
}

const WEEK_1_MATCHUPS: PublishedSlide[] = [
  vs('vs-w1-m1', 'Mauricio vs Crooke'),
  vs('vs-w1-m2', 'Kayser vs Hady'),
  vs('vs-w1-m3', 'Matt vs Narking'),
  vs('vs-w1-m4', 'Jamil vs Danny'),
  vs('vs-w1-m5', 'Steven vs Frankie'),
  vs('vs-w1-m6', 'Manny vs Eric'),
]

const WEEK_2_MATCHUPS: PublishedSlide[] = [
  vs('vs-w2-m1', 'Hady vs Crooke'),
  vs('vs-w2-m2', 'Narking vs Mauricio'),
  vs('vs-w2-m3', 'Kayser vs Danny'),
  vs('vs-w2-m4', 'Steven vs Matt'),
  vs('vs-w2-m5', 'Manny vs Jamil'),
  vs('vs-w2-m6', 'Eric vs Frankie'),
]

const WEEK_3_MATCHUPS: PublishedSlide[] = [
  vs('vs-w3-m1', 'Crooke vs Narking'),
  vs('vs-w3-m2', 'Hady vs Danny'),
  vs('vs-w3-m3', 'Steven vs Mauricio'),
  vs('vs-w3-m4', 'Kayser vs Manny'),
  vs('vs-w3-m5', 'Eric vs Matt'),
  vs('vs-w3-m6', 'Jamil vs Frankie'),
]

const WEEK_4_MATCHUPS: PublishedSlide[] = [
  vs('vs-w4-m1', 'Steven vs Narking'),
  vs('vs-w4-m2', 'Frankie vs Kayser'),
  vs('vs-w4-m3', 'Hady vs Manny'),
  vs('vs-w4-m4', 'Jamil vs Matt'),
  vs('vs-w4-m5', 'Mauricio vs Eric'),
  vs('vs-w4-m6', 'Danny vs Crooke'),
]

const WEEK_5_MATCHUPS: PublishedSlide[] = [
  vs('vs-w5-m1', 'Crooke vs Steven'),
  vs('vs-w5-m2', 'Danny vs Manny'),
  vs('vs-w5-m3', 'Eric vs Narking'),
  vs('vs-w5-m4', 'Hady vs Frankie'),
  vs('vs-w5-m5', 'Mauricio vs Jamil'),
  vs('vs-w5-m6', 'Matt vs Kayser'),
]

const WEEK_6_MATCHUPS: PublishedSlide[] = [
  vs('vs-w6-m1', 'Crooke vs Manny'),
  vs('vs-w6-m2', 'Eric vs Steven'),
  vs('vs-w6-m3', 'Danny vs Frankie'),
  vs('vs-w6-m4', 'Narking vs Jamil'),
  vs('vs-w6-m5', 'Hady vs Matt'),
  vs('vs-w6-m6', 'Mauricio vs Kayser'),
]

const WEEK_7_MATCHUPS: PublishedSlide[] = [
  vs('vs-w7-m1', 'Eric vs Crooke'),
  vs('vs-w7-m2', 'Manny vs Frankie'),
  vs('vs-w7-m3', 'Steven vs Jamil'),
  vs('vs-w7-m4', 'Danny vs Matt'),
  vs('vs-w7-m5', 'Narking vs Kayser'),
  vs('vs-w7-m6', 'Mauricio vs Hady'),
]

const WEEK_8_MATCHUPS: PublishedSlide[] = [
  vs('vs-w8-m1', 'Crooke vs Frankie'),
  vs('vs-w8-m2', 'Eric vs Jamil'),
  vs('vs-w8-m3', 'Manny vs Matt'),
  vs('vs-w8-m4', 'Kayser vs Steven'),
  vs('vs-w8-m5', 'Danny vs Mauricio'),
  vs('vs-w8-m6', 'Narking vs Hady'),
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

const WEEK_5_REPORT: PublishedSlide[] = [
  w4('w5-slide-01', "Steven's Perfect Season Is Over"),
  w4('w5-slide-02', 'Crooke 159.29 def Steven'),
  w4('w5-slide-03', 'Hady 212.33 def Frankie'),
  w4('w5-slide-04', 'Danny 176.78 def Manny'),
  w4('w5-slide-05', 'Mauricio 204.16 def Jamil'),
  w4('w5-slide-06', 'Matt 176.87 def Kayser'),
  w4('w5-slide-07', 'Eric 145.67 def Narking'),
  w4('w5-slide-08', 'Bench Watch: Left on the Pine'),
  w4('w5-slide-09', 'Frankie Zone Check-In'),
  w4('w5-slide-10', 'Week 5 Top Scorers'),
  w4('w5-slide-11', 'Final Week 5 Scoring'),
  w4('w5-slide-12', 'Closest Game & Biggest Blowout'),
  w4('w5-slide-13', 'Standings After Week 5'),
  w4('w5-slide-14', 'Biggest Blowout: Hady vs Frankie'),
  w4('w5-slide-15', 'Week 5 Awards'),
  w4('w5-slide-16', 'Week 6: No Undefeateds'),
]

const RESULTS_W5: PublishedSlide[] = [
  result('results-w5-m1', 'Crooke 159.3 – Steven 120.8'),
  result('results-w5-m2', 'Danny 176.8 – Manny 122.2'),
  result('results-w5-m3', 'Eric 145.7 – Narking 95.9'),
  result('results-w5-m4', 'Hady 212.3 – Frankie 101.1'),
  result('results-w5-m5', 'Mauricio 204.2 – Jamil 143.5'),
  result('results-w5-m6', 'Matt 176.9 – Kayser 150.3'),
]

const RESULTS_W6: PublishedSlide[] = [
  result('results-w6-m1', 'Crooke 128.80 – Manny 124.52'),
  result('results-w6-m2', 'Steven 119.93 – Eric 99.59'),
  result('results-w6-m3', 'Danny 131.40 – Frankie 111.23'),
  result('results-w6-m4', 'Narking 137.59 – Jamil 134.98'),
  result('results-w6-m5', 'Hady 144.85 – Matt 125.69'),
  result('results-w6-m6', 'Mauricio 143.21 – Kayser 93.27'),
]

const RESULTS_W7: PublishedSlide[] = [
  result('results-w7-m1', 'Crooke beats Eric 136.45-110.86'),
  result('results-w7-m2', 'Frankie beats Manny 161.66-124.44'),
  result('results-w7-m3', 'Steven beats Jamil 187.82-163.40'),
  result('results-w7-m4', 'Matt beats Danny 139.98-135.83'),
  result('results-w7-m5', 'Narking beats Kayser 129.7-87.97'),
  result('results-w7-m6', 'Hady beats Mauricio 141.51-118.3'),
]

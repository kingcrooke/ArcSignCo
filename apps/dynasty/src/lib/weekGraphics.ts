import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'

export type GraphicsSectionKind = 'matchups' | 'results'

export type WeekGraphicsSection = {
  kind: GraphicsSectionKind
  heading: string
  slides: PublishedSlide[]
}

const HELD = new Set(HELD_BACK_SLIDES.map((s) => s.id))
const SLIDE_SIZE = { width: 1080, height: 1350 }

function publish(slides: PublishedSlide[]): PublishedSlide[] {
  return slides.filter((s) => !HELD.has(s.id))
}

function slide(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

const RESULTS_W5: PublishedSlide[] = [
  slide('results-w5-m1', 'BigBlue 104.96 - Chase\u2019n Dubs 121.78'),
  slide('results-w5-m2', 'Saints & Sinners 172.38 - Rubuilding 134.94'),
  slide('results-w5-m3', 'Nix in 5 161.66 - Wolf Pack 178.40'),
  slide('results-w5-m4', 'Chalupa Batman 115.44 - Team Name Hoes 154.22'),
  slide('results-w5-m5', 'Love Thy Nabers 132.44 - MahomiesRidley4MooreJeffe 117.06'),
  slide('results-w5-m6', 'A-Lamb-e que tengo hambre 86.94 - ramonguaraguao 122.40'),
]

const VS_W6: PublishedSlide[] = [
  slide('vs-w6-m1', 'Chase\u2019n Dubs vs MahomiesRidley4MooreJeffe'),
  slide('vs-w6-m2', 'A-Lamb-e que tengo hambre vs Rubuilding'),
  slide('vs-w6-m3', 'Wolf Pack vs ramonguaraguao'),
  slide('vs-w6-m4', 'Love Thy Nabers vs Team Name Hoes'),
  slide('vs-w6-m5', 'Saints & Sinners vs Chalupa Batman'),
  slide('vs-w6-m6', 'Nix in 5 vs BigBlue'),
]

/** Week 5 final: results then Week 6 matchup previews (never mixed in one gallery row). */
export function getWeekGraphicsSections(week: number): WeekGraphicsSection[] {
  const sections: WeekGraphicsSection[] = []

  if (week === 5) {
    sections.push({ kind: 'results', heading: 'Results', slides: publish(RESULTS_W5) })
    sections.push({ kind: 'matchups', heading: 'Matchups', slides: publish(VS_W6) })
  } else if (week === 6) {
    sections.push({ kind: 'matchups', heading: 'Matchups', slides: publish(VS_W6) })
  }

  return sections
}

export function getWeekGraphicsSlides(week: number): PublishedSlide[] {
  return getWeekGraphicsSections(week).flatMap((s) => s.slides)
}

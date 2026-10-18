import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'
import weekResults from '../data/week-result-slides.json'

export type GraphicsSectionKind = 'matchups' | 'results'

export type WeekGraphicsSection = {
  kind: GraphicsSectionKind
  heading: string
  slides: PublishedSlide[]
  /** When set, this section previews a future NFL week (e.g. Week 6 on the Week 5 page). */
  previewWeek?: number
}

const HELD = new Set(HELD_BACK_SLIDES.map((s) => s.id))
const SLIDE_SIZE = { width: 1080, height: 1350 }

function publish(slides: PublishedSlide[]): PublishedSlide[] {
  return slides.filter((s) => !HELD.has(s.id))
}

function slide(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

const RESULTS_BY_WEEK = weekResults as Record<
  string,
  { id: string; title: string }[]
>

function resultsSlides(week: number): PublishedSlide[] {
  const rows = RESULTS_BY_WEEK[String(week)] ?? []
  return rows.map((r) => slide(r.id, r.title))
}

const VS_W6: PublishedSlide[] = [
  slide('vs-w6-m1', 'Chase\u2019n Dubs vs MahomiesRidley4MooreJeffe'),
  slide('vs-w6-m2', 'A-Lamb-e que tengo hambre vs Rubuilding'),
  slide('vs-w6-m3', 'Wolf Pack vs ramonguaraguao'),
  slide('vs-w6-m4', 'Love Thy Nabers vs Team Name Hoes'),
  slide('vs-w6-m5', 'Saints & Sinners vs Chalupa Batman'),
  slide('vs-w6-m6', 'Nix in 5 vs BigBlue'),
]

/** Weeks 1–4: results only. Week 5: results + Week 6 previews. Week 6: matchups only. */
export function getWeekGraphicsSections(week: number): WeekGraphicsSection[] {
  const sections: WeekGraphicsSection[] = []

  if (week >= 1 && week <= 4) {
    const slides = publish(resultsSlides(week))
    if (slides.length) {
      sections.push({ kind: 'results', heading: 'Results', slides })
    }
  } else if (week === 5) {
    sections.push({
      kind: 'results',
      heading: 'Results',
      slides: publish(resultsSlides(5)),
    })
    sections.push({
      kind: 'matchups',
      heading: 'Week 6 matchup previews',
      previewWeek: 6,
      slides: publish(VS_W6),
    })
  } else if (week === 6) {
    sections.push({ kind: 'matchups', heading: 'Matchups', slides: publish(VS_W6) })
  }

  return sections
}

export function getWeekGraphicsSlides(week: number): PublishedSlide[] {
  return getWeekGraphicsSections(week).flatMap((s) => s.slides)
}

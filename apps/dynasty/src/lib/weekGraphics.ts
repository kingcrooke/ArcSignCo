import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'
import weekResults from '../data/week-result-slides.json'
import weekMatchups from '../data/week-matchup-slides.json'

export type GraphicsSectionKind = 'matchups' | 'results'

export type WeekGraphicsSection = {
  kind: GraphicsSectionKind
  heading: string
  slides: PublishedSlide[]
  /** When set, this section previews a future NFL week (e.g. Week 6 on the Week 5 page). */
  previewWeek?: number
}

type SlideRef = { id: string; title: string }

type ManifestWeek = {
  results?: SlideRef[]
  matchups?: SlideRef[]
  matchupPreviewWeek?: number
}

type Manifest = Record<string, Record<string, ManifestWeek>>

type MatchupFile = Record<
  string,
  Record<string, { previewWeek?: number; slides?: SlideRef[] }>
>

const HELD = new Set(HELD_BACK_SLIDES.map((s) => s.id))
const SLIDE_SIZE = { width: 1080, height: 1350 }

/** week-result-slides.json is the 2026 results deck. Other seasons have no cards. */
const RESULTS_SEASON = '2026'

function publish(slides: PublishedSlide[]): PublishedSlide[] {
  return slides.filter((s) => !HELD.has(s.id))
}

function slide(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

function buildManifest(): Manifest {
  const manifest: Manifest = {}
  const results = weekResults as Record<string, SlideRef[]>
  for (const [week, rows] of Object.entries(results)) {
    const seasonWeeks = manifest[RESULTS_SEASON] ?? {}
    const existing = seasonWeeks[week] ?? {}
    seasonWeeks[week] = { ...existing, results: rows }
    manifest[RESULTS_SEASON] = seasonWeeks
  }

  const matchups = weekMatchups as MatchupFile
  for (const [season, weeks] of Object.entries(matchups)) {
    const seasonWeeks = manifest[season] ?? {}
    for (const [week, entry] of Object.entries(weeks)) {
      const existing = seasonWeeks[week] ?? {}
      seasonWeeks[week] = {
        ...existing,
        matchups: entry.slides ?? [],
        matchupPreviewWeek: entry.previewWeek,
      }
    }
    manifest[season] = seasonWeeks
  }
  return manifest
}

const MANIFEST = buildManifest()

function weekEntry(season: string | number, week: number): ManifestWeek | null {
  if (!Number.isFinite(week)) return null
  const seasonWeeks = MANIFEST[String(season)]
  if (!seasonWeeks) return null
  return seasonWeeks[String(week)] ?? null
}

/** True when this season has any published card, regardless of week. */
export function seasonHasPublishedGraphics(season: string | number): boolean {
  const weeks = MANIFEST[String(season)]
  return !!weeks && Object.keys(weeks).length > 0
}

export function graphicsEmptyMessage(season: string | number, week: number): string {
  if (!seasonHasPublishedGraphics(season)) return 'No published graphics'
  return `Week ${week} cards aren't posted yet.`
}

/**
 * Published cards for a season and week. Unknown seasons and weeks return []
 * and never throw. Adding a week is a manifest entry, not a code branch.
 */
export function getWeekGraphicsSections(
  season: string | number,
  week: number,
): WeekGraphicsSection[] {
  const entry = weekEntry(season, week)
  if (!entry) return []

  const sections: WeekGraphicsSection[] = []
  const results = publish((entry.results ?? []).map((r) => slide(r.id, r.title)))
  if (results.length) {
    sections.push({ kind: 'results', heading: 'Results', slides: results })
  }

  const matchups = publish((entry.matchups ?? []).map((r) => slide(r.id, r.title)))
  if (matchups.length) {
    const preview = entry.matchupPreviewWeek
    sections.push({
      kind: 'matchups',
      heading: preview ? `Week ${preview} matchup previews` : 'Matchups',
      previewWeek: preview,
      slides: matchups,
    })
  }

  return sections
}

export function getWeekGraphicsSlides(
  season: string | number,
  week: number,
): PublishedSlide[] {
  return getWeekGraphicsSections(season, week).flatMap((s) => s.slides)
}

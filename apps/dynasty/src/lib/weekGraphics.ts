import type { PublishedSlide } from './publishedSlides'
import { HELD_BACK_SLIDES } from './publishedSlides'
import manifest from '../data/week-graphics-manifest.json'
import { getWeeklyReport } from './weeklyReport'

export type GraphicsSectionKind = 'matchups' | 'results'

export type WeekGraphicsSection = {
  kind: GraphicsSectionKind
  heading: string
  slides: PublishedSlide[]
  /** When set, this section previews a future NFL week (e.g. Week 6 on the Week 5 page). */
  previewWeek?: number
}

type ManifestSlide = { id: string; title: string }
type ManifestMatchups = { previewWeek?: number; slides: ManifestSlide[] }
type ManifestWeek = { results?: ManifestSlide[]; matchups?: ManifestMatchups }
type Manifest = Record<string, Record<string, ManifestWeek>>

const HELD = new Set(HELD_BACK_SLIDES.map((s) => s.id))
const SLIDE_SIZE = { width: 1080, height: 1350 }
const GRAPHICS = manifest as Manifest

function publish(slides: PublishedSlide[]): PublishedSlide[] {
  return slides.filter((s) => !HELD.has(s.id))
}

function slide(id: string, title: string): PublishedSlide {
  return { id, title, basename: id, ...SLIDE_SIZE }
}

function weekEntry(season: string | number, week: number): ManifestWeek | null {
  const seasonRow = GRAPHICS[String(season)]
  if (!seasonRow) return null
  return seasonRow[String(week)] ?? null
}

/** Copy for a week that has no published cards. Never throws. */
export function weekGraphicsEmptyMessage(week: number): string {
  return `Week ${week} cards aren't posted yet.`
}

/**
 * Card sections for a season and week. Unknown seasons and weeks return [].
 * Adding a week is a manifest entry plus slide files — no code change.
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

  const matchupSlides = publish(
    (entry.matchups?.slides ?? []).map((r) => slide(r.id, r.title)),
  )
  if (matchupSlides.length) {
    const previewWeek = entry.matchups?.previewWeek
    sections.push({
      kind: 'matchups',
      heading: previewWeek ? `Week ${previewWeek} matchup previews` : 'Matchups',
      previewWeek,
      slides: matchupSlides,
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

/** True when this week has published cards or a stored weekly report. */
export function weekHasPublishedGraphics(
  season: string | number,
  week: number,
): boolean {
  if (getWeekGraphicsSections(season, week).length > 0) return true
  return getWeeklyReport(season, week) != null
}

/** Latest week that has cards or a weekly report, or null when the season has none. */
export function latestGraphicsContentWeek(
  season: string | number,
  maxWeek = 18,
): number | null {
  let latest: number | null = null
  const last = Math.max(0, maxWeek)
  for (let week = 1; week <= last; week++) {
    if (weekHasPublishedGraphics(season, week)) latest = week
  }
  return latest
}

/**
 * Week the Graphics tab should show.
 * A pinned week is an explicit picker choice (including an empty week).
 * Otherwise prefer the shared selected week when it has content, else the latest
 * week that has a report or cards — not a live NFL week with nothing posted.
 */
export function resolveGraphicsWeek({
  selectedWeek,
  pinnedWeek,
  season,
  maxWeek = 18,
}: {
  selectedWeek: number
  pinnedWeek: number | null
  season: string | number
  maxWeek?: number
}): number {
  if (pinnedWeek != null && pinnedWeek >= 1) return pinnedWeek
  if (weekHasPublishedGraphics(season, selectedWeek)) return selectedWeek
  return latestGraphicsContentWeek(season, maxWeek) ?? selectedWeek
}

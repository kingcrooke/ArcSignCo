import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getWeekGraphicsSections,
  getWeekGraphicsSlides,
} from '../lib/weekGraphics'
import type { GraphicsSectionKind } from '../lib/weekGraphics'
import { groupMatchupPairs } from '../lib/matchupBoard'
import {
  pairProjectionLine,
  weekShouldShowProjectedTotals,
} from '../lib/matchupProjections'
import { fetchWeekProjections } from '../lib/projections'
import type { ProjectionsMap } from '../lib/projections'
import type { PublishedSlide } from '../lib/publishedSlides'
import { slideAssetUrl } from '../lib/publishedSlides'
import { fetchNflWeekScores } from '../lib/sleeperApi'
import type {
  NflWeekGame,
  PlayersMap,
  SleeperLeague,
  SleeperMatchup,
} from '../lib/types'
import { SlideLightbox } from './SlideLightbox'

const THUMB_WIDTH = 540
const THUMB_HEIGHT = 675

function GraphicThumb({
  slide,
  indexInWeek,
  onOpen,
  eager,
  buttonRef,
  projectionLine,
}: {
  slide: PublishedSlide
  indexInWeek: number
  onOpen: (indexInWeek: number) => void
  eager: boolean
  buttonRef?: React.RefObject<HTMLButtonElement | null>
  projectionLine?: string | null
}) {
  const webp = slideAssetUrl(slide.basename, 'thumb', 'webp')
  const jpg = slideAssetUrl(slide.basename, 'thumb', 'jpg')

  return (
    <button
      ref={buttonRef}
      type="button"
      className="group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]"
      onClick={() => onOpen(indexInWeek)}
      aria-label={`Open ${slide.title}`}
    >
      <img
        src={jpg}
        srcSet={`${webp} ${THUMB_WIDTH}w`}
        sizes="(max-width: 1024px) 50vw, 20vw"
        alt=""
        width={THUMB_WIDTH}
        height={THUMB_HEIGHT}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="aspect-[4/5] w-full bg-[#0d1319] object-cover transition group-hover:opacity-95"
      />
      <p className="truncate px-2 py-1.5 text-xs text-[var(--gwb-muted)]">
        {slide.title}
      </p>
      {projectionLine && (
        <p className="px-2 pb-1.5 text-center text-[10px] font-semibold tabular-nums tracking-wide text-amber-200/90">
          {projectionLine}
        </p>
      )}
    </button>
  )
}

function matchupIndexFromSlideId(id: string): number | null {
  const m = /^vs-w\d+-m(\d+)$/.exec(id)
  if (!m) return null
  return Number(m[1]) - 1
}

export function WeekGraphicsPanel({
  week,
  initialSlideId,
  onSlideUrlChange,
  onDeckKindChange,
  league,
  matchups,
  players,
  ensurePlayers,
  isActive,
}: {
  week: number
  initialSlideId?: string | null
  onSlideUrlChange?: (slideId: string | null) => void
  onDeckKindChange?: (kind: GraphicsSectionKind | null) => void
  league: SleeperLeague
  matchups?: SleeperMatchup[]
  players: PlayersMap | null
  ensurePlayers: () => void
  isActive: boolean
}) {
  const sections = useMemo(() => getWeekGraphicsSections(week), [week])
  const weekSlides = useMemo(() => getWeekGraphicsSlides(week), [week])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openButtonRef = useRef<HTMLButtonElement | null>(null)
  const [projections, setProjections] = useState<ProjectionsMap | null>(null)
  const [nflGames, setNflGames] = useState<NflWeekGame[] | null>(null)

  const pairs = useMemo(
    () => (matchups ? groupMatchupPairs(matchups) : []),
    [matchups],
  )

  const showProjections = useMemo(() => {
    if (!matchups?.length || !players) return false
    return weekShouldShowProjectedTotals(matchups, players, nflGames)
  }, [matchups, players, nflGames])

  const projectionBySlideId = useMemo(() => {
    const map = new Map<string, string>()
    if (!showProjections || !projections || !pairs.length) return map
    for (const slide of weekSlides) {
      const idx = matchupIndexFromSlideId(slide.id)
      if (idx == null || idx >= pairs.length) continue
      const pair = pairs[idx]
      const line = pairProjectionLine(pair.home, pair.away, projections)
      if (line) map.set(slide.id, line)
    }
    return map
  }, [showProjections, projections, pairs, weekSlides])

  useEffect(() => {
    ensurePlayers()
  }, [ensurePlayers])

  useEffect(() => {
    if (!isActive || !matchups?.length) return
    let cancelled = false
    fetchWeekProjections(league.season, week, 'regular').then((map) => {
      if (!cancelled) setProjections(map)
    })
    void fetchNflWeekScores(league.season, week, 'regular')
      .then((games) => {
        if (!cancelled) setNflGames(games)
      })
      .catch(() => {
        if (!cancelled) setNflGames(null)
      })
    return () => {
      cancelled = true
    }
  }, [isActive, week, league.season, matchups?.length])

  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    weekSlides.forEach((s, i) => map.set(s.id, i))
    return map
  }, [weekSlides])

  const open = useCallback(
    (indexInWeek: number) => {
      setLightboxIndex(indexInWeek)
      const slide = weekSlides[indexInWeek]
      onSlideUrlChange?.(slide?.id ?? null)
      const section = sections.find((s) => s.slides.some((x) => x.id === slide?.id))
      onDeckKindChange?.(section?.kind ?? null)
    },
    [weekSlides, onSlideUrlChange, onDeckKindChange, sections],
  )

  const close = useCallback(() => {
    setLightboxIndex(null)
    onSlideUrlChange?.(null)
    onDeckKindChange?.(null)
  }, [onSlideUrlChange, onDeckKindChange])

  useEffect(() => {
    if (!initialSlideId) return
    const idx = indexById.get(initialSlideId)
    if (idx != null) open(idx)
  }, [initialSlideId, indexById, open])

  const copySlideLink = (slide: PublishedSlide) => {
    const params = new URLSearchParams(window.location.search)
    params.set('week', String(week))
    params.set('tab', 'gallery')
    params.set('slide', slide.id)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    void navigator.clipboard?.writeText(url)
  }

  if (!sections.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No published graphics for Week {week} yet. Try another week.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--gwb-muted)]">
        Week {week} graphics. Tap a card for full size; swipe or use arrows in the
        viewer. Use &quot;Copy link&quot; on a card to deep-link this slide.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
        {sections.map((section) => (
          <section
            key={section.kind}
            id={`graphics-week-${week}-${section.kind}`}
            className="min-w-0 flex-1"
            aria-labelledby={`graphics-heading-${week}-${section.kind}`}
          >
            <h3
              id={`graphics-heading-${week}-${section.kind}`}
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]"
            >
              {section.heading}
            </h3>
            <ul
              className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
              role="list"
            >
              {section.slides.map((slide, i) => {
                const indexInWeek = indexById.get(slide.id) ?? 0
                const isDeepLinkTarget = initialSlideId === slide.id
                return (
                  <li key={slide.id} className="space-y-1">
                    <GraphicThumb
                      slide={slide}
                      indexInWeek={indexInWeek}
                      onOpen={open}
                      eager={i < 4 && section.kind === sections[0]?.kind}
                      buttonRef={isDeepLinkTarget ? openButtonRef : undefined}
                      projectionLine={
                        section.kind === 'matchups'
                          ? projectionBySlideId.get(slide.id)
                          : null
                      }
                    />
                    <button
                      type="button"
                      className="min-h-11 w-full text-xs text-[var(--gwb-accent)] underline"
                      onClick={() => copySlideLink(slide)}
                    >
                      Copy link
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      {lightboxIndex !== null && (
        <SlideLightbox
          slides={weekSlides}
          index={lightboxIndex}
          onClose={close}
          onIndexChange={(idx) => {
            setLightboxIndex(idx)
            const slide = weekSlides[idx]
            onSlideUrlChange?.(slide?.id ?? null)
            const section = sections.find((s) =>
              s.slides.some((x) => x.id === slide?.id),
            )
            onDeckKindChange?.(section?.kind ?? null)
          }}
          returnFocusRef={openButtonRef}
        />
      )}
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import recapsData from '../content/commissioner-recaps.json'
import { FRANKIE_ZONE_RECORD } from '../lib/constants'
import { managerNickname } from '../lib/nicknames'
import {
  computeFrankieZoneView,
  buildScheduleByWeek,
  mergeScheduleWeek,
  pathStatusLine,
  renameMeterLabel,
  ZONE_LORE_QUOTES,
  ZONE_PATH_STEPS,
  type FrankieZoneView,
} from '../lib/frankieZone'
import { getFrankieZoneSlides } from '../lib/frankieZoneSlides'
import { fetchMatchups, fetchNflWeekScores } from '../lib/sleeperApi'
import { slideAssetUrl } from '../lib/publishedSlides'
import type {
  NflState,
  NflWeekGame,
  PlayersMap,
  SleeperMatchup,
  TeamInfo,
} from '../lib/types'
import { SlideLightbox } from './SlideLightbox'

const THUMB_WIDTH = 540
const THUMB_HEIGHT = 675

type Props = {
  teams: Map<number, TeamInfo>
  matchupsByWeek: Map<number, SleeperMatchup[]>
  selectedWeek: number
  completedThroughWeek: number
  weekInProgress: boolean
  nflState: NflState
  players: PlayersMap | null
  ensurePlayers: () => void
  deferralNote: string | null
  playoffWeekStart: number
  onOpenRecap: (week: number, recapId: string) => void
  initialSlideId?: string | null
  onSlideUrlChange?: (slideId: string | null) => void
}

function PathTracker({ losses }: { losses: number }) {
  return (
    <div className="overflow-x-auto pb-1">
      <ol className="flex min-w-max gap-1.5" aria-label="Winless path tracker">
        {ZONE_PATH_STEPS.map((step) => {
          const here = step === losses
          const isRecord = step === FRANKIE_ZONE_RECORD.lossesWithoutWin
          const isRename = step === FRANKIE_ZONE_RECORD.renameAtLosses
          return (
            <li
              key={step}
              className={`flex flex-col items-center rounded-lg border px-2 py-2 text-center ${
                here
                  ? 'border-teal-400/70 bg-teal-950/40'
                  : 'border-[var(--gwb-border)] bg-[#0d1319]'
              }`}
            >
              <span
                className={`font-['Bebas Neue'] text-lg leading-none ${
                  here ? 'text-teal-300' : 'text-[var(--gwb-muted)]'
                }`}
              >
                0-{step}
              </span>
              {isRecord && (
                <span className="mt-1 max-w-[4.5rem] text-[0.55rem] font-semibold uppercase leading-tight text-[var(--gwb-accent)]">
                  Frankie&apos;s record (2015)
                </span>
              )}
              {isRename && (
                <span className="mt-1 max-w-[4.5rem] text-[0.55rem] font-semibold uppercase leading-tight text-red-300">
                  Zone renamed
                </span>
              )}
              {here && (
                <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-wide text-teal-300">
                  Here
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function CollisionCard({
  collision,
}: {
  collision: FrankieZoneView['collisions'][number]
}) {
  const weeksLabel =
    collision.weeksUntil === 0
      ? 'THIS WEEK'
      : collision.weeksUntil === 1
        ? '1 WEEK TO THE COLLISION'
        : `${collision.weeksUntil} WEEKS TO THE COLLISION`
  return (
    <article
      className="rounded-xl border-2 border-[var(--gwb-accent)] bg-gradient-to-b from-amber-950/50 to-[var(--gwb-surface)] p-4"
    >
      <p className="font-['Bebas Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]">
        {weeksLabel}
      </p>
      <p className="mt-2 text-lg font-semibold leading-snug">
        {collision.labelA} vs {collision.labelB}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gwb-muted)]">
        Week {collision.week} they collide / Who survives?
      </p>
    </article>
  )
}

export function FrankieZonePanel({
  teams,
  matchupsByWeek,
  selectedWeek,
  completedThroughWeek,
  weekInProgress,
  nflState,
  players,
  ensurePlayers,
  deferralNote,
  playoffWeekStart,
  onOpenRecap,
  initialSlideId,
  onSlideUrlChange,
}: Props) {
  const [scheduleByWeek, setScheduleByWeek] = useState(() =>
    buildScheduleByWeek(matchupsByWeek),
  )
  const scheduleWeeksLoaded = useRef(new Set<number>())
  const [scheduleReady, setScheduleReady] = useState(false)
  const [nflWeekGames, setNflWeekGames] = useState<NflWeekGame[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const slides = useMemo(() => getFrankieZoneSlides(), [])

  useEffect(() => {
    if (!weekInProgress) {
      setNflWeekGames(null)
      return
    }
    ensurePlayers()
    let cancelled = false
    void fetchNflWeekScores(
      nflState.season,
      selectedWeek,
      nflState.season_type,
    )
      .then((games) => {
        if (!cancelled) setNflWeekGames(games)
      })
      .catch(() => {
        if (!cancelled) setNflWeekGames(null)
      })
    return () => {
      cancelled = true
    }
  }, [weekInProgress, selectedWeek, nflState.season, nflState.season_type, ensurePlayers])

  useEffect(() => {
    const links: HTMLLinkElement[] = []
    for (const slide of slides) {
      for (const variant of ['webp', 'jpg'] as const) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = slideAssetUrl(slide.basename, 'thumb', variant)
        document.head.appendChild(link)
        links.push(link)
      }
    }
    return () => {
      for (const link of links) link.remove()
    }
  }, [slides])

  useEffect(() => {
    setScheduleByWeek(buildScheduleByWeek(matchupsByWeek))
    for (const week of matchupsByWeek.keys()) {
      scheduleWeeksLoaded.current.add(week)
    }
  }, [matchupsByWeek])

  useEffect(() => {
    let cancelled = false
    setScheduleReady(false)
    void (async () => {
      const toFetch: number[] = []
      for (let week = 1; week <= 18; week++) {
        if (!scheduleWeeksLoaded.current.has(week)) toFetch.push(week)
      }
      await Promise.all(
        toFetch.map(async (week) => {
          if (cancelled) return
          scheduleWeeksLoaded.current.add(week)
          try {
            const rows = await fetchMatchups(week)
            if (!rows?.length) return
            setScheduleByWeek((prev) => mergeScheduleWeek(prev, week, rows))
          } catch {
            scheduleWeeksLoaded.current.delete(week)
          }
        }),
      )
      if (!cancelled) setScheduleReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [matchupsByWeek])

  const view = useMemo(
    () =>
      computeFrankieZoneView({
        teams,
        matchupsByWeek,
        scheduleByWeek,
        completedThroughWeek,
        selectedWeek,
        weekInProgress,
        players,
        nflWeekGames,
        playoffWeekStart,
      }),
    [
      teams,
      matchupsByWeek,
      scheduleByWeek,
      completedThroughWeek,
      selectedWeek,
      weekInProgress,
      players,
      nflWeekGames,
      playoffWeekStart,
    ],
  )

  const indexBySlideId = useMemo(() => {
    const map = new Map<string, number>()
    slides.forEach((s, i) => map.set(s.id, i))
    return map
  }, [slides])

  const openSlide = useCallback(
    (index: number) => {
      setLightboxIndex(index)
      const slide = slides[index]
      onSlideUrlChange?.(slide?.id ?? null)
    },
    [slides, onSlideUrlChange],
  )
  const closeSlide = useCallback(() => {
    setLightboxIndex(null)
    onSlideUrlChange?.(null)
  }, [onSlideUrlChange])

  useEffect(() => {
    if (!initialSlideId) return
    const idx = indexBySlideId.get(initialSlideId)
    if (idx != null) setLightboxIndex(idx)
  }, [initialSlideId, indexBySlideId])

  const recapTitles = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of recapsData.recaps) {
      map.set(r.id, r.title)
    }
    return map
  }, [])

  return (
    <div id="frankie-zone-section" className="space-y-8">
      {view.weekInProgressNote ? (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {view.weekInProgressNote}
        </p>
      ) : (
        deferralNote && (
          <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
            {deferralNote}
          </p>
        )
      )}
      <header className="text-center">
        <h2 className="font-['Anton'] text-4xl uppercase leading-tight text-[var(--gwb-accent)] sm:text-5xl">
          {view.heroTitle}
        </h2>
        <p className="mt-2 font-['Bebas Neue'] text-lg tracking-[0.12em] text-[var(--gwb-text)] sm:text-xl">
          {view.censusLine}
        </p>
      </header>

      {view.isEmpty ? (
        <div className="rounded-xl border border-dashed border-[var(--gwb-border)] p-8 text-center">
          <p className="font-['Bebas Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]">
            ZONE EMPTY · FRANKIE&apos;S 0-{FRANKIE_ZONE_RECORD.lossesWithoutWin} RECORD STANDS
          </p>
        </div>
      ) : (
        <>
          <section aria-labelledby="fz-census-heading">
            <h3
              id="fz-census-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
            >
              Zone census
            </h3>
            <ul className="space-y-3" role="list">
              {view.residents.map((r) => (
                <li
                  key={r.rosterId}
                  className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold">
                        {managerNickname(r.rosterId, r.displayName)}
                      </p>
                      <p className="text-sm text-[var(--gwb-muted)]">
                        {r.teamName}
                        <span className="ml-1 text-xs" title={`Sleeper: ${r.displayName}`}>
                          (@{r.displayName})
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Bebas Neue'] text-2xl text-red-300">
                        {r.record}
                      </p>
                      <p className="text-xs text-[var(--gwb-muted)]">
                        {r.pointsFor.toFixed(2)} PF
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {(!scheduleReady ||
            view.collisions.length > 0 ||
            view.moreCollisionsCount > 0) && (
            <section aria-labelledby="fz-collisions-heading">
              <h3
                id="fz-collisions-heading"
                className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]"
              >
                Collisions
              </h3>
              {!scheduleReady ? (
                <p
                  className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-sm text-[var(--gwb-muted)]"
                  data-schedule-loading
                >
                  Loading season schedule for collision watch…
                </p>
              ) : view.collisions.length > 0 ? (
                <>
                  <ul className="space-y-3" role="list">
                    {view.collisions.map((c) => (
                      <li key={`${c.week}-${c.rosterA}-${c.rosterB}`}>
                        <CollisionCard collision={c} />
                      </li>
                    ))}
                  </ul>
                  {view.moreCollisionsCount > 0 && (
                    <p className="mt-2 text-xs text-[var(--gwb-muted)]">
                      +{view.moreCollisionsCount} more zone-vs-zone games this season
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-[var(--gwb-muted)]">
                  No head-to-head collisions scheduled between current residents.
                </p>
              )}
            </section>
          )}

          <section aria-labelledby="fz-residents-heading">
            <h3
              id="fz-residents-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
            >
              You are here
            </h3>
            <ul className="space-y-6" role="list">
              {view.residents.map((r) => (
                <li
                  key={r.rosterId}
                  className="rounded-xl border border-[var(--gwb-border)] bg-[#0d1319] p-4"
                >
                  <p className="font-medium">
                    {managerNickname(r.rosterId, r.displayName)} · {r.teamName}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-300">
                    {pathStatusLine(r.losses, Boolean(r.nextOpponent))}
                  </p>
                  <div className="mt-3">
                    <PathTracker losses={r.losses} />
                  </div>
                  <p className="mt-3 text-sm text-[var(--gwb-muted)]">
                    {renameMeterLabel(r.losses)}
                  </p>
                  {r.nextOpponent && (
                    <div className="mt-4 rounded-lg border border-teal-900/50 bg-teal-950/20 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
                        Up next · Week {r.nextOpponent.week}
                      </p>
                      <p className="mt-1 font-medium">
                        {managerNickname(
                          r.nextOpponent.rosterId,
                          r.nextOpponent.displayName,
                        )}{' '}
                        <span className="text-[var(--gwb-muted)]">
                          ({r.nextOpponent.record})
                        </span>
                      </p>
                      <p className="text-sm text-[var(--gwb-muted)]">
                        {r.nextOpponent.teamName}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {view.escapes.length > 0 && (
        <section aria-labelledby="fz-escape-heading">
          <h3
            id="fz-escape-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
          >
            Escape log
          </h3>
          <ul className="space-y-2 text-sm" role="list">
            {view.escapes.map((e) => (
              <li
                key={`${e.rosterId}-${e.week}`}
                className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2"
              >
                {e.line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!view.isEmpty && (
      <>
      <section aria-labelledby="fz-slides-heading">
        <h3
          id="fz-slides-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
        >
          Slides
        </h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="list">
          {slides.map((slide, i) => {
            const jpg = slideAssetUrl(slide.basename, 'thumb', 'jpg')
            return (
              <li key={slide.id}>
                <button
                  type="button"
                  className="group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)]"
                  onClick={() => openSlide(i)}
                  aria-label={`Open ${slide.title}`}
                >
                  <img
                    src={jpg}
                    alt=""
                    width={THUMB_WIDTH}
                    height={THUMB_HEIGHT}
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                    data-fz-slide-thumb={slide.id}
                    className="aspect-[4/5] w-full bg-[#0d1319] object-cover"
                  />
                  <p className="truncate px-2 py-1.5 text-xs text-[var(--gwb-muted)]">
                    {slide.title}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="fz-lore-heading">
        <h3
          id="fz-lore-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
        >
          Zone lore
        </h3>
        <ol className="space-y-3 border-l border-[var(--gwb-border)] pl-4">
          {ZONE_LORE_QUOTES.map((q) => (
            <li key={`${q.recapId}-${q.quote}`} className="relative">
              <span
                className="absolute -left-[1.125rem] top-2 h-2 w-2 rounded-full bg-[var(--gwb-accent)]"
                aria-hidden
              />
              <button
                type="button"
                className="w-full rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-left transition hover:border-[var(--gwb-accent)]"
                onClick={() => onOpenRecap(q.week, q.recapId)}
              >
                <p className="text-sm leading-snug">&ldquo;{q.quote}&rdquo;</p>
                <p className="mt-2 text-xs text-[var(--gwb-muted)]">
                  Week {q.week}
                  {recapTitles.get(q.recapId)
                    ? ` · ${recapTitles.get(q.recapId)}`
                    : ''}
                </p>
              </button>
            </li>
          ))}
        </ol>
      </section>
      </>
      )}

      {lightboxIndex !== null && (
        <SlideLightbox
          slides={slides}
          index={lightboxIndex}
          onClose={closeSlide}
          onIndexChange={(idx) => {
            setLightboxIndex(idx)
            onSlideUrlChange?.(slides[idx]?.id ?? null)
          }}
        />
      )}
    </div>
  )
}

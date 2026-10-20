import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getWeekGraphicsSections,
  getWeekGraphicsSlides,
  weekGraphicsEmptyMessage,
} from '../lib/weekGraphics'
import { getWeeklyReport, weeklyReportEmptyMessage } from '../lib/weeklyReport'
import type { PublishedSlide } from '../lib/publishedSlides'
import { slideAssetUrl } from '../lib/publishedSlides'
import type { TeamInfo } from '../lib/types'
import { ShareCardButton } from './ShareCardButton'
import { SlideLightbox } from './SlideLightbox'
import { WeeklyReportDeck } from './WeeklyReportDeck'

const THUMB_WIDTH = 540
const THUMB_HEIGHT = 675

function EmptyNotice({
  message,
  week,
  latestWeek,
  onSelectWeek,
}: {
  message: string
  week: number
  latestWeek?: number | null
  onSelectWeek?: (week: number) => void
}) {
  const showLink =
    latestWeek != null && latestWeek !== week && onSelectWeek != null
  return (
    <p className="rounded-xl border border-dashed border-[var(--dyn-border)] p-6 text-center text-[var(--dyn-muted)]">
      {message}
      {showLink && (
        <>
          {' '}
          <button
            type="button"
            className="font-semibold text-[var(--dyn-accent)] underline decoration-[var(--dyn-accent)]/60 underline-offset-2"
            onClick={() => onSelectWeek(latestWeek)}
          >
            View Week {latestWeek}
          </button>
        </>
      )}
    </p>
  )
}

function GraphicThumb({
  slide,
  onOpen,
  loadImmediately,
  buttonRef,
}: {
  slide: PublishedSlide
  onOpen: () => void
  loadImmediately: boolean
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}) {
  const jpg = slideAssetUrl(slide.basename, 'thumb', 'jpg')
  const rootRef = useRef<HTMLButtonElement | null>(null)
  const [inView, setInView] = useState(loadImmediately)

  useEffect(() => {
    if (loadImmediately || inView) return
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '240px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadImmediately, inView])

  const showImage = loadImmediately || inView

  return (
    <button
      ref={(el) => {
        rootRef.current = el
        if (buttonRef && 'current' in buttonRef) buttonRef.current = el
      }}
      type="button"
      className="group block w-full shrink-0 overflow-hidden rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] text-left transition hover:border-[var(--dyn-accent)]"
      onClick={onOpen}
      aria-label={`Open ${slide.title}`}
    >
      {showImage ? (
        <img
          src={jpg}
          alt=""
          width={THUMB_WIDTH}
          height={THUMB_HEIGHT}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full bg-[var(--dyn-bg)] object-cover object-top"
        />
      ) : (
        <div
          className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 bg-[var(--dyn-surface)] px-3 text-center"
          aria-hidden
        >
          <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[var(--dyn-border)] border-t-[var(--dyn-accent)]" />
          <p className="line-clamp-3 text-[10px] font-medium leading-snug text-[var(--dyn-muted)]">
            {slide.title}
          </p>
        </div>
      )}
      <p className="truncate px-2 py-1.5 text-xs text-[var(--dyn-muted)]">
        {slide.title}
      </p>
    </button>
  )
}

export function DynastyWeekGraphicsPanel({
  season,
  week,
  weekComplete = false,
  teams,
  initialSlideId,
  latestContentWeek = null,
  onSelectWeek,
}: {
  season: string
  week: number
  weekComplete?: boolean
  teams?: Map<number, TeamInfo>
  initialSlideId?: string | null
  /** Latest week with cards or a report. Empty weeks link here. */
  latestContentWeek?: number | null
  onSelectWeek?: (week: number) => void
}) {
  const sections = useMemo(
    () => getWeekGraphicsSections(season, week),
    [season, week],
  )
  const weekSlides = useMemo(
    () => getWeekGraphicsSlides(season, week),
    [season, week],
  )
  const report = useMemo(
    () => (weekComplete ? getWeeklyReport(season, week) : null),
    [season, week, weekComplete],
  )
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openButtonRef = useRef<HTMLButtonElement | null>(null)

  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    weekSlides.forEach((s, i) => map.set(s.id, i))
    return map
  }, [weekSlides])

  const open = useCallback(
    (indexInWeek: number) => {
      setLightboxIndex(indexInWeek)
    },
    [],
  )

  const close = useCallback(() => {
    setLightboxIndex(null)
  }, [])

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

  return (
    <div className="space-y-6" id="week-graphics-panel">
      {sections.length > 0 && (
        <p className="text-sm text-[var(--dyn-muted)]">
          Week {week} feed graphics (1080×1350). Tap a card for full size.
        </p>
      )}

      {!sections.length && (
        <EmptyNotice
          message={weekGraphicsEmptyMessage(week)}
          week={week}
          latestWeek={latestContentWeek}
          onSelectWeek={onSelectWeek}
        />
      )}

      <div className="flex flex-col gap-8">
        {sections.map((section, sectionIndex) => (
          <section
            key={`${section.kind}-${section.previewWeek ?? week}`}
            id={`graphics-week-${week}-${section.kind}${section.previewWeek ? `-preview-${section.previewWeek}` : ''}`}
            aria-labelledby={`graphics-heading-${week}-${section.kind}${section.previewWeek ? `-preview-${section.previewWeek}` : ''}`}
          >
            <h3
              id={`graphics-heading-${week}-${section.kind}${section.previewWeek ? `-preview-${section.previewWeek}` : ''}`}
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--dyn-accent)]"
            >
              {section.heading}
            </h3>
            {section.kind === 'matchups' && (
              <p className="mb-4 text-xs text-[var(--dyn-muted)]">
                {section.previewWeek
                  ? `Week ${section.previewWeek} pairing graphics — neutral preview, no winner marked.`
                  : 'Neutral preview — no winner marked.'}
              </p>
            )}
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
              {section.slides.map((slide) => {
                const indexInWeek = indexById.get(slide.id) ?? 0
                const isDeepLinkTarget = initialSlideId === slide.id
                const loadImmediately =
                  isDeepLinkTarget || sectionIndex === 0
                return (
                  <li key={slide.id} className="flex min-w-0 flex-col gap-2">
                    <GraphicThumb
                      slide={slide}
                      onOpen={() => open(indexInWeek)}
                      loadImmediately={loadImmediately}
                      buttonRef={isDeepLinkTarget ? openButtonRef : undefined}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <ShareCardButton basename={slide.basename} title={slide.title} />
                      <button
                        type="button"
                        className="min-h-11 w-full rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-2 text-xs font-semibold text-[var(--dyn-accent)]"
                        onClick={() => copySlideLink(slide)}
                      >
                        Copy link
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      {(report || season === '2026') && (
      <section aria-labelledby={`graphics-report-${week}`}>
        <h3
          id={`graphics-report-${week}`}
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--dyn-accent)]"
        >
          Report
        </h3>
        {report && teams ? (
          <WeeklyReportDeck report={report} teams={teams} />
        ) : (
          <EmptyNotice
            message={weeklyReportEmptyMessage(week)}
            week={week}
            latestWeek={latestContentWeek}
            onSelectWeek={onSelectWeek}
          />
        )}
      </section>
      )}

      {lightboxIndex !== null && (
        <SlideLightbox
          slides={weekSlides}
          index={lightboxIndex}
          onClose={close}
          onIndexChange={setLightboxIndex}
          returnFocusRef={openButtonRef}
        />
      )}
    </div>
  )
}

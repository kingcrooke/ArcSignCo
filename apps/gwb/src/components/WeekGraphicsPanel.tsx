import { useCallback, useMemo, useState } from 'react'
import {
  getWeekGraphicsSections,
  getWeekGraphicsSlides,
} from '../lib/weekGraphics'
import type { PublishedSlide } from '../lib/publishedSlides'
import { slideAssetUrl } from '../lib/publishedSlides'
import { SlideLightbox } from './SlideLightbox'

const THUMB_WIDTH = 540
const THUMB_HEIGHT = 675

function GraphicThumb({
  slide,
  indexInWeek,
  onOpen,
  eager,
}: {
  slide: PublishedSlide
  indexInWeek: number
  onOpen: (indexInWeek: number) => void
  eager: boolean
}) {
  const webp = slideAssetUrl(slide.basename, 'thumb', 'webp')
  const jpg = slideAssetUrl(slide.basename, 'thumb', 'jpg')

  return (
    <button
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
    </button>
  )
}

export function WeekGraphicsPanel({ week }: { week: number }) {
  const sections = useMemo(() => getWeekGraphicsSections(week), [week])
  const weekSlides = useMemo(() => getWeekGraphicsSlides(week), [week])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    weekSlides.forEach((s, i) => map.set(s.id, i))
    return map
  }, [weekSlides])

  const open = useCallback(
    (indexInWeek: number) => setLightboxIndex(indexInWeek),
    [],
  )
  const close = useCallback(() => setLightboxIndex(null), [])

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
        viewer to move through this week only.
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
                return (
                  <li key={slide.id}>
                    <GraphicThumb
                      slide={slide}
                      indexInWeek={indexInWeek}
                      onOpen={open}
                      eager={i < 4 && section.kind === sections[0]?.kind}
                    />
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
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  )
}

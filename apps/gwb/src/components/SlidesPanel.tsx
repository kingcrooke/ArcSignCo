import { useCallback, useState } from 'react'
import {
  ALL_PUBLISHED_SLIDES,
  SLIDE_GROUPS,
  type PublishedSlide,
  slideAssetUrl,
} from '../lib/publishedSlides'
import { SlideLightbox } from './SlideLightbox'

const THUMB_WIDTH = 540
const THUMB_HEIGHT = 675

function SlideThumb({
  slide,
  index,
  globalIndex,
  onOpen,
}: {
  slide: PublishedSlide
  index: number
  globalIndex: number
  onOpen: (globalIndex: number) => void
}) {
  const webp = slideAssetUrl(slide.basename, 'thumb', 'webp')
  const jpg = slideAssetUrl(slide.basename, 'thumb', 'jpg')
  const eager = globalIndex < 8

  return (
    <button
      type="button"
      className="group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]"
      onClick={() => onOpen(globalIndex)}
      aria-label={`Open ${slide.title}, slide ${index + 1}`}
    >
      <img
        src={jpg}
        srcSet={`${webp} ${THUMB_WIDTH}w`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        alt=""
        width={THUMB_WIDTH}
        height={THUMB_HEIGHT}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="aspect-[4/5] w-full bg-[#0d1319] object-cover transition group-hover:opacity-95"
      />
      <span className="sr-only">{slide.title}</span>
    </button>
  )
}

export function SlidesPanel() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = useCallback((globalIndex: number) => {
    setLightboxIndex(globalIndex)
  }, [])

  const close = useCallback(() => setLightboxIndex(null), [])

  return (
    <div className="space-y-10">
      <p className="text-sm text-[var(--gwb-muted)]">
        Tap a slide for full size. Use arrow keys in the viewer; swipe on mobile.
      </p>

      {SLIDE_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`slides-${group.id}`}>
          <h3
            id={`slides-${group.id}`}
            className="mb-4 font-['Anton'] text-2xl uppercase tracking-wide text-[var(--gwb-accent)] sm:text-3xl"
          >
            {group.heading}
          </h3>
          <ul
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
            role="list"
          >
            {group.slides.map((slide, i) => {
              const globalIndex = ALL_PUBLISHED_SLIDES.findIndex(
                (s) => s.id === slide.id,
              )
              return (
                <li key={slide.id}>
                  <SlideThumb
                    slide={slide}
                    index={i}
                    globalIndex={globalIndex}
                    onOpen={open}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {lightboxIndex !== null && (
        <SlideLightbox
          slides={ALL_PUBLISHED_SLIDES}
          index={lightboxIndex}
          onClose={close}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  )
}

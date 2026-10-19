import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type TouchEvent,
} from 'react'
import type { PublishedSlide } from '../lib/publishedSlides'
import { slideAssetUrl } from '../lib/publishedSlides'
import { ShareCardButton } from './ShareCardButton'

type Props = {
  slides: PublishedSlide[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const SWIPE_THRESHOLD_PX = 48

export function SlideLightbox({
  slides,
  index,
  onClose,
  onIndexChange,
  returnFocusRef,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const touchStartX = useRef<number | null>(null)
  const [imageReady, setImageReady] = useState(false)
  const slide = slides[index]

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1)
  }, [index, onIndexChange])

  const goNext = useCallback(() => {
    if (index < slides.length - 1) onIndexChange(index + 1)
  }, [index, onIndexChange, slides.length])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      returnFocusRef?.current?.focus()
    }
  }, [returnFocusRef])

  useEffect(() => {
    setImageReady(false)
  }, [slide?.basename])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goPrev, goNext])

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current
    const end = e.changedTouches[0]?.clientX
    touchStartX.current = null
    if (start == null || end == null) return
    const delta = end - start
    if (delta > SWIPE_THRESHOLD_PX) goPrev()
    else if (delta < -SWIPE_THRESHOLD_PX) goNext()
  }

  if (!slide) return null

  const webp = slideAssetUrl(slide.basename, 'full', 'webp')
  const jpg = slideAssetUrl(slide.basename, 'full', 'jpg')

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.title}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="truncate text-sm text-white/80">
          {index + 1} / {slides.length} · {slide.title}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <ShareCardButton
            basename={slide.basename}
            title={slide.title}
            className="border-white/20 bg-transparent text-[var(--dyn-accent-bright)]"
          />
          <button
            type="button"
            className="min-h-11 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 sm:px-20">
        <button
          type="button"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white disabled:opacity-30"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <img
          ref={imgRef}
          key={slide.basename}
          src={jpg}
          srcSet={`${webp} 1080w`}
          alt={slide.title}
          width={slide.width}
          height={slide.height}
          className={`max-h-[min(78dvh,900px)] w-auto max-w-full object-contain ${
            imageReady ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageReady(true)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white disabled:opacity-30"
          onClick={goNext}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  )
}

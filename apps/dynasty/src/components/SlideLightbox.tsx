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
import { fetchFullSlideBlob } from '../lib/shareSlide'

type Props = {
  slides: PublishedSlide[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const SWIPE_THRESHOLD_PX = 48
const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

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
  const [saveState, setSaveState] = useState<'idle' | 'busy' | 'done' | 'error'>(
    'idle',
  )
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
    setSaveState('idle')
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
      } else if (e.key === 'Tab' && dialogRef.current) {
        const nodes = [
          ...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ].filter((el) => !el.hasAttribute('disabled'))
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
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

  const markReady = useCallback(async () => {
    const img = imgRef.current
    if (!img) return
    try {
      if (typeof img.decode === 'function') await img.decode()
    } catch {
      /* decode can fail on some browsers; onload still fired */
    }
    if (img.naturalWidth > 0) setImageReady(true)
  }, [])

  const saveOrShare = useCallback(async () => {
    if (!slide) return
    setSaveState('busy')
    try {
      const blob = await fetchFullSlideBlob(slide.basename)
      const file = new File([blob], `${slide.basename}.jpg`, {
        type: blob.type || 'image/jpeg',
      })
      const canShare =
        typeof navigator.share === 'function' &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))

      if (canShare) {
        await navigator.share({
          files: [file],
          title: slide.title,
        })
        setSaveState('done')
        return
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slide.basename}.jpg`
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setSaveState('done')
    } catch {
      setSaveState('error')
    }
  }, [slide])

  if (!slide) return null

  const webp = slideAssetUrl(slide.basename, 'full', 'webp')
  const jpg = slideAssetUrl(slide.basename, 'full', 'jpg')

  const saveLabel =
    saveState === 'busy'
      ? 'Saving…'
      : saveState === 'done'
        ? 'Saved'
        : saveState === 'error'
          ? 'Try again'
          : 'Save image'

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
      <div className="flex shrink-0 flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
        <p className="text-sm text-white/80">
          <span className="block sm:inline">
            {index + 1} / {slides.length}
          </span>
          <span className="mt-0.5 block truncate sm:mt-0 sm:inline">
            <span className="hidden sm:inline"> · </span>
            {slide.title}
          </span>
        </p>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            className="min-h-11 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)] disabled:opacity-50"
            onClick={() => void saveOrShare()}
            disabled={saveState === 'busy'}
            aria-label="Save or share full size slide image"
          >
            {saveLabel}
          </button>
          <button
            type="button"
            className="min-h-11 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]"
            onClick={onClose}
            aria-label="Close slide viewer"
          >
            Close
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 pt-2 sm:px-20">
        <button
          type="button"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:left-4"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="relative z-10 flex max-h-[min(78dvh,900px)] w-full max-w-[min(100%,720px)] items-center justify-center">
          {!imageReady && (
            <div
              className="absolute inset-0 flex items-center justify-center text-sm text-white/50"
              aria-hidden="true"
            >
              Loading slide…
            </div>
          )}
          <img
            ref={imgRef}
            key={slide.basename}
            src={jpg}
            srcSet={`${webp} 1080w`}
            sizes="(max-width: 720px) 100vw, 720px"
            alt={slide.title}
            width={slide.width}
            height={slide.height}
            decoding="async"
            fetchPriority="high"
            className={`block max-h-[min(78dvh,900px)] w-auto max-w-full object-contain transition-opacity duration-150 ${
              imageReady ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
            onLoad={() => {
              void markReady()
            }}
            onError={(e) => {
              const img = e.currentTarget
              if (img.src.endsWith('.jpg')) return
              img.removeAttribute('srcset')
              img.src = jpg
            }}
          />
        </div>

        <button
          type="button"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:right-4"
          onClick={goNext}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  )
}

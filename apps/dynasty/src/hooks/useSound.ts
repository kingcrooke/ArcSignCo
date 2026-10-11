import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppTab } from './useUrlState'

const STORAGE_KEY = 'dynasty-sound'

export function audioSrc(file: string, base = import.meta.env.BASE_URL): string {
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}audio/${file.replace(/^\//, '')}`
}

/** Filenames for tab beds — must exist under `public/audio/` (see AUDIO_CREDITS.md). */
export const TAB_LOOP_FILES: Record<AppTab, string> = {
  standings: 'loop-standings.mp3',
  live: 'loop-live.mp3',
  drafts: 'loop-drafts.mp3',
  gallery: 'loop-gallery.mp3',
  waiver: 'loop-waiver.mp3',
  bestgames: 'loop-bestgames.mp3',
  trades: 'loop-trades.mp3',
  awards: 'loop-awards.mp3',
  managers: 'loop-managers.mp3',
}

const TAB_LOOPS: Record<AppTab, string> = Object.fromEntries(
  Object.entries(TAB_LOOP_FILES).map(([tab, file]) => [tab, audioSrc(file)]),
) as Record<AppTab, string>

const CLICK_SRC = audioSrc('click.mp3')

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off'
  } catch {
    return false
  }
}

function srcMatches(audio: HTMLAudioElement, src: string): boolean {
  const file = src.slice(src.lastIndexOf('/') + 1)
  return audio.src.endsWith(`/${file}`) || audio.src.endsWith(file)
}

export function useSound() {
  const [armed, setArmed] = useState(() => !readMuted())
  const [unlocked, setUnlocked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const bedRef = useRef<HTMLAudioElement | null>(null)
  const stingerRef = useRef<HTMLAudioElement | null>(null)
  const pendingSrcRef = useRef(TAB_LOOPS.standings)
  const armedRef = useRef(armed)
  const unlockedRef = useRef(unlocked)
  armedRef.current = armed
  unlockedRef.current = unlocked

  const ensureAudio = useCallback(() => {
    if (!bedRef.current) {
      bedRef.current = new Audio()
      bedRef.current.preload = 'none'
      bedRef.current.loop = true
      bedRef.current.volume = 0.55
      bedRef.current.addEventListener('playing', () => setPlaying(true))
      bedRef.current.addEventListener('pause', () => setPlaying(false))
    }
    if (!stingerRef.current) {
      stingerRef.current = new Audio()
      stingerRef.current.preload = 'none'
      stingerRef.current.volume = 0.5
    }
    return { bed: bedRef.current, stinger: stingerRef.current }
  }, [])

  const stopAll = useCallback(() => {
    const bed = bedRef.current
    if (bed) {
      bed.pause()
      bed.removeAttribute('src')
      bed.load()
    }
    setPlaying(false)
  }, [])

  const playBedNow = useCallback(() => {
    if (!armedRef.current) return
    const { bed } = ensureAudio()
    const src = pendingSrcRef.current
    if (!srcMatches(bed, src)) bed.src = src
    const attempt = bed.play()
    void attempt.then(
      () => {
        unlockedRef.current = true
        setUnlocked(true)
        setPlaying(true)
      },
      () => {
        if (!bedRef.current || bedRef.current.paused) {
          unlockedRef.current = false
          setUnlocked(false)
        }
      },
    )
  }, [ensureAudio])

  const playLoop = useCallback(
    (src: string) => {
      if (!armedRef.current) return
      pendingSrcRef.current = src
      if (!unlockedRef.current) return
      playBedNow()
    },
    [playBedNow],
  )

  const unlock = useCallback(() => {
    const next = !armedRef.current
    setArmed(next)
    armedRef.current = next
    try {
      if (next) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, 'off')
      }
    } catch {
      /* ignore */
    }
    if (next) {
      playBedNow()
    } else {
      unlockedRef.current = false
      setUnlocked(false)
      stopAll()
    }
  }, [playBedNow, stopAll])

  const setTabBed = useCallback(
    (tab: AppTab) => {
      playLoop(TAB_LOOPS[tab])
    },
    [playLoop],
  )

  const playStinger = useCallback(
    (src: string) => {
      if (!armedRef.current || !unlockedRef.current) return
      const { stinger } = ensureAudio()
      stinger.src = src
      const attempt = stinger.play()
      void attempt.catch(() => {})
    },
    [ensureAudio],
  )

  const playClick = useCallback(() => {
    playStinger(CLICK_SRC)
  }, [playStinger])

  useEffect(() => {
    if (!armed) {
      stopAll()
      unlockedRef.current = false
      setUnlocked(false)
    }
  }, [armed, stopAll])

  useEffect(() => {
    if (!armed || unlocked) return

    const onGesture = () => {
      if (!armedRef.current || unlockedRef.current) return
      const { bed } = ensureAudio()
      const src = pendingSrcRef.current
      if (!srcMatches(bed, src)) bed.src = src
      const attempt = bed.play()
      void attempt.then(
        () => {
          unlockedRef.current = true
          setUnlocked(true)
          setPlaying(true)
        },
        () => {
          if (!bedRef.current || bedRef.current.paused) {
            unlockedRef.current = false
            setUnlocked(false)
          }
        },
      )
    }

    const opts: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener('pointerdown', onGesture, opts)
    window.addEventListener('keydown', onGesture, opts)
    window.addEventListener('touchstart', onGesture, opts)
    window.addEventListener('click', onGesture, opts)

    return () => {
      window.removeEventListener('pointerdown', onGesture, opts)
      window.removeEventListener('keydown', onGesture, opts)
      window.removeEventListener('touchstart', onGesture, opts)
      window.removeEventListener('click', onGesture, opts)
    }
  }, [armed, unlocked, ensureAudio])

  const showTapHint = armed && !playing

  return {
    armed,
    unlock,
    setTabBed,
    playClick,
    label: armed ? 'Sound on' : 'Sound off',
    pressed: armed,
    showTapHint,
  }
}

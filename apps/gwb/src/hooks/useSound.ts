import { useCallback, useEffect, useRef, useState } from 'react'
import type { GraphicsSectionKind } from '../lib/weekGraphics'

const STORAGE_KEY = 'gwb-sound'

/** `/gwb-fe006a16/audio/<file>` — BASE_URL may or may not end with a slash. */
export function audioSrc(file: string, base = import.meta.env.BASE_URL): string {
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}audio/${file.replace(/^\//, '')}`
}

type TabSound = 'standings' | 'gallery' | 'recaps' | 'mulligans' | 'frankie'

const TAB_LOOPS: Record<TabSound, string> = {
  standings: audioSrc('impact-loop.mp3'),
  gallery: audioSrc('impact-loop.mp3'),
  recaps: audioSrc('impact-loop.mp3'),
  mulligans: audioSrc('monkeys-loop.mp3'),
  frankie: audioSrc('sneaky-loop.mp3'),
}

const DECK_LOOPS: Record<GraphicsSectionKind, string> = {
  matchups: audioSrc('sneaky-loop.mp3'),
  results: audioSrc('impact-loop.mp3'),
  report: audioSrc('volatile-loop.mp3'),
}

const CLICK_SRC = audioSrc('click.mp3')
const BUZZER_SRC = audioSrc('buzzer.mp3')

/** Sound is on unless the user explicitly muted (`gwb-sound=off`). */
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
      bedRef.current.loop = true
      bedRef.current.volume = 0.35
      bedRef.current.addEventListener('playing', () => setPlaying(true))
      bedRef.current.addEventListener('pause', () => setPlaying(false))
    }
    if (!stingerRef.current) {
      stingerRef.current = new Audio()
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

  /**
   * Start the bed in the current turn. `play()` is called here, not after an
   * await, so a user-gesture caller keeps the activation.
   */
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

  const onUserGesture = useCallback(() => {
    if (!armedRef.current || unlockedRef.current) return
    playBedNow()
  }, [playBedNow])

  const setTabBed = useCallback(
    (tab: TabSound) => {
      playLoop(TAB_LOOPS[tab])
    },
    [playLoop],
  )

  const setDeckBed = useCallback(
    (kind: GraphicsSectionKind | null) => {
      if (!kind) {
        setTabBed('gallery')
        return
      }
      playLoop(DECK_LOOPS[kind])
    },
    [playLoop, setTabBed],
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

  const playBuzzer = useCallback(() => {
    playStinger(BUZZER_SRC)
  }, [playStinger])

  useEffect(() => {
    if (!armed) {
      stopAll()
      unlockedRef.current = false
      setUnlocked(false)
    }
  }, [armed, stopAll])

  useEffect(() => {
    if (!armedRef.current) return
    ensureAudio()
    pendingSrcRef.current = TAB_LOOPS.standings
    const bed = bedRef.current
    if (bed && !bed.src) bed.src = TAB_LOOPS.standings
    playBedNow()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- once on mount

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
    onUserGesture,
    setTabBed,
    setDeckBed,
    playClick,
    playBuzzer,
    label: armed ? 'Sound on' : 'Sound off',
    pressed: armed,
    showTapHint,
  }
}

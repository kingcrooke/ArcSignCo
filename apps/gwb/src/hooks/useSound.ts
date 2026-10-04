import { useCallback, useEffect, useRef, useState } from 'react'
import type { GraphicsSectionKind } from '../lib/weekGraphics'

const STORAGE_KEY = 'gwb-sound'
const BASE = `${import.meta.env.BASE_URL}audio`

type TabSound =
  | 'standings'
  | 'gallery'
  | 'recaps'
  | 'mulligans'
  | 'frankie'
  | 'waiver'

const TAB_LOOPS: Record<TabSound, string> = {
  standings: `${BASE}impact-loop.mp3`,
  gallery: `${BASE}impact-loop.mp3`,
  recaps: `${BASE}impact-loop.mp3`,
  mulligans: `${BASE}monkeys-loop.mp3`,
  frankie: `${BASE}sneaky-loop.mp3`,
  waiver: `${BASE}volatile-loop.mp3`,
}

const DECK_LOOPS: Record<GraphicsSectionKind, string> = {
  matchups: `${BASE}sneaky-loop.mp3`,
  results: `${BASE}impact-loop.mp3`,
  report: `${BASE}volatile-loop.mp3`,
}

/** Sound is on unless the user explicitly muted (`gwb-sound=off`). */
function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off'
  } catch {
    return false
  }
}

export function useSound() {
  const [armed, setArmed] = useState(() => !readMuted())
  const [unlocked, setUnlocked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const bedRef = useRef<HTMLAudioElement | null>(null)
  const stingerRef = useRef<HTMLAudioElement | null>(null)
  const pendingSrcRef = useRef(TAB_LOOPS.standings)

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

  const tryPlayBed = useCallback(async () => {
    if (!armed) return false
    const { bed } = ensureAudio()
    const src = pendingSrcRef.current
    const file = src.split('/').pop() ?? src
    if (!bed.src || !bed.src.endsWith(file)) {
      bed.src = src
    }
    try {
      await bed.play()
      setUnlocked(true)
      setPlaying(true)
      return true
    } catch {
      return false
    }
  }, [armed, ensureAudio])

  const playLoop = useCallback(
    (src: string) => {
      if (!armed) return
      pendingSrcRef.current = src
      if (!unlocked) return
      void tryPlayBed()
    },
    [armed, unlocked, tryPlayBed],
  )

  const unlock = useCallback(() => {
    const next = !armed
    setArmed(next)
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
      ensureAudio()
      void tryPlayBed()
    } else {
      setUnlocked(false)
      stopAll()
    }
  }, [armed, ensureAudio, stopAll, tryPlayBed])

  const onUserGesture = useCallback(() => {
    if (!armed || unlocked) return
    ensureAudio()
    void tryPlayBed()
  }, [armed, unlocked, ensureAudio, tryPlayBed])

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

  const playClick = useCallback(() => {
    if (!armed || !unlocked) return
    const { stinger } = ensureAudio()
    stinger.src = `${BASE}click.mp3`
    void stinger.play().catch(() => {})
  }, [armed, unlocked, ensureAudio])

  const playBuzzer = useCallback(() => {
    if (!armed || !unlocked) return
    const { stinger } = ensureAudio()
    stinger.src = `${BASE}buzzer.mp3`
    void stinger.play().catch(() => {})
  }, [armed, unlocked, ensureAudio])

  useEffect(() => {
    if (!armed) {
      stopAll()
      setUnlocked(false)
    }
  }, [armed, stopAll])

  useEffect(() => {
    if (!armed) return
    ensureAudio()
    pendingSrcRef.current = TAB_LOOPS.standings
    const bed = bedRef.current
    if (bed && !bed.src) {
      bed.src = TAB_LOOPS.standings
    }
    void tryPlayBed()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- once on mount

  useEffect(() => {
    if (!armed || unlocked) return

    const onGesture = () => {
      onUserGesture()
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
  }, [armed, unlocked, onUserGesture])

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

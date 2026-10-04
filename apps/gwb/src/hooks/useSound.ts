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

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

export function useSound() {
  const [armed, setArmed] = useState(() => readStored())
  const [sessionReady, setSessionReady] = useState(false)
  const bedRef = useRef<HTMLAudioElement | null>(null)
  const stingerRef = useRef<HTMLAudioElement | null>(null)

  const ensureAudio = useCallback(() => {
    if (!bedRef.current) {
      bedRef.current = new Audio()
      bedRef.current.loop = true
      bedRef.current.volume = 0.35
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
  }, [])

  const playLoop = useCallback(
    async (src: string) => {
      if (!armed || !sessionReady) return
      const { bed } = ensureAudio()
      if (bed.src.endsWith(src) && !bed.paused) return
      bed.src = src
      try {
        await bed.play()
      } catch {
        /* autoplay policy */
      }
    },
    [armed, sessionReady, ensureAudio],
  )

  const unlock = useCallback(() => {
    const next = !armed
    setArmed(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      /* ignore */
    }
    if (next) {
      ensureAudio()
      setSessionReady(true)
    } else {
      setSessionReady(false)
      stopAll()
    }
  }, [armed, ensureAudio, stopAll])

  const onUserGesture = useCallback(() => {
    if (!armed || sessionReady) return
    setSessionReady(true)
    ensureAudio()
  }, [armed, sessionReady, ensureAudio])

  const setTabBed = useCallback(
    (tab: TabSound) => {
      void playLoop(TAB_LOOPS[tab])
    },
    [playLoop],
  )

  const setDeckBed = useCallback(
    (kind: GraphicsSectionKind | null) => {
      if (!kind) {
        setTabBed('gallery')
        return
      }
      void playLoop(DECK_LOOPS[kind])
    },
    [playLoop, setTabBed],
  )

  const playClick = useCallback(() => {
    if (!armed || !sessionReady) return
    const { stinger } = ensureAudio()
    stinger.src = `${BASE}click.mp3`
    void stinger.play().catch(() => {})
  }, [armed, sessionReady, ensureAudio])

  const playBuzzer = useCallback(() => {
    if (!armed || !sessionReady) return
    const { stinger } = ensureAudio()
    stinger.src = `${BASE}buzzer.mp3`
    void stinger.play().catch(() => {})
  }, [armed, sessionReady, ensureAudio])

  useEffect(() => {
    if (!armed) {
      stopAll()
      setSessionReady(false)
    }
  }, [armed, stopAll])

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
  }
}

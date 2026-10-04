import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchMatchups } from '../lib/sleeperApi'
import type { SleeperMatchup } from '../lib/types'

const POLL_MS = 60_000

export function useLiveWeekPolling(
  week: number,
  enabled: boolean,
  initial: SleeperMatchup[] | undefined,
  onUpdated?: (week: number, rows: SleeperMatchup[]) => void,
): {
  matchups: SleeperMatchup[] | undefined
  lastUpdated: Date | null
  refreshing: boolean
  refresh: () => void
} {
  const [matchups, setMatchups] = useState<SleeperMatchup[] | undefined>(initial)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const visibleRef = useRef(true)

  useEffect(() => {
    setMatchups(initial)
  }, [week, initial])

  const pull = useCallback(async () => {
    if (!enabled) return
    setRefreshing(true)
    try {
      const rows = await fetchMatchups(week)
      if (rows?.length) {
        setMatchups(rows)
        setLastUpdated(new Date())
        onUpdated?.(week, rows)
      }
    } catch {
      /* keep last good data */
    } finally {
      setRefreshing(false)
    }
  }, [week, enabled, onUpdated])

  useEffect(() => {
    if (!enabled) return
    const onVis = () => {
      visibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVis)
    onVis()

    const id = window.setInterval(() => {
      if (visibleRef.current) pull()
    }, POLL_MS)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(id)
    }
  }, [enabled, pull])

  useEffect(() => {
    if (!enabled) return
    pull()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial fetch when week/tab enables
  }, [week, enabled])

  return { matchups, lastUpdated, refreshing, refresh: pull }
}

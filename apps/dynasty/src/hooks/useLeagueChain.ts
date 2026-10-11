import { useCallback, useEffect, useMemo, useState } from 'react'
import { CURRENT_LEAGUE_ID } from '../lib/constants'
import { buildLeagueSeasonSummaries } from '../lib/managerSeasons'
import {
  buildTradeLogEntry,
  mergeTradeLogs,
  type TradeLogEntry,
} from '../lib/trades'
import { loadPlayersMap } from '../lib/playersCache'
import { fetchTradeHistoryChain } from '../lib/sleeperApi'
import type { LeagueSeasonSummary } from '../lib/managerSeasons'

export function useLeagueChain(startLeagueId = CURRENT_LEAGUE_ID) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [priorSeasonsFailed, setPriorSeasonsFailed] = useState(false)
  const [summaries, setSummaries] = useState<LeagueSeasonSummary[]>([])
  const [allTrades, setAllTrades] = useState<TradeLogEntry[]>([])

  const load = useCallback(async () => {
    setState('loading')
    try {
      const players = await loadPlayersMap()
      const { bundles, priorSeasonsFailed: failed } =
        await fetchTradeHistoryChain(startLeagueId)
      setPriorSeasonsFailed(failed)
      setSummaries(buildLeagueSeasonSummaries(bundles))
      const entries: TradeLogEntry[] = []
      for (const bundle of bundles) {
        for (const tx of bundle.transactions) {
          const entry = buildTradeLogEntry(
            tx,
            bundle.league,
            bundle.teams,
            players,
          )
          if (entry) entries.push(entry)
        }
      }
      setAllTrades(mergeTradeLogs(entries))
      setState('ready')
    } catch {
      setState('error')
    }
  }, [startLeagueId])

  useEffect(() => {
    load()
  }, [load])

  return useMemo(
    () => ({
      state,
      priorSeasonsFailed,
      leagueSeasonSummaries: summaries,
      allTrades,
      refresh: load,
    }),
    [state, priorSeasonsFailed, summaries, allTrades, load],
  )
}

import { describe, expect, it } from 'vitest'
import { LEAGUE_ID } from './constants'
import { loadPlayersMap } from './playersCache'
import { fetchTradeHistoryChain } from './sleeperApi'
import { buildTradeLogEntry, mergeTradeLogs } from './trades'

describe('trade history chain (live Sleeper)', () => {
  it('loads dynasty trade history across prior seasons', async () => {
    const players = await loadPlayersMap()
    const { bundles, priorSeasonsFailed } =
      await fetchTradeHistoryChain(LEAGUE_ID)
    expect(priorSeasonsFailed).toBe(false)
    expect(bundles.length).toBeGreaterThanOrEqual(8)

    const entries = []
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
    const trades = mergeTradeLogs(entries)
    expect(trades.length).toBeGreaterThan(0)

    const seasons = new Set(trades.map((t) => t.season))
    expect(seasons.has('2026')).toBe(true)
  })
})

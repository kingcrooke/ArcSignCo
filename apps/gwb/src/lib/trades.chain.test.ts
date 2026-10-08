import { describe, expect, it } from 'vitest'
import { loadPlayersMap } from './playersCache'
import { fetchTradeHistoryChain } from './sleeperApi'
import { buildTradeLogEntry, mergeTradeLogs, tradeCountBySeason } from './trades'

const EXPECTED: Record<string, number> = {
  '2019': 2,
  '2020': 8,
  '2021': 3,
  '2022': 3,
  '2023': 0,
  '2024': 1,
  '2025': 2,
  '2026': 1,
}

describe('trade history chain (live Sleeper)', () => {
  it('loads 20 trades across 2019–2026', async () => {
    const players = await loadPlayersMap()
    const { bundles, priorSeasonsFailed } = await fetchTradeHistoryChain()
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
    expect(trades).toHaveLength(20)

    const counts = tradeCountBySeason(trades)
    for (const [season, n] of Object.entries(EXPECTED)) {
      expect(counts.get(season) ?? 0).toBe(n)
    }

    const w4 = trades.find((t) => t.transactionId === '1413233010219741184')
    expect(w4?.season).toBe('2026')
    expect(w4?.week).toBe(4)
    const dannySide = [w4?.sideA, w4?.sideB].find((s) =>
      s?.received.some((a) => a.label.includes('Shough')),
    )
    expect(dannySide?.sent.some((a) => a.label.includes('Bo Nix'))).toBe(true)
  })
})

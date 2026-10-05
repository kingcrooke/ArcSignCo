import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { MULLIGAN_LEDGER_ENTRIES } from './mulligans'
import {
  badgesForBreakdown,
  computeGameBreakdown,
  computeMulliganBonus,
  makeMatchupKey,
  BEST_GAMES_PER_WEEK,
  rankBestGamesByWeek,
  rankBestGamesForWeek,
  youtubeEmbedUrl,
} from './bestGames'
import { groupMatchupPairs } from './matchupBoard'
import type { NflState, SleeperLeague, SleeperMatchup } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('bestGames scoring', () => {
  it('computes closeness and shootout from margin and totals', () => {
    const home = { roster_id: 1, matchup_id: 1, points: 130, starters: [], starters_points: [], players_points: {} }
    const away = { roster_id: 2, matchup_id: 1, points: 128, starters: [], starters_points: [], players_points: {} }
    const b = computeGameBreakdown(home, away, 1, new Map(), [])
    expect(b.margin).toBe(2)
    expect(b.closeness).toBe(38)
    expect(b.shootout).toBeCloseTo(258 / 5, 5)
    expect(b.composite).toBeCloseTo(38 + 258 / 5, 5)
  })

  it('applies upset bonus from pre-week records', () => {
    const home = { roster_id: 1, matchup_id: 2, points: 141, starters: [], starters_points: [], players_points: {} }
    const away = { roster_id: 2, matchup_id: 2, points: 114, starters: [], starters_points: [], players_points: {} }
    const records = new Map([
      [1, { wins: 0, losses: 2 }],
      [2, { wins: 1, losses: 0 }],
    ])
    const b = computeGameBreakdown(home, away, 4, records, [])
    expect(b.upsetUnits).toBe(1)
    expect(b.upsetBonus).toBe(12)
    expect(badgesForBreakdown(b)).toContain('Upset')
  })

  it('adds mulligan bonuses from ledger rules', () => {
    const flipped = MULLIGAN_LEDGER_ENTRIES.find((e) => e.flipped)
    if (flipped) {
      expect(computeMulliganBonus(5, [flipped])).toBeGreaterThanOrEqual(30)
    }
    expect(computeMulliganBonus(8, [MULLIGAN_LEDGER_ENTRIES[0]])).toBeGreaterThanOrEqual(10)
  })

  it('builds stable matchup keys', () => {
    expect(makeMatchupKey(3, 42)).toBe('3-42')
  })

  it('parses YouTube embed URLs', () => {
    expect(youtubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
    expect(youtubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })
})

describe('rankBestGames', () => {
  it('groups top games per completed week, newest first', () => {
    const league = load<SleeperLeague>('league.json')
    const nflState = load<NflState>('state-nfl.json')
    const m1 = load<SleeperMatchup[]>('matchups-1.json')
    const m2 = load<SleeperMatchup[]>('matchups-2.json')
    const m3 = load<SleeperMatchup[]>('matchups-3.json')
    const map = new Map<number, SleeperMatchup[]>([
      [1, m1],
      [2, m2],
      [3, m3],
    ])
    const groups = rankBestGamesByWeek(
      map,
      { ...league, settings: { ...league.settings, last_scored_leg: 3 } },
      nflState,
      MULLIGAN_LEDGER_ENTRIES,
    )
    expect(groups.length).toBe(3)
    expect(groups[0].week).toBe(3)
    expect(groups[2].week).toBe(1)
    for (const { week, games } of groups) {
      expect(games.length).toBeLessThanOrEqual(BEST_GAMES_PER_WEEK)
      expect(games.every((g) => g.week === week)).toBe(true)
      for (const g of games) {
        const pairs = groupMatchupPairs(map.get(g.week) ?? [])
        expect(pairs.some((p) => p.matchupId === g.matchupId)).toBe(true)
      }
    }
  })

  it('ranks matchups within a single week', () => {
    const league = load<SleeperLeague>('league.json')
    const nflState = load<NflState>('state-nfl.json')
    const m3 = load<SleeperMatchup[]>('matchups-3.json')
    const map = new Map<number, SleeperMatchup[]>([[3, m3]])
    const weekRanked = rankBestGamesForWeek(
      3,
      map,
      { ...league, settings: { ...league.settings, last_scored_leg: 3 } },
      nflState,
      MULLIGAN_LEDGER_ENTRIES,
    )
    expect(weekRanked.length).toBeGreaterThan(0)
    expect(weekRanked.length).toBeLessThanOrEqual(BEST_GAMES_PER_WEEK)
    expect(weekRanked.every((g) => g.week === 3)).toBe(true)
    expect(weekRanked[0].rank).toBe(1)
    for (let i = 1; i < weekRanked.length; i++) {
      expect(weekRanked[i].breakdown.composite).toBeLessThanOrEqual(
        weekRanked[i - 1].breakdown.composite,
      )
    }
  })
})

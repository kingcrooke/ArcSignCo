import { describe, expect, it } from 'vitest'
import { effectiveNflStateForLeague, isHistoricalSeason } from './seasonContext'
import type { NflState, SleeperLeague } from './types'

const league2025 = {
  season: '2025',
  settings: { last_scored_leg: 17 },
} as SleeperLeague

const nfl2026: NflState = {
  week: 5,
  season: '2026',
  season_type: 'regular',
  display_week: 5,
  league_season: '2026',
  season_has_scores: true,
}

describe('seasonContext', () => {
  it('marks past Sleeper seasons as historical', () => {
    expect(isHistoricalSeason(league2025, nfl2026)).toBe(true)
  })

  it('pins NFL state to last scored leg for historical seasons', () => {
    const effective = effectiveNflStateForLeague(league2025, nfl2026)
    expect(effective.season).toBe('2025')
    expect(effective.week).toBe(17)
  })
})

import { describe, expect, it } from 'vitest'
import { faabByRoster, leagueFaabBudget } from './faab'
import type { SleeperLeague, SleeperRoster } from './types'

describe('faabByRoster', () => {
  it('uses league waiver_budget and roster waiver_budget_used', () => {
    const league = {
      league_id: '1',
      name: 'Test',
      season: '2026',
      status: 'in_season',
      settings: { leg: 4, waiver_budget: 100 },
      roster_positions: [],
      scoring_settings: {},
    } satisfies SleeperLeague
    const rosters: SleeperRoster[] = [
      {
        roster_id: 1,
        owner_id: 'a',
        players: [],
        starters: [],
        settings: {
          wins: 0,
          losses: 0,
          ties: 0,
          fpts: 0,
          fpts_decimal: 0,
          fpts_against: 0,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
          waiver_budget_used: 37,
        },
      },
    ]
    expect(leagueFaabBudget(league)).toBe(100)
    const snap = faabByRoster(league, rosters).get(1)
    expect(snap).toEqual({ budget: 100, spent: 37, remaining: 63 })
  })
})

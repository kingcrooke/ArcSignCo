import { describe, expect, it } from 'vitest'
import {
  currentNflWeek,
  defaultBestGamesWeek,
  isWeekComplete,
  lastCompletedWeek,
} from './weeks'
import type { NflState, SleeperLeague } from './types'

function league(lastScored: number): SleeperLeague {
  return {
    league_id: '1',
    season: '2025',
    roster_positions: [],
    settings: { last_scored_leg: lastScored, leg: lastScored },
  } as SleeperLeague
}

function nfl(week: number): NflState {
  return { week, display_week: week, season: '2025', season_type: 'regular' }
}

describe('defaultBestGamesWeek', () => {
  it('uses current NFL week when that week is complete', () => {
    const lg = league(5)
    const state = nfl(5)
    expect(isWeekComplete(5, lg, state)).toBe(true)
    expect(defaultBestGamesWeek(lg, state)).toBe(5)
  })

  it('uses last completed week while current week is live', () => {
    const lg = league(4)
    const state = nfl(5)
    expect(currentNflWeek(state)).toBe(5)
    expect(lastCompletedWeek(lg, state)).toBe(4)
    expect(defaultBestGamesWeek(lg, state)).toBe(4)
  })
})

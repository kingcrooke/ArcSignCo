import { describe, expect, it } from 'vitest'
import {
  bestGamesWeekChip,
  currentNflWeek,
  defaultBestGamesWeek,
  isWeekComplete,
  lastCompletedWeek,
  standingsThroughWeek,
} from './weeks'
import type { NflState, SleeperLeague } from './types'

function league(lastScored: number, playoffWeekStart = 15): SleeperLeague {
  return {
    league_id: '1',
    season: '2025',
    roster_positions: [],
    settings: {
      last_scored_leg: lastScored,
      leg: lastScored,
      playoff_week_start: playoffWeekStart,
    },
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

describe('standingsThroughWeek', () => {
  it('caps a completed season at the last regular-season week', () => {
    const lg = league(16, 14)
    const state = nfl(16)
    expect(standingsThroughWeek(16, lg, state, true)).toBe(13)
    expect(standingsThroughWeek(5, lg, state, true)).toBe(13)
  })

  it('caps a selected playoff week in the current season', () => {
    const lg = league(16, 14)
    const state = nfl(16)
    expect(standingsThroughWeek(16, lg, state, false)).toBe(13)
    expect(standingsThroughWeek(5, lg, state, false)).toBe(5)
  })
})

describe('bestGamesWeekChip', () => {
  it('labels only the live week as in progress and later weeks as upcoming', () => {
    const lg = league(5)
    const state = nfl(6)
    expect(bestGamesWeekChip(5, lg, state)).toEqual({
      label: 'Week 5',
      disabled: false,
    })
    expect(bestGamesWeekChip(6, lg, state)).toEqual({
      label: 'Week 6 · In progress',
      disabled: true,
    })
    expect(bestGamesWeekChip(7, lg, state)).toEqual({
      label: 'Week 7 · Upcoming',
      disabled: true,
    })
  })
})

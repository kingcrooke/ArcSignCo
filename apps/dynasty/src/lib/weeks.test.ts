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

function league(
  lastScored: number,
  extra: Partial<SleeperLeague> = {},
): SleeperLeague {
  return {
    league_id: '1',
    season: '2025',
    status: 'in_season',
    roster_positions: [],
    settings: { last_scored_leg: lastScored, leg: lastScored },
    ...extra,
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
  it('caps 2019 (playoff_week_start 14) at week 13, not the last scored playoff week', () => {
    const lg = league(16, {
      season: '2019',
      status: 'complete',
      settings: { last_scored_leg: 16, leg: 16, playoff_week_start: 14 },
    })
    const state = nfl(16)
    state.season = '2019'
    expect(standingsThroughWeek(16, lg, state)).toBe(13)
    expect(standingsThroughWeek(5, lg, state)).toBe(5)
  })
})

describe('bestGamesWeekChip', () => {
  it('marks only the live NFL week in progress and later weeks upcoming', () => {
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

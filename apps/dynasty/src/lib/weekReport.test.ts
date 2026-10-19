import { describe, expect, it } from 'vitest'
import { buildWeekReport } from './weekReport'
import type { NflState, SleeperLeague, SleeperMatchup, TeamInfo } from './types'

function team(rosterId: number, name: string): TeamInfo {
  return {
    rosterId,
    userId: `u${rosterId}`,
    displayName: name,
    teamName: name,
    leagueAvatarUrl: null,
    globalAvatarUrl: null,
    avatarUrl: null,
  }
}

function row(rosterId: number, points: number, matchupId: number): SleeperMatchup {
  return {
    roster_id: rosterId,
    matchup_id: matchupId,
    points,
    starters: ['1'],
    starters_points: [points],
    players: ['1', '2'],
    players_points: { '1': points, '2': 10 },
  }
}

const teams = new Map<number, TeamInfo>([
  [1, team(1, 'Alpha')],
  [2, team(2, 'Beta')],
])

function league(lastScored: number): SleeperLeague {
  return {
    league_id: '1',
    name: 'Dynasty',
    season: '2026',
    status: 'in_season',
    settings: { leg: 6, last_scored_leg: lastScored, playoff_week_start: 15 },
    roster_positions: [],
    scoring_settings: {},
  }
}

function nfl(week: number): NflState {
  return {
    week,
    display_week: week,
    season: '2026',
    season_type: 'regular',
    league_season: '2026',
    season_has_scores: true,
  }
}

describe('buildWeekReport', () => {
  const matchupsByWeek = new Map<number, SleeperMatchup[]>([
    [5, [row(1, 150, 1), row(2, 120, 1)]],
  ])

  it('builds a report for a completed week and hides a live week', () => {
    const report = buildWeekReport({
      week: 5,
      matchupsByWeek,
      teams,
      league: league(5),
      nflState: nfl(6),
    })
    expect(report?.highScore.name).toBe('Alpha')
    expect(report?.lowScore.name).toBe('Beta')
    expect(report?.closest?.margin).toBeCloseTo(30, 2)
    expect(report?.blowout?.winner.name).toBe('Alpha')
    expect(report?.top3[0].name).toBe('Alpha')
    expect(
      buildWeekReport({
        week: 6,
        matchupsByWeek,
        teams,
        league: league(5),
        nflState: nfl(6),
      }),
    ).toBeNull()
  })
})
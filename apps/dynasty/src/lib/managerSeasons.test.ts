import { describe, expect, it } from 'vitest'
import {
  buildLeagueSeasonSummaries,
  championsWallRows,
  titlesLeaderboard,
} from './managerSeasons'
import { buildTeamMap } from './teams'
import type { LeagueTradeBundle } from './sleeperApi'
import type { SleeperLeague, SleeperRoster, SleeperUser } from './types'

function miniBundle(
  season: string,
  users: SleeperUser[],
  rosters: SleeperRoster[],
  winnerRosterId: number,
): LeagueTradeBundle {
  const league: SleeperLeague = {
    league_id: `league-${season}`,
    name: 'Dynasty of Champions',
    season,
    status: 'complete',
    metadata: { latest_league_winner_roster_id: String(winnerRosterId) },
    settings: {
      leg: 17,
      playoff_week_start: 15,
      playoff_teams: 6,
    },
    roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'BN'],
    scoring_settings: {},
  }
  return {
    league,
    rosters,
    teams: buildTeamMap(users, rosters),
    transactions: [],
    winnersBracket: [
      { m: 1, r: 3, t1: 1, t2: 2, p: 1, w: winnerRosterId },
    ],
    losersBracket: null,
  }
}

describe('buildLeagueSeasonSummaries', () => {
  it('indexes managers by user_id and marks champion', () => {
    const users: SleeperUser[] = [
      { user_id: 'u1', display_name: 'Alpha' },
      { user_id: 'u2', display_name: 'Beta' },
    ]
    const rosters: SleeperRoster[] = [
      {
        roster_id: 1,
        owner_id: 'u1',
        players: ['p1'],
        starters: ['p1'],
        settings: {
          wins: 10,
          losses: 4,
          ties: 0,
          fpts: 2000,
          fpts_decimal: 0,
          fpts_against: 1800,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
        metadata: { record: 'WWWWWWWWWWWWWW' },
      },
      {
        roster_id: 2,
        owner_id: 'u2',
        players: ['p2'],
        starters: [],
        settings: {
          wins: 6,
          losses: 8,
          ties: 0,
          fpts: 1700,
          fpts_decimal: 0,
          fpts_against: 1900,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
        metadata: { record: 'LLLLLLLLLLLLLL' },
      },
    ]
    const summaries = buildLeagueSeasonSummaries([
      miniBundle('2024', users, rosters, 1),
    ])
    expect(summaries).toHaveLength(1)
    const row = summaries[0].byUserId.get('u1')
    expect(row?.playoffResult).toBe('Champion')
    expect(row?.championDisplayName).toBe('Alpha')
    expect(summaries[0].championSleeperName).toBe('Alpha')
    expect(summaries[0].runnerUpSleeperName).toBe('Beta')
    expect(summaries[0].byUserId.get('u2')?.playoffResult).toBe('Runner-up')
  })

  it('ignores prior-year winner metadata while season is in progress', () => {
    const users: SleeperUser[] = [{ user_id: 'u1', display_name: 'Alpha' }]
    const rosters: SleeperRoster[] = [
      {
        roster_id: 1,
        owner_id: 'u1',
        players: [],
        starters: [],
        settings: {
          wins: 1,
          losses: 3,
          ties: 0,
          fpts: 500,
          fpts_decimal: 0,
          fpts_against: 600,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
        metadata: { record: 'LWLL' },
      },
    ]
    const league: SleeperLeague = {
      league_id: 'live',
      name: 'Dynasty of Champions',
      season: '2026',
      status: 'in_season',
      metadata: { latest_league_winner_roster_id: '6' },
      settings: { leg: 4, playoff_week_start: 15, playoff_teams: 6 },
      roster_positions: [],
      scoring_settings: {},
    }
    const summaries = buildLeagueSeasonSummaries([
      {
        league,
        rosters,
        teams: buildTeamMap(users, rosters),
        transactions: [],
        winnersBracket: null,
        losersBracket: null,
      },
    ])
    expect(summaries[0].championDisplayName).toBe('')
    expect(summaries[0].byUserId.get('u1')?.playoffResult).toBe('')
  })

  it('builds a champions wall and titles leaderboard from sleeper names', () => {
    const users: SleeperUser[] = [
      { user_id: 'u1', display_name: 'NutCrusher' },
      { user_id: 'u2', display_name: 'BigBlue01' },
    ]
    const rosters: SleeperRoster[] = [
      {
        roster_id: 1,
        owner_id: 'u1',
        players: [],
        starters: [],
        settings: {
          wins: 10,
          losses: 3,
          ties: 0,
          fpts: 1,
          fpts_decimal: 0,
          fpts_against: 1,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
      },
      {
        roster_id: 2,
        owner_id: 'u2',
        players: [],
        starters: [],
        settings: {
          wins: 8,
          losses: 5,
          ties: 0,
          fpts: 1,
          fpts_decimal: 0,
          fpts_against: 1,
          fpts_against_decimal: 0,
          ppts: 0,
          ppts_decimal: 0,
        },
      },
    ]
    const summaries = buildLeagueSeasonSummaries([
      miniBundle('2019', users, rosters, 1),
      miniBundle('2022', users, rosters, 1),
      miniBundle('2023', users, rosters, 1),
      miniBundle('2026', users, rosters, 1),
    ])
    const wall = championsWallRows(summaries)
    expect(wall.map((r) => r.season)).toEqual(['2019', '2022', '2023'])
    expect(wall[0]).toEqual({
      season: '2019',
      champion: 'NutCrusher',
      runnerUp: 'BigBlue01',
    })
    expect(titlesLeaderboard(summaries)[0]).toEqual({
      name: 'NutCrusher',
      titles: 3,
      years: ['2019', '2022', '2023'],
    })
  })
})

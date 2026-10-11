import { describe, expect, it } from 'vitest'
import { buildPastRosterRows, nflTeamForPlayerSeason } from './seasonNflTeams'
import type { ManagerSeasonFinish } from './managerSeasons'
import type { PlayersMap } from './types'

describe('season NFL teams', () => {
  it('maps 2020 teams from build cache (not current NFL team)', () => {
    expect(nflTeamForPlayerSeason('2020', '4039')).toBe('LAR') // Kupp
    expect(nflTeamForPlayerSeason('2020', '5849')).toBe('ARI') // Murray
    expect(nflTeamForPlayerSeason('2020', '4029')).toBe('MIN') // Dalvin Cook
    expect(nflTeamForPlayerSeason('2020', '3969')).toBe('TB') // Fournette
    expect(nflTeamForPlayerSeason('2020', '1110')).toBe('IND') // T.Y. Hilton
  })

  it('orders starters by lineup slot then bench by position', () => {
    const finish: ManagerSeasonFinish = {
      season: '2020',
      leagueId: 'x',
      leagueName: 'Dynasty of Champions',
      rosterId: 1,
      userId: 'u',
      displayName: 'Test',
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      regularSeasonRank: 1,
      playoffResult: 'Missed playoffs',
      championUserId: '',
      championDisplayName: 'x',
      roster: {
        roster_id: 1,
        owner_id: 'u',
        players: ['qb', 'rb', 'wr'],
        starters: ['wr', 'qb', 'rb'],
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
        },
      },
      rosterPositions: [],
      unavailable: false,
    }
    const players: PlayersMap = {
      qb: { full_name: 'A QB', first_name: 'A', last_name: 'QB', position: 'QB', team: 'NYJ' },
      rb: { full_name: 'Z RB', first_name: 'Z', last_name: 'RB', position: 'RB', team: 'NYJ' },
      wr: { full_name: 'M WR', first_name: 'M', last_name: 'WR', position: 'WR', team: 'NYJ' },
    }
    const rows = buildPastRosterRows(finish, players)
    expect(rows.map((r) => r.id)).toEqual(['wr', 'qb', 'rb'])
    expect(rows.every((r) => r.nfl === '—')).toBe(true)
  })
})

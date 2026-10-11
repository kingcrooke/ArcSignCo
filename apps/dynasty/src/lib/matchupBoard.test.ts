import { describe, expect, it } from 'vitest'
import {
  finalizedMatchupKeysForWeek,
  isMatchupPairFinal,
  nflTeamsWithOpenGames,
} from './matchupBoard'
import type { NflWeekGame, PlayersMap, SleeperMatchup } from './types'

const players: PlayersMap = {
  '100': {
    first_name: 'A',
    last_name: 'One',
    full_name: 'A One',
    position: 'RB',
    team: 'BUF',
  },
  '200': {
    first_name: 'B',
    last_name: 'Two',
    full_name: 'B Two',
    position: 'WR',
    team: 'KC',
  },
  '201': {
    first_name: 'C',
    last_name: 'Three',
    full_name: 'C Three',
    position: 'WR',
    team: 'NO',
  },
}

const nflAllComplete: NflWeekGame[] = [
  {
    status: 'complete',
    week: 4,
    metadata: { home_team: 'BUF', away_team: 'KC' },
  },
]

const nflMnfOpen: NflWeekGame[] = [
  ...nflAllComplete,
  {
    status: 'pre_game',
    week: 4,
    metadata: { home_team: 'NO', away_team: 'ATL' },
  },
]

describe('matchup finalization', () => {
  it('flags open NFL teams from scoreboard', () => {
    expect(nflTeamsWithOpenGames(nflMnfOpen)).toEqual(new Set(['NO', 'ATL']))
    expect(nflTeamsWithOpenGames(nflAllComplete).size).toBe(0)
  })

  it('treats matchup as final when neither side has starters on open teams', () => {
    const home: SleeperMatchup = {
      roster_id: 1,
      matchup_id: 1,
      points: 163.91,
      starters: ['100'],
      starters_points: [20],
      players_points: { '100': 20 },
    }
    const away: SleeperMatchup = {
      roster_id: 8,
      matchup_id: 1,
      points: 121.27,
      starters: ['200'],
      starters_points: [10],
      players_points: { '200': 10 },
    }
    const awayMnf: SleeperMatchup = {
      ...away,
      starters: ['201'],
      players_points: { '201': 10 },
    }
    expect(isMatchupPairFinal(home, away, players, nflAllComplete)).toBe(true)
    expect(isMatchupPairFinal(home, awayMnf, players, nflMnfOpen)).toBe(false)
  })

  it('builds finalized keys for a week', () => {
    const matchups: SleeperMatchup[] = [
      {
        roster_id: 1,
        matchup_id: 1,
        points: 163.91,
        starters: ['100'],
        starters_points: [20],
        players_points: { '100': 20 },
      },
      {
        roster_id: 8,
        matchup_id: 1,
        points: 121.27,
        starters: ['200'],
        starters_points: [10],
        players_points: { '200': 10 },
      },
      {
        roster_id: 2,
        matchup_id: 2,
        points: 90,
        starters: ['201'],
        starters_points: [5],
        players_points: { '201': 5 },
      },
      {
        roster_id: 3,
        matchup_id: 2,
        points: 80,
        starters: ['100'],
        starters_points: [4],
        players_points: { '100': 4 },
      },
    ]
    const keys = finalizedMatchupKeysForWeek(4, matchups, players, nflMnfOpen)
    expect(keys).toEqual(new Set(['4-1']))
  })
})

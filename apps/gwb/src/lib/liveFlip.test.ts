import { describe, expect, it } from 'vitest'
import { liveFlipForPair } from './liveFlip'
import type { NflWeekGame, PlayersMap, SleeperMatchup } from './types'

function side(
  rosterId: number,
  points: number,
  starter: string,
  starterPts: number,
): SleeperMatchup {
  return {
    roster_id: rosterId,
    matchup_id: 1,
    points,
    starters: [starter],
    starters_points: [starterPts],
    players_points: { [starter]: starterPts },
    players: [starter],
  }
}

const players: PlayersMap = {
  p1: {
    first_name: 'A',
    last_name: 'A',
    position: 'QB',
    team: 'BUF',
    full_name: 'A',
  },
  p2: {
    first_name: 'B',
    last_name: 'B',
    position: 'QB',
    team: 'KC',
    full_name: 'B',
  },
}

const games: NflWeekGame[] = [
  {
    status: 'in_game',
    week: 8,
    metadata: { home_team: 'BUF', away_team: 'KC' },
  },
]

describe('liveFlipForPair', () => {
  it('names each side on the points-still-out line', () => {
    const insight = liveFlipForPair(
      side(8, 122, 'p1', 4),
      side(11, 100, 'p2', 2),
      players,
      games,
      { p1: 22.4, p2: 2 },
      (id) => (id === 8 ? 'Crooke' : 'Frankie'),
    )
    expect(insight?.summary).toBe(
      '~18.4 pts still out for Crooke / ~0.0 pts still out for Frankie — unlikely to flip',
    )
  })
})

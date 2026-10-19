import { describe, expect, it } from 'vitest'
import { badgesForBreakdown, computeGameBreakdown, isUpset } from './bestGames'
import type { SleeperMatchup } from './types'

function side(rosterId: number, points: number): SleeperMatchup {
  return {
    roster_id: rosterId,
    matchup_id: 1,
    points,
    starters: [],
    starters_points: [],
    players_points: {},
  }
}

describe('upset rule', () => {
  it('is an upset only when the winner had a worse win percentage', () => {
    expect(isUpset({ wins: 3, losses: 1 }, { wins: 0, losses: 4 })).toBe(false)
    expect(isUpset({ wins: 1, losses: 3 }, { wins: 2, losses: 2 })).toBe(true)
    expect(isUpset({ wins: 2, losses: 2 }, { wins: 1, losses: 1 })).toBe(false)
    expect(isUpset({ wins: 0, losses: 0 }, { wins: 0, losses: 0 })).toBe(false)
  })

  it('does not badge Chase’n Dubs over BigBlue, and does badge Love Thy Nabers', () => {
    const chaseOverBlue = computeGameBreakdown(
      side(5, 121.78),
      side(4, 104.96),
      5,
      new Map([
        [5, { wins: 3, losses: 1 }],
        [4, { wins: 0, losses: 4 }],
      ]),
    )
    expect(badgesForBreakdown(chaseOverBlue)).not.toContain('Upset')

    const loveOverMahomes = computeGameBreakdown(
      side(7, 132.44),
      side(11, 117.06),
      5,
      new Map([
        [7, { wins: 1, losses: 3 }],
        [11, { wins: 2, losses: 2 }],
      ]),
    )
    expect(badgesForBreakdown(loveOverMahomes)).toContain('Upset')
  })
})

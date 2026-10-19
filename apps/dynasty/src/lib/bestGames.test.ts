import { describe, expect, it } from 'vitest'
import { badgesForBreakdown, computeGameBreakdown, isUpset } from './bestGames'
import type { SleeperMatchup } from './types'

function row(rosterId: number, points: number): SleeperMatchup {
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
  it('is an upset only when the winner had a worse record going in', () => {
    expect(isUpset({ wins: 1, losses: 3 }, { wins: 2, losses: 2 })).toBe(true)
    expect(isUpset({ wins: 3, losses: 1 }, { wins: 0, losses: 4 })).toBe(false)
    expect(isUpset({ wins: 2, losses: 2 }, { wins: 1, losses: 1 })).toBe(false)
    expect(isUpset({ wins: 0, losses: 0 }, { wins: 0, losses: 0 })).toBe(false)
  })

  it('week 5 2026 Chase’n Dubs (3-1) over BigBlue (0-4) is not an upset', () => {
    const records = new Map<number, { wins: number; losses: number }>([
      [5, { wins: 3, losses: 1 }],
      [4, { wins: 0, losses: 4 }],
    ])
    const breakdown = computeGameBreakdown(
      row(5, 121.78),
      row(4, 104.96),
      5,
      records,
    )
    expect(breakdown.upsetBonus).toBe(0)
    expect(badgesForBreakdown(breakdown)).not.toContain('Upset')
  })

  it('Love Thy Nabers (1-3) over MahomiesRidley4MooreJeffe (2-2) is an upset', () => {
    const records = new Map<number, { wins: number; losses: number }>([
      [7, { wins: 1, losses: 3 }],
      [11, { wins: 2, losses: 2 }],
    ])
    const breakdown = computeGameBreakdown(
      row(7, 132.44),
      row(11, 117.06),
      5,
      records,
    )
    expect(badgesForBreakdown(breakdown)).toContain('Upset')
  })
})

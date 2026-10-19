import { describe, expect, it } from 'vitest'
import {
  computeAllPlayThroughWeek,
  finishedSeasonLine,
  formatAllPlayRecord,
  playoffSeedHint,
} from './allPlay'
import type { SleeperMatchup } from './types'

describe('allPlay', () => {
  it('counts weekly all-play wins across the window', () => {
    const w1: SleeperMatchup[] = [
      { roster_id: 1, matchup_id: 1, points: 100, starters: [], starters_points: [] },
      { roster_id: 2, matchup_id: 1, points: 90, starters: [], starters_points: [] },
      { roster_id: 3, matchup_id: 2, points: 80, starters: [], starters_points: [] },
      { roster_id: 4, matchup_id: 2, points: 70, starters: [], starters_points: [] },
    ]
    const map = new Map([[1, w1]])
    const records = computeAllPlayThroughWeek(map, 1)
    expect(formatAllPlayRecord(records.get(1)!)).toBe('3-0')
    expect(formatAllPlayRecord(records.get(4)!)).toBe('0-3')
  })

  it('formats playoff seed hints', () => {
    expect(playoffSeedHint(3, 6)).toContain('3rd seed')
    expect(playoffSeedHint(8, 6)).toContain('outside')
  })

  it('uses final wording for a completed season', () => {
    expect(finishedSeasonLine(2, 'Champion')).toBe(
      'Finished #2 (regular season) · Champion',
    )
    expect(finishedSeasonLine(8)).toBe('Finished 8th in the regular season')
  })
})

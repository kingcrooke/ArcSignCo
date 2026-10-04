import { describe, expect, it } from 'vitest'
import matchups from '../test/fixtures/matchups-3.json'
import {
  benchPointsTotal,
  groupMatchupPairs,
  isDefenseId,
  playerDisplayName,
  starterPositions,
} from './matchupBoard'
import type { PlayersMap, SleeperMatchup } from './types'

const rows = matchups as SleeperMatchup[]

describe('matchupBoard', () => {
  it('groups roster pairs by matchup_id', () => {
    const pairs = groupMatchupPairs(rows)
    expect(pairs.length).toBe(6)
    expect(pairs[0].home.roster_id).toBeLessThan(pairs[0].away.roster_id)
  })

  it('reads starter slots from league positions', () => {
    const slots = starterPositions([
      'QB',
      'RB',
      'RB',
      'WR',
      'WR',
      'TE',
      'FLEX',
      'FLEX',
      'K',
      'DEF',
      'BN',
      'BN',
    ])
    expect(slots).toEqual([
      'QB',
      'RB',
      'RB',
      'WR',
      'WR',
      'TE',
      'FLEX',
      'FLEX',
      'K',
      'DEF',
    ])
  })

  it('labels defenses and empty slots', () => {
    const players: PlayersMap = {}
    expect(isDefenseId('NYG')).toBe(true)
    expect(playerDisplayName('NYG', players)).toBe('NYG')
    expect(playerDisplayName('0', players)).toBe('Empty')
  })

  it('sums bench points from players_points', () => {
    const m = rows.find((r) => r.roster_id === 1)!
    const bench = benchPointsTotal(m)
    expect(bench).toBeGreaterThan(0)
  })
})

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import {
  computeStandings,
  computeStandingsThroughWeek,
  finalRegularSeasonStandings,
  recordLabel,
  streakLabel,
} from './standings'
import type { SleeperMatchup, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('computeStandings', () => {
  it('orders by wins then points for', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const teams = buildTeamMap(users, rosters)
    const standings = computeStandings(rosters, teams)
    expect(standings).toHaveLength(12)
    expect(standings[0].wins).toBeGreaterThanOrEqual(standings[1].wins)
    const undefeated = standings.filter((s) => s.losses === 0)
    expect(undefeated.length).toBeGreaterThan(0)
    expect(standings[0].rank).toBe(1)
    expect(recordLabel(standings[0])).toMatch(/^\d+-\d+/)
  })

  it('formats Sleeper streak metadata for display', () => {
    expect(streakLabel('3L')).toBe('L3')
    expect(streakLabel('2W')).toBe('W2')
    expect(streakLabel('')).toBe('')
  })

  it('through one week gives 1-0 or 0-1 records', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const matchups = load<SleeperMatchup[]>('matchups-3.json')
    const teams = buildTeamMap(users, rosters)
    const map = new Map([[3, matchups]])
    const w3only = computeStandingsThroughWeek(map, teams, 3)
    const season = computeStandings(rosters, teams)
    expect(w3only).toHaveLength(12)
    for (const row of w3only) {
      expect(row.wins + row.losses + row.ties).toBeLessThanOrEqual(3)
    }
    expect(season[0].wins).toBeGreaterThanOrEqual(w3only[0].wins)
  })
})

describe('finalRegularSeasonStandings', () => {
  it('uses 2019 Nut Crusher roster settings (7-6, PF 1681.86), not a playoff-inflated line', () => {
    const roster: SleeperRoster = {
      roster_id: 12,
      owner_id: 'nut',
      players: [],
      starters: [],
      settings: {
        wins: 7,
        losses: 6,
        ties: 0,
        fpts: 1681,
        fpts_decimal: 86,
        fpts_against: 1600,
        fpts_against_decimal: 0,
        ppts: 0,
        ppts_decimal: 0,
      },
    }
    const teams = buildTeamMap(
      [{ user_id: 'nut', display_name: 'NutCrusher' }],
      [roster],
    )
    const rows = finalRegularSeasonStandings([roster], teams, 13)
    const nut = rows.find((r) => r.rosterId === 12)
    expect(nut?.wins).toBe(7)
    expect(nut?.losses).toBe(6)
    expect(nut?.pointsFor).toBeCloseTo(1681.86, 2)
    expect(`${nut?.wins}-${nut?.losses}`).not.toBe('11-5')
    expect(nut?.pointsFor).not.toBeCloseTo(2113.76, 1)
  })
})

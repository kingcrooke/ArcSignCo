import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import {
  computeStandings,
  computeStandingsThroughWeek,
  recordLabel,
  standingsForView,
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

  it('keeps 2019 Nut Crusher at the regular-season roster line, not the playoff total', () => {
    const rows = load<{ week: number; roster_id: number; matchup_id: number | null; points: number }[]>(
      '2019-matchups.json',
    )
    const byWeek = new Map<number, SleeperMatchup[]>()
    for (const row of rows) {
      if (row.matchup_id == null) continue
      const list = byWeek.get(row.week) ?? []
      list.push({
        roster_id: row.roster_id,
        matchup_id: row.matchup_id,
        points: row.points,
        starters: [],
        starters_points: [],
        players_points: {},
      })
      byWeek.set(row.week, list)
    }
    const teams = new Map<number, import('./types').TeamInfo>()
    for (let rosterId = 1; rosterId <= 12; rosterId++) {
      teams.set(rosterId, {
        rosterId,
        userId: `u${rosterId}`,
        displayName: rosterId === 12 ? 'NutCrusher' : `R${rosterId}`,
        teamName: rosterId === 12 ? 'Nut Crusher' : `Team ${rosterId}`,
        leagueAvatarUrl: null,
        globalAvatarUrl: null,
        avatarUrl: null,
      })
    }
    const throughPlayoffs = computeStandingsThroughWeek(byWeek, teams, 17)
    const nutPlayoffs = throughPlayoffs.find((r) => r.rosterId === 12)
    expect(nutPlayoffs?.wins).toBe(11)
    expect(nutPlayoffs?.losses).toBe(5)
    expect(nutPlayoffs?.pointsFor).toBeCloseTo(2113.76, 2)

    const roster = {
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
        fpts_against: 1585,
        fpts_against_decimal: 40,
        ppts: 0,
        ppts_decimal: 0,
      },
    }
    const historical = standingsForView({
      historical: true,
      rosters: [roster],
      teams,
      matchupsByWeek: byWeek,
      throughWeek: 17,
    })
    const nut = historical.find((r) => r.rosterId === 12)
    expect(`${nut?.wins}-${nut?.losses}`).toBe('7-6')
    expect(nut?.pointsFor).toBeCloseTo(1681.86, 2)
    expect(nut?.pointsFor).not.toBeCloseTo(2113.76, 1)
  })
})

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { computeStandings } from './standings'
import {
  buildEscapeLog,
  buildScheduleByWeek,
  censusSubtitle,
  computeFrankieZoneView,
  findZoneCollisions,
  firstWeekAtLossCount,
  resolveZoneName,
  renameMeterLabel,
  zoneHeroTitle,
} from './frankieZone'
import type { SleeperMatchup, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('frankieZone', () => {
  const users = load<SleeperUser[]>('users.json')
  const rosters = load<SleeperRoster[]>('rosters.json')
  const matchupsW3 = load<SleeperMatchup[]>('matchups-3.json')
  const teams = buildTeamMap(users, rosters)
  const matchupsByWeek = new Map([[3, matchupsW3]])
  const standings = computeStandings(rosters, teams)
  const schedule = buildScheduleByWeek(matchupsByWeek)

  it('lists winless residents at week 3', () => {
    const view = computeFrankieZoneView({
      standings,
      teams,
      matchupsByWeek,
      scheduleByWeek: schedule,
      throughWeek: 3,
      nflWeek: 4,
      weekInProgress: true,
    })
    expect(view.residents).toHaveLength(2)
    expect(view.residents.map((r) => r.teamName)).toContain('Turn Your Head And Goff')
    expect(view.zoneName).toBe('Frankie')
    expect(view.heroTitle).toBe(zoneHeroTitle('Frankie'))
  })

  it('formats census and rename meter', () => {
    expect(censusSubtitle(2, 3, true, 4)).toContain('AFTER WEEK 3')
    expect(censusSubtitle(2, 3, true, 4)).toContain('IN PROGRESS')
    expect(renameMeterLabel(3)).toBe('5 losses from breaking the record')
    expect(renameMeterLabel(7)).toBe('1 loss from breaking the record')
  })

  it('detects zone-vs-zone collisions when schedule includes a future week', () => {
    const week4: SleeperMatchup[] = [
      { roster_id: 1, matchup_id: 5, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 11, matchup_id: 5, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 2, matchup_id: 4, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 5, matchup_id: 4, points: 0, starters: [], starters_points: [], players_points: {} },
    ]
    const sched = buildScheduleByWeek(new Map([[4, week4]]))
    const hits = findZoneCollisions(new Set([1, 11]), sched, teams, 4, 4)
    expect(hits).toHaveLength(1)
    expect(hits[0].week).toBe(4)
  })

  it('resolves renamed zone when a team hits 0-8', () => {
    const fakeStandings = standings.map((r) =>
      r.rosterId === 11 ? { ...r, wins: 0, losses: 8 } : r,
    )
    const name = resolveZoneName(fakeStandings, teams, matchupsByWeek, 8)
    expect(name).toBe('Frankie')
  })

  it('escape log skips week-1 winners who never entered the zone', () => {
    const pair = (
      a: number,
      mid: number,
      aPts: number,
      b: number,
      bPts: number,
    ): SleeperMatchup[] => [
      {
        roster_id: a,
        matchup_id: mid,
        points: aPts,
        starters: ['p1'],
        starters_points: [aPts],
        players_points: {},
      },
      {
        roster_id: b,
        matchup_id: mid,
        points: bPts,
        starters: ['p2'],
        starters_points: [bPts],
        players_points: {},
      },
    ]
    const crooke = teams.get(8)!
    const narking = teams.get(3)!
    const steven = teams.get(7)!
    const frankie = teams.get(11)!
    const byWeek = new Map<number, SleeperMatchup[]>([
      [1, [...pair(7, 1, 199, 11, 135), ...pair(8, 2, 100, 3, 120)]],
      [2, [...pair(8, 1, 90, 3, 110)]],
      [3, [...pair(8, 1, 167.66, 3, 136.7)]],
    ])
    const escapes = buildEscapeLog(byWeek, teams, 3)
    expect(escapes).toHaveLength(1)
    expect(escapes[0].teamName).toBe(crooke.teamName)
    expect(escapes[0].week).toBe(3)
    expect(escapes[0].opponentLabel).toBe(narking.displayName)
    expect(escapes[0].line).toContain('167.66')
    expect(escapes.map((e) => e.rosterId)).not.toContain(steven.rosterId)
    expect(escapes.map((e) => e.rosterId)).not.toContain(frankie.rosterId)
  })

  it('firstWeekAtLossCount tracks milestone weeks', () => {
    const frankieRoster = rosters.find((r) => r.owner_id === '475847480039174144')!
    const loss = (rid: number, mid: number, pts: number, oppPts: number) => [
      {
        roster_id: rid,
        matchup_id: mid,
        points: pts,
        starters: ['a'],
        starters_points: [pts],
        players_points: {},
      },
      {
        roster_id: rid === 11 ? 99 : 11,
        matchup_id: mid,
        points: oppPts,
        starters: ['b'],
        starters_points: [oppPts],
        players_points: {},
      },
    ] as SleeperMatchup[]
    const multiWeek = new Map<number, SleeperMatchup[]>([
      [1, loss(11, 1, 80, 100)],
      [2, loss(11, 2, 90, 110)],
      [3, loss(11, 3, 95, 115)],
    ])
    const w = firstWeekAtLossCount(frankieRoster.roster_id, 3, multiWeek, 3)
    expect(w).toBe(3)
  })
})

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeStandingsThroughWeek } from './standings'
import { buildTeamMap } from './teams'
import {
  buildEscapeLog,
  buildScheduleByWeek,
  censusSubtitle,
  computeFrankieZoneView,
  findZoneCollisions,
  firstWeekAtLossCount,
  limitZoneCollisions,
  regularSeasonLastWeek,
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

function matchupsThroughWeek(maxWeek: number): Map<number, SleeperMatchup[]> {
  const map = new Map<number, SleeperMatchup[]>()
  for (let w = 1; w <= maxWeek; w++) {
    map.set(w, load<SleeperMatchup[]>(`matchups-${w}.json`))
  }
  return map
}

describe('frankieZone', () => {
  const users = load<SleeperUser[]>('users.json')
  const rosters = load<SleeperRoster[]>('rosters.json')
  const teams = buildTeamMap(users, rosters)

  function viewAtWeek(week: number) {
    const matchupsByWeek = matchupsThroughWeek(week)
    const standings = computeStandingsThroughWeek(matchupsByWeek, teams, week)
    const scheduleByWeek = buildScheduleByWeek(matchupsByWeek)
    return computeFrankieZoneView({
      standings,
      teams,
      matchupsByWeek,
      scheduleByWeek,
      throughWeek: week,
      selectedWeek: week,
      weekInProgress: false,
      playoffWeekStart: 15,
    })
  }

  it('week 1 census: six teams at 0-1 in the zone', () => {
    const view = viewAtWeek(1)
    expect(view.residents).toHaveLength(6)
    expect(view.censusLine).toContain('AFTER WEEK 1')
    expect(view.escapes).toHaveLength(0)
  })

  it('week 2 census: three winless teams remain', () => {
    const view = viewAtWeek(2)
    expect(view.residents).toHaveLength(3)
    const names = view.residents.map((r) => r.displayName)
    expect(names).toEqual(
      expect.arrayContaining(['Santagua', 'kingCrooke', 'GetThePapers2x']),
    )
    expect(view.escapes.length).toBeGreaterThan(0)
    expect(view.escapes.every((e) => e.week <= 2)).toBe(true)
  })

  it('week 3 census: Frankie and Santagua only', () => {
    const view = viewAtWeek(3)
    expect(view.residents).toHaveLength(2)
    expect(view.residents.map((r) => r.displayName).sort()).toEqual([
      'GetThePapers2x',
      'Santagua',
    ])
    expect(view.zoneName).toBe('Frankie')
    expect(view.heroTitle).toBe(zoneHeroTitle('Frankie'))
    expect(view.residents.every((r) => r.losses === 3)).toBe(true)
  })

  it('formats census and rename meter', () => {
    expect(censusSubtitle(2, 3, true, 4)).toContain('AFTER WEEK 3')
    expect(censusSubtitle(2, 3, true, 4)).toContain('IN PROGRESS')
    expect(renameMeterLabel(3)).toBe('5 losses from breaking the record')
    expect(renameMeterLabel(7)).toBe('1 loss from breaking the record')
  })

  it('detects zone-vs-zone collisions after the as-of week only', () => {
    const week4: SleeperMatchup[] = [
      { roster_id: 1, matchup_id: 5, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 11, matchup_id: 5, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 2, matchup_id: 4, points: 0, starters: [], starters_points: [], players_points: {} },
      { roster_id: 5, matchup_id: 4, points: 0, starters: [], starters_points: [], players_points: {} },
    ]
    const sched = buildScheduleByWeek(new Map([[4, week4]]))
    const hits = findZoneCollisions(new Set([1, 11]), sched, teams, 4, 3, 15)
    expect(hits).toHaveLength(1)
    expect(hits[0].week).toBe(4)
    expect(hits[0].weeksUntil).toBe(1)
  })

  it('excludes playoff weeks and caps displayed collisions at two', () => {
    expect(regularSeasonLastWeek(15)).toBe(14)
    const sched = new Map<number, Map<number, number>>()
    for (let week = 2; week <= 17; week++) {
      sched.set(week, new Map([[1, 11], [11, 1]]))
    }
    const all = findZoneCollisions(new Set([1, 11]), sched, teams, 2, 1, 15)
    expect(all.every((c) => c.week < 15)).toBe(true)
    expect(all[0].week).toBe(2)
    expect(all.at(-1)?.week).toBe(14)
    const limited = limitZoneCollisions(all, 2)
    expect(limited.collisions).toHaveLength(2)
    expect(limited.moreCount).toBe(all.length - 2)
  })

  it('week 3 view surfaces at most two upcoming collisions', () => {
    const sched = new Map<number, Map<number, number>>()
    for (let week = 4; week <= 14; week++) {
      sched.set(week, new Map([[1, 11], [11, 1]]))
    }
    const matchupsByWeek = matchupsThroughWeek(3)
    const standings = computeStandingsThroughWeek(matchupsByWeek, teams, 3)
    const view = computeFrankieZoneView({
      standings,
      teams,
      matchupsByWeek,
      scheduleByWeek: sched,
      throughWeek: 3,
      selectedWeek: 3,
      weekInProgress: false,
      playoffWeekStart: 15,
    })
    expect(view.collisions.length).toBeLessThanOrEqual(2)
    expect(view.collisions[0]?.week).toBe(4)
    expect(view.moreCollisionsCount).toBeGreaterThan(0)
  })

  it('resolves renamed zone when a team hits 0-8', () => {
    const matchupsByWeek = matchupsThroughWeek(3)
    const standings = computeStandingsThroughWeek(matchupsByWeek, teams, 3)
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

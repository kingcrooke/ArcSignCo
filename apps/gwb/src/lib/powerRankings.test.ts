import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { managerNickname } from './nicknames'
import { computePowerRankings } from './powerRankings'
import { buildTeamMap } from './teams'
import type { SleeperMatchup, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')
const prFixtures = join(fixtures, 'power-rankings')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

function loadPr<T>(name: string): T {
  return JSON.parse(readFileSync(join(prFixtures, name), 'utf-8')) as T
}

describe('computePowerRankings', () => {
  it('orders managers through Week 5 per Sleeper fixture', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const teams = buildTeamMap(users, rosters)
    const matchupsByWeek = new Map<number, SleeperMatchup[]>()
    for (const week of [1, 2, 3, 4, 5]) {
      matchupsByWeek.set(week, loadPr<SleeperMatchup[]>(`matchups-${week}.json`))
    }

    const rows = computePowerRankings({
      matchupsByWeek,
      teams,
      throughWeek: 5,
    })

    const names = rows.map((r) => managerNickname(r.rosterId, r.displayName))
    expect(names).toEqual([
      'Steven',
      'Hady',
      'Kayser',
      'Matt',
      'Jamil',
      'Mauricio',
      'Danny',
      'Crooke',
      'Eric',
      'Manny',
      'Narking',
      'Frankie',
    ])

    expect(rows[0].score).toBeGreaterThan(80)
    expect(rows[0].wins).toBe(4)
    expect(rows[0].losses).toBe(1)
    expect(rows[11].score).toBeLessThan(20)
  })

  it('movement compares rank through week 4 vs week 5', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const teams = buildTeamMap(users, rosters)
    const matchupsByWeek = new Map<number, SleeperMatchup[]>()
    for (const week of [1, 2, 3, 4, 5]) {
      matchupsByWeek.set(week, loadPr<SleeperMatchup[]>(`matchups-${week}.json`))
    }

    const w4 = computePowerRankings({
      matchupsByWeek,
      teams,
      throughWeek: 4,
    })
    const w5 = computePowerRankings({
      matchupsByWeek,
      teams,
      throughWeek: 5,
    })
    const w4Rank = new Map(w4.map((r) => [r.rosterId, r.rank]))
    for (const row of w5) {
      if (row.movement == null) continue
      const prev = w4Rank.get(row.rosterId)
      expect(prev).toBe(row.prevRank)
      expect(row.movement).toBe(prev! - row.rank)
    }
  })
})

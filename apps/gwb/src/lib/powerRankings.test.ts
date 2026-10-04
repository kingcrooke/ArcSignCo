import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computePowerRankings } from './powerRankings'
import { buildTeamMap } from './teams'
import type { SleeperMatchup, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('computePowerRankings', () => {
  it('returns ranked rows with scores', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const matchups = load<SleeperMatchup[]>('matchups-3.json')
    const teams = buildTeamMap(users, rosters)
    const map = new Map([[3, matchups]])
    const rows = computePowerRankings(rosters, teams, map, 3, 10)
    expect(rows).toHaveLength(12)
    expect(rows[0].score).toBeGreaterThanOrEqual(rows[11].score)
    expect(rows[0].rank).toBe(1)
  })
})

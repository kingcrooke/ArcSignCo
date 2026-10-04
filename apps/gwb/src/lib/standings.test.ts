import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { computeStandings, recordLabel } from './standings'
import type { SleeperRoster, SleeperUser } from './types'

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
})

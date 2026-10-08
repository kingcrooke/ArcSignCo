import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { computeWeeklyAwardsForWeek } from './weeklyAwards'
import type { SleeperMatchup, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('weekly awards', () => {
  it('picks high and low from fixture week 3', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const teams = buildTeamMap(users, rosters)
    const matchups = load<SleeperMatchup[]>('matchups-3.json')
    const awards = computeWeeklyAwardsForWeek(3, matchups, teams)
    expect(awards.highScore).toBeTruthy()
    expect(awards.lowScore).toBeTruthy()
    expect(awards.highScore!.value).toBeGreaterThan(awards.lowScore!.value)
  })
})

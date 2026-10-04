import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildWeekRecaps } from './recaps'
import { computeStandings } from './standings'
import { buildTeamMap } from './teams'
import type {
  PlayersMap,
  SleeperMatchup,
  SleeperRoster,
  SleeperUser,
} from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('buildWeekRecaps', () => {
  it('builds narratives and tags blowouts', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const matchups = load<SleeperMatchup[]>('matchups-3.json')
    const players = load<PlayersMap>('players-slim.json')
    const teams = buildTeamMap(users, rosters)
    const standings = computeStandings(rosters, teams)
    const recaps = buildWeekRecaps(matchups, teams, players, standings)
    expect(recaps.length).toBeGreaterThan(0)
    const blowout = recaps.find((r) => r.tags.includes('Blowout'))
    expect(blowout).toBeTruthy()
    expect(recaps.some((r) => r.isMatchupOfTheWeek)).toBe(true)
    recaps.forEach((r) => {
      expect(r.narrative.length).toBeGreaterThan(10)
      expect(r.teamA.topScorer).toBeTruthy()
    })
  })
})

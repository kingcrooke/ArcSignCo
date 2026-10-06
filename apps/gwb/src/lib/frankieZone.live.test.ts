import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildScheduleByWeek, computeFrankieZoneView } from './frankieZone'
import { loadPlayersMap } from './playersCache'
import { fetchLeague, fetchMatchups, fetchNflWeekScores } from './sleeperApi'
import { buildTeamMap } from './teams'
import type { SleeperLeague, SleeperRoster, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('frankieZone live Sleeper', () => {
  it('shows Frankie and Danny escaped W4 after MNF finals (Sleeper leg may still be 3)', async () => {
    const league = await fetchLeague()
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const teams = buildTeamMap(users, rosters)
    const completedThroughWeek = league.settings.last_scored_leg ?? 3
    const selectedWeek = completedThroughWeek + 1

    const matchupsByWeek = new Map<number, import('./types').SleeperMatchup[]>()
    for (let w = 1; w <= selectedWeek; w++) {
      const rows = await fetchMatchups(w)
      if (rows?.length) matchupsByWeek.set(w, rows)
    }
    const [players, nflWeekGames] = await Promise.all([
      loadPlayersMap(),
      fetchNflWeekScores('2026', selectedWeek, 'regular'),
    ])

    const view = computeFrankieZoneView({
      teams,
      matchupsByWeek,
      scheduleByWeek: buildScheduleByWeek(matchupsByWeek),
      completedThroughWeek,
      selectedWeek,
      weekInProgress: true,
      players,
      nflWeekGames,
    })

    const danny = view.escapes.find((e) => e.displayName === 'Santagua')
    expect(danny?.week).toBe(4)
    expect(danny?.line).toMatch(/163\.91/)
    expect(danny?.opponentLabel).toBe('kingCrooke')

    const frankie = view.escapes.find((e) => e.displayName === 'GetThePapers2x')
    expect(frankie?.week).toBe(4)
    expect(frankie?.points).toBeCloseTo(144.8, 2)
    expect(frankie?.opponentLabel).toBe('powpeazy')
    expect(frankie?.line).toMatch(/144\.80/)

    expect(view.residents.map((r) => r.displayName)).not.toContain('Santagua')
    expect(view.residents.map((r) => r.displayName)).not.toContain('GetThePapers2x')
    expect(view.residents).toHaveLength(0)
    expect(view.isEmpty).toBe(true)
    expect(view.weekInProgressNote).toContain('finalized matchups only')
  })
})

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import commissionerRecaps from '../content/commissioner-recaps.json'
import {
  buildWeekRecaps,
  filterCommissionerRecapsByWeek,
  type CommissionerRecap,
} from './recaps'
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
    const recaps = buildWeekRecaps(matchups, teams, players, {
      rosterPositions: load('league.json').roster_positions,
      preWeekStandings: standings,
      isWeekFinal: true,
    })
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

describe('commissioner recaps timeline', () => {
  const recaps = commissionerRecaps.recaps as CommissionerRecap[]

  it('orders week 2 posts chronologically', () => {
    const ids = filterCommissionerRecapsByWeek(recaps, 2).map((r) => r.id)
    expect(ids).toEqual([
      'recap-6',
      'recap-2',
      'recap-3',
      'recap-4',
      'recap-5',
      'recap-7',
      'recap-8',
    ])
  })

  it('orders week 3 posts chronologically', () => {
    const ids = filterCommissionerRecapsByWeek(recaps, 3).map((r) => r.id)
    expect(ids).toEqual([
      'recap-9',
      'recap-10',
      'recap-11',
      'recap-12',
      'recap-13',
    ])
  })

  it('puts final reports after monday night; correction before final when earlier', () => {
    const week2 = filterCommissionerRecapsByWeek(recaps, 2)
    expect(week2.at(-1)?.label).toBe('Final')
    const week3 = filterCommissionerRecapsByWeek(recaps, 3)
    expect(week3.find((r) => r.label === 'Correction')?.id).toBe('recap-12')
    const correctionIdx = week3.findIndex((r) => r.id === 'recap-12')
    const finalIdx = week3.findIndex((r) => r.id === 'recap-13')
    expect(correctionIdx).toBeLessThan(finalIdx)
  })

  it('lists the week 4 final report above the predictions post', () => {
    const week4 = filterCommissionerRecapsByWeek(recaps, 4)
    const ids = week4.map((r) => r.id)
    expect(ids).toEqual(['recap-15', 'recap-14'])
    const final = week4[0]
    expect(final?.label).toBe('Final')
    expect(final?.week).toBe(4)
    expect(final?.reconstructed).toBe(false)
    expect(final?.index).toBeGreaterThan(14)
    expect(final?.title).toContain('WEEK 4 FINAL REPORT')
    expect(final?.title).toContain('FRANKIE ZONE HAS BEEN EVACUATED')
    expect(final?.bodyMarkdown).toContain('Steven 180.56')
    expect(final?.bodyMarkdown).toContain('Narking 141.21')
    expect(final?.bodyMarkdown).toContain('714.07')
    expect(final?.bodyMarkdown).toContain('Kayser')
    expect(final?.bodyMarkdown).toContain('Hady')
    expect(final?.bodyMarkdown).not.toMatch(/Hadi|HADI|Kaiser|@\d{8,}/)
    const waiver = week4[1]
    expect(waiver?.id).toBe('recap-14')
    expect(waiver?.label).toBe('Predictions')
    expect(waiver?.title).toContain("WHO'S ACTUALLY GOOD?")
  })
})

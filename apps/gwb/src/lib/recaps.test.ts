import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import commissionerRecaps from '../content/commissioner-recaps.json'
import {
  buildWeekRecaps,
  displayMargin,
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

describe('displayMargin', () => {
  it('subtracts raw scores and rounds once to two decimals', () => {
    expect(displayMargin(161.66, 124.44)).toBe('37.22')
    expect(displayMargin(139.98, 135.83)).toBe('4.15')
    expect(displayMargin(122.0, 121.92)).toBe('0.08')
    expect(displayMargin(60.16, 60.1)).toBe('0.06')
    expect(displayMargin(137.59, 134.98)).toBe('2.61')
  })
})

describe('buildWeekRecaps', () => {
  it('builds narratives and tags blowouts', () => {
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<SleeperRoster[]>('rosters.json')
    const matchups = load<SleeperMatchup[]>('matchups-3.json')
    const players = load<PlayersMap>('players-slim.json')
    const teams = buildTeamMap(users, rosters)
    const standings = computeStandings(rosters, teams)
    const recaps = buildWeekRecaps(matchups, teams, players, {
      week: 1,
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

  it('lists the week 5 final mega report', () => {
    const week5 = filterCommissionerRecapsByWeek(recaps, 5)
    const ids = week5.map((r) => r.id)
    expect(ids).toEqual(['recap-16'])
    const final = week5[0]
    expect(final?.label).toBe('Final')
    expect(final?.week).toBe(5)
    expect(final?.reconstructed).toBe(false)
    expect(final?.index).toBe(16)
    expect(final?.postedAt).toBe('2026-10-18')
    expect(final?.title).toContain('WEEK 5 MEGA REPORT')
    expect(final?.title).toContain('FALL OF THE UNDEFEATED')
    expect(final?.bodyMarkdown).toContain('Crooke 159.29')
    expect(final?.bodyMarkdown).toContain('Steven 120.77')
    expect(final?.bodyMarkdown).toContain('834.84')
    expect(final?.bodyMarkdown).toContain('212.33')
    expect(final?.bodyMarkdown).not.toMatch(/Hadi|HADI|Kaiser|@\d{8,}/)
    expect(final?.bodyMarkdown).not.toContain(
      'GWB WEEK 5 MEGA REPORT — WAIVER RECEIPTS',
    )
  })

  it('lists the week 6 final report', () => {
    const week6Source = readFileSync(
      join(fixtures, 'week6-commissioner-recap.md'),
      'utf-8',
    )
    const week6 = filterCommissionerRecapsByWeek(recaps, 6)
    const ids = week6.map((r) => r.id)
    expect(ids).toEqual(['recap-17'])
    const final = week6[0]
    expect(final?.bodyMarkdown).toBe(week6Source)
  })

  it('lists the week 7 final report', () => {
    const week7Source = readFileSync(
      join(fixtures, 'week7-commissioner-recap.md'),
      'utf-8',
    )
    const week7 = filterCommissionerRecapsByWeek(recaps, 7)
    const ids = week7.map((r) => r.id)
    expect(ids).toEqual(['recap-18'])
    const final = week7[0]
    expect(final?.label).toBe('Final')
    expect(final?.week).toBe(7)
    expect(final?.bodyMarkdown).toBe(week7Source)
  })

  it('lists the week 9 final report', () => {
    const week9Source = readFileSync(
      join(fixtures, 'week9-commissioner-recap.md'),
      'utf-8',
    )
    const week9 = filterCommissionerRecapsByWeek(recaps, 9)
    const ids = week9.map((r) => r.id)
    expect(ids).toEqual(['recap-19'])
    const final = week9[0]
    expect(final?.label).toBe('Final')
    expect(final?.week).toBe(9)
    expect(final?.bodyMarkdown).toBe(week9Source)
  })
})

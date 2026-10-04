import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { computeWaiverBoard } from './waiverWire'
import type {
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
} from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const root = join(dir, '../test/fixtures')
const waiver = join(root, 'waiver')

function load<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function boardThrough(scoringThrough: number, selectedWeek = scoringThrough) {
  const users = load<SleeperUser[]>(join(root, 'users.json'))
  const rosters = load<SleeperRoster[]>(join(root, 'rosters.json'))
  const teams = buildTeamMap(users, rosters)
  const transactions: SleeperTransaction[] = []
  for (let w = 1; w <= 4; w++) {
    transactions.push(
      ...load<SleeperTransaction[]>(join(waiver, `transactions-${w}.json`)),
    )
  }
  const matchupsByWeek = new Map<number, SleeperMatchup[]>()
  for (let w = 1; w <= 4; w++) {
    matchupsByWeek.set(
      w,
      load<SleeperMatchup[]>(join(waiver, `matchups-${w}.json`)),
    )
  }
  return computeWaiverBoard({
    transactions,
    matchupsByWeek,
    teams,
    rosters,
    scoringThrough,
    selectedWeek,
    selectedWeekComplete: selectedWeek >= 1 && selectedWeek <= scoringThrough,
  })
}

function row(board: ReturnType<typeof boardThrough>, rosterId: number) {
  const found = board.managers.find((m) => m.rosterId === rosterId)
  if (!found) throw new Error(`missing roster ${rosterId}`)
  return found
}

describe('computeWaiverBoard', () => {
  it('does not give a Tuesday waiver add the week it was filed under', () => {
    const through1 = boardThrough(1)
    const frankie = row(through1, 11)
    expect(frankie.bestPickup?.playerId).not.toBe('11834')
    expect(frankie.startedPoints).toBeCloseTo(0, 5)

    const through3 = boardThrough(3)
    const veleMove = through3.moves.find(
      (m) => m.adds.includes('11834') && m.status === 'complete',
    )
    expect(veleMove?.leg).toBe(1)
    expect(veleMove?.startedPoints).toBeCloseTo(18.3, 5)
    expect(row(through3, 11).bestPickup).toMatchObject({
      playerId: '11834',
      points: 18.3,
    })
  })

  it('credits Marvin Harrison week 3 to the claim and the drop', () => {
    const board = boardThrough(3)
    const narking = row(board, 3)
    expect(narking.bestPickup?.playerId).toBe('12545')
    expect(narking.startedPoints).toBeCloseTo(47.27, 2)
    const mhj = board.moves.find(
      (m) => m.rosterId === 3 && m.adds.includes('11628') && m.status === 'complete',
    )
    expect(mhj?.startedPoints).toBeCloseTo(7, 5)
    expect(row(board, 11).dropRegret).toBeCloseTo(7, 5)
  })

  it('counts Sam Darnold week 3 as BigBlue drop regret and hairychest pickup', () => {
    const board = boardThrough(3)
    expect(row(board, 10).dropRegret).toBeCloseTo(47.89, 2)
    expect(row(board, 10).netWaiverPoints).toBeCloseTo(-42.59, 2)
    expect(row(board, 7).bestPickup).toMatchObject({
      playerId: '4943',
      points: 47.89,
    })
    expect(row(board, 7).eligible).toBe(false)
  })

  it('ranks the championship pool through week 3 and ignores week 4 points', () => {
    const board = boardThrough(3)
    expect(board.champion?.rosterId).toBe(3)
    expect(board.champion?.displayName).toBe('NarkingR')
    expect(board.champion?.wes).toBeCloseTo(11.8175, 2)
    expect(board.champion?.rosteredPickups).toBe(4)
    expect(board.cellar?.rosterId).toBe(10)
    expect(board.cellar?.displayName).toBe('BigBlue01')
    expect(board.cellar?.wes).toBeCloseTo(-14.1967, 2)
    expect(board.cellar?.poolRank).toBe(9)

    const withoutWeek4 = computeWaiverBoard({
      transactions: board.moves.length
        ? loadTx()
        : [],
      matchupsByWeek: loadMatchups(3),
      teams: loadTeams(),
      rosters: loadRosters(),
      scoringThrough: 3,
      selectedWeek: 3,
      selectedWeekComplete: true,
    })
    expect(withoutWeek4.champion?.startedPoints).toBeCloseTo(
      board.champion?.startedPoints ?? 0,
      5,
    )
    expect(row(board, 10).startedPoints).toBeCloseTo(
      row(withoutWeek4, 10).startedPoints,
      5,
    )
  })

  it('week 3 pickup of the week is Darnold and the worst drop is the same player', () => {
    const board = boardThrough(3)
    expect(board.pickupOfWeek).toMatchObject({
      week: 3,
      playerId: '4943',
      rosterId: 7,
      points: 47.89,
    })
    expect(board.worstDropOfWeek).toMatchObject({
      week: 3,
      playerId: '4943',
      rosterId: 10,
      startedByRosterId: 7,
      points: 47.89,
    })
    expect(board.weeklyRanking[0]?.rosterId).toBe(7)
    expect(board.weeklyRanking[0]?.weeklyStarted).toBeCloseTo(47.89, 2)
  })

  it('leaves weekly points empty while the selected week is still in progress', () => {
    const board = boardThrough(3, 4)
    expect(board.selectedWeekComplete).toBe(false)
    expect(board.pickupOfWeek).toBeNull()
    expect(board.worstDropOfWeek).toBeNull()
    expect(board.weeklyRanking).toHaveLength(0)
    expect(board.champion?.rosterId).toBe(3)
    expect(board.scoringThrough).toBe(3)
    const week4Adds = board.moves.filter((m) => m.leg === 4 && m.adds.length)
    expect(week4Adds.length).toBeGreaterThan(0)
    expect(week4Adds.every((m) => m.pending || m.status === 'failed')).toBe(true)
  })

  it('does not score failed claims', () => {
    const board = boardThrough(3)
    const frankie = row(board, 11)
    expect(frankie.failedClaims).toBe(8)
    const failed = board.moves.filter((m) => m.rosterId === 11 && m.status === 'failed')
    expect(failed).toHaveLength(8)
    expect(failed.every((m) => m.startedPoints == null)).toBe(true)
  })
})

function loadTx(): SleeperTransaction[] {
  const transactions: SleeperTransaction[] = []
  for (let w = 1; w <= 4; w++) {
    transactions.push(
      ...load<SleeperTransaction[]>(join(waiver, `transactions-${w}.json`)),
    )
  }
  return transactions
}

function loadMatchups(through: number): Map<number, SleeperMatchup[]> {
  const map = new Map<number, SleeperMatchup[]>()
  for (let w = 1; w <= through; w++) {
    map.set(w, load<SleeperMatchup[]>(join(waiver, `matchups-${w}.json`)))
  }
  return map
}

function loadTeams() {
  const users = load<SleeperUser[]>(join(root, 'users.json'))
  const rosters = load<SleeperRoster[]>(join(root, 'rosters.json'))
  return buildTeamMap(users, rosters)
}

function loadRosters() {
  return load<SleeperRoster[]>(join(root, 'rosters.json'))
}

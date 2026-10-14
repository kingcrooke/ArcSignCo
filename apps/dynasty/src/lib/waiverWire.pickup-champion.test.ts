import { describe, expect, it } from 'vitest'
import { LEAGUE_ID } from './constants'
import { buildTeamMap } from './teams'
import {
  comparePickupChampionRank,
  computeWaiverBoard,
  countCompletedPickupsByRoster,
} from './waiverWire'
import type {
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
} from './types'

const SLEEPER = 'https://api.sleeper.app/v1'

describe('pickup champion ranking', () => {
  it('counts every completed waiver and free_agent add in the leg window', () => {
    const txs: SleeperTransaction[] = [
      {
        transaction_id: 'fa1',
        type: 'free_agent',
        status: 'complete',
        leg: 1,
        status_updated: 100,
        roster_ids: [1],
        adds: { p1: 1, p2: 1 },
        drops: null,
        settings: { seq: 1 },
        metadata: null,
      },
      {
        transaction_id: 'w1',
        type: 'waiver',
        status: 'complete',
        leg: 1,
        status_updated: 200,
        roster_ids: [2],
        adds: { p3: 2 },
        drops: null,
        settings: { seq: 1 },
        metadata: null,
      },
      {
        transaction_id: 'trade1',
        type: 'trade',
        status: 'complete',
        leg: 1,
        status_updated: 300,
        roster_ids: [1],
        adds: { p9: 1 },
        drops: null,
        settings: { seq: 1 },
        metadata: null,
      },
    ]
    const totals = countCompletedPickupsByRoster(txs, 1)
    expect(totals.get(1)).toBe(2)
    expect(totals.get(2)).toBe(1)
  })

  it('tiebreaks by FAAB spent then name', () => {
    const base = {
      rosterId: 1,
      displayName: 'Alpha',
      teamName: 'Alpha',
      faabBudget: 100,
      faabSpent: 10,
      faabRemaining: 90,
      waiverPriority: null,
      pickupCount: 5,
      rosteredPickups: 0,
      pendingPickups: 0,
      startedPoints: 0,
      benchPoints: 0,
      pointsPerPickup: null,
      hitHits: 0,
      hitWeeks: 0,
      hitRate: null,
      netWaiverPoints: 0,
      dropRegret: 0,
      failedClaims: 0,
      wes: null,
      eligible: false,
      poolRank: null,
      bestPickup: null,
      weeklyStarted: null,
      weeklyRegret: null,
      weeklyNet: null,
      cumulativeStarted: [],
    }
    const a = { ...base, rosterId: 1, faabSpent: 20, teamName: 'Zulu FC' }
    const b = { ...base, rosterId: 2, faabSpent: 30, teamName: 'Alpha FC' }
    expect(comparePickupChampionRank(b, a)).toBeLessThan(0)
    const c = { ...base, rosterId: 3, faabSpent: 30, teamName: 'Mango FC' }
    expect(comparePickupChampionRank(b, c)).toBeLessThan(0)
  })
})

describe('Dynasty league pickup totals (live Sleeper)', () => {
  it('board champion matches live completed-add counts through last scored week', async () => {
    const leagueId = LEAGUE_ID
    const league = await fetch(`${SLEEPER}/league/${leagueId}`).then((r) =>
      r.json(),
    ) as { settings?: { leg?: number; last_scored_leg?: number } }
    const scoringThrough =
      league.settings?.last_scored_leg ?? league.settings?.leg ?? 1

    const users = await fetch(`${SLEEPER}/league/${leagueId}/users`).then((r) =>
      r.json(),
    ) as SleeperUser[]
    const rosters = await fetch(`${SLEEPER}/league/${leagueId}/rosters`).then(
      (r) => r.json(),
    ) as SleeperRoster[]
    const teams = buildTeamMap(users, rosters)

    const transactions: SleeperTransaction[] = []
    const matchupsByWeek = new Map<number, SleeperMatchup[]>()
    for (let w = 1; w <= scoringThrough; w++) {
      transactions.push(
        ...(await fetch(
          `${SLEEPER}/league/${leagueId}/transactions/${w}`,
        ).then((r) => r.json()) as SleeperTransaction[]),
      )
      matchupsByWeek.set(
        w,
        await fetch(`${SLEEPER}/league/${leagueId}/matchups/${w}`).then((r) =>
          r.json(),
        ) as SleeperMatchup[],
      )
    }

    const totals = countCompletedPickupsByRoster(transactions, scoringThrough)
    const maxPickups = Math.max(0, ...totals.values())

    const board = computeWaiverBoard({
      transactions,
      matchupsByWeek,
      teams,
      rosters,
      scoringThrough,
      selectedWeek: scoringThrough,
      selectedWeekComplete: true,
    })

    expect(board.champion?.pickupCount).toBe(maxPickups)
    expect(board.champion?.pickupCount).toBe(
      totals.get(board.champion!.rosterId) ?? 0,
    )
    const champTeam = teams.get(board.champion!.rosterId)?.teamName ?? ''
    expect(champTeam).toMatch(/Rubuilding/i)

    const hoesId = [...teams.entries()].find(([, t]) =>
      (t.teamName || t.displayName).includes('Team Name Hoes'),
    )?.[0]
    expect(hoesId).toBeDefined()
    expect(board.managers.find((m) => m.rosterId === hoesId)?.pickupCount).toBe(
      totals.get(hoesId!) ?? 0,
    )
  })
})

import { describe, expect, it } from 'vitest'
import { computeWaiverBoard } from './waiverWire'
import type { SleeperMatchup, SleeperRoster, SleeperTransaction, TeamInfo } from './types'

const teams = new Map<number, TeamInfo>([
  [
    6,
    {
      rosterId: 6,
      ownerId: 'a',
      displayName: 'Buyer',
      teamName: 'Buyer FC',
    },
  ],
  [
    12,
    {
      rosterId: 12,
      ownerId: 'b',
      displayName: 'Seller',
      teamName: 'Seller FC',
    },
  ],
])

const rosters: SleeperRoster[] = [
  {
    roster_id: 6,
    owner_id: 'a',
    players: ['6786'],
    starters: ['6786'],
    settings: {
      wins: 0,
      losses: 0,
      ties: 0,
      fpts: 0,
      fpts_decimal: 0,
      fpts_against: 0,
      fpts_against_decimal: 0,
      ppts: 0,
      ppts_decimal: 0,
      waiver_budget_used: 0,
    },
  },
  {
    roster_id: 12,
    owner_id: 'b',
    players: [],
    starters: [],
    settings: {
      wins: 0,
      losses: 0,
      ties: 0,
      fpts: 0,
      fpts_decimal: 0,
      fpts_against: 0,
      fpts_against_decimal: 0,
      ppts: 0,
      ppts_decimal: 0,
      waiver_budget_used: 0,
    },
  },
]

function matchupWeek3(): SleeperMatchup[] {
  return [
    {
      roster_id: 6,
      matchup_id: 1,
      points: 41.3,
      starters: ['6786'],
      starters_points: [41.3],
      players_points: { '6786': 41.3 },
      players: ['6786'],
    },
    {
      roster_id: 12,
      matchup_id: 1,
      points: 0,
      starters: [],
      starters_points: [],
      players_points: {},
      players: [],
    },
  ]
}

describe('computeWaiverBoard trade exclusion', () => {
  it('does not score players acquired only via trade', () => {
    const trade: SleeperTransaction = {
      transaction_id: 'trade-lamb-fixture',
      type: 'trade',
      status: 'complete',
      leg: 2,
      status_updated: 1_000,
      roster_ids: [6, 12],
      adds: { '6786': 6, '9999': 12 },
      drops: { '6786': 12, '9999': 6 },
      draft_picks: [],
      waiver_budget: [],
      settings: null,
      metadata: null,
    }
    const waiverClose: SleeperTransaction = {
      transaction_id: 'waiver-batch-w3',
      type: 'waiver',
      status: 'complete',
      leg: 3,
      status_updated: 2_000,
      roster_ids: [10],
      adds: { '1234': 10 },
      drops: null,
      settings: { seq: 1 },
      metadata: null,
    }
    const matchupsByWeek = new Map<number, SleeperMatchup[]>([[3, matchupWeek3()]])
    const board = computeWaiverBoard({
      transactions: [trade, waiverClose],
      matchupsByWeek,
      teams,
      rosters,
      scoringThrough: 3,
      selectedWeek: 3,
      selectedWeekComplete: true,
    })

    const buyer = board.managers.find((m) => m.rosterId === 6)
    expect(buyer?.startedPoints).toBe(0)
    expect(buyer?.pickupCount).toBe(0)
    expect(buyer?.bestPickup).toBeNull()
    expect(board.moves.some((m) => m.adds.includes('6786'))).toBe(false)

    const spoofBoard = computeWaiverBoard({
      transactions: [
        trade,
        {
          transaction_id: 'spoof-fa',
          type: 'free_agent',
          status: 'complete',
          leg: 2,
          status_updated: 1_500,
          roster_ids: [6],
          adds: { '6786': 6 },
          drops: null,
          settings: null,
          metadata: null,
        },
        waiverClose,
      ],
      matchupsByWeek,
      teams,
      rosters,
      scoringThrough: 3,
      selectedWeek: 3,
      selectedWeekComplete: true,
    })
    const spoofBuyer = spoofBoard.managers.find((m) => m.rosterId === 6)
    expect(spoofBuyer?.startedPoints).toBe(0)
  })
})

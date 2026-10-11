import { describe, expect, it } from 'vitest'
import {
  buildRosterPlayerAcquisitionTimeline,
  computeWaiverBoard,
  isWaiverPickupAcquisition,
  latestAcquisitionBefore,
} from './waiverWire'
import type { SleeperMatchup, SleeperRoster, SleeperTransaction, TeamInfo } from './types'

const teams = new Map<number, TeamInfo>([
  [
    1,
    {
      rosterId: 1,
      ownerId: 'a',
      displayName: 'Alpha',
      teamName: 'Alpha FC',
    },
  ],
  [
    2,
    {
      rosterId: 2,
      ownerId: 'b',
      displayName: 'Beta',
      teamName: 'Beta FC',
    },
  ],
])

const rosters: SleeperRoster[] = [
  {
    roster_id: 1,
    owner_id: 'a',
    players: ['999'],
    starters: ['999'],
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
    roster_id: 2,
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

function waiverBatch(leg: number, time: number): SleeperTransaction {
  return {
    transaction_id: `waiver-close-w${leg}`,
    type: 'waiver',
    status: 'complete',
    leg,
    status_updated: time,
    roster_ids: [2],
    adds: { '0000': 2 },
    drops: null,
    settings: { seq: 1 },
    metadata: null,
  }
}

function matchup(week: number, points: number): Map<number, SleeperMatchup[]> {
  return new Map([
    [
      week,
      [
        {
          roster_id: 1,
          matchup_id: 1,
          points,
          starters: ['999'],
          starters_points: [points],
          players_points: { '999': points },
          players: ['999'],
        },
        {
          roster_id: 2,
          matchup_id: 1,
          points: 0,
          starters: [],
          starters_points: [],
          players_points: {},
          players: [],
        },
      ],
    ],
  ])
}

describe('roster acquisition timeline', () => {
  it('trade back after waiver pickup is not a waiver stint', () => {
    const txs: SleeperTransaction[] = [
      {
        transaction_id: 'fa-1',
        type: 'free_agent',
        status: 'complete',
        leg: 1,
        status_updated: 100,
        roster_ids: [1],
        adds: { '999': 1 },
        drops: null,
        settings: null,
        metadata: null,
      },
      {
        transaction_id: 'trade-out',
        type: 'trade',
        status: 'complete',
        leg: 2,
        status_updated: 200,
        roster_ids: [1, 2],
        adds: { '8888': 2, '999': 2 },
        drops: { '8888': 1, '999': 1 },
        settings: null,
        metadata: null,
      },
      {
        transaction_id: 'trade-back',
        type: 'trade',
        status: 'complete',
        leg: 3,
        status_updated: 300,
        roster_ids: [1, 2],
        adds: { '999': 1, '8888': 1 },
        drops: { '999': 2, '8888': 2 },
        settings: null,
        metadata: null,
      },
      waiverBatch(3, 400),
    ]
    const timeline = buildRosterPlayerAcquisitionTimeline(txs)
    const events = timeline.get('1:999') ?? []
    expect(isWaiverPickupAcquisition(latestAcquisitionBefore(events, 400))).toBe(false)

    const board = computeWaiverBoard({
      transactions: txs,
      matchupsByWeek: matchup(3, 25),
      teams,
      rosters,
      scoringThrough: 3,
      selectedWeek: 3,
      selectedWeekComplete: true,
    })
    const alpha = board.managers.find((m) => m.rosterId === 1)
    expect(alpha?.startedPoints).toBe(0)
  })

  it('commissioner add never earns waiver credit', () => {
    const txs: SleeperTransaction[] = [
      {
        transaction_id: 'comm-1',
        type: 'commissioner',
        status: 'complete',
        leg: 1,
        status_updated: 100,
        roster_ids: [1],
        adds: { '999': 1 },
        drops: null,
        settings: null,
        metadata: null,
      },
      waiverBatch(1, 200),
    ]
    const board = computeWaiverBoard({
      transactions: txs,
      matchupsByWeek: matchup(1, 18),
      teams,
      rosters,
      scoringThrough: 1,
      selectedWeek: 1,
      selectedWeekComplete: true,
    })
    expect(board.managers.find((m) => m.rosterId === 1)?.startedPoints).toBe(0)
  })

  it('failed waiver does not create a countable pickup', () => {
    const txs: SleeperTransaction[] = [
      {
        transaction_id: 'fail-1',
        type: 'waiver',
        status: 'failed',
        leg: 1,
        status_updated: 150,
        roster_ids: [1],
        adds: { '999': 1 },
        drops: null,
        settings: { seq: 1 },
        metadata: { notes: 'claimed by another owner' },
      },
      waiverBatch(1, 200),
    ]
    const board = computeWaiverBoard({
      transactions: txs,
      matchupsByWeek: matchup(1, 30),
      teams,
      rosters,
      scoringThrough: 1,
      selectedWeek: 1,
      selectedWeekComplete: true,
    })
    const alpha = board.managers.find((m) => m.rosterId === 1)
    expect(alpha?.startedPoints).toBe(0)
    expect(alpha?.failedClaims).toBe(1)
    expect(board.moves.some((m) => m.adds.includes('999') && m.status === 'failed')).toBe(
      true,
    )
  })

  it('pending waiver add after week close does not score that week', () => {
    const txs: SleeperTransaction[] = [
      waiverBatch(2, 100),
      {
        transaction_id: 'late-fa',
        type: 'free_agent',
        status: 'complete',
        leg: 2,
        status_updated: 150,
        roster_ids: [1],
        adds: { '999': 1 },
        drops: null,
        settings: null,
        metadata: null,
      },
    ]
    const board = computeWaiverBoard({
      transactions: txs,
      matchupsByWeek: matchup(2, 22),
      teams,
      rosters,
      scoringThrough: 2,
      selectedWeek: 2,
      selectedWeekComplete: true,
    })
    const alpha = board.managers.find((m) => m.rosterId === 1)
    expect(alpha?.startedPoints).toBe(0)
    expect(alpha?.pendingPickups).toBe(1)
  })
})

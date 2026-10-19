import { describe, expect, it } from 'vitest'
import {
  formatTradedPickHistory,
  futurePickOwnership,
  picksOwnedByRoster,
  tradedPickHistoryFromTransactions,
} from './drafts'
import type { SleeperTradedPick, SleeperTransaction, TeamInfo } from './types'

function team(rosterId: number, teamName: string, displayName = teamName): TeamInfo {
  return {
    rosterId,
    userId: `u${rosterId}`,
    displayName,
    teamName,
    leagueAvatarUrl: null,
    globalAvatarUrl: null,
    avatarUrl: null,
  }
}

const teams = new Map<number, TeamInfo>([
  [1, team(1, 'Saints & Sinners', 'Santagua')],
  [2, team(2, 'Nix in 5', 'FantasyThanos6')],
  [3, team(3, 'Wolf Pack', 'LoboSLB')],
  [6, team(6, 'A-Lamb-e que tengo hambre', 'kingCrooke')],
  [8, team(8, 'Chalupa Batman', 'Yuvraja')],
  [12, team(12, 'Rubuilding', 'NutCrusher')],
])

describe('future picks', () => {
  const traded: SleeperTradedPick[] = [
    { season: '2027', round: 1, roster_id: 1, owner_id: 7, previous_owner_id: 1 },
    { season: '2027', round: 2, roster_id: 1, owner_id: 12, previous_owner_id: 1 },
    { season: '2027', round: 3, roster_id: 1, owner_id: 10, previous_owner_id: 1 },
    { season: '2028', round: 1, roster_id: 1, owner_id: 3, previous_owner_id: 1 },
    { season: '2028', round: 2, roster_id: 1, owner_id: 8, previous_owner_id: 1 },
    { season: '2029', round: 1, roster_id: 1, owner_id: 11, previous_owner_id: 1 },
    { season: '2027', round: 1, roster_id: 8, owner_id: 1, previous_owner_id: 8 },
    { season: '2027', round: 1, roster_id: 12, owner_id: 1, previous_owner_id: 8 },
    { season: '2028', round: 1, roster_id: 8, owner_id: 1, previous_owner_id: 8 },
    { season: '2027', round: 2, roster_id: 3, owner_id: 3, previous_owner_id: 5 },
  ]

  it('keeps a roster’s own untraded picks plus acquired picks', () => {
    const owned = picksOwnedByRoster(traded, teams, 1, '2026', 3, 3).map(
      (p) => `${p.season} Rd ${p.round} (${p.originalLabel})`,
    )
    expect(owned).toEqual([
      '2027 Rd 1 (Chalupa Batman)',
      '2027 Rd 1 (Rubuilding)',
      '2028 Rd 1 (Chalupa Batman)',
      '2028 Rd 3 (Saints & Sinners)',
      '2029 Rd 2 (Saints & Sinners)',
      '2029 Rd 3 (Saints & Sinners)',
    ])
    expect(owned.join(' ')).not.toMatch(/2027 Rd [123] \(Saints/)
    expect(owned.join(' ')).not.toContain('2028 Rd 2 (Saints')
    expect(owned.join(' ')).not.toContain('2029 Rd 1 (Saints')
  })

  it('drops picks whose current owner is still the original owner', () => {
    const rows = futurePickOwnership(traded, teams, '2026', 3, 3)
    expect(
      rows.some((r) => r.originalLabel === 'Wolf Pack' && r.ownerLabel === 'Wolf Pack'),
    ).toBe(false)
    expect(rows.every((r) => r.originalRosterId !== r.ownerRosterId)).toBe(true)
  })
})

describe('traded pick history labels', () => {
  it('names the original pick and labels pre-September week 1 as Offseason', () => {
    const august = Date.parse('2026-08-02T18:00:00Z')
    const tx: SleeperTransaction = {
      type: 'trade',
      status: 'complete',
      status_updated: august,
      leg: 1,
      roster_ids: [6, 12],
      adds: null,
      drops: null,
      draft_picks: [
        {
          season: '2027',
          round: 2,
          roster_id: 2,
          previous_owner_id: 6,
          owner_id: 12,
        },
      ],
    }
    const [row] = tradedPickHistoryFromTransactions([tx], '2026')
    expect(formatTradedPickHistory(row, teams)).toBe(
      "2027 Rd 2 (Nix in 5's pick) · A-Lamb-e que tengo hambre → Rubuilding",
    )
    expect(row.periodLabel).toBe('Offseason')
  })
})

import { describe, expect, it } from 'vitest'
import { futurePickOwnership, picksOwnedByRoster, tradedPickHistoryFromTransactions } from './drafts'
import type { SleeperTradedPick, SleeperTransaction, TeamInfo } from './types'

function team(rosterId: number, teamName: string): TeamInfo {
  return {
    rosterId,
    userId: `u${rosterId}`,
    displayName: teamName,
    teamName,
    leagueAvatarUrl: null,
    globalAvatarUrl: null,
    avatarUrl: null,
  }
}

const teams = new Map<number, TeamInfo>([
  [1, team(1, 'Saints & Sinners')],
  [3, team(3, 'Wolf Pack')],
  [6, team(6, 'A-Lamb-e que tengo hambre')],
  [7, team(7, 'Love Thy Nabers')],
  [8, team(8, 'Chalupa Batman')],
  [10, team(10, 'Nix in 5')],
  [12, team(12, 'Rubuilding')],
])

const traded: SleeperTradedPick[] = [
  { season: '2027', round: 1, roster_id: 1, owner_id: 7, previous_owner_id: 1 },
  { season: '2027', round: 1, roster_id: 8, owner_id: 1, previous_owner_id: 8 },
  { season: '2027', round: 1, roster_id: 12, owner_id: 1, previous_owner_id: 8 },
  { season: '2027', round: 2, roster_id: 1, owner_id: 12, previous_owner_id: 3 },
  { season: '2027', round: 3, roster_id: 1, owner_id: 10, previous_owner_id: 1 },
  { season: '2028', round: 1, roster_id: 1, owner_id: 3, previous_owner_id: 1 },
  { season: '2028', round: 1, roster_id: 8, owner_id: 1, previous_owner_id: 8 },
  { season: '2028', round: 2, roster_id: 1, owner_id: 8, previous_owner_id: 1 },
  { season: '2029', round: 1, roster_id: 1, owner_id: 11, previous_owner_id: 1 },
  { season: '2028', round: 3, roster_id: 3, owner_id: 3, previous_owner_id: 3 },
]

describe('future pick ownership', () => {
  it('drops picks whose current owner is the original owner', () => {
    const rows = futurePickOwnership(traded, teams, '2026', 3)
    expect(rows.some((r) => r.originalRosterId === 3 && r.ownerRosterId === 3)).toBe(false)
    expect(rows.some((r) => r.originalLabel === 'Wolf Pack' && r.ownerLabel === 'Wolf Pack')).toBe(
      false,
    )
  })

  it('includes a roster’s own remaining picks plus acquired picks', () => {
    const owned = picksOwnedByRoster(traded, teams, 1, '2026', 3, 3).map(
      (r) => `${r.season} Rd ${r.round} (${r.originalLabel})`,
    )
    expect(owned).toEqual([
      '2027 Rd 1 (Chalupa Batman)',
      '2027 Rd 1 (Rubuilding)',
      '2028 Rd 1 (Chalupa Batman)',
      '2028 Rd 3 (Saints & Sinners)',
      '2029 Rd 2 (Saints & Sinners)',
      '2029 Rd 3 (Saints & Sinners)',
    ])
    expect(owned.some((line) => line.startsWith('2027 Rd 2'))).toBe(false)
    expect(owned.some((line) => line === '2029 Rd 1 (Saints & Sinners)')).toBe(false)
  })

  it('names the original pick and labels offseason trades', () => {
    const tx: SleeperTransaction = {
      type: 'trade',
      status: 'complete',
      leg: 1,
      status_updated: Date.parse('2026-04-12T12:00:00-04:00'),
      roster_ids: [6, 12],
      adds: null,
      drops: null,
      draft_picks: [
        {
          season: '2027',
          round: 2,
          roster_id: 10,
          previous_owner_id: 6,
          owner_id: 12,
        },
      ],
    }
    const [row] = tradedPickHistoryFromTransactions([tx], '2026')
    expect(row.originalRosterId).toBe(10)
    expect(row.weekLabel).toBe('Offseason')
    expect(row.fromRosterId).toBe(6)
    expect(row.toRosterId).toBe(12)
    const original = teams.get(row.originalRosterId)
    const from = teams.get(row.fromRosterId)
    const to = teams.get(row.toRosterId)
    expect(
      `${row.season} Rd ${row.round} (${original?.teamName}'s pick) · ${from?.teamName} → ${to?.teamName}`,
    ).toBe("2027 Rd 2 (Nix in 5's pick) · A-Lamb-e que tengo hambre → Rubuilding")
  })
})

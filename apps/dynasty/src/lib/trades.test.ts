import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { buildTradeLogEntry, isOffseasonTrade } from './trades'
import type { SleeperLeague, SleeperTransaction, SleeperUser, TeamInfo } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('trade log', () => {
  it('parses a completed player-for-player trade', () => {
    const league = load<SleeperLeague>('league.json')
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<{ roster_id: number; owner_id: string }[]>('rosters.json')
    const teams = buildTeamMap(users, rosters as import('./types').SleeperRoster[])
    const trade: SleeperTransaction = {
      transaction_id: 'tx-fixture-1',
      type: 'trade',
      status: 'complete',
      leg: 4,
      created: 1_700_000_000_000,
      roster_ids: [1, 3],
      adds: { '11563': 3, '12545': 1 },
      drops: { '11563': 1, '12545': 3 },
      draft_picks: [],
      waiver_budget: [],
      settings: null,
      metadata: null,
    }
    const players = {
      '11563': {
        full_name: 'Bo Nix',
        first_name: 'Bo',
        last_name: 'Nix',
        position: 'QB',
        team: 'DEN',
      },
      '12545': {
        full_name: 'Tyler Shough',
        first_name: 'Tyler',
        last_name: 'Shough',
        position: 'QB',
        team: 'NO',
      },
    }
    const entry = buildTradeLogEntry(trade, league, teams, players)
    expect(entry?.week).toBe(4)
    expect(entry?.sideA.managerName.length).toBeGreaterThan(0)
    expect(entry?.sideB.managerName.length).toBeGreaterThan(0)
    const sentA = entry?.sideA.sent.map((x) => x.label).join(' ')
    const recvB = entry?.sideB.received.map((x) => x.label).join(' ')
    expect(sentA).toContain('Bo Nix')
    expect(recvB).toContain('Bo Nix')
    expect(entry?.sideB.sent.map((x) => x.label).join(' ')).toContain('Tyler Shough')
  })

  it('splits the Oct 2 2026 pick trade by owner and previous owner', () => {
    const league = {
      league_id: '1312077668782473216',
      name: 'Dynasty of Champions',
      season: '2026',
      status: 'in_season',
      settings: { leg: 5 },
      roster_positions: [],
      scoring_settings: {},
    } as SleeperLeague
    const team = (
      rosterId: number,
      teamName: string,
      displayName: string,
    ): TeamInfo => ({
      rosterId,
      userId: `u${rosterId}`,
      displayName,
      teamName,
      leagueAvatarUrl: null,
      globalAvatarUrl: null,
      avatarUrl: null,
    })
    const teams = new Map<number, TeamInfo>([
      [7, team(7, 'Love Thy Nabers', 'NarkingR')],
      [10, team(10, 'ramonguaraguao', 'ramonguaraguao')],
      [12, team(12, 'Rubuilding', 'NutCrusher')],
    ])
    const trade: SleeperTransaction = {
      transaction_id: '1411881952012681216',
      type: 'trade',
      status: 'complete',
      leg: 5,
      status_updated: Date.parse('2026-10-02T16:00:00Z'),
      roster_ids: [12, 10],
      adds: null,
      drops: null,
      draft_picks: [
        { season: '2027', round: 1, roster_id: 10, previous_owner_id: 10, owner_id: 12 },
        { season: '2027', round: 2, roster_id: 10, previous_owner_id: 10, owner_id: 12 },
        { season: '2029', round: 1, roster_id: 10, previous_owner_id: 10, owner_id: 12 },
        { season: '2028', round: 2, roster_id: 12, previous_owner_id: 12, owner_id: 10 },
        { season: '2029', round: 2, roster_id: 12, previous_owner_id: 12, owner_id: 10 },
        { season: '2028', round: 1, roster_id: 7, previous_owner_id: 10, owner_id: 12 },
      ],
      waiver_budget: [],
      settings: null,
      metadata: null,
    }
    const entry = buildTradeLogEntry(trade, league, teams, {})
    const rub = entry?.sideA.rosterId === 12 ? entry.sideA : entry?.sideB
    const ram = entry?.sideA.rosterId === 10 ? entry.sideA : entry?.sideB
    expect(rub?.received.map((a) => a.label)).toEqual([
      '27 Rd 1 (ramonguaraguao)',
      '27 Rd 2 (ramonguaraguao)',
      '29 Rd 1 (ramonguaraguao)',
      '28 Rd 1 (Love Thy Nabers)',
    ])
    expect(ram?.received.map((a) => a.label)).toEqual([
      '28 Rd 2 (Rubuilding)',
      '29 Rd 2 (Rubuilding)',
    ])
    expect(rub?.sent.map((a) => a.label)).toEqual(ram?.received.map((a) => a.label))
    expect(ram?.sent.map((a) => a.label)).toEqual(rub?.received.map((a) => a.label))
  })

  it('labels a pre-September leg 1 trade as Offseason', () => {
    expect(isOffseasonTrade('2026', 1, Date.parse('2026-08-15T15:00:00Z'))).toBe(true)
    expect(isOffseasonTrade('2026', 1, Date.parse('2026-09-15T15:00:00Z'))).toBe(false)
  })
})

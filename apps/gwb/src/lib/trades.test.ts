import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTeamMap } from './teams'
import { buildTradeLogEntry } from './trades'
import type { SleeperLeague, SleeperTransaction, SleeperUser } from './types'

const dir = dirname(fileURLToPath(import.meta.url))
const fixtures = join(dir, '../test/fixtures')

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf-8')) as T
}

describe('trade log', () => {
  it('parses the Week 4 Bo Nix ↔ Tyler Shough trade', async () => {
    const league = load<SleeperLeague>('league.json')
    const users = load<SleeperUser[]>('users.json')
    const rosters = load<{ roster_id: number; owner_id: string }[]>('rosters.json')
    const teams = buildTeamMap(users, rosters as import('./types').SleeperRoster[])
    const res = await fetch(
      'https://api.sleeper.app/v1/league/1389375326257184768/transactions/4',
    )
    const txs = (await res.json()) as SleeperTransaction[]
    const trade = txs.find((t) => t.type === 'trade' && t.status === 'complete')
    expect(trade).toBeTruthy()
    const players = {
      '11563': { full_name: 'Bo Nix', first_name: 'Bo', last_name: 'Nix', position: 'QB', team: 'DEN' },
      '12545': { full_name: 'Tyler Shough', first_name: 'Tyler', last_name: 'Shough', position: 'QB', team: 'NO' },
    }
    const entry = buildTradeLogEntry(trade!, league, teams, players)
    expect(entry?.week).toBe(4)
    expect(entry?.sideA.managerName).toMatch(/Danny|Santagua/)
    expect(entry?.sideB.managerName).toMatch(/Narking/)
    const sentA = entry?.sideA.sent.map((x) => x.label).join(' ')
    const recvB = entry?.sideB.received.map((x) => x.label).join(' ')
    expect(sentA).toContain('Bo Nix')
    expect(recvB).toContain('Bo Nix')
    expect(entry?.sideB.sent.map((x) => x.label).join(' ')).toContain('Tyler Shough')
  })
})

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { groupMatchupPairs } from './matchupBoard'
import type { SleeperMatchup } from './types'

const LEAGUE = '1312077668782473216'
const API = 'https://api.sleeper.app/v1'

const slideData = JSON.parse(
  readFileSync(
    path.join(
      import.meta.dirname,
      '../../scripts/render-week-slides/slide-data.json',
    ),
    'utf8',
  ),
) as Record<string, unknown>

type ResultRow = {
  id: string
  matchupId: number
  homeRoster: number
  awayRoster: number
  homeOwner: string
  awayOwner: string
  homePts: number
  awayPts: number
  winnerRoster: number
}

describe('slide-data ground truth vs Sleeper', () => {
  it('weeks 1–4 results pair by matchup_id and map owner to user', async () => {
    const [users, rosters, ...weekMatchups] = await Promise.all([
      fetch(`${API}/league/${LEAGUE}/users`).then((r) => r.json()),
      fetch(`${API}/league/${LEAGUE}/rosters`).then((r) => r.json()),
      ...[1, 2, 3, 4].map((w) =>
        fetch(`${API}/league/${LEAGUE}/matchups/${w}`).then((r) => r.json()),
      ),
    ])

    const ownerByRoster = new Map(
      rosters.map((r: { roster_id: number; owner_id: string }) => [
        r.roster_id,
        r.owner_id,
      ]),
    )
    const userIds = new Set(users.map((u: { user_id: string }) => u.user_id))

    for (let i = 0; i < 4; i++) {
      const week = i + 1
      const matchups = weekMatchups[i] as SleeperMatchup[]
      const rows = slideData[`resultsWeek${week}`] as ResultRow[]

      expect(rows).toHaveLength(6)
      const pairs = groupMatchupPairs(matchups)
      expect(pairs).toHaveLength(6)

      for (let m = 0; m < 6; m++) {
        const row = rows[m]
        const pair = pairs[m]
        expect(row.matchupId).toBe(pair.matchupId)
        expect(row.homeRoster).toBe(pair.home.roster_id)
        expect(row.awayRoster).toBe(pair.away.roster_id)
        expect(row.homePts).toBe(Math.round(pair.home.points * 100) / 100)
        expect(row.awayPts).toBe(Math.round(pair.away.points * 100) / 100)

        const homeOwner = ownerByRoster.get(row.homeRoster)
        const awayOwner = ownerByRoster.get(row.awayRoster)
        expect(homeOwner).toBe(row.homeOwner)
        expect(awayOwner).toBe(row.awayOwner)
        expect(userIds.has(row.homeOwner)).toBe(true)
        expect(userIds.has(row.awayOwner)).toBe(true)

        const winner =
          pair.home.points > pair.away.points
            ? pair.home.roster_id
            : pair.away.roster_id
        expect(row.winnerRoster).toBe(winner)
      }
    }
  })
})

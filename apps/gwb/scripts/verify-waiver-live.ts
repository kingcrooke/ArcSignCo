/**
 * Replay computeWaiverBoard against live Sleeper data (weeks 1–4).
 * Usage: npx tsx scripts/verify-waiver-live.ts
 */
import { buildTeamMap } from '../src/lib/teams'
import { LEAGUE_ID, SLEEPER_API } from '../src/lib/constants'
import { managerNickname } from '../src/lib/nicknames'
import { computeWaiverBoard } from '../src/lib/waiverWire'
import type { SleeperMatchup, SleeperRoster, SleeperTransaction, SleeperUser } from '../src/lib/types'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${SLEEPER_API}${path}`)
  if (!res.ok) throw new Error(`${path} ${res.status}`)
  return res.json() as Promise<T>
}

async function main() {
  const league = await getJson<{ settings: { last_scored_leg?: number } }>(
    `/league/${LEAGUE_ID}`,
  )
  const scoringThrough = league.settings?.last_scored_leg ?? 4
  const users = await getJson<SleeperUser[]>(`/league/${LEAGUE_ID}/users`)
  const rosters = await getJson<SleeperRoster[]>(`/league/${LEAGUE_ID}/rosters`)
  const teams = buildTeamMap(users, rosters)

  const transactions: SleeperTransaction[] = []
  const matchupsByWeek = new Map<number, SleeperMatchup[]>()
  for (let w = 1; w <= scoringThrough; w++) {
    transactions.push(
      ...(await getJson<SleeperTransaction[]>(`/league/${LEAGUE_ID}/transactions/${w}`)),
    )
    matchupsByWeek.set(
      w,
      await getJson<SleeperMatchup[]>(`/league/${LEAGUE_ID}/matchups/${w}`),
    )
  }

  const board = computeWaiverBoard({
    transactions,
    matchupsByWeek,
    teams,
    rosters,
    scoringThrough,
    selectedWeek: scoringThrough,
    selectedWeekComplete: true,
  })

  const managers = board.managers.map((r) => ({
    rosterId: r.rosterId,
    name: managerNickname(r.rosterId, r.displayName),
    wes: r.wes,
    net: r.netWaiverPoints,
    started: r.startedPoints,
    regret: r.dropRegret,
    eligible: r.eligible,
    poolRank: r.poolRank,
  }))

  const payload = {
    scoringThrough,
    champion: board.champion
      ? {
          name: managerNickname(board.champion.rosterId, board.champion.displayName),
          wes: board.champion?.wes,
        }
      : null,
    cellar: board.cellar
      ? {
          name: managerNickname(board.cellar.rosterId, board.cellar.displayName),
          wes: board.cellar?.wes,
        }
      : null,
    managers,
  }
  console.log(JSON.stringify(payload, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

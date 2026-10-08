import { LEAGUE_ID, SLEEPER_API } from './constants'
import { buildTeamMap } from './teams'
import type {
  NflState,
  NflWeekGame,
  SleeperLeague,
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
  TeamInfo,
} from './types'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${SLEEPER_API}${path}`)
  if (!res.ok) {
    throw new Error(`Sleeper API ${path}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchNflState(): Promise<NflState> {
  return getJson('/state/nfl')
}

export function fetchNflWeekScores(
  season: string,
  week: number,
  seasonType = 'regular',
): Promise<NflWeekGame[]> {
  return getJson(`/scores/nfl/${seasonType}/${season}/${week}`)
}

export function fetchLeague(leagueId = LEAGUE_ID): Promise<SleeperLeague> {
  return getJson(`/league/${leagueId}`)
}

export function fetchUsers(leagueId = LEAGUE_ID): Promise<SleeperUser[]> {
  return getJson(`/league/${leagueId}/users`)
}

export function fetchRosters(leagueId = LEAGUE_ID): Promise<SleeperRoster[]> {
  return getJson(`/league/${leagueId}/rosters`)
}

export function fetchMatchups(
  week: number,
  leagueId = LEAGUE_ID,
): Promise<SleeperMatchup[]> {
  return getJson(`/league/${leagueId}/matchups/${week}`)
}

export function fetchTransactions(
  week: number,
  leagueId = LEAGUE_ID,
): Promise<SleeperTransaction[]> {
  return getJson(`/league/${leagueId}/transactions/${week}`)
}

export async function fetchTransactionsThroughWeek(
  throughWeek: number,
  leagueId = LEAGUE_ID,
): Promise<SleeperTransaction[]> {
  if (throughWeek < 1) return []
  const weeks = await Promise.all(
    Array.from({ length: throughWeek }, (_, i) =>
      fetchTransactions(i + 1, leagueId),
    ),
  )
  return weeks.flat()
}

export async function fetchAllMatchupsThroughWeek(
  throughWeek: number,
  leagueId = LEAGUE_ID,
): Promise<Map<number, SleeperMatchup[]>> {
  const map = new Map<number, SleeperMatchup[]>()
  const weeks = Array.from({ length: throughWeek }, (_, i) => i + 1)
  const results = await Promise.all(
    weeks.map((w) => fetchMatchups(w, leagueId).then((rows) => ({ w, rows }))),
  )
  for (const { w, rows } of results) {
    if (!rows?.length) continue
    const hasScores = rows.some((m) => m.points > 0 || m.starters?.length)
    if (hasScores) map.set(w, rows)
  }
  return map
}

export async function fetchMatchupsForWeekRange(
  fromWeek: number,
  toWeek: number,
  leagueId = LEAGUE_ID,
): Promise<Map<number, SleeperMatchup[]>> {
  const map = new Map<number, SleeperMatchup[]>()
  if (toWeek < fromWeek) return map
  const weeks = Array.from(
    { length: toWeek - fromWeek + 1 },
    (_, i) => fromWeek + i,
  )
  const results = await Promise.all(
    weeks.map((w) => fetchMatchups(w, leagueId).then((rows) => ({ w, rows }))),
  )
  for (const { w, rows } of results) {
    if (rows?.length) map.set(w, rows)
  }
  return map
}

const MAX_PRIOR_LEAGUE_CHAIN = 4

export interface LeagueTradeBundle {
  league: SleeperLeague
  teams: Map<number, TeamInfo>
  transactions: SleeperTransaction[]
}

export async function fetchTradeHistoryChain(
  startLeagueId = LEAGUE_ID,
): Promise<{
  bundles: LeagueTradeBundle[]
  priorSeasonsFailed: boolean
}> {
  const bundles: LeagueTradeBundle[] = []
  let priorSeasonsFailed = false
  let leagueId: string | null = startLeagueId
  let depth = 0

  while (leagueId && depth < MAX_PRIOR_LEAGUE_CHAIN) {
    try {
      const league = await fetchLeague(leagueId)
      const [users, rosters] = await Promise.all([
        fetchUsers(leagueId),
        fetchRosters(leagueId),
      ])
      const teams = buildTeamMap(users, rosters)
      const lastWeek =
        league.settings.playoff_week_start != null
          ? league.settings.playoff_week_start - 1
          : 18
      const scored =
        league.settings.last_scored_leg ??
        league.settings.leg ??
        lastWeek
      const through = Math.max(scored, lastWeek)
      const transactions = await fetchTransactionsThroughWeek(
        Math.min(through, 18),
        leagueId,
      )
      bundles.push({ league, teams, transactions })
      leagueId = league.previous_league_id ?? null
      depth++
    } catch {
      if (depth > 0) priorSeasonsFailed = true
      break
    }
  }

  return { bundles, priorSeasonsFailed }
}

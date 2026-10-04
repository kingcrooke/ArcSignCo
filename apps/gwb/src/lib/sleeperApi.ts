import { LEAGUE_ID, SLEEPER_API } from './constants'
import type {
  NflState,
  SleeperLeague,
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
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
  for (let w = 1; w <= throughWeek; w++) {
    const rows = await fetchMatchups(w, leagueId)
    if (!rows?.length) continue
    const hasScores = rows.some((m) => m.points > 0 || m.starters?.length)
    if (hasScores) map.set(w, rows)
  }
  return map
}

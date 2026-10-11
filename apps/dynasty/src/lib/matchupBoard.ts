import { managerNickname } from './nicknames'
import type { NflWeekGame, PlayersMap, SleeperMatchup, TeamInfo } from './types'

export interface MatchupPair {
  matchupId: number
  home: SleeperMatchup
  away: SleeperMatchup
}

export function groupMatchupPairs(
  matchups: SleeperMatchup[],
): MatchupPair[] {
  const byId = new Map<number, SleeperMatchup[]>()
  for (const m of matchups) {
    const list = byId.get(m.matchup_id) ?? []
    list.push(m)
    byId.set(m.matchup_id, list)
  }
  const pairs: MatchupPair[] = []
  for (const [matchupId, list] of byId) {
    if (list.length < 2) continue
    const sorted = [...list].sort((a, b) => a.roster_id - b.roster_id)
    pairs.push({
      matchupId,
      home: sorted[0],
      away: sorted[1],
    })
  }
  return pairs.sort((a, b) => a.matchupId - b.matchupId)
}

export function starterPositions(rosterPositions: string[]): string[] {
  return rosterPositions.filter(
    (p) => p !== 'BN' && p !== 'IR' && p !== 'TAXI' && p !== 'REC',
  )
}

export function isEmptyPlayerId(id: string | undefined | null): boolean {
  return !id || id === '0'
}

export function isDefenseId(id: string): boolean {
  return /^[A-Z]{2,4}$/.test(id)
}

export function playerDisplayName(
  id: string,
  players: PlayersMap,
): string {
  if (isEmptyPlayerId(id)) return 'Empty'
  if (isDefenseId(id)) return id
  const p = players[id]
  if (!p) return 'Player'
  return p.full_name
}

export function playerMetaLine(
  id: string,
  players: PlayersMap,
): string {
  if (isEmptyPlayerId(id)) return '—'
  if (isDefenseId(id)) return 'DEF'
  const p = players[id]
  if (!p) return '—'
  const pos = p.position ?? '—'
  const team = p.team ?? '—'
  return `${pos} · ${team}`
}

export function pointsForPlayer(
  matchup: SleeperMatchup,
  playerId: string,
  starterIndex: number | null,
): number {
  if (isEmptyPlayerId(playerId)) return 0
  const fromMap = matchup.players_points?.[playerId]
  if (typeof fromMap === 'number') return fromMap
  if (starterIndex !== null && matchup.starters_points?.[starterIndex] != null) {
    return matchup.starters_points[starterIndex] ?? 0
  }
  return 0
}

export function benchPlayerIds(matchup: SleeperMatchup): string[] {
  const starters = new Set(matchup.starters ?? [])
  const pool = matchup.players ?? []
  return pool.filter((id) => !isEmptyPlayerId(id) && !starters.has(id))
}

export function benchPointsTotal(
  matchup: SleeperMatchup,
): number {
  return benchPlayerIds(matchup).reduce(
    (sum, id) => sum + pointsForPlayer(matchup, id, null),
    0,
  )
}

export function teamLabel(
  rosterId: number,
  teams: Map<number, TeamInfo>,
): string {
  const team = teams.get(rosterId)
  if (!team) return `Team ${rosterId}`
  return managerNickname(rosterId, team.displayName)
}

export function leaderRosterId(
  a: SleeperMatchup,
  b: SleeperMatchup,
): number | null {
  if (a.points > b.points) return a.roster_id
  if (b.points > a.points) return b.roster_id
  return null
}

/** NFL teams with at least one non-final game in this fantasy week. */
export function nflTeamsWithOpenGames(games: NflWeekGame[]): Set<string> {
  const open = new Set<string>()
  for (const game of games) {
    if (game.status === 'complete') continue
    const home = game.metadata?.home_team
    const away = game.metadata?.away_team
    if (home) open.add(home)
    if (away) open.add(away)
  }
  return open
}

export function starterNflTeam(
  playerId: string,
  players: PlayersMap,
): string | null {
  if (isEmptyPlayerId(playerId)) return null
  if (isDefenseId(playerId)) return playerId
  return players[playerId]?.team ?? null
}

/** True when a starter still has an NFL game left to play this week. */
export function rosterHasStartersWithGamesRemaining(
  matchup: SleeperMatchup,
  players: PlayersMap,
  openTeams: Set<string>,
): boolean {
  for (const pid of matchup.starters ?? []) {
    const team = starterNflTeam(pid, players)
    if (team && openTeams.has(team)) return true
  }
  return false
}

export function isMatchupPairFinal(
  home: SleeperMatchup,
  away: SleeperMatchup,
  players: PlayersMap,
  nflGames: NflWeekGame[],
): boolean {
  const openTeams = nflTeamsWithOpenGames(nflGames)
  if (
    rosterHasStartersWithGamesRemaining(home, players, openTeams) ||
    rosterHasStartersWithGamesRemaining(away, players, openTeams)
  ) {
    return false
  }
  if (home.points === 0 && away.points === 0) {
    const played =
      home.starters?.some((_, i) => (home.starters_points[i] ?? 0) > 0) ||
      away.starters?.some((_, i) => (away.starters_points[i] ?? 0) > 0)
    if (!played) return false
  }
  return true
}

export function finalizedMatchupKeysForWeek(
  week: number,
  matchups: SleeperMatchup[],
  players: PlayersMap,
  nflGames: NflWeekGame[],
): Set<string> {
  const keys = new Set<string>()
  for (const { home, away } of groupMatchupPairs(matchups)) {
    if (isMatchupPairFinal(home, away, players, nflGames)) {
      keys.add(`${week}-${home.matchup_id}`)
    }
  }
  return keys
}

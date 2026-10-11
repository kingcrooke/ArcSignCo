import seasonTeamsJson from '../content/season-nfl-teams.json'
import type { ManagerSeasonFinish } from './managerSeasons'
import type { PlayersMap } from './types'
import { playerDisplayName } from './matchupBoard'

export type SeasonNflTeamsMap = Record<string, Record<string, string>>

const SEASON_NFL_TEAMS = seasonTeamsJson as SeasonNflTeamsMap

export function nflTeamForPlayerSeason(
  season: string,
  playerId: string,
): string | null {
  const team = SEASON_NFL_TEAMS[season]?.[playerId]
  return team ?? null
}

const POS_SORT: Record<string, number> = {
  QB: 0,
  RB: 1,
  WR: 2,
  TE: 3,
  FLEX: 4,
  K: 5,
  DEF: 6,
  DST: 6,
  DL: 7,
  LB: 8,
  DB: 9,
}

function positionSortKey(pos: string): number {
  return POS_SORT[pos.toUpperCase()] ?? 50
}

export interface PastRosterRow {
  id: string
  name: string
  pos: string
  nfl: string
  starter: boolean
}

export function buildPastRosterRows(
  finish: ManagerSeasonFinish,
  players: PlayersMap | null,
): PastRosterRow[] {
  const roster = finish.roster
  const season = finish.season
  const starters = roster.starters ?? []
  const starterIndex = new Map(starters.map((id, i) => [id, i]))
  const rows: PastRosterRow[] = []

  for (const pid of roster.players ?? []) {
    const p = players?.[pid]
    const pos = p?.position ?? '—'
    const nflTeam = nflTeamForPlayerSeason(season, pid)
    rows.push({
      id: pid,
      name: players ? playerDisplayName(pid, players) : pid,
      pos,
      nfl: nflTeam ?? '—',
      starter: starterIndex.has(pid),
    })
  }

  rows.sort((a, b) => {
    const ai = starterIndex.get(a.id)
    const bi = starterIndex.get(b.id)
    if (ai !== undefined && bi !== undefined) return ai - bi
    if (ai !== undefined) return -1
    if (bi !== undefined) return 1
    const pd = positionSortKey(a.pos) - positionSortKey(b.pos)
    if (pd !== 0) return pd
    return a.name.localeCompare(b.name)
  })

  return rows
}

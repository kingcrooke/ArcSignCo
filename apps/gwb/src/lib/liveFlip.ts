import {
  groupMatchupPairs,
  isMatchupPairFinal,
  nflTeamsWithOpenGames,
  starterNflTeam,
} from './matchupBoard'
import type { ProjectionsMap } from './projections'
import type { NflWeekGame, PlayersMap, SleeperMatchup } from './types'

export interface LiveFlipInsight {
  matchupId: number
  canFlip: boolean
  trailingRosterId: number
  trailingStillOut: number
  leaderStillOut: number
  summary: string
}

/**
 * Remaining starter points for players whose NFL game is not complete.
 * Returns null when projections are unavailable for any such starter.
 */
function starterPointsStillOut(
  matchup: SleeperMatchup,
  players: PlayersMap,
  openTeams: Set<string>,
  projections: ProjectionsMap,
): number | null {
  let sum = 0
  for (let i = 0; i < (matchup.starters?.length ?? 0); i++) {
    const pid = matchup.starters[i]
    if (!pid || pid === '0') continue
    const team = starterNflTeam(pid, players)
    if (!team || !openTeams.has(team)) continue
    const scored = matchup.starters_points?.[i] ?? 0
    const proj = projections[pid]
    if (typeof proj !== 'number' || Number.isNaN(proj)) return null
    const remaining = Math.max(0, proj - scored)
    sum += remaining
  }
  return sum
}

export function liveFlipForPair(
  home: SleeperMatchup,
  away: SleeperMatchup,
  players: PlayersMap,
  nflGames: NflWeekGame[],
  projections: ProjectionsMap | null,
): LiveFlipInsight | null {
  if (!projections || !nflGames.length) return null
  if (isMatchupPairFinal(home, away, players, nflGames)) return null

  const anyStarterScored =
    (home.starters_points?.some((p) => p > 0) ?? false) ||
    (away.starters_points?.some((p) => p > 0) ?? false)
  if (!anyStarterScored && home.points === 0 && away.points === 0) return null

  const openTeams = nflTeamsWithOpenGames(nflGames)
  if (!openTeams.size) return null

  const homeStill = starterPointsStillOut(home, players, openTeams, projections)
  const awayStill = starterPointsStillOut(away, players, openTeams, projections)
  if (homeStill === null || awayStill === null) return null
  if (homeStill <= 0 && awayStill <= 0) return null

  const homeLeads = home.points > away.points
  const tied = home.points === away.points
  const trailerId = tied
    ? homeStill >= awayStill
      ? home.roster_id
      : away.roster_id
    : homeLeads
      ? away.roster_id
      : home.roster_id
  const trailerStill = trailerId === home.roster_id ? homeStill : awayStill
  const leaderStill = trailerId === home.roster_id ? awayStill : homeStill
  const trailerPts =
    trailerId === home.roster_id ? home.points : away.points
  const leaderPts = trailerId === home.roster_id ? away.points : home.points

  const canFlip = trailerPts + trailerStill > leaderPts + 0.01

  let summary: string
  if (canFlip) {
    summary = `Can still flip — ~${trailerStill.toFixed(1)} pts still out for the trailing side`
  } else if (tied) {
    summary = `~${homeStill.toFixed(1)} / ~${awayStill.toFixed(1)} pts still out`
  } else {
    summary = `~${leaderStill.toFixed(1)} / ~${trailerStill.toFixed(1)} pts still out — unlikely to flip`
  }

  return {
    matchupId: home.matchup_id,
    canFlip,
    trailingRosterId: trailerId,
    trailingStillOut: trailerStill,
    leaderStillOut: leaderStill,
    summary,
  }
}

export function liveFlipsForWeek(
  matchups: SleeperMatchup[],
  players: PlayersMap,
  nflGames: NflWeekGame[] | null,
  projections: ProjectionsMap | null,
): LiveFlipInsight[] {
  if (!nflGames?.length || !projections) return []
  const out: LiveFlipInsight[] = []
  for (const { home, away } of groupMatchupPairs(matchups)) {
    const insight = liveFlipForPair(home, away, players, nflGames, projections)
    if (insight) out.push(insight)
  }
  return out
}

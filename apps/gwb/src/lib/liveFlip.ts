import {
  groupMatchupPairs,
  isMatchupPairFinal,
  nflTeamsWithOpenGames,
  rosterHasStartersWithGamesRemaining,
  starterNflTeam,
} from './matchupBoard'
import type { ProjectionsMap } from './projections'
import type { NflWeekGame, PlayersMap, SleeperMatchup } from './types'

export interface LiveFlipInsight {
  matchupId: number
  canFlip: boolean
  leaderRosterId: number | null
  trailingRosterId: number | null
  margin: number
  pointsStillOut: { rosterId: number; points: number }[]
  summary: string
}

function starterPointsStillOut(
  matchup: SleeperMatchup,
  players: PlayersMap,
  openTeams: Set<string>,
  projections: ProjectionsMap | null,
): number {
  let sum = 0
  for (let i = 0; i < (matchup.starters?.length ?? 0); i++) {
    const pid = matchup.starters[i]
    if (!pid || pid === '0') continue
    const team = starterNflTeam(pid, players)
    if (!team || !openTeams.has(team)) continue
    const scored = matchup.starters_points?.[i] ?? 0
    const proj = projections?.[pid]
    if (typeof proj === 'number' && proj > scored) {
      sum += proj - scored
    } else if (scored <= 0 && typeof proj === 'number') {
      sum += proj
    } else if (scored <= 0) {
      sum += 8
    }
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
  if (isMatchupPairFinal(home, away, players, nflGames)) return null

  const openTeams = nflTeamsWithOpenGames(nflGames)
  const homeStill = starterPointsStillOut(home, players, openTeams, projections)
  const awayStill = starterPointsStillOut(away, players, openTeams, projections)
  const homeOpen = rosterHasStartersWithGamesRemaining(home, players, openTeams)
  const awayOpen = rosterHasStartersWithGamesRemaining(away, players, openTeams)
  if (!homeOpen && !awayOpen) return null

  const margin = Math.abs(home.points - away.points)
  const homeLeads = home.points >= away.points
  const leaderId = homeLeads ? home.roster_id : away.roster_id
  const trailerId = homeLeads ? away.roster_id : home.roster_id
  const leaderPts = homeLeads ? home.points : away.points
  const trailerPts = homeLeads ? away.points : home.points
  const trailerStill = homeLeads ? awayStill : homeStill
  const leaderStill = homeLeads ? homeStill : awayStill

  const trailerMax = trailerPts + trailerStill
  const leaderFloor = leaderPts
  const canFlip = trailerMax > leaderFloor + 0.01

  const pointsStillOut = [
    { rosterId: home.roster_id, points: homeStill },
    { rosterId: away.roster_id, points: awayStill },
  ].filter((x) => x.points > 0.05)

  let summary: string
  if (canFlip) {
    summary = `Can still flip — ~${trailerStill.toFixed(1)} pts still out for the trailing side`
  } else if (margin < 0.01) {
    summary = 'Tied with NFL games still on the board'
  } else {
    summary = `~${leaderStill.toFixed(1)} / ~${trailerStill.toFixed(1)} pts still out — unlikely to flip`
  }

  return {
    matchupId: home.matchup_id,
    canFlip,
    leaderRosterId: margin === 0 ? null : leaderId,
    trailingRosterId: margin === 0 ? null : trailerId,
    margin,
    pointsStillOut,
    summary,
  }
}

export function liveFlipsForWeek(
  matchups: SleeperMatchup[],
  players: PlayersMap,
  nflGames: NflWeekGame[],
  projections: ProjectionsMap | null,
): LiveFlipInsight[] {
  const out: LiveFlipInsight[] = []
  for (const { home, away } of groupMatchupPairs(matchups)) {
    const insight = liveFlipForPair(home, away, players, nflGames, projections)
    if (insight) out.push(insight)
  }
  return out
}

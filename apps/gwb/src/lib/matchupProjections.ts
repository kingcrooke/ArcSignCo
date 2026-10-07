import { groupMatchupPairs, isMatchupPairFinal } from './matchupBoard'
import type { ProjectionsMap } from './projections'
import { rosterProjectedPoints } from './projections'
import type { NflWeekGame, PlayersMap, SleeperMatchup } from './types'

export function formatMatchupProjectionLine(
  homePts: number,
  awayPts: number,
): string {
  return `proj ${homePts.toFixed(1)} – ${awayPts.toFixed(1)}`
}

export function weekShouldShowProjectedTotals(
  matchups: SleeperMatchup[],
  players: PlayersMap | null,
  nflGames: NflWeekGame[] | null,
): boolean {
  if (!players) return false
  const pairs = groupMatchupPairs(matchups)
  if (!pairs.length) return false

  for (const { home, away } of pairs) {
    if (home.points > 0 || away.points > 0) return false
    const homePlayed = home.starters?.some(
      (_, i) => (home.starters_points?.[i] ?? 0) > 0,
    )
    const awayPlayed = away.starters?.some(
      (_, i) => (away.starters_points?.[i] ?? 0) > 0,
    )
    if (homePlayed || awayPlayed) return false
    if (nflGames?.length) {
      if (isMatchupPairFinal(home, away, players, nflGames)) return false
    }
  }
  return true
}

export function pairProjectionLine(
  home: SleeperMatchup,
  away: SleeperMatchup,
  projections: ProjectionsMap,
): string | null {
  const homeProj = rosterProjectedPoints(home, projections)
  const awayProj = rosterProjectedPoints(away, projections)
  if (homeProj <= 0 && awayProj <= 0) return null
  return formatMatchupProjectionLine(homeProj, awayProj)
}

import type { NflState, SleeperLeague } from './types'
import { currentNflWeek, lastCompletedWeek, lastScoredLeg } from './weeks'

/** When viewing a past Sleeper season, NFL state still reflects the live calendar. */
export function isHistoricalSeason(
  league: SleeperLeague,
  nflState: NflState,
): boolean {
  const liveSeason = nflState.season ?? nflState.league_season
  if (!liveSeason) return false
  return String(league.season) !== String(liveSeason)
}

export function effectiveNflStateForLeague(
  league: SleeperLeague,
  nflState: NflState,
): NflState {
  if (!isHistoricalSeason(league, nflState)) return nflState
  const last = Math.max(lastScoredLeg(league), 1)
  return {
    ...nflState,
    season: league.season,
    week: last,
    display_week: last,
    season_type: 'regular',
  }
}

export function maxSelectableWeek(
  league: SleeperLeague,
  nflState: NflState,
  regLast: number,
): number {
  if (isHistoricalSeason(league, nflState)) {
    return Math.max(lastScoredLeg(league), regLast)
  }
  return Math.max(currentNflWeek(nflState), lastCompletedWeek(league, nflState), regLast)
}

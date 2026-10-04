import type { NflState, SleeperLeague } from './types'

/** Last fully scored fantasy week (Sleeper leg). */
export function lastScoredLeg(league: SleeperLeague): number {
  return league.settings.last_scored_leg ?? league.settings.leg ?? 0
}

export function currentNflWeek(nflState: NflState): number {
  return nflState.week ?? nflState.display_week ?? 1
}

/**
 * Last week with final scores for recaps / IG defaults.
 * Prefer league last_scored_leg; otherwise weeks strictly before current NFL week.
 */
export function lastCompletedWeek(
  league: SleeperLeague,
  nflState: NflState,
): number {
  const scored = lastScoredLeg(league)
  if (scored > 0) return scored
  const nfl = currentNflWeek(nflState)
  return Math.max(1, nfl - 1)
}

/** True when NFL is still on this week and Sleeper has not finished scoring it. */
export function isWeekLive(
  week: number,
  league: SleeperLeague,
  nflState: NflState,
): boolean {
  const nfl = currentNflWeek(nflState)
  const scored = lastScoredLeg(league)
  return week >= nfl && week > scored
}

export function isWeekComplete(
  week: number,
  league: SleeperLeague,
  nflState: NflState,
): boolean {
  return !isWeekLive(week, league, nflState) && week <= currentNflWeek(nflState)
}

export function weekStatusLabel(
  week: number,
  league: SleeperLeague,
  nflState: NflState,
): string {
  if (isWeekLive(week, league, nflState)) return 'LIVE'
  return 'FINAL'
}

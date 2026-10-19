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

/** Best Games default scope: current NFL week when final, else last finished week. */
export function defaultBestGamesWeek(
  league: SleeperLeague,
  nflState: NflState,
): number {
  const current = currentNflWeek(nflState)
  if (isWeekComplete(current, league, nflState)) return current
  return lastCompletedWeek(league, nflState)
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

/**
 * Week window for cumulative views before the regular-season cap.
 * A live week defers to the last scored leg.
 */
export function cumulativeThroughWeek(
  selectedWeek: number,
  league: SleeperLeague,
  nflState: NflState,
): number {
  if (isWeekLive(selectedWeek, league, nflState)) {
    return lastCompletedWeek(league, nflState)
  }
  return selectedWeek
}

/**
 * Standings, playoff odds, and all-play stop at the end of the regular season.
 * Completed seasons and any selected week past `playoff_week_start` are capped
 * at regularSeasonLastWeek so playoff games do not inflate the table.
 */
export function standingsThroughWeek(
  selectedWeek: number,
  league: SleeperLeague,
  nflState: NflState,
): number {
  const through = cumulativeThroughWeek(selectedWeek, league, nflState)
  const regLast = regularSeasonLastWeek(league.settings.playoff_week_start ?? 15)
  if (league.status === 'complete' || through > regLast) {
    return Math.min(through, regLast)
  }
  return through
}

/** Best Games week chips: only the live NFL week is in progress. Later weeks are upcoming. */
export function bestGamesWeekChip(
  week: number,
  league: SleeperLeague,
  nflState: NflState,
): { label: string; disabled: boolean } {
  if (week > currentNflWeek(nflState)) {
    return { label: `Week ${week} · Upcoming`, disabled: true }
  }
  if (isWeekLive(week, league, nflState)) {
    return { label: `Week ${week} · In progress`, disabled: true }
  }
  return { label: `Week ${week}`, disabled: false }
}

export function standingsDeferralNote(
  selectedWeek: number,
  league: SleeperLeague,
  nflState: NflState,
): string | null {
  return cumulativeDeferralNote(selectedWeek, league, nflState, 'standings')
}

export function cumulativeDeferralNote(
  selectedWeek: number,
  league: SleeperLeague,
  nflState: NflState,
  subject: string,
): string | null {
  if (!isWeekLive(selectedWeek, league, nflState)) return null
  const through = lastCompletedWeek(league, nflState)
  return `Week ${selectedWeek} in progress, ${subject} through Week ${through}.`
}

export function regularSeasonLastWeek(playoffWeekStart: number): number {
  return Math.max(1, playoffWeekStart - 1)
}

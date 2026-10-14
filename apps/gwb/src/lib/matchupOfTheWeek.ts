import type { MatchupRecap, StandingRow } from './types'

/** Commissioner overrides when auto-pick should not run. */
export const MATCHUP_OF_THE_WEEK_BY_WEEK: Record<number, number> = {
  /** Week 6: Eric (3-2) vs Steven (4-1) */
  6: 2,
}

const TOP_SEED_CUTOFF = 6

function standingRow(
  rosterId: number,
  standings: StandingRow[],
): StandingRow | undefined {
  return standings.find((s) => s.rosterId === rosterId)
}

/**
 * Pick the matchup of the week: manual override, else the closest records among
 * teams currently in the playoff seeding range (top six).
 */
export function chooseMatchupOfTheWeek(
  recaps: MatchupRecap[],
  preWeekStandings: StandingRow[],
  week: number,
): number | null {
  if (!recaps.length) return null
  const manual = MATCHUP_OF_THE_WEEK_BY_WEEK[week]
  if (manual != null && recaps.some((r) => r.matchupId === manual)) {
    return manual
  }

  let best: MatchupRecap | null = null
  let bestScore = Infinity
  for (const recap of recaps) {
    const a = standingRow(recap.teamA.rosterId, preWeekStandings)
    const b = standingRow(recap.teamB.rosterId, preWeekStandings)
    if (!a || !b) continue
    if (a.rank > TOP_SEED_CUTOFF || b.rank > TOP_SEED_CUTOFF) continue
    const recordGap =
      Math.abs(a.wins - b.wins) + Math.abs(a.losses - b.losses)
    const rankSum = a.rank + b.rank
    const score = recordGap * 100 + rankSum
    if (score < bestScore) {
      bestScore = score
      best = recap
    }
  }

  if (best) return best.matchupId

  const closestMargin = recaps.reduce((pick, r) =>
    r.margin < pick.margin ? r : pick,
  )
  return closestMargin.matchupId
}

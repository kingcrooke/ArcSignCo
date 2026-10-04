import { rosterPointsAgainst, rosterPointsFor } from './teams'
import type { SleeperRoster, StandingRow, TeamInfo } from './types'

/**
 * Tiebreakers (assumption — Sleeper league JSON does not expose a custom seeding rule):
 * 1) Win percentage (W-L-T)
 * 2) Total points for
 * 3) Total points against (lower is better — common secondary tiebreaker)
 */
export function computeStandings(
  rosters: SleeperRoster[],
  teams: Map<number, TeamInfo>,
): StandingRow[] {
  const rows = rosters.map((r) => {
    const t = teams.get(r.roster_id)
    const wins = r.settings.wins ?? 0
    const losses = r.settings.losses ?? 0
    const ties = r.settings.ties ?? 0
    return {
      rosterId: r.roster_id,
      teamName: t?.teamName ?? `Team ${r.roster_id}`,
      displayName: t?.displayName ?? '',
      wins,
      losses,
      ties,
      pointsFor: rosterPointsFor(r.settings),
      pointsAgainst: rosterPointsAgainst(r.settings),
      streak: r.metadata?.streak ?? '',
      winPct: (wins + ties * 0.5) / Math.max(wins + losses + ties, 1),
    }
  })

  rows.sort((a, b) => {
    if (b.winPct !== a.winPct) return b.winPct - a.winPct
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor
    return a.pointsAgainst - b.pointsAgainst
  })

  return rows.map((r, i) => ({
    rank: i + 1,
    rosterId: r.rosterId,
    teamName: r.teamName,
    displayName: r.displayName,
    wins: r.wins,
    losses: r.losses,
    ties: r.ties,
    pointsFor: r.pointsFor,
    pointsAgainst: r.pointsAgainst,
    streak: r.streak,
  }))
}

export function recordLabel(row: StandingRow): string {
  const t = row.ties ? `-${row.ties}` : ''
  return `${row.wins}-${row.losses}${t}`
}

import { rosterPointsAgainst, rosterPointsFor } from './teams'
import type {
  SleeperMatchup,
  SleeperRoster,
  StandingRow,
  TeamInfo,
} from './types'

type Outcome = 'W' | 'L' | 'T'

interface WeekStats {
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  outcomes: Outcome[]
}

function formatStreak(outcomes: Outcome[]): string {
  if (outcomes.length === 0) return ''
  const last = outcomes[outcomes.length - 1]
  let count = 0
  for (let i = outcomes.length - 1; i >= 0; i--) {
    if (outcomes[i] !== last) break
    count++
  }
  return `${last}${count}`
}

/** Sleeper roster metadata uses `3L`; display as `L3` / `W2`. */
export function streakLabel(streak: string): string {
  const trimmed = streak.trim()
  if (!trimmed) return ''
  const sleeper = /^(\d+)([WLT])$/i.exec(trimmed)
  if (sleeper) return `${sleeper[2].toUpperCase()}${sleeper[1]}`
  return trimmed
}

function sortStandingRows(
  rows: Omit<StandingRow, 'rank'>[],
): StandingRow[] {
  const sorted = [...rows]
  sorted.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor
    return a.pointsAgainst - b.pointsAgainst
  })

  return sorted.map((r, i) => ({
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

/**
 * Cumulative standings through `throughWeek` using Sleeper matchup scores.
 */
export function computeStandingsThroughWeek(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  teams: Map<number, TeamInfo>,
  throughWeek: number,
): StandingRow[] {
  const stats = new Map<number, WeekStats>()
  for (const rosterId of teams.keys()) {
    stats.set(rosterId, {
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      outcomes: [],
    })
  }

  for (let week = 1; week <= throughWeek; week++) {
    const matchups = matchupsByWeek.get(week)
    if (!matchups?.length) continue

    const byMatch = new Map<number, SleeperMatchup[]>()
    for (const m of matchups) {
      const list = byMatch.get(m.matchup_id) ?? []
      list.push(m)
      byMatch.set(m.matchup_id, list)
    }

    for (const pair of byMatch.values()) {
      if (pair.length !== 2) continue
      const [a, b] = pair
      const sa = stats.get(a.roster_id)
      const sb = stats.get(b.roster_id)
      if (!sa || !sb) continue

      sa.pointsFor += a.points
      sa.pointsAgainst += b.points
      sb.pointsFor += b.points
      sb.pointsAgainst += a.points

      if (a.points > b.points) {
        sa.wins++
        sb.losses++
        sa.outcomes.push('W')
        sb.outcomes.push('L')
      } else if (b.points > a.points) {
        sb.wins++
        sa.losses++
        sb.outcomes.push('W')
        sa.outcomes.push('L')
      } else {
        sa.ties++
        sb.ties++
        sa.outcomes.push('T')
        sb.outcomes.push('T')
      }
    }
  }

  const rows = [...teams.entries()].map(([rosterId, t]) => {
    const s = stats.get(rosterId)!
    return {
      rosterId,
      teamName: t.teamName,
      displayName: t.displayName,
      wins: s.wins,
      losses: s.losses,
      ties: s.ties,
      pointsFor: s.pointsFor,
      pointsAgainst: s.pointsAgainst,
      streak: formatStreak(s.outcomes),
    }
  })

  return sortStandingRows(rows)
}

/**
 * Tiebreakers (Sleeper-style regular-season seeding):
 * 1) Wins
 * 2) Total points for
 * 3) Total points against (lower is better)
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
      streak: streakLabel(r.metadata?.streak ?? ''),
    }
  })

  return sortStandingRows(rows)
}

export function recordLabel(row: StandingRow): string {
  const t = row.ties ? `-${row.ties}` : ''
  return `${row.wins}-${row.losses}${t}`
}

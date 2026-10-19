import { benchPointsTotal, groupMatchupPairs } from './matchupBoard'
import { rankBestGamesForWeek } from './bestGames'
import { managerLabel } from './teams'
import {
  computeStandingsThroughWeek,
  finalRegularSeasonStandings,
  recordLabel,
} from './standings'
import { isWeekComplete, regularSeasonLastWeek } from './weeks'
import type {
  NflState,
  SleeperLeague,
  SleeperMatchup,
  SleeperRoster,
  TeamInfo,
} from './types'

export interface ReportSide {
  rosterId: number
  name: string
  points: number
}

export interface ReportMatch {
  winner: ReportSide
  loser: ReportSide
  margin: number
}

export interface WeekReport {
  week: number
  highScore: ReportSide
  lowScore: ReportSide
  closest: ReportMatch | null
  blowout: ReportMatch | null
  mostBench: ReportSide | null
  bestGame: (ReportMatch & { badges: string[] }) | null
  waiver: {
    rosterId: number
    name: string
    playerId: string
    points: number
  } | null
  top3: {
    rank: number
    rosterId: number
    name: string
    record: string
    pointsFor: number
  }[]
}

function nameOf(rosterId: number, teams: Map<number, TeamInfo>): string {
  return managerLabel(teams.get(rosterId), rosterId)
}

function side(rosterId: number, points: number, teams: Map<number, TeamInfo>): ReportSide {
  return { rosterId, name: nameOf(rosterId, teams), points }
}

/**
 * In-app weekly report for a completed week. Live and future weeks return null.
 * No card art — the panel renders this as HTML.
 */
export function buildWeekReport(input: {
  week: number
  matchupsByWeek: Map<number, SleeperMatchup[]>
  teams: Map<number, TeamInfo>
  league: SleeperLeague
  nflState: NflState
  rosters?: SleeperRoster[]
  waiverPickup?: { playerId: string; rosterId: number; points: number } | null
}): WeekReport | null {
  const { week, matchupsByWeek, teams, league, nflState, rosters, waiverPickup } = input
  if (!isWeekComplete(week, league, nflState)) return null
  const matchups = matchupsByWeek.get(week)
  if (!matchups?.length) return null
  if (!matchups.some((m) => m.points > 0)) return null

  let high: ReportSide | null = null
  let low: ReportSide | null = null
  let mostBench: ReportSide | null = null
  for (const m of matchups) {
    if (m.points <= 0) continue
    const row = side(m.roster_id, m.points, teams)
    if (!high || row.points > high.points) high = row
    if (!low || row.points < low.points) low = row
    const bench = benchPointsTotal(m)
    if (!mostBench || bench > mostBench.points) {
      mostBench = side(m.roster_id, bench, teams)
    }
  }
  if (!high || !low) return null

  let closest: ReportMatch | null = null
  let blowout: ReportMatch | null = null
  for (const { home, away } of groupMatchupPairs(matchups)) {
    const margin = Math.abs(home.points - away.points)
    if (margin <= 0) continue
    const winnerM = home.points > away.points ? home : away
    const loserM = winnerM === home ? away : home
    const match: ReportMatch = {
      winner: side(winnerM.roster_id, winnerM.points, teams),
      loser: side(loserM.roster_id, loserM.points, teams),
      margin,
    }
    if (!closest || margin < closest.margin) closest = match
    if (!blowout || margin > blowout.margin) blowout = match
  }

  const ranked = rankBestGamesForWeek(week, matchupsByWeek, league, nflState, 1)
  const best = ranked[0]
  const bestGame = best
    ? {
        winner: side(
          best.winnerRosterId,
          best.winnerRosterId === best.home.roster_id
            ? best.home.points
            : best.away.points,
          teams,
        ),
        loser: side(
          best.loserRosterId,
          best.loserRosterId === best.home.roster_id
            ? best.home.points
            : best.away.points,
          teams,
        ),
        margin: best.breakdown.margin,
        badges: best.badges,
      }
    : null

  const regLast = regularSeasonLastWeek(league.settings.playoff_week_start ?? 15)
  const through = Math.min(week, regLast)
  const table =
    league.status === 'complete' && through >= regLast && rosters?.length
      ? finalRegularSeasonStandings(rosters, teams, regLast)
      : computeStandingsThroughWeek(matchupsByWeek, teams, through)

  return {
    week,
    highScore: high,
    lowScore: low,
    closest,
    blowout,
    mostBench,
    bestGame,
    waiver: waiverPickup
      ? {
          rosterId: waiverPickup.rosterId,
          name: nameOf(waiverPickup.rosterId, teams),
          playerId: waiverPickup.playerId,
          points: waiverPickup.points,
        }
      : null,
    top3: table.slice(0, 3).map((row) => ({
      rank: row.rank,
      rosterId: row.rosterId,
      name: row.teamName || row.displayName,
      record: recordLabel(row),
      pointsFor: row.pointsFor,
    })),
  }
}

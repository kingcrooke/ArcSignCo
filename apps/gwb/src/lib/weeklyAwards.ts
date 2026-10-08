import { benchPointsTotal, groupMatchupPairs } from './matchupBoard'
import { managerNickname } from './nicknames'
import type { SleeperLeague, SleeperMatchup, TeamInfo } from './types'
import { isWeekComplete } from './weeks'
import type { NflState } from './types'

export interface WeeklyAwardWinner {
  week: number
  rosterId: number
  managerName: string
  value: number
  detail: string
}

export interface WeeklyAwardsWeek {
  week: number
  highScore: WeeklyAwardWinner | null
  lowScore: WeeklyAwardWinner | null
  closestWin: WeeklyAwardWinner | null
  mostBench: WeeklyAwardWinner | null
}

function teamName(rosterId: number, teams: Map<number, TeamInfo>): string {
  const t = teams.get(rosterId)
  return managerNickname(rosterId, t?.displayName ?? '')
}

export function computeWeeklyAwardsForWeek(
  week: number,
  matchups: SleeperMatchup[],
  teams: Map<number, TeamInfo>,
): WeeklyAwardsWeek {
  let high: WeeklyAwardWinner | null = null
  let low: WeeklyAwardWinner | null = null
  let closest: WeeklyAwardWinner | null = null
  let mostBench: WeeklyAwardWinner | null = null

  for (const m of matchups) {
    const pts = m.points
    if (pts <= 0) continue
    const name = teamName(m.roster_id, teams)
    if (!high || pts > high.value) {
      high = { week, rosterId: m.roster_id, managerName: name, value: pts, detail: `${pts.toFixed(2)} pts` }
    }
    if (!low || pts < low.value) {
      low = { week, rosterId: m.roster_id, managerName: name, value: pts, detail: `${pts.toFixed(2)} pts` }
    }
    const bench = benchPointsTotal(m)
    if (!mostBench || bench > mostBench.value) {
      mostBench = {
        week,
        rosterId: m.roster_id,
        managerName: name,
        value: bench,
        detail: `${bench.toFixed(2)} on bench`,
      }
    }
  }

  for (const { home, away } of groupMatchupPairs(matchups)) {
    const margin = Math.abs(home.points - away.points)
    if (margin <= 0) continue
    const winner = home.points > away.points ? home : away
    const loser = home.points > away.points ? away : home
    if (!closest || margin < closest.value) {
      closest = {
        week,
        rosterId: winner.roster_id,
        managerName: teamName(winner.roster_id, teams),
        value: margin,
        detail: `${margin.toFixed(2)} over ${teamName(loser.roster_id, teams)}`,
      }
    }
  }

  return {
    week,
    highScore: high,
    lowScore: low,
    closestWin: closest,
    mostBench,
  }
}

export function computeWeeklyAwards(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  teams: Map<number, TeamInfo>,
  league: SleeperLeague,
  nflState: NflState,
): WeeklyAwardsWeek[] {
  const weeks = [...matchupsByWeek.keys()].sort((a, b) => b - a)
  const out: WeeklyAwardsWeek[] = []
  for (const week of weeks) {
    if (!isWeekComplete(week, league, nflState)) continue
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    const scored = rows.some((m) => m.points > 0)
    if (!scored) continue
    out.push(computeWeeklyAwardsForWeek(week, rows, teams))
  }
  return out.sort((a, b) => b.week - a.week)
}

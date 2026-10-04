import type { SleeperMatchup, TeamInfo } from './types'

export interface HeadToHeadPair {
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
}

function pairKey(a: number, b: number): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

/** Cumulative H2H from roster `a` vs roster `b` (a’s perspective). */
export function buildHeadToHeadMap(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): Map<string, HeadToHeadPair> {
  const map = new Map<string, HeadToHeadPair>()

  for (let week = 1; week <= throughWeek; week++) {
    const rows = matchupsByWeek.get(week)
    if (!rows?.length) continue
    const byMatch = new Map<number, SleeperMatchup[]>()
    for (const m of rows) {
      const list = byMatch.get(m.matchup_id) ?? []
      list.push(m)
      byMatch.set(m.matchup_id, list)
    }
    for (const pair of byMatch.values()) {
      if (pair.length < 2) continue
      const [left, right] = pair
      const k = pairKey(left.roster_id, right.roster_id)
      const rec = map.get(k) ?? {
        wins: 0,
        losses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      }
      const lowId = Math.min(left.roster_id, right.roster_id)
      const a = left.roster_id === lowId ? left : right
      const b = left.roster_id === lowId ? right : left
      rec.pointsFor += a.points
      rec.pointsAgainst += b.points
      if (a.points === b.points) {
        rec.ties += 1
      } else if (a.points > b.points) {
        rec.wins += 1
      } else {
        rec.losses += 1
      }
      map.set(k, rec)
    }
  }
  return map
}

export function headToHeadForRoster(
  rosterId: number,
  opponentId: number,
  h2h: Map<string, HeadToHeadPair>,
): HeadToHeadPair | null {
  const low = Math.min(rosterId, opponentId)
  const high = Math.max(rosterId, opponentId)
  const rec = h2h.get(`${low}|${high}`)
  if (!rec) return null
  if (rosterId === low) return rec
  return {
    wins: rec.losses,
    losses: rec.wins,
    ties: rec.ties,
    pointsFor: rec.pointsAgainst,
    pointsAgainst: rec.pointsFor,
  }
}

export function headToHeadSummary(
  rosterId: number,
  opponentId: number,
  h2h: Map<string, HeadToHeadPair>,
  teams: Map<number, TeamInfo>,
): string | null {
  const rec = headToHeadForRoster(rosterId, opponentId, h2h)
  if (!rec || rec.wins + rec.losses + rec.ties === 0) return null
  const self = teams.get(rosterId)
  const opp = teams.get(opponentId)
  const selfNick = self?.teamName ?? 'Team'
  const oppNick = opp?.teamName ?? 'Opponent'
  const record = `${rec.wins}-${rec.losses}${rec.ties ? `-${rec.ties}` : ''}`
  const pf = Math.round(rec.pointsFor)
  const pa = Math.round(rec.pointsAgainst)
  return `${selfNick} is ${record} vs ${oppNick}, outscoring ${pf} to ${pa}.`
}

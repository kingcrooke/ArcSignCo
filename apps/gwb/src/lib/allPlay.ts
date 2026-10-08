import type { SleeperMatchup } from './types'

export type AllPlayRecord = { wins: number; losses: number; ties: number }

export function computeAllPlayThroughWeek(
  matchupsByWeek: Map<number, SleeperMatchup[]>,
  throughWeek: number,
): Map<number, AllPlayRecord> {
  const records = new Map<number, AllPlayRecord>()

  const ensure = (rosterId: number): AllPlayRecord => {
    let row = records.get(rosterId)
    if (!row) {
      row = { wins: 0, losses: 0, ties: 0 }
      records.set(rosterId, row)
    }
    return row
  }

  for (let week = 1; week <= throughWeek; week++) {
    const matchups = matchupsByWeek.get(week)
    if (!matchups?.length) continue
    const scores = matchups.map((m) => ({
      rosterId: m.roster_id,
      points: m.points,
    }))
    for (const { rosterId, points } of scores) {
      const row = ensure(rosterId)
      for (const other of scores) {
        if (other.rosterId === rosterId) continue
        if (points > other.points) row.wins += 1
        else if (points < other.points) row.losses += 1
        else row.ties += 1
      }
    }
  }

  return records
}

export function formatAllPlayRecord(record: AllPlayRecord): string {
  if (record.ties > 0) {
    return `${record.wins}-${record.losses}-${record.ties}`
  }
  return `${record.wins}-${record.losses}`
}

function ordinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

/** Playoff seed if the season ended today (rank is current standings rank). */
export function playoffSeedHint(
  rank: number,
  playoffTeams: number,
): string | null {
  if (playoffTeams <= 0 || rank <= 0) return null
  if (rank <= playoffTeams) {
    return `Would be the ${ordinal(rank)} seed if the season ended today.`
  }
  return `Would be ${ordinal(rank)} overall — outside the top ${playoffTeams}.`
}

export function allPlayLine(
  score: number,
  weekMatchups: SleeperMatchup[],
  rosterId: number,
): string {
  const others = weekMatchups
    .filter((m) => m.roster_id !== rosterId)
    .map((m) => m.points)
  if (others.length === 0) return ''
  const wins = others.filter((s) => score > s).length
  return `All-play: would have beaten ${wins} of ${others.length} teams.`
}

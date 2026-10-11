import type { MatchupRecap } from './types'

export interface WeekReceipt {
  biggestWin: { label: string; margin: number }
  closestGame: { label: string; margin: number }
  highestScore: { label: string; points: number }
}

export function buildWeekReceipt(recaps: MatchupRecap[]): WeekReceipt | null {
  if (!recaps.length) return null
  let biggest = recaps[0]
  let closest = recaps[0]
  let highTeam = recaps[0].teamA.teamName
  let highPts = recaps[0].teamA.points

  for (const r of recaps) {
    if (r.margin > biggest.margin) biggest = r
    if (r.margin < closest.margin) closest = r
    for (const side of [r.teamA, r.teamB]) {
      if (side.points > highPts) {
        highPts = side.points
        highTeam = side.teamName
      }
    }
  }

  const winLabel = (r: MatchupRecap) => {
    const w = r.teamA.points >= r.teamB.points ? r.teamA : r.teamB
    const l = r.teamA.points >= r.teamB.points ? r.teamB : r.teamA
    return `${w.teamName} over ${l.teamName}`
  }

  return {
    biggestWin: { label: winLabel(biggest), margin: biggest.margin },
    closestGame: { label: winLabel(closest), margin: closest.margin },
    highestScore: { label: highTeam, points: highPts },
  }
}

import type { SleeperMatchup } from './types'

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

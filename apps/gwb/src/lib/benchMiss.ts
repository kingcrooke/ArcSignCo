import type { PlayersMap, SleeperMatchup } from './types'

const MIN_GAIN = 1.5
const FLEX_ELIGIBLE = new Set(['RB', 'WR', 'TE'])

export interface BenchMissResult {
  name: string
  gain: number
  message: string
}

function playerPosition(pid: string, players: PlayersMap): string | null {
  return players[pid]?.position ?? null
}

function playerName(pid: string, players: PlayersMap): string {
  return players[pid]?.full_name?.trim() || 'Player'
}

/**
 * Largest bench upgrade vs a starter slot the player could have filled.
 */
export function biggestBenchMiss(
  m: SleeperMatchup,
  rosterPositions: string[],
  players: PlayersMap,
): BenchMissResult | null {
  const starterSet = new Set(m.starters)
  let best: BenchMissResult | null = null

  for (const [pid, pts] of Object.entries(m.players_points ?? {})) {
    if (starterSet.has(pid)) continue
    const pos = playerPosition(pid, players)
    if (!pos) continue

    m.starters.forEach((_starterId, slotIndex) => {
      const slotPos = rosterPositions[slotIndex]
      if (!slotPos || slotPos === 'BN') return
      const eligible =
        slotPos === pos ||
        (slotPos === 'FLEX' && FLEX_ELIGIBLE.has(pos))
      if (!eligible) return
      const starterPts = m.starters_points[slotIndex] ?? 0
      const gain = pts - starterPts
      if (gain < MIN_GAIN) return
      if (!best || gain > best.gain) {
        const name = playerName(pid, players)
        best = {
          name,
          gain,
          message: `${name} would have added ${gain.toFixed(1)}`,
        }
      }
    })
  }

  return best
}

import type { SleeperMatchup, TeamInfo } from '../lib/types'

export function LiveScoresStrip({
  matchups,
  teams,
}: {
  matchups: SleeperMatchup[]
  teams: Map<number, TeamInfo>
}) {
  const byMatch = new Map<number, SleeperMatchup[]>()
  for (const m of matchups) {
    const list = byMatch.get(m.matchup_id) ?? []
    list.push(m)
    byMatch.set(m.matchup_id, list)
  }
  const pairs = [...byMatch.values()].filter((p) => p.length >= 2)

  if (!pairs.length) return null

  return (
    <div className="rounded-xl border border-amber-600/40 bg-amber-950/20 px-3 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
        Live scores
      </p>
      <ul className="space-y-1 text-sm tabular-nums">
        {pairs.map((pair) => {
          const [a, b] = pair
          const teamA = teams.get(a.roster_id)?.teamName ?? `Team ${a.roster_id}`
          const teamB = teams.get(b.roster_id)?.teamName ?? `Team ${b.roster_id}`
          return (
            <li key={`${a.roster_id}-${b.roster_id}`}>
              {teamA} {a.points.toFixed(1)} · {teamB} {b.points.toFixed(1)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

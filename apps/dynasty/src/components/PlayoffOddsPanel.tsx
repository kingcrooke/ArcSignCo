import {
  PLAYOFF_ODDS_METHOD_NOTE,
  type PlayoffOddsRow,
} from '../lib/playoffOdds'

export function PlayoffOddsPanel({ rows }: { rows: PlayoffOddsRow[] }) {
  const sorted = [...rows].sort((a, b) => b.playoffPct - a.playoffPct)

  return (
    <div className="space-y-2" id="playoff-odds-panel">
      <p className="text-xs text-[var(--dyn-muted)]">
        <span className="font-semibold text-[var(--dyn-accent-bright)]">Estimate only.</span>{' '}
        {PLAYOFF_ODDS_METHOD_NOTE}
      </p>
      <ul
        className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)]"
        role="list"
      >
        {sorted.map((r, i) => (
          <li
            key={r.rosterId}
            className={`flex items-center justify-between gap-3 border-t border-[var(--dyn-border)] px-4 py-2.5 first:border-t-0 ${
              i % 2 === 1 ? 'bg-[var(--dyn-row-alt)]' : ''
            }`}
          >
            <div className="min-w-0">
              <p className="font-medium">
                {r.teamName || r.displayName}
              </p>
              <p className="text-xs text-[var(--dyn-muted)]">
                {r.wins}-{r.losses} · {r.pointsFor.toFixed(2)} PF
              </p>
            </div>
            <p className="shrink-0 text-lg font-bold tabular-nums text-[var(--dyn-accent)]">
              {(r.playoffPct * 100).toFixed(0)}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

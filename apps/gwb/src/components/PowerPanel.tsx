import { POWER_RANKING_FORMULA } from '../lib/powerRankings'
import type { PowerRankingRow } from '../lib/types'

function movementArrow(m: number | null): string {
  if (m == null) return '·'
  if (m > 0) return `▲${m}`
  if (m < 0) return `▼${Math.abs(m)}`
  return '─'
}

export function PowerPanel({ rows }: { rows: PowerRankingRow[] }) {
  return (
    <div className="space-y-4">
      <details className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4 text-sm text-[var(--gwb-muted)]">
        <summary className="cursor-pointer font-medium text-[var(--gwb-text)]">
          How power score works
        </summary>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed">
          {POWER_RANKING_FORMULA}
        </pre>
      </details>
      <ol className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.rosterId}
            className="flex items-center gap-3 rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3"
          >
            <span className="w-8 text-lg font-bold text-[var(--gwb-accent)]">
              {r.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{r.teamName}</div>
              <div className="text-xs text-[var(--gwb-muted)]">
                Form {(r.recentForm * 100).toFixed(0)}% · All-play{' '}
                {(r.allPlayWinPct * 100).toFixed(0)}% · Eff{' '}
                {(r.lineupEfficiency * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums">{r.score}</div>
              <div className="text-xs text-[var(--gwb-muted)]">
                {movementArrow(r.movement)}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

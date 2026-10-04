import { recordLabel } from '../lib/standings'
import type { StandingRow } from '../lib/types'

export function StandingsPanel({ rows }: { rows: StandingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--gwb-border)]">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Team</th>
            <th className="px-3 py-2">W-L-T</th>
            <th className="px-3 py-2">PF</th>
            <th className="px-3 py-2">PA</th>
            <th className="px-3 py-2">Streak</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.rosterId}
              className="border-t border-[var(--gwb-border)] odd:bg-[#0d1319]"
            >
              <td className="px-3 py-2.5 font-semibold text-[var(--gwb-accent)]">
                {r.rank}
              </td>
              <td className="px-3 py-2.5">
                <div className="font-medium">{r.teamName}</div>
                <div className="text-xs text-[var(--gwb-muted)]">{r.displayName}</div>
              </td>
              <td className="px-3 py-2.5 tabular-nums">{recordLabel(r)}</td>
              <td className="px-3 py-2.5 tabular-nums">{r.pointsFor.toFixed(2)}</td>
              <td className="px-3 py-2.5 tabular-nums">{r.pointsAgainst.toFixed(2)}</td>
              <td className="px-3 py-2.5 tabular-nums">{r.streak || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

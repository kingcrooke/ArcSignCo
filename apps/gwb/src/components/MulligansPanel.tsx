import { mulliganForRoster, mulliganLabel } from '../lib/mulligans'
import type { StandingRow } from '../lib/types'

export function MulligansPanel({ rows }: { rows: StandingRow[] }) {
  const sorted = [...rows].sort((a, b) => a.teamName.localeCompare(b.teamName))

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
        Mulligans
      </h3>
      <p className="mb-3 text-xs text-[var(--gwb-muted)]">
        One per manager per season. Danny&apos;s Week 4 swap and Mauricio&apos;s
        Week 1 move count as used.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--gwb-border)]">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider">
            <tr>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Mulligan</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const m = mulliganForRoster(r.rosterId)
              return (
                <tr
                  key={r.rosterId}
                  className="border-t border-[var(--gwb-border)] odd:bg-[#0d1319]"
                >
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{r.teamName}</div>
                    <div className="text-xs text-[var(--gwb-muted)]">
                      {r.displayName}
                    </div>
                  </td>
                  <td
                    className={`px-3 py-2.5 text-sm ${
                      m.used ? 'text-amber-300' : 'text-[var(--gwb-muted)]'
                    }`}
                  >
                    {mulliganLabel(m)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

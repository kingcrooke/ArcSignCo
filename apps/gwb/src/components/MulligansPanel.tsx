import {
  formatMulliganLedgerLine,
  mulliganForRoster,
  mulliganLabel,
  MULLIGAN_LEDGER_META,
  publishedMulliganEntries,
} from '../lib/mulligans'
import type { StandingRow } from '../lib/types'

const MANAGER_COUNT = 12

export function MulligansPanel({ rows }: { rows: StandingRow[] }) {
  const published = publishedMulliganEntries()
  const sorted = [...rows].sort((a, b) => a.teamName.localeCompare(b.teamName))

  return (
    <div id="mulligans-section" className="mt-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
        Mulligans
      </h3>
      <p className="mb-3 text-xs text-[var(--gwb-muted)]">
        One per manager per season.{' '}
        {published.length} published use{published.length === 1 ? '' : 's'} /{' '}
        {MANAGER_COUNT} managers through Week {MULLIGAN_LEDGER_META.throughWeek}.{' '}
        {MULLIGAN_LEDGER_META.weekNote} None flipped a result.
      </p>

      <div className="mb-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
          2026 mulligan ledger (published)
        </h4>
        <ul className="space-y-2">
          {published.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm leading-snug text-[var(--gwb-text)]"
            >
              {formatMulliganLedgerLine(entry)}
            </li>
          ))}
        </ul>
      </div>

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
      <p className="mt-2 text-xs text-[var(--gwb-muted)]">
        Per-manager status reflects published ledger entries only (2 shown). Full
        audit through Week 3 counts five league-wide uses (one each for five
        managers); three additional uses are staged as pending in site data and
        are not listed above.
      </p>
    </div>
  )
}

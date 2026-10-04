import {
  formatMulliganLedgerLine,
  mulliganEntriesForWeek,
  mulliganLabel,
  mulliganStatusForRoster,
  mulligansUsedThroughWeek,
  MULLIGAN_LEDGER_META,
} from '../lib/mulligans'
import type { StandingRow } from '../lib/types'

const MANAGER_COUNT = 12

export function MulligansPanel({
  rows,
  selectedWeek,
  statusThroughWeek,
  deferralNote,
}: {
  rows: StandingRow[]
  selectedWeek: number
  statusThroughWeek: number
  deferralNote: string | null
}) {
  const weekResults = mulliganEntriesForWeek(selectedWeek)
  const usedThrough = mulligansUsedThroughWeek(statusThroughWeek)
  const sorted = [...rows].sort((a, b) => a.teamName.localeCompare(b.teamName))

  return (
    <div id="mulligans-section" className="space-y-6">
      {deferralNote && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {deferralNote}
        </p>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
          Mulligan status
        </h3>
        <p className="mb-3 text-xs text-[var(--gwb-muted)]">
          One per manager per season. {usedThrough} used / {MANAGER_COUNT} managers
          through Week {statusThroughWeek}.{' '}
          {statusThroughWeek >= MULLIGAN_LEDGER_META.throughWeek
            ? MULLIGAN_LEDGER_META.weekNote
            : ''}{' '}
          None flipped a result.
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
                const m = mulliganStatusForRoster(r.rosterId, statusThroughWeek)
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

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
          Week {selectedWeek} mulligans
        </h3>
        {weekResults.length === 0 ? (
          <p className="text-sm text-[var(--gwb-muted)]">
            No mulligans used in Week {selectedWeek}.
          </p>
        ) : (
          <ul className="space-y-2">
            {weekResults.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm leading-snug text-[var(--gwb-text)]"
              >
                {formatMulliganLedgerLine(entry)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

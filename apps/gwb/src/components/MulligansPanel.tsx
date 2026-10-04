import {
  formatMulliganLedgerLine,
  formatMulliganReceipt,
  mulliganEntriesForWeek,
  mulliganLabel,
  mulliganStatusForRoster,
  mulligansFlippedThroughWeek,
  mulligansUsedThroughWeek,
  mulliganLiveContextForEntry,
  MULLIGAN_LEDGER_META,
} from '../lib/mulligans'
import { managerNickname } from '../lib/nicknames'
import type { MulliganLedgerEntry, MulliganLiveContext } from '../lib/mulligans'
import { resolveMulliganNetImpact } from '../lib/mulligans'
import type { SleeperMatchup, StandingRow } from '../lib/types'
import { MulliganChipRack } from './MulliganChipRack'

export function MulligansPanel({
  rows,
  selectedWeek,
  statusThroughWeek,
  deferralNote,
  weekMatchups,
  onNegativeMulliganOpen,
}: {
  rows: StandingRow[]
  selectedWeek: number
  statusThroughWeek: number
  deferralNote: string | null
  weekMatchups?: SleeperMatchup[]
  onNegativeMulliganOpen?: () => void
}) {
  const weekResults = mulliganEntriesForWeek(selectedWeek)
  const usedThrough = mulligansUsedThroughWeek(statusThroughWeek)
  const flipped = mulligansFlippedThroughWeek(statusThroughWeek)
  const sorted = [...rows].sort((a, b) => a.teamName.localeCompare(b.teamName))

  const flipLine =
    flipped === 0
      ? `${flipped} of ${usedThrough} flipped a result.`
      : `${flipped} of ${usedThrough} flipped a result.`

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
        <MulliganChipRack used={usedThrough} />
        <p className="mb-3 mt-2 text-xs text-[var(--gwb-muted)]">
          One per manager per season through Week {statusThroughWeek}. {flipLine}
          {statusThroughWeek >= MULLIGAN_LEDGER_META.throughWeek &&
          MULLIGAN_LEDGER_META.weekNote
            ? ` ${MULLIGAN_LEDGER_META.weekNote}`
            : ''}
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
                        {managerNickname(r.rosterId, r.displayName)}
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
          <ul className="space-y-3">
            {weekResults.map((entry) => {
              const matchup = weekMatchups?.find(
                (m) => m.roster_id === entry.rosterId,
              )
              const liveCtx = mulliganLiveContextForEntry(
                entry,
                matchup?.players_points,
              )
              return (
                <MulliganReceiptRow
                  key={entry.id}
                  entry={entry}
                  liveCtx={liveCtx}
                  onOpen={onNegativeMulliganOpen}
                />
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function MulliganReceiptRow({
  entry,
  liveCtx,
  onOpen,
}: {
  entry: MulliganLedgerEntry
  liveCtx?: MulliganLiveContext
  onOpen?: () => void
}) {
  const net = resolveMulliganNetImpact(entry, liveCtx)
  const negative = net !== null && net < 0
  return (
    <li
      className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm"
      onClick={() => {
        if (negative) onOpen?.()
      }}
    >
      <p className="font-medium text-[var(--gwb-text)]">
        {formatMulliganReceipt(entry, liveCtx)}
      </p>
      <p className="mt-1 text-xs leading-snug text-[var(--gwb-muted)]">
        {formatMulliganLedgerLine(entry, liveCtx)}
      </p>
    </li>
  )
}

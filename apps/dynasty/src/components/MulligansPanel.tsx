import {
  mulliganEntriesForWeek,
  mulliganReceiptParts,
  mulliganStatusParts,
  mulligansFlippedThroughWeek,
  mulligansUsedThroughWeek,
  mulliganLiveContextForEntry,
  MULLIGAN_LEDGER_META,
} from '../lib/mulligans'
import { managerNickname } from '../lib/nicknames'
import type { MulliganLedgerEntry, MulliganLiveContext } from '../lib/mulligans'
import { resolveMulliganNetImpact } from '../lib/mulligans'
import type { SleeperMatchup, StandingRow } from '../lib/types'
import { MULLIGAN_CHIP_TOTAL, MulliganChipRack } from './MulliganChipRack'

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

  const chipsLeft = MULLIGAN_CHIP_TOTAL - usedThrough
  const flipLine = `${flipped} of ${usedThrough} flipped, ${usedThrough} used, ${chipsLeft} left.`

  return (
    <div id="mulligans-section" className="min-w-0 space-y-6">
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
        <p className="mb-3 mt-2 break-words text-xs leading-relaxed text-[var(--gwb-muted)]">
          One per manager per season through Week {statusThroughWeek}. {flipLine}
          {statusThroughWeek >= MULLIGAN_LEDGER_META.throughWeek &&
          MULLIGAN_LEDGER_META.weekNote
            ? ` ${MULLIGAN_LEDGER_META.weekNote}`
            : ''}
        </p>

        <ul className="overflow-hidden rounded-xl border border-[var(--gwb-border)]">
          {sorted.map((r) => {
            const status = mulliganStatusParts(r.rosterId, statusThroughWeek)
            return (
              <li
                key={r.rosterId}
                className="min-w-0 border-t border-[var(--gwb-border)] px-3 py-3 first:border-t-0 odd:bg-[#0d1319]"
              >
                <div className="font-medium break-words">{r.teamName}</div>
                <div className="text-xs text-[var(--gwb-muted)]">
                  {managerNickname(r.rosterId, r.displayName)}
                </div>
                {status.used ? (
                  <div className="mt-2 space-y-0.5 text-sm leading-snug">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Used · Week {status.week}
                    </p>
                    <p className="break-words">{status.outLine}</p>
                    <p className="break-words">{status.inLine}</p>
                    <p className="break-words text-amber-200">{status.netLine}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[var(--gwb-muted)]">Available</p>
                )}
              </li>
            )
          })}
        </ul>
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
  const parts = mulliganReceiptParts(entry, liveCtx)
  return (
    <li
      className="min-w-0 rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-3 text-sm"
      onClick={() => {
        if (negative) onOpen?.()
      }}
    >
      <p className="break-words text-base font-semibold leading-snug text-[var(--gwb-text)]">
        {parts.manager}
      </p>
      <div className="mt-2 space-y-0.5 leading-snug">
        <p className="break-words">{parts.outLine}</p>
        <p className="break-words">{parts.inLine}</p>
        <p className="break-words font-medium text-amber-200">{parts.netLine}</p>
        <p className="break-words font-medium">{parts.resultLine}</p>
      </div>
      <div className="mt-2 space-y-0.5 break-words text-xs leading-relaxed text-[var(--gwb-muted)]">
        <p>{parts.versusLine}</p>
        <p>{parts.withoutLine}</p>
        <p>{parts.flipLine}</p>
        {parts.footnote ? <p>{parts.footnote}</p> : null}
      </div>
    </li>
  )
}

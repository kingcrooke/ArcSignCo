import { formatTradeAssetList, type TradeLogEntry } from '../lib/trades'

export function TradeLogPanel({
  trades,
  priorSeasonsIncluded,
  priorSeasonsFailed,
}: {
  trades: TradeLogEntry[]
  priorSeasonsIncluded: string[]
  priorSeasonsFailed: boolean
}) {
  return (
    <div className="space-y-3" id="trade-log-panel">
      {priorSeasonsFailed && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          Prior-season trade history did not load cleanly — showing current season
          only. (FAIL)
        </p>
      )}
      {priorSeasonsIncluded.length > 0 && (
        <p className="text-xs text-[var(--gwb-muted)]">
          Includes seasons: {priorSeasonsIncluded.join(', ')}
        </p>
      )}
      {!trades.length ? (
        <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
          No completed trades yet.
        </p>
      ) : (
        <ul
          className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
          role="list"
        >
          {trades.map((t) => (
            <li
              key={t.transactionId}
              className="border-t border-[var(--gwb-border)] px-4 py-3 first:border-t-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  {t.sideA.managerName} ↔ {t.sideB.managerName}
                </p>
                <p className="text-xs text-[var(--gwb-muted)]">
                  {t.dateLabel || '—'} · Week {t.week}
                  {t.season !== trades[0]?.season ? ` · ${t.season}` : ''}
                </p>
              </div>
              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--gwb-muted)]">
                    {t.sideA.managerName} received
                  </p>
                  <p>{formatTradeAssetList(t.sideA.received)}</p>
                  <p className="mt-1 text-xs text-[var(--gwb-muted)]">
                    Sent {formatTradeAssetList(t.sideA.sent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--gwb-muted)]">
                    {t.sideB.managerName} received
                  </p>
                  <p>{formatTradeAssetList(t.sideB.received)}</p>
                  <p className="mt-1 text-xs text-[var(--gwb-muted)]">
                    Sent {formatTradeAssetList(t.sideB.sent)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

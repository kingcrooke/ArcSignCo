import { formatTradeAssetList, type TradeAsset, type TradeLogEntry } from '../lib/trades'

function isPickAsset(label: string): boolean {
  return /\bRd\s+\d/i.test(label) || /round/i.test(label)
}

function AssetList({
  assets,
  highlightDraftPicks,
}: {
  assets: TradeAsset[]
  highlightDraftPicks?: boolean
}) {
  if (!assets.length) return <>—</>
  return (
    <>
      {assets.map((a, i) => {
        const pick = highlightDraftPicks && isPickAsset(a.label)
        return (
          <span key={`${a.label}-${i}`}>
            {i > 0 ? ', ' : ''}
            <span
              className={
                pick
                  ? 'font-semibold text-[var(--gwb-accent-bright)]'
                  : undefined
              }
            >
              {a.label}
            </span>
          </span>
        )
      })}
    </>
  )
}

export function TradeLogPanel({
  trades,
  priorSeasonsIncluded,
  priorSeasonsFailed,
  playersLoading,
  highlightDraftPicks,
  seasonOnly,
}: {
  trades: TradeLogEntry[]
  priorSeasonsIncluded: string[]
  priorSeasonsFailed: boolean
  playersLoading: boolean
  highlightDraftPicks?: boolean
  seasonOnly?: string
}) {
  const filtered = seasonOnly
    ? trades.filter((t) => t.season === seasonOnly)
    : trades

  return (
    <div className="space-y-3" id="trade-log-panel">
      {priorSeasonsFailed && (
        <p className="dynasty-deferral text-sm">
          Prior-season trade history did not load cleanly — some seasons may be
          missing. (FAIL)
        </p>
      )}
      {priorSeasonsIncluded.length > 0 && (
        <p className="text-xs text-[var(--gwb-muted)]">
          Includes prior seasons: {priorSeasonsIncluded.join(', ')}
        </p>
      )}
      {playersLoading ? (
        <p className="rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
          Loading trade history…
        </p>
      ) : !filtered.length ? (
        <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
          No completed trades yet.
        </p>
      ) : (
        <ul
          className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
          role="list"
        >
          {filtered.map((t) => (
            <li
              key={t.transactionId}
              className="border-t border-[var(--gwb-border)] px-4 py-3 first:border-t-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  {t.sideA.managerName} ↔ {t.sideB.managerName}
                </p>
                <p className="text-xs text-[var(--gwb-muted)]">
                  {t.dateLabel || '—'} · {t.season} · Week {t.week}
                </p>
              </div>
              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--gwb-muted)]">
                    {t.sideA.managerName} received
                  </p>
                  <p>
                    <AssetList
                      assets={t.sideA.received}
                      highlightDraftPicks={highlightDraftPicks}
                    />
                  </p>
                  <p className="mt-1 text-xs text-[var(--gwb-muted)]">
                    Sent{' '}
                    <AssetList
                      assets={t.sideA.sent}
                      highlightDraftPicks={highlightDraftPicks}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--gwb-muted)]">
                    {t.sideB.managerName} received
                  </p>
                  <p>
                    <AssetList
                      assets={t.sideB.received}
                      highlightDraftPicks={highlightDraftPicks}
                    />
                  </p>
                  <p className="mt-1 text-xs text-[var(--gwb-muted)]">
                    Sent{' '}
                    <AssetList
                      assets={t.sideB.sent}
                      highlightDraftPicks={highlightDraftPicks}
                    />
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

export { formatTradeAssetList }

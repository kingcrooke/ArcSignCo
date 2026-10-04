import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import recapsData from '../content/commissioner-recaps.json'
import {
  commissionerRecapChipLabel,
  commissionerRecapExcerpt,
  filterCommissionerRecapsByWeek,
  type CommissionerRecap,
} from '../lib/recaps'

const RECAPS = recapsData.recaps as CommissionerRecap[]

export function CommissionerRecapsPanel({ week }: { week: number }) {
  const items = useMemo(
    () => filterCommissionerRecapsByWeek(RECAPS, week),
    [week],
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--gwb-muted)]">
        {recapsData.label} — timeline for NFL Week {week}. Tap a post to read
        the full recap.
      </p>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-sm text-[var(--gwb-muted)]">
          No commissioner recaps for Week {week} yet.
        </p>
      ) : (
        <ol className="relative space-y-2 border-l border-[var(--gwb-border)] pl-4">
          {items.map((r) => (
            <li key={r.id} className="relative">
              <span
                className="absolute -left-[1.125rem] top-4 h-2 w-2 rounded-full bg-[var(--gwb-accent)]"
                aria-hidden
              />
              <details
                className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
              >
                <summary className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex flex-col gap-2">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full bg-[#243040] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]"
                      >
                        {commissionerRecapChipLabel(r.label)}
                      </span>
                      {r.reconstructed && (
                        <span className="rounded-full bg-[#243040] px-2 py-0.5 text-xs font-normal uppercase tracking-wide text-[var(--gwb-muted)]">
                          reconstructed
                        </span>
                      )}
                      <time
                        className="text-xs text-[var(--gwb-muted)]"
                        dateTime={r.postedAt}
                      >
                        {formatPostedDay(r.postedAt)}
                      </time>
                    </span>
                    <span className="font-medium leading-snug">{r.title}</span>
                    <span className="text-sm leading-relaxed text-[var(--gwb-muted)] line-clamp-3">
                      {commissionerRecapExcerpt(r.bodyMarkdown)}
                    </span>
                  </span>
                </summary>
                <div className="commissioner-recap-prose border-t border-[var(--gwb-border)] px-4 py-4 text-sm leading-relaxed text-[var(--gwb-text)]">
                  <ReactMarkdown>{r.bodyMarkdown}</ReactMarkdown>
                </div>
              </details>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function formatPostedDay(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

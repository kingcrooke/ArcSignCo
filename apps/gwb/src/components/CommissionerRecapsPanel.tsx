import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import recapsData from '../content/commissioner-recaps.json'

type CommissionerRecap = {
  id: string
  index: number
  title: string
  week: number
  reconstructed?: boolean
  bodyMarkdown: string
}

const RECAPS = recapsData.recaps as CommissionerRecap[]

function groupByWeek(recaps: CommissionerRecap[]) {
  const map = new Map<number, CommissionerRecap[]>()
  for (const r of recaps) {
    const list = map.get(r.week) ?? []
    list.push(r)
    map.set(r.week, list)
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([week, items]) => ({
      week,
      items: items.sort((a, b) => b.index - a.index),
    }))
}

export function CommissionerRecapsPanel() {
  const weeks = useMemo(() => groupByWeek(RECAPS), [])
  const [openId, setOpenId] = useState<string | null>(weeks[0]?.items[0]?.id ?? null)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--gwb-muted)]">
          {recapsData.label} — league chat write-ups from the commissioner, grouped
          by NFL week (newest first).
        </p>
      </div>
      {weeks.map(({ week, items }) => (
        <section key={week} className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--gwb-accent)]">
            Week {week}
          </h3>
          <div className="space-y-2">
            {items.map((r) => {
              const isOpen = openId === r.id
              return (
                <details
                  key={r.id}
                  className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
                  open={isOpen}
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) {
                      setOpenId(r.id)
                    } else if (openId === r.id) {
                      setOpenId(null)
                    }
                  }}
                >
                  <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-wrap items-center gap-2">
                      <span>{r.title}</span>
                      {r.reconstructed && (
                        <span className="rounded-full bg-[#243040] px-2 py-0.5 text-xs font-normal uppercase tracking-wide text-[var(--gwb-muted)]">
                          reconstructed
                        </span>
                      )}
                    </span>
                  </summary>
                  <div className="commissioner-recap-prose border-t border-[var(--gwb-border)] px-4 py-4 text-sm leading-relaxed text-[var(--gwb-text)]">
                    <ReactMarkdown>{r.bodyMarkdown}</ReactMarkdown>
                  </div>
                </details>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

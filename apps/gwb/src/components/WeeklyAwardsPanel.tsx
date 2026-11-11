import type { WeeklyAwardsWeek } from '../lib/weeklyAwards'

function cell(w: { managerName: string; detail: string } | null) {
  if (!w) return '—'
  return `${w.managerName} (${w.detail})`
}

export function WeeklyAwardsPanel({ weeks }: { weeks: WeeklyAwardsWeek[] }) {
  if (!weeks.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No scored weeks yet for awards.
      </p>
    )
  }

  return (
    <div id="weekly-awards-panel">
      <ul className="space-y-2 sm:hidden" role="list">
        {weeks.map((w) => (
          <li
            key={w.week}
            className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm"
          >
            <p className="font-semibold tabular-nums text-[var(--gwb-flow-awards)]">
              Week {w.week}
            </p>
            <dl className="mt-2 grid gap-1.5 text-xs">
              <div>
                <dt className="text-[var(--gwb-muted)]">High score</dt>
                <dd>{cell(w.highScore)}</dd>
              </div>
              <div>
                <dt className="text-[var(--gwb-muted)]">Low score</dt>
                <dd>{cell(w.lowScore)}</dd>
              </div>
              <div>
                <dt className="text-[var(--gwb-muted)]">Closest win</dt>
                <dd>{cell(w.closestWin)}</dd>
              </div>
              <div>
                <dt className="text-[var(--gwb-muted)]">Most bench</dt>
                <dd>{cell(w.mostBench)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--gwb-border)] text-left text-xs uppercase text-[var(--gwb-muted)]">
              <th className="px-3 py-2">Week</th>
              <th className="px-3 py-2">High score</th>
              <th className="px-3 py-2">Low score</th>
              <th className="px-3 py-2">Closest win</th>
              <th className="px-3 py-2">Most bench</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.week} className="border-t border-[var(--gwb-border)]">
                <td className="px-3 py-2 font-semibold tabular-nums">{w.week}</td>
                <td className="px-3 py-2">{cell(w.highScore)}</td>
                <td className="px-3 py-2">{cell(w.lowScore)}</td>
                <td className="px-3 py-2">{cell(w.closestWin)}</td>
                <td className="px-3 py-2">{cell(w.mostBench)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

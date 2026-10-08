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
    <div className="overflow-x-auto" id="weekly-awards-panel">
      <table className="w-full min-w-[520px] border-collapse text-sm">
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
  )
}

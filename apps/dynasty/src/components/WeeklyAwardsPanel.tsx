import type { WeeklyAwardWinner, WeeklyAwardsWeek } from '../lib/weeklyAwards'
import type { TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function AwardCell({
  winner,
  teams,
}: {
  winner: WeeklyAwardWinner | null
  teams: Map<number, TeamInfo>
}) {
  if (!winner) return <>—</>
  const team = teams.get(winner.rosterId)
  return (
    <span className="inline-flex max-w-full flex-wrap items-start gap-2">
      {team && <TeamAvatar team={team} size="sm" />}
      <span className="min-w-0 break-words">
        {winner.managerName} ({winner.detail})
      </span>
    </span>
  )
}

function AwardRow({
  label,
  winner,
  teams,
}: {
  label: string
  winner: WeeklyAwardWinner | null
  teams: Map<number, TeamInfo>
}) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-[var(--dyn-border)] py-2 first:border-t-0 first:pt-0 sm:flex-row sm:gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--dyn-muted)] sm:w-28 sm:shrink-0">
        {label}
      </span>
      <div className="min-w-0 text-sm">
        <AwardCell winner={winner} teams={teams} />
      </div>
    </div>
  )
}

export function WeeklyAwardsPanel({
  weeks,
  teams,
}: {
  weeks: WeeklyAwardsWeek[]
  teams: Map<number, TeamInfo>
}) {
  if (!weeks.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--dyn-border)] p-6 text-center text-[var(--dyn-muted)]">
        No scored weeks yet for awards.
      </p>
    )
  }

  return (
    <div id="weekly-awards-panel">
      <div className="space-y-3 sm:hidden">
      {weeks.map((w) => (
        <article
          key={w.week}
          className="rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-4 py-3"
        >
          <p className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--dyn-accent)]">
            Week {w.week}
          </p>
          <AwardRow label="High score" winner={w.highScore} teams={teams} />
          <AwardRow label="Low score" winner={w.lowScore} teams={teams} />
          <AwardRow label="Closest win" winner={w.closestWin} teams={teams} />
          <AwardRow label="Most bench" winner={w.mostBench} teams={teams} />
        </article>
      ))}
      </div>

      <div className="hidden rounded-xl border border-[var(--dyn-border)] sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--dyn-border)] text-left text-xs uppercase text-[var(--dyn-muted)]">
              <th className="w-[3.5rem] px-3 py-2">Week</th>
              <th className="px-3 py-2">High score</th>
              <th className="px-3 py-2">Low score</th>
              <th className="px-3 py-2">Closest win</th>
              <th className="px-3 py-2">Most bench</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.week} className="border-t border-[var(--dyn-border)]">
                <td className="px-3 py-2 align-top font-semibold tabular-nums">{w.week}</td>
                <td className="min-w-0 px-3 py-2 align-top whitespace-normal break-words">
                  <AwardCell winner={w.highScore} teams={teams} />
                </td>
                <td className="min-w-0 px-3 py-2 align-top whitespace-normal break-words">
                  <AwardCell winner={w.lowScore} teams={teams} />
                </td>
                <td className="min-w-0 px-3 py-2 align-top whitespace-normal break-words">
                  <AwardCell winner={w.closestWin} teams={teams} />
                </td>
                <td className="min-w-0 px-3 py-2 align-top whitespace-normal break-words">
                  <AwardCell winner={w.mostBench} teams={teams} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

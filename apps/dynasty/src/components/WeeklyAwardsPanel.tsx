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
    <span className="inline-flex items-center gap-2">
      {team && <TeamAvatar team={team} size="sm" />}
      <span>
        {winner.managerName} ({winner.detail})
      </span>
    </span>
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
    <div className="overflow-x-auto" id="weekly-awards-panel">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--dyn-border)] text-left text-xs uppercase text-[var(--dyn-muted)]">
            <th className="px-3 py-2">Week</th>
            <th className="px-3 py-2">High score</th>
            <th className="px-3 py-2">Low score</th>
            <th className="px-3 py-2">Closest win</th>
            <th className="px-3 py-2">Most bench</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.week} className="border-t border-[var(--dyn-border)]">
              <td className="px-3 py-2 font-semibold tabular-nums">{w.week}</td>
              <td className="px-3 py-2">
                <AwardCell winner={w.highScore} teams={teams} />
              </td>
              <td className="px-3 py-2">
                <AwardCell winner={w.lowScore} teams={teams} />
              </td>
              <td className="px-3 py-2">
                <AwardCell winner={w.closestWin} teams={teams} />
              </td>
              <td className="px-3 py-2">
                <AwardCell winner={w.mostBench} teams={teams} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

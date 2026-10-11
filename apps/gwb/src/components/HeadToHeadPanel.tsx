import { useMemo } from 'react'
import { buildHeadToHeadMap, headToHeadForRoster } from '../lib/headToHead'
import { managerNickname } from '../lib/nicknames'
import type { SleeperMatchup, TeamInfo } from '../lib/types'

export function HeadToHeadPanel({
  teams,
  matchupsByWeek,
  throughWeek,
}: {
  teams: Map<number, TeamInfo>
  matchupsByWeek: Map<number, SleeperMatchup[]>
  throughWeek: number
}) {
  const rosterIds = useMemo(
    () => [...teams.keys()].sort((a, b) => a - b),
    [teams],
  )
  const h2h = useMemo(
    () => buildHeadToHeadMap(matchupsByWeek, throughWeek),
    [matchupsByWeek, throughWeek],
  )

  return (
    <div
      className="overflow-x-auto overscroll-x-contain rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
      id="head-to-head-panel"
    >
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--gwb-border)] text-left text-xs uppercase text-[var(--gwb-muted)]">
            <th
              className="sticky left-0 z-20 min-w-[5.5rem] max-w-[8.5rem] bg-[var(--gwb-surface)] px-2 py-2 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.45)]"
            >
              Mgr
            </th>
            {rosterIds.map((id) => (
              <th
                key={id}
                className="min-w-[2.75rem] whitespace-nowrap px-2 py-2 text-center font-medium"
              >
                {managerNickname(id, teams.get(id)?.displayName ?? '').slice(0, 4)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rosterIds.map((rowId) => (
            <tr key={rowId} className="border-t border-[var(--gwb-border)]">
              <th
                className="sticky left-0 z-10 min-w-[5.5rem] max-w-[8.5rem] truncate bg-[var(--gwb-surface)] px-2 py-1.5 text-left font-medium shadow-[4px_0_8px_-4px_rgba(0,0,0,0.45)]"
                scope="row"
                title={managerNickname(rowId, teams.get(rowId)?.displayName ?? '')}
              >
                {managerNickname(rowId, teams.get(rowId)?.displayName ?? '')}
              </th>
              {rosterIds.map((colId) => {
                if (rowId === colId) {
                  return (
                    <td
                      key={colId}
                      className="px-2 py-1.5 text-center text-[var(--gwb-muted)]"
                    >
                      —
                    </td>
                  )
                }
                const rec = headToHeadForRoster(rowId, colId, h2h)
                const label = rec
                  ? `${rec.wins}-${rec.losses}${rec.ties ? `-${rec.ties}` : ''}`
                  : ''
                return (
                  <td
                    key={colId}
                    className="min-w-[2.75rem] whitespace-nowrap px-2 py-1.5 text-center tabular-nums"
                    title={label || undefined}
                  >
                    {label || '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[var(--gwb-muted)]">
        Row vs column record through Week {throughWeek} (completed matchups).
      </p>
    </div>
  )
}

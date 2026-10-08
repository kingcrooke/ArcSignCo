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
    <div className="overflow-x-auto" id="head-to-head-panel">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--gwb-border)] text-left text-xs uppercase text-[var(--gwb-muted)]">
            <th className="sticky left-0 bg-[var(--gwb-surface)] px-2 py-2">Mgr</th>
            {rosterIds.map((id) => (
              <th key={id} className="px-2 py-2 text-center font-medium">
                {managerNickname(id, teams.get(id)?.displayName ?? '').slice(0, 4)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rosterIds.map((rowId) => (
            <tr key={rowId} className="border-t border-[var(--gwb-border)]">
              <th
                className="sticky left-0 bg-[var(--gwb-surface)] px-2 py-1.5 text-left font-medium"
                scope="row"
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
                    className="px-2 py-1.5 text-center tabular-nums"
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

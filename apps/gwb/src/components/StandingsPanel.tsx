import { useMemo } from 'react'
import { headToHeadForRoster, buildHeadToHeadMap } from '../lib/headToHead'
import { managerNickname } from '../lib/nicknames'
import { recordLabel } from '../lib/standings'
import type { SleeperMatchup, StandingRow, TeamInfo } from '../lib/types'

export function StandingsPanel({
  rows,
  deferralNote,
  matchupsByWeek,
  standingsThroughWeek,
  teams,
}: {
  rows: StandingRow[]
  deferralNote?: string | null
  matchupsByWeek: Map<number, SleeperMatchup[]>
  standingsThroughWeek: number
  teams: Map<number, TeamInfo>
}) {
  const h2h = useMemo(
    () => buildHeadToHeadMap(matchupsByWeek, standingsThroughWeek),
    [matchupsByWeek, standingsThroughWeek],
  )

  const sacko = rows.length ? rows[rows.length - 1] : null

  const opponentsFor = (rosterId: number): number[] => {
    const set = new Set<number>()
    for (let w = 1; w <= standingsThroughWeek; w++) {
      const week = matchupsByWeek.get(w)
      if (!week) continue
      const mine = week.find((m) => m.roster_id === rosterId)
      if (!mine) continue
      const opp = week.find(
        (m) => m.matchup_id === mine.matchup_id && m.roster_id !== rosterId,
      )
      if (opp) set.add(opp.roster_id)
    }
    return [...set].sort((a, b) => a - b)
  }

  return (
    <div className="space-y-3">
      {deferralNote && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {deferralNote}
        </p>
      )}

      {/* Mobile card layout */}
      <ul className="space-y-2 sm:hidden" role="list">
        {rows.map((r) => (
          <li
            key={r.rosterId}
            className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5"
          >
            <details>
              <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-[var(--gwb-accent)]">#{r.rank}</span>
                    <span className="ml-2 font-medium">{r.teamName}</span>
                    <p className="text-xs text-[var(--gwb-muted)]">
                      {managerNickname(r.rosterId, r.displayName)}
                      <span className="mx-1">·</span>
                      <span title={`Sleeper: ${r.displayName}`}>@{r.displayName}</span>
                    </p>
                  </div>
                  <div className="text-right text-sm tabular-nums">
                    <div>{recordLabel(r)}</div>
                    <div className="text-xs text-[var(--gwb-muted)]">PF {r.pointsFor.toFixed(2)}</div>
                  </div>
                </div>
              </summary>
              <H2HBlock rosterId={r.rosterId} opponents={opponentsFor(r.rosterId)} h2h={h2h} teams={teams} />
            </details>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--gwb-border)] sm:block">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">W-L-T</th>
              <th className="px-3 py-2">PF</th>
              <th className="px-3 py-2">PA</th>
              <th className="px-3 py-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.rosterId}
                className="border-t border-[var(--gwb-border)] odd:bg-[#0d1319]"
              >
                <td className="px-3 py-2.5 font-semibold text-[var(--gwb-accent)]">
                  {r.rank}
                </td>
                <td className="px-3 py-2.5">
                  <details>
                    <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
                      <div className="font-medium">{r.teamName}</div>
                      <div className="text-xs text-[var(--gwb-muted)]">
                        {managerNickname(r.rosterId, r.displayName)}
                        <span className="mx-1" title={`Sleeper: ${r.displayName}`}>
                          (@{r.displayName})
                        </span>
                      </div>
                    </summary>
                    <H2HBlock
                      rosterId={r.rosterId}
                      opponents={opponentsFor(r.rosterId)}
                      h2h={h2h}
                      teams={teams}
                    />
                  </details>
                </td>
                <td className="px-3 py-2.5 tabular-nums">{recordLabel(r)}</td>
                <td className="px-3 py-2.5 tabular-nums">{r.pointsFor.toFixed(2)}</td>
                <td className="px-3 py-2.5 tabular-nums">{r.pointsAgainst.toFixed(2)}</td>
                <td className="px-3 py-2.5 tabular-nums">{r.streak || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sacko && (
        <p className="text-sm text-[var(--gwb-muted)]">
          Sacko watch: #{sacko.rank} {sacko.teamName} ({recordLabel(sacko)}, PF{' '}
          {sacko.pointsFor.toFixed(2)}).
        </p>
      )}
    </div>
  )
}

function H2HBlock({
  rosterId,
  opponents,
  h2h,
  teams,
}: {
  rosterId: number
  opponents: number[]
  h2h: ReturnType<typeof buildHeadToHeadMap>
  teams: Map<number, TeamInfo>
}) {
  if (!opponents.length) return null
  return (
    <div className="mt-2 space-y-1 text-xs text-[var(--gwb-muted)]">
      <p className="font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
        Head-to-head
      </p>
      {opponents.map((oppId) => {
        const rec = headToHeadForRoster(rosterId, oppId, h2h)
        const opp = teams.get(oppId)
        if (!rec) return null
        const record = `${rec.wins}-${rec.losses}${rec.ties ? `-${rec.ties}` : ''}`
        const pf = Math.round(rec.pointsFor)
        const pa = Math.round(rec.pointsAgainst)
        const self = teams.get(rosterId)?.teamName ?? 'Team'
        return (
          <p key={oppId}>
            {self} is {record} vs {opp?.teamName ?? 'Opponent'}, {pf}–{pa} combined.
          </p>
        )
      })}
    </div>
  )
}

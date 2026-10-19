import { useMemo } from 'react'
import {
  futurePickOwnership,
  picksByRound,
  type DraftBoard,
} from '../lib/drafts'
import { playerDisplayName } from '../lib/matchupBoard'
import { managerLabel } from '../lib/teams'
import type { PlayersMap, SleeperTradedPick, TeamInfo } from '../lib/types'
import type { TradedPickHistoryRow } from '../lib/drafts'
import { TeamAvatar } from './TeamAvatar'

export function DraftsPanel({
  boards,
  tradedPicks,
  tradedPickHistory,
  teams,
  players,
  playersLoading,
  leagueSeason,
}: {
  boards: DraftBoard[]
  tradedPicks: SleeperTradedPick[]
  tradedPickHistory: TradedPickHistoryRow[]
  teams: Map<number, TeamInfo>
  players: PlayersMap | null
  playersLoading: boolean
  leagueSeason: string
}) {
  const future = useMemo(
    () => futurePickOwnership(tradedPicks, teams, leagueSeason, 3),
    [tradedPicks, teams, leagueSeason],
  )

  return (
    <div className="space-y-8" id="drafts-panel">
      {boards.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--dyn-border)] p-6 text-center text-[var(--dyn-muted)]">
          No rookie draft found for this season.
        </p>
      ) : (
        boards.map(({ draft, picks, rounds }) => (
          <section key={draft.draft_id}>
            <h3 className="mb-2 font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent-bright)]">
              {draft.metadata?.name ?? 'Rookie draft'} · {draft.season}
            </h3>
            <p className="mb-3 text-xs text-[var(--dyn-muted)]">
              {draft.type} · {rounds} rounds · {draft.status}
            </p>
            <div className="space-y-4">
              {Array.from({ length: rounds }, (_, i) => i + 1).map((round) => (
                <div key={round}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
                    Round {round}
                  </p>
                  <ul
                    className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)]"
                    role="list"
                  >
                    {picksByRound(picks, round).map((pick) => {
                      const team = teams.get(pick.roster_id)
                      const name =
                        pick.player_id && players
                          ? playerDisplayName(pick.player_id, players)
                          : 'TBD'
                      return (
                        <li
                          key={pick.pick_no}
                          className="flex items-center gap-3 border-t border-[var(--dyn-border)] px-3 py-2 first:border-t-0"
                        >
                          <span className="w-6 text-xs tabular-nums text-[var(--dyn-muted)]">
                            {pick.pick_no}
                          </span>
                          <TeamAvatar team={team} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {name}
                              {playersLoading && !players ? '…' : ''}
                            </p>
                            <p className="truncate text-xs text-[var(--dyn-muted)]">
                              {managerLabel(team, pick.roster_id)}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      <section>
        <h3 className="mb-2 text-lg font-semibold">Future pick ownership</h3>
        <p className="mb-3 text-xs text-[var(--dyn-muted)]">
          Next three draft years from {leagueSeason} (via Sleeper traded picks).
        </p>
        {future.length === 0 ? (
          <p className="dynasty-deferral text-sm">No traded future picks on file.</p>
        ) : (
          <ul
            className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] text-sm"
            role="list"
          >
            {future.map((row) => (
              <li
                key={`${row.season}-${row.round}-${row.originalRosterId}-${row.ownerRosterId}`}
                className="border-t border-[var(--dyn-border)] px-4 py-2 first:border-t-0"
              >
                <span className="font-medium text-[var(--dyn-accent-bright)]">
                  {row.season} Rd {row.round}
                </span>
                <span className="text-[var(--dyn-muted)]"> · originally </span>
                {row.originalLabel}
                <span className="text-[var(--dyn-muted)]"> → now </span>
                {row.ownerLabel}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">Traded pick history</h3>
        <p className="mb-3 text-xs text-[var(--dyn-muted)]">
          Pick moves from completed trades this season.
        </p>
        {tradedPickHistory.length === 0 ? (
          <p className="dynasty-deferral text-sm">No pick trades recorded yet.</p>
        ) : (
          <ul
            className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] text-sm"
            role="list"
          >
            {tradedPickHistory.map((row, i) => {
              const original = teams.get(row.originalRosterId)
              const from = teams.get(row.fromRosterId)
              const to = teams.get(row.toRosterId)
              const originalName = managerLabel(original, row.originalRosterId)
              return (
                <li
                  key={`${row.season}-${row.round}-${i}`}
                  className="border-t border-[var(--dyn-border)] px-4 py-2 first:border-t-0"
                >
                  <span className="font-medium">
                    {row.season} Rd {row.round} ({originalName}&apos;s pick)
                  </span>
                  <span className="text-[var(--dyn-muted)]">
                    {' '}
                    · {from?.teamName ?? `R${row.fromRosterId}`} →{' '}
                    {to?.teamName ?? `R${row.toRosterId}`}
                  </span>
                  <span className="block text-xs text-[var(--dyn-muted)]">
                    {row.dateLabel} · {row.weekLabel}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

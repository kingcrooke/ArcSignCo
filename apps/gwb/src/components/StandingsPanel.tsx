import { managerNickname } from '../lib/nicknames'
import { recordLabel, streakLabel } from '../lib/standings'
import type { StandingRow, TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function pfPa(row: StandingRow): { pf: string; pa: string } {
  return {
    pf: row.pointsFor.toFixed(2),
    pa: row.pointsAgainst.toFixed(2),
  }
}

export function StandingsPanel({
  rows,
  deferralNote,
  teams,
  playoffTeams,
}: {
  rows: StandingRow[]
  deferralNote?: string | null
  teams: Map<number, TeamInfo>
  playoffTeams?: number | null
}) {
  const sacko = rows.length ? rows[rows.length - 1] : null
  const cutoff =
    playoffTeams && playoffTeams > 0 && playoffTeams < rows.length
      ? playoffTeams
      : null

  return (
    <div className="space-y-3">
      {deferralNote && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {deferralNote}
        </p>
      )}

      <ul
        className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
        role="list"
        aria-label="League standings"
      >
        {rows.map((r, index) => {
          const team = teams.get(r.rosterId)
          const { pf, pa } = pfPa(r)
          const streak = streakLabel(r.streak)
          const showPlayoffLine =
            cutoff !== null && r.rank === cutoff && index < rows.length - 1

          return (
            <li key={r.rosterId}>
              <div
                className={`flex items-center gap-2.5 border-t border-[var(--gwb-border)] px-3 py-2.5 first:border-t-0 sm:gap-3 sm:px-4 sm:py-3 ${
                  index % 2 === 1 ? 'bg-[#0d1319]/60' : ''
                }`}
              >
                <span
                  className="w-5 shrink-0 text-center text-sm font-semibold tabular-nums text-[var(--gwb-muted)] sm:w-6"
                  aria-label={`Rank ${r.rank}`}
                >
                  {r.rank}
                </span>

                <TeamAvatar team={team} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight sm:text-[15px]">
                    {r.teamName}
                  </p>
                  <p className="truncate text-xs text-[var(--gwb-muted)]">
                    {managerNickname(r.rosterId, r.displayName)}
                    {r.displayName ? (
                      <span className="text-[var(--gwb-muted)]/75">
                        {' '}
                        · @{r.displayName}
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums leading-tight">
                      {recordLabel(r)}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[var(--gwb-muted)] sm:text-xs">
                      <span>PF </span>
                      <span className="tabular-nums">{pf}</span>
                      <span className="mx-1 text-[var(--gwb-border)]">·</span>
                      <span>PA </span>
                      <span className="tabular-nums">{pa}</span>
                      {streak ? (
                        <>
                          <span className="mx-1 text-[var(--gwb-border)]">·</span>
                          <span
                            className={
                              streak.startsWith('W')
                                ? 'font-semibold text-emerald-400/90'
                                : streak.startsWith('L')
                                  ? 'font-semibold text-rose-400/80'
                                  : 'font-semibold'
                            }
                          >
                            {streak}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>

                  {streak ? (
                    <span
                      className={`hidden min-w-[2.25rem] text-center text-xs font-semibold tabular-nums sm:inline ${
                        streak.startsWith('W')
                          ? 'text-emerald-400/90'
                          : streak.startsWith('L')
                            ? 'text-rose-400/80'
                            : 'text-[var(--gwb-muted)]'
                      }`}
                    >
                      {streak}
                    </span>
                  ) : (
                    <span className="hidden min-w-[2.25rem] text-center text-xs text-[var(--gwb-muted)] sm:inline">
                      —
                    </span>
                  )}
                </div>
              </div>

              {showPlayoffLine && (
                <div
                  className="flex items-center gap-2 border-t border-[var(--gwb-accent)]/35 bg-[var(--gwb-accent)]/5 px-3 py-1.5"
                  role="separator"
                  aria-label="Playoff cutoff"
                >
                  <div className="h-px flex-1 bg-[var(--gwb-accent)]/40" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gwb-accent)]">
                    Playoffs
                  </span>
                  <div className="h-px flex-1 bg-[var(--gwb-accent)]/40" />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {sacko && (
        <p className="text-sm text-[var(--gwb-muted)]">
          Sacko watch: #{sacko.rank} {sacko.teamName} ({recordLabel(sacko)}, PF{' '}
          {sacko.pointsFor.toFixed(2)}).
        </p>
      )}
    </div>
  )
}

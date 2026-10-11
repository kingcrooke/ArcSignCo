import { useMemo } from 'react'
import {
  computeAllPlayThroughWeek,
  formatAllPlayRecord,
  playoffSeedHint,
} from '../lib/allPlay'
import { recordLabel, streakLabel } from '../lib/standings'
import type { FaabSnapshot } from '../lib/faab'
import type { SleeperMatchup, StandingRow, TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function pfPa(row: StandingRow): { pf: string; pa: string } {
  return {
    pf: row.pointsFor.toFixed(2),
    pa: row.pointsAgainst.toFixed(2),
  }
}

function StreakBadge({ streak }: { streak: string }) {
  if (!streak) {
    return (
      <span className="min-w-[2.25rem] text-center text-xs text-[var(--dyn-muted)]">
        —
      </span>
    )
  }
  return (
    <span
      className={`min-w-[2.25rem] text-center text-xs font-semibold tabular-nums ${
        streak.startsWith('W')
          ? 'dynasty-positive'
          : streak.startsWith('L')
            ? 'text-rose-400/80'
            : 'text-[var(--dyn-muted)]'
      }`}
    >
      {streak}
    </span>
  )
}

function faabLabel(snap: FaabSnapshot | undefined): string {
  if (!snap) return '—'
  return `$${snap.remaining}`
}

export function StandingsPanel({
  rows,
  deferralNote,
  teams,
  playoffTeams,
  matchupsByWeek,
  standingsThroughWeek,
  faabByRoster,
}: {
  rows: StandingRow[]
  deferralNote?: string | null
  teams: Map<number, TeamInfo>
  playoffTeams?: number | null
  matchupsByWeek: Map<number, SleeperMatchup[]>
  standingsThroughWeek: number
  faabByRoster: Map<number, FaabSnapshot>
}) {
  const sacko = rows.length ? rows[rows.length - 1] : null
  const cutoff =
    playoffTeams && playoffTeams > 0 && playoffTeams < rows.length
      ? playoffTeams
      : null

  const allPlay = useMemo(
    () => computeAllPlayThroughWeek(matchupsByWeek, standingsThroughWeek),
    [matchupsByWeek, standingsThroughWeek],
  )

  return (
    <div className="space-y-3">
      {deferralNote && (
        <p className="dynasty-deferral">
          {deferralNote}
        </p>
      )}

      <ul
        className="overflow-hidden rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)]"
        role="list"
        aria-label="League standings"
      >
        {rows.map((r, index) => {
          const team = teams.get(r.rosterId)
          const { pf, pa } = pfPa(r)
          const streak = streakLabel(r.streak)
          const manager = r.teamName || r.displayName
          const showPlayoffLine =
            cutoff !== null && r.rank === cutoff && index < rows.length - 1
          const seedLine =
            playoffTeams && playoffTeams > 0
              ? playoffSeedHint(r.rank, playoffTeams)
              : null
          const ap = allPlay.get(r.rosterId)
          const allPlayLabel = ap ? formatAllPlayRecord(ap) : '—'
          const faab = faabByRoster.get(r.rosterId)

          return (
            <li key={r.rosterId}>
              <div
                className={`flex items-start gap-2.5 border-t border-[var(--dyn-border)] px-3 py-2.5 first:border-t-0 sm:items-center sm:gap-3 sm:px-4 sm:py-3 ${
                  index % 2 === 1 ? 'bg-[#0d1319]/60' : ''
                }`}
              >
                <span
                  className="w-5 shrink-0 pt-0.5 text-center text-sm font-semibold tabular-nums text-[var(--dyn-muted)] sm:w-6 sm:pt-0"
                  aria-label={`Rank ${r.rank}`}
                >
                  {r.rank}
                </span>

                <TeamAvatar team={team} size="sm" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2 sm:items-center">
                    <p
                      className="min-w-0 flex-1 text-sm font-semibold leading-snug break-words sm:truncate sm:leading-tight sm:text-[15px]"
                    >
                      {r.teamName}
                    </p>

                    <div className="flex shrink-0 items-center gap-2 sm:hidden">
                      <p className="text-sm font-semibold tabular-nums leading-tight">
                        {recordLabel(r)}
                      </p>
                      <StreakBadge streak={streak} />
                    </div>
                  </div>

                  <p className="mt-0.5 text-xs leading-snug text-[var(--dyn-muted)] sm:truncate">
                    <span className="sm:hidden">
                      {manager}
                      <span className="text-[var(--dyn-muted)]/80">
                        {' '}
                        · {pf} PF · {pa} PA · FAAB {faabLabel(faab)} · AP{' '}
                        {allPlayLabel}
                      </span>
                    </span>
                    <span className="hidden sm:inline">
                      {manager}
                      {r.displayName ? (
                        <span className="text-[var(--dyn-muted)]/75">
                          {' '}
                          · @{r.displayName}
                        </span>
                      ) : null}
                    </span>
                  </p>
                  {seedLine && (
                    <p className="mt-1 text-[0.65rem] leading-snug text-[var(--dyn-muted)]/90 sm:text-xs">
                      {seedLine}
                    </p>
                  )}
                </div>

                <div className="hidden shrink-0 items-center gap-3 sm:flex">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
                      FAAB
                    </p>
                    <p className="text-sm font-semibold tabular-nums leading-tight">
                      {faabLabel(faab)}
                    </p>
                    {faab && (
                      <p className="text-[10px] tabular-nums text-[var(--dyn-muted)]">
                        ${faab.spent} spent
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
                      All-play
                    </p>
                    <p className="text-sm font-semibold tabular-nums leading-tight">
                      {allPlayLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums leading-tight">
                      {recordLabel(r)}
                    </p>
                    <p className="mt-0.5 text-xs leading-tight text-[var(--dyn-muted)]">
                      <span>PF </span>
                      <span className="tabular-nums">{pf}</span>
                      <span className="mx-1 text-[var(--dyn-border)]">·</span>
                      <span>PA </span>
                      <span className="tabular-nums">{pa}</span>
                    </p>
                  </div>
                  <StreakBadge streak={streak} />
                </div>
              </div>

              {showPlayoffLine && (
                <div
                  className="flex items-center gap-2 border-t border-[var(--dyn-accent)]/35 bg-[var(--dyn-accent)]/5 px-3 py-1.5"
                  role="separator"
                  aria-label="Playoff cutoff"
                >
                  <div className="h-px flex-1 bg-[var(--dyn-accent)]/40" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dyn-accent)]">
                    Playoffs
                  </span>
                  <div className="h-px flex-1 bg-[var(--dyn-accent)]/40" />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {sacko && (
        <p className="text-sm text-[var(--dyn-muted)]">
          Sacko watch: #{sacko.rank} {sacko.teamName} ({recordLabel(sacko)}, PF{' '}
          {sacko.pointsFor.toFixed(2)}).
        </p>
      )}
    </div>
  )
}

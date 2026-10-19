import { managerNickname } from '../lib/nicknames'
import {
  POWER_RANKINGS_METHOD_NOTE,
  powerRankingsMovementLabel,
  type PowerRankingRow,
} from '../lib/powerRankings'
import type { TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function movementLabel(movement: number | null): string {
  if (movement == null) return '—'
  if (movement > 0) return `▲${movement}`
  if (movement < 0) return `▼${Math.abs(movement)}`
  return '—'
}

export function PowerRankingsPanel({
  rows,
  teams,
  throughWeek,
}: {
  rows: PowerRankingRow[]
  teams: Map<number, TeamInfo>
  throughWeek: number
}) {
  const movementFromWeek = throughWeek > 1 ? throughWeek - 1 : null
  const movementHint =
    movementFromWeek != null
      ? powerRankingsMovementLabel(movementFromWeek, throughWeek)
      : null

  return (
    <div className="space-y-2" id="power-rankings-panel">
      <p className="text-xs text-[var(--gwb-muted)]">{POWER_RANKINGS_METHOD_NOTE}</p>
      {movementHint && (
        <p className="text-xs text-[var(--gwb-muted)]">{movementHint}</p>
      )}
      <ul
        className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
        role="list"
      >
        {rows.map((r, i) => {
          const team = teams.get(r.rosterId)
          const manager = managerNickname(
            r.rosterId,
            r.displayName,
            team?.userId,
          )
          const movementTitle =
            movementFromWeek != null
              ? powerRankingsMovementLabel(movementFromWeek, throughWeek)
              : 'No prior week'
          const record =
            r.ties > 0
              ? `${r.wins}-${r.losses}-${r.ties}`
              : `${r.wins}-${r.losses}`
          return (
            <li
              key={r.rosterId}
              className={`border-t border-[var(--gwb-border)] px-3 py-2.5 first:border-t-0 sm:px-4 sm:py-3 ${
                i % 2 === 1 ? 'bg-[#0d1319]/60' : ''
              }`}
            >
              <div className="flex items-start gap-2.5 sm:items-center sm:gap-3">
                <span
                  className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-[var(--gwb-muted)]"
                  aria-hidden
                >
                  {r.rank}
                </span>
                <TeamAvatar team={team} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-tight">{manager}</p>
                  <p className="text-xs text-[var(--gwb-muted)]">
                    {record} · {r.score.toFixed(1)} score
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-[var(--gwb-muted)] sm:text-xs">
                    All-play {r.allPlayLabel} ({(r.allPlayPct * 100).toFixed(0)}%) ·
                    Win {(r.winPct * 100).toFixed(0)}% · PPG {r.ppg.toFixed(2)} ·
                    L3 {r.last3Ppg.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold tabular-nums ${
                    r.movement != null && r.movement > 0
                      ? 'text-emerald-400/90'
                      : r.movement != null && r.movement < 0
                        ? 'text-rose-400/80'
                        : 'text-[var(--gwb-muted)]'
                  }`}
                  title={movementTitle}
                  aria-label={movementTitle}
                >
                  {movementLabel(r.movement)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-xs text-[var(--gwb-muted)]">
        Through Week {throughWeek} (completed weeks only).
      </p>
    </div>
  )
}

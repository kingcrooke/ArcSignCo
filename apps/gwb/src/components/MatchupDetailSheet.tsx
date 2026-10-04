import { useEffect, useMemo, useState } from 'react'
import {
  benchPlayerIds,
  benchPointsTotal,
  playerDisplayName,
  playerMetaLine,
  pointsForPlayer,
  starterPositions,
  teamLabel,
} from '../lib/matchupBoard'
import type { ProjectionsMap } from '../lib/projections'
import type { PlayersMap, SleeperMatchup, TeamInfo } from '../lib/types'

function TeamAvatar({
  team,
  className = 'h-10 w-10',
}: {
  team: TeamInfo | undefined
  className?: string
}) {
  if (team?.avatarUrl) {
    return (
      <img
        src={team.avatarUrl}
        alt=""
        className={`${className} rounded-full border border-[var(--gwb-border)] object-cover`}
      />
    )
  }
  return (
    <div
      className={`${className} flex items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`}
    >
      {team?.teamName?.slice(0, 1) ?? '?'}
    </div>
  )
}

function LineupSide({
  matchup,
  team,
  slots,
  players,
  projections,
  showProjections,
}: {
  matchup: SleeperMatchup
  team: TeamInfo | undefined
  slots: string[]
  players: PlayersMap
  projections: ProjectionsMap | null
  showProjections: boolean
}) {
  const [benchOpen, setBenchOpen] = useState(false)
  const benchIds = benchPlayerIds(matchup)
  const benchTotal = benchPointsTotal(matchup)

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-3 flex items-center gap-2">
        <TeamAvatar team={team} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{team?.teamName ?? 'Team'}</p>
          <p className="text-2xl font-bold tabular-nums text-[var(--gwb-accent)]">
            {matchup.points.toFixed(2)}
          </p>
        </div>
      </div>

      <ul className="space-y-1">
        {slots.map((slot, i) => {
          const pid = matchup.starters?.[i] ?? '0'
          const pts = pointsForPlayer(matchup, pid, i)
          const proj =
            showProjections && projections && !/^[A-Z]{2,4}$/.test(pid)
              ? projections[pid]
              : undefined
          return (
            <li
              key={`${slot}-${i}`}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 rounded-lg border border-[var(--gwb-border)]/60 bg-[var(--gwb-surface)] px-2 py-1.5 text-sm"
            >
              <span className="text-[10px] font-semibold uppercase text-[var(--gwb-muted)]">
                {slot}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {playerDisplayName(pid, players)}
                </p>
                <p className="truncate text-xs text-[var(--gwb-muted)]">
                  {playerMetaLine(pid, players)}
                </p>
              </div>
              <div className="text-right tabular-nums">
                <p className="font-semibold">{pts.toFixed(2)}</p>
                {proj != null && (
                  <p className="text-[10px] text-[var(--gwb-muted)]">
                    {proj.toFixed(1)} proj
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-[var(--gwb-border)] bg-[#1a222c] px-3 py-2 text-left text-sm font-medium"
          onClick={() => setBenchOpen((o) => !o)}
          aria-expanded={benchOpen}
        >
          <span>Bench</span>
          <span className="tabular-nums text-[var(--gwb-muted)]">
            {benchTotal.toFixed(2)} pts
            <span className="ml-2 text-[var(--gwb-accent)]">
              {benchOpen ? '▲' : '▼'}
            </span>
          </span>
        </button>
        {benchOpen && (
          <ul className="mt-1 space-y-1">
            {benchIds.length === 0 && (
              <li className="px-2 py-2 text-xs text-[var(--gwb-muted)]">
                No bench players
              </li>
            )}
            {benchIds.map((pid) => {
              const pts = pointsForPlayer(matchup, pid, null)
              return (
                <li
                  key={pid}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[var(--gwb-border)]/40 px-2 py-1.5 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">{playerDisplayName(pid, players)}</p>
                    <p className="text-xs text-[var(--gwb-muted)]">
                      {playerMetaLine(pid, players)}
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums font-medium">
                    {pts.toFixed(2)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function MatchupDetailSheet({
  open,
  onClose,
  left,
  right,
  teams,
  rosterPositions,
  players,
  projections,
  showProjections,
}: {
  open: boolean
  onClose: () => void
  left: SleeperMatchup
  right: SleeperMatchup
  teams: Map<number, TeamInfo>
  rosterPositions: string[]
  players: PlayersMap
  projections: ProjectionsMap | null
  showProjections: boolean
}) {
  const slots = useMemo(
    () => starterPositions(rosterPositions),
    [rosterPositions],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const teamL = teams.get(left.roster_id)
  const teamR = teams.get(right.roster_id)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[var(--gwb-bg)]"
      role="dialog"
      aria-modal="true"
      aria-label={`${teamLabel(left.roster_id, teams)} vs ${teamLabel(right.roster_id, teams)}`}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-[var(--gwb-border)] px-4 py-3">
        <button
          type="button"
          className="rounded-lg border border-[var(--gwb-border)] px-3 py-1.5 text-sm font-medium"
          onClick={onClose}
        >
          Back
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">
          {teamLabel(left.roster_id, teams)} vs {teamLabel(right.roster_id, teams)}
        </p>
        <div className="w-[4.5rem]" aria-hidden />
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 lg:flex-row lg:gap-3">
          <LineupSide
            matchup={left}
            team={teamL}
            slots={slots}
            players={players}
            projections={projections}
            showProjections={showProjections}
          />
          <LineupSide
            matchup={right}
            team={teamR}
            slots={slots}
            players={players}
            projections={projections}
            showProjections={showProjections}
          />
        </div>
      </div>
    </div>
  )
}

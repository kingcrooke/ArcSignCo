import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
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
  compact,
}: {
  matchup: SleeperMatchup
  team: TeamInfo | undefined
  slots: string[]
  players: PlayersMap
  projections: ProjectionsMap | null
  showProjections: boolean
  compact: boolean
}) {
  const [benchOpen, setBenchOpen] = useState(false)
  const benchIds = benchPlayerIds(matchup)
  const benchTotal = benchPointsTotal(matchup)

  return (
    <div
      className={`min-w-0 flex-1 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-bg)] ${
        compact ? 'p-1.5' : 'p-2'
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-1.5 ${compact ? 'flex-col text-center' : 'gap-2'}`}
      >
        <TeamAvatar team={team} className={compact ? 'h-8 w-8' : 'h-10 w-10'} />
        <div className="min-w-0 w-full">
          <p
            className={`truncate font-semibold ${compact ? 'text-[11px] leading-tight' : ''}`}
          >
            {team?.teamName ?? 'Team'}
          </p>
          <p
            className={`font-bold tabular-nums text-[var(--gwb-accent)] ${
              compact ? 'text-lg' : 'text-2xl'
            }`}
          >
            {matchup.points.toFixed(2)}
          </p>
        </div>
      </div>

      <ul className={compact ? 'space-y-1' : 'space-y-1'}>
        {slots.map((slot, i) => {
          const pid = matchup.starters?.[i] ?? '0'
          const pts = pointsForPlayer(matchup, pid, i)
          const proj =
            showProjections && projections && !/^[A-Z]{2,4}$/.test(pid)
              ? projections[pid]
              : undefined
          if (compact) {
            return (
              <li
                key={`${slot}-${i}`}
                className="rounded-md border border-[var(--gwb-border)]/70 bg-[var(--gwb-surface)] px-1.5 py-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-semibold uppercase text-[var(--gwb-muted)]">
                    {slot}
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums">
                    {pts.toFixed(2)}
                  </span>
                </div>
                <p className="truncate text-[11px] font-medium leading-tight">
                  {playerDisplayName(pid, players)}
                </p>
                {proj != null && (
                  <p className="text-[9px] text-[var(--gwb-muted)] tabular-nums">
                    {proj.toFixed(1)} proj
                  </p>
                )}
              </li>
            )
          }
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

      <div className="mt-2">
        <button
          type="button"
          className={`flex w-full items-center justify-between rounded-lg border border-[var(--gwb-border)] bg-[#1a222c] text-left font-medium ${
            compact ? 'px-2 py-1.5 text-[11px]' : 'px-3 py-2 text-sm'
          }`}
          onClick={() => setBenchOpen((o) => !o)}
          aria-expanded={benchOpen}
        >
          <span>Bench</span>
          <span className="tabular-nums text-[var(--gwb-muted)]">
            {benchTotal.toFixed(2)}
            <span className="ml-1 text-[var(--gwb-accent)]">
              {benchOpen ? '▲' : '▼'}
            </span>
          </span>
        </button>
        {benchOpen && (
          <ul className="mt-1 space-y-1">
            {benchIds.length === 0 && (
              <li className="px-1 py-1 text-[10px] text-[var(--gwb-muted)]">
                No bench
              </li>
            )}
            {benchIds.map((pid) => {
              const pts = pointsForPlayer(matchup, pid, null)
              return (
                <li
                  key={pid}
                  className="flex items-center justify-between gap-1 rounded-md border border-[var(--gwb-border)]/40 bg-[var(--gwb-surface)] px-1.5 py-1 text-[11px]"
                >
                  <p className="min-w-0 truncate">
                    {playerDisplayName(pid, players)}
                  </p>
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

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`
    }
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [open])

  if (!open) return null

  const teamL = teams.get(left.roster_id)
  const teamR = teams.get(right.roster_id)

  const sheet = (
    <div
      className="fixed inset-0 z-[200] flex min-h-0 flex-col bg-[var(--gwb-bg)] isolate"
      role="dialog"
      aria-modal="true"
      aria-label={`${teamLabel(left.roster_id, teams)} vs ${teamLabel(right.roster_id, teams)}`}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-[var(--gwb-border)] bg-[var(--gwb-bg)] px-3 py-3">
        <button
          type="button"
          className="rounded-lg border border-[var(--gwb-border)] px-3 py-1.5 text-sm font-medium"
          onClick={onClose}
        >
          Back
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">
          {teamLabel(left.roster_id, teams)} vs{' '}
          {teamLabel(right.roster_id, teams)}
        </p>
        <div className="w-[4.5rem]" aria-hidden />
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--gwb-bg)] px-2 py-3"
        data-testid="matchup-detail-scroll"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3">
          <LineupSide
            matchup={left}
            team={teamL}
            slots={slots}
            players={players}
            projections={projections}
            showProjections={showProjections}
            compact
          />
          <LineupSide
            matchup={right}
            team={teamR}
            slots={slots}
            players={players}
            projections={projections}
            showProjections={showProjections}
            compact
          />
        </div>
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}

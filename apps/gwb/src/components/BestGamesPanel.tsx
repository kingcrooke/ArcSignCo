import { useEffect, useMemo, useState } from 'react'
import {
  contentForMatchup,
  rankBestGames,
  rankBestGamesForWeek,
  youtubeEmbedUrl,
  type RankedBestGame,
} from '../lib/bestGames'
import type { MulliganLedgerEntry } from '../lib/mulligans'
import {
  playerDisplayName,
  playerMetaLine,
  pointsForPlayer,
  starterPositions,
} from '../lib/matchupBoard'
import { managerNickname } from '../lib/nicknames'
import type {
  NflState,
  PlayersMap,
  SleeperLeague,
  SleeperMatchup,
  TeamInfo,
} from '../lib/types'
import { isWeekLive, lastCompletedWeek } from '../lib/weeks'
import { TeamAvatar } from './TeamAvatar'
import {
  BestGamesWeekScope,
  type BestGamesScope,
} from './BestGamesWeekScope'

function Badge({ label }: { label: string }) {
  const tone =
    label === 'Nail-biter'
      ? 'border-rose-400/40 bg-rose-950/40 text-rose-100'
      : label === 'Shootout'
        ? 'border-amber-400/40 bg-amber-950/40 text-amber-100'
        : label === 'Upset'
          ? 'border-violet-400/40 bg-violet-950/40 text-violet-100'
          : 'border-cyan-400/40 bg-cyan-950/40 text-cyan-100'
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
  )
}

function ScoreSide({
  rosterId,
  points,
  teams,
  winning,
}: {
  rosterId: number
  points: number
  teams: Map<number, TeamInfo>
  winning: boolean
}) {
  const team = teams.get(rosterId)
  const manager = managerNickname(rosterId, team?.displayName ?? '')
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${
        winning ? 'rounded-lg ring-1 ring-[var(--gwb-accent)]/50' : ''
      }`}
    >
      <TeamAvatar team={team} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">
          {team?.teamName ?? `Team ${rosterId}`}
        </p>
        <p className="truncate text-xs text-[var(--gwb-muted)]">{manager}</p>
      </div>
      <p
        className={`shrink-0 text-lg font-bold tabular-nums ${
          winning ? 'text-[var(--gwb-accent)]' : 'text-[var(--gwb-text)]'
        }`}
      >
        {points.toFixed(1)}
      </p>
    </div>
  )
}

function ExpandedLineup({
  matchup,
  team,
  slots,
  players,
}: {
  matchup: RankedBestGame['home']
  team: TeamInfo | undefined
  slots: string[]
  players: PlayersMap
}) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-bg)] p-2">
      <div className="mb-2 flex items-center gap-2">
        <TeamAvatar team={team} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{team?.teamName ?? 'Team'}</p>
          <p className="text-xs font-bold tabular-nums text-[var(--gwb-accent)]">
            {matchup.points.toFixed(2)} pts
          </p>
        </div>
      </div>
      <ul className="space-y-1">
        {slots.map((slot, i) => {
          const pid = matchup.starters?.[i] ?? '0'
          const pts = pointsForPlayer(matchup, pid, i)
          return (
            <li
              key={`${slot}-${i}`}
              className="flex items-center justify-between gap-2 rounded-md border border-[var(--gwb-border)]/70 bg-[var(--gwb-surface)] px-2 py-1"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-[var(--gwb-muted)]">
                  {slot}
                </p>
                <p className="truncate text-xs font-medium">
                  {playerDisplayName(pid, players)}
                </p>
                <p className="text-[10px] text-[var(--gwb-muted)]">
                  {playerMetaLine(pid, players)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {pts.toFixed(2)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RecapMedia({ matchupKey }: { matchupKey: string }) {
  const entry = contentForMatchup(matchupKey)
  if (entry?.status === 'live' && entry.videoUrl) {
    const embed = youtubeEmbedUrl(entry.videoUrl)
    if (embed) {
      return (
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              title="Best game recap"
              src={embed}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )
    }
  }
  return (
    <div className="mt-3 rounded-lg border border-dashed border-[var(--gwb-border)] bg-[#0d1319]/80 px-4 py-6 text-center">
      <p className="text-sm font-medium text-[var(--gwb-text)]">
        Recap video coming soon
      </p>
      <p className="mt-1 text-xs text-[var(--gwb-muted)]">
        Motion recap lands here after commissioner review — no broadcast footage.
      </p>
    </div>
  )
}

export function BestGamesPanel({
  matchupsByWeek,
  league,
  nflState,
  maxWeek,
  ledger,
  teams,
  players,
  playersLoading,
  ensurePlayers,
  deferralNote,
}: {
  matchupsByWeek: Map<number, SleeperMatchup[]>
  league: SleeperLeague
  nflState: NflState
  maxWeek: number
  ledger: MulliganLedgerEntry[]
  teams: Map<number, TeamInfo>
  players: PlayersMap | null
  playersLoading: boolean
  ensurePlayers: () => void
  deferralNote?: string | null
}) {
  const completedThrough = lastCompletedWeek(league, nflState)
  const [scope, setScope] = useState<BestGamesScope>(() => completedThrough)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  useEffect(() => {
    if (
      typeof scope === 'number' &&
      (isWeekLive(scope, league, nflState) || scope > completedThrough)
    ) {
      setScope(completedThrough)
    }
  }, [scope, completedThrough, league, nflState])

  const games = useMemo(() => {
    if (scope === 'all') {
      return rankBestGames(
        matchupsByWeek,
        league,
        nflState,
        ledger,
        6,
      )
    }
    return rankBestGamesForWeek(
      scope,
      matchupsByWeek,
      league,
      nflState,
      ledger,
    )
  }, [scope, matchupsByWeek, league, nflState, ledger])

  const slots = useMemo(
    () => starterPositions(league.roster_positions),
    [league.roster_positions],
  )

  useEffect(() => {
    ensurePlayers()
  }, [ensurePlayers])

  const scopeLabel =
    scope === 'all'
      ? `season top ${games.length || 6}`
      : `Week ${scope}`

  if (!games.length && scope === 'all' && completedThrough < 1) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No final matchups ranked yet. Check back after the first full scoring week.
      </p>
    )
  }

  return (
    <div className="space-y-3" id="best-games-panel">
      {deferralNote && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          {deferralNote}
        </p>
      )}

      <BestGamesWeekScope
        scope={scope}
        maxWeek={maxWeek}
        league={league}
        nflState={nflState}
        onChange={(next) => {
          setExpandedKey(null)
          setScope(next)
        }}
      />

      <p className="text-xs text-[var(--gwb-muted)]">
        {scope === 'all' ? (
          <>
            Ranked by closeness, shootout, upset, and mulligan drama — top final
            matchups season-to-date ({scopeLabel}).
          </>
        ) : (
          <>
            Best matchups in Week {scope}, ranked within the week by closeness,
            shootout, upset, and mulligan drama.
          </>
        )}
      </p>

      {!games.length ? (
        <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
          {typeof scope === 'number' && isWeekLive(scope, league, nflState)
            ? `Week ${scope} is still in progress — rankings appear when scoring is final.`
            : 'No scored matchups for this week yet.'}
        </p>
      ) : null}

      {playersLoading || !players ? (
        <p className="rounded-xl border border-[var(--gwb-border)] p-4 text-center text-sm text-[var(--gwb-muted)]">
          Loading starter lines…
        </p>
      ) : null}

      {games.length > 0 ? (
      <ul
        className="overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]"
        role="list"
        aria-label={
          scope === 'all'
            ? 'Best games of the season'
            : `Best games of week ${scope}`
        }
      >
        {games.map((game, index) => {
          const { home, away, breakdown } = game
          const winner =
            home.points >= away.points ? home.roster_id : away.roster_id
          const open = expandedKey === game.matchupKey
          const teamH = teams.get(home.roster_id)
          const teamA = teams.get(away.roster_id)

          return (
            <li key={game.matchupKey}>
              <button
                type="button"
                className={`w-full border-t border-[var(--gwb-border)] px-3 py-3 text-left first:border-t-0 sm:px-4 ${
                  index % 2 === 1 ? 'bg-[#0d1319]/60' : ''
                }`}
                aria-expanded={open}
                onClick={() =>
                  setExpandedKey(open ? null : game.matchupKey)
                }
              >
                <div className="flex items-start gap-2">
                  <span
                    className="w-6 shrink-0 pt-0.5 text-center text-sm font-semibold tabular-nums text-[var(--gwb-muted)]"
                    aria-label={`Rank ${game.rank}`}
                  >
                    {game.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md border border-[var(--gwb-accent)]/45 bg-[var(--gwb-accent)]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--gwb-accent)]"
                        aria-label={`NFL week ${game.week}`}
                      >
                        Week {game.week}
                      </span>
                      {game.badges.map((b) => (
                        <Badge key={b} label={b} />
                      ))}
                    </div>

                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <ScoreSide
                        rosterId={home.roster_id}
                        points={home.points}
                        teams={teams}
                        winning={winner === home.roster_id}
                      />
                      <span className="hidden shrink-0 text-xs font-semibold uppercase text-[var(--gwb-muted)] sm:block">
                        vs
                      </span>
                      <ScoreSide
                        rosterId={away.roster_id}
                        points={away.points}
                        teams={teams}
                        winning={winner === away.roster_id}
                      />
                    </div>

                    <p className="mt-2 text-xs text-[var(--gwb-muted)]">
                      Score {breakdown.composite.toFixed(1)}
                      <span className="mx-1 text-[var(--gwb-border)]">·</span>
                      {breakdown.margin.toFixed(1)} pt margin
                      <span className="mx-1 text-[var(--gwb-border)]">·</span>
                      {breakdown.combinedPoints.toFixed(1)} combined
                    </p>
                  </div>
                  <span
                    className="shrink-0 pt-1 text-[var(--gwb-muted)]"
                    aria-hidden
                  >
                    {open ? '▾' : '▸'}
                  </span>
                </div>
              </button>

              {open && players && (
                <div className="border-t border-[var(--gwb-border)] bg-[#0a0e12]/90 px-3 pb-4 pt-3 sm:px-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ExpandedLineup
                      matchup={home}
                      team={teamH}
                      slots={slots}
                      players={players}
                    />
                    <ExpandedLineup
                      matchup={away}
                      team={teamA}
                      slots={slots}
                      players={players}
                    />
                  </div>
                  <RecapMedia matchupKey={game.matchupKey} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
      ) : null}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useLiveWeekPolling } from '../hooks/useLiveWeekPolling'
import {
  groupMatchupPairs,
  leaderRosterId,
  teamLabel,
} from '../lib/matchupBoard'
import {
  pairProjectionLine,
  weekShouldShowProjectedTotals,
} from '../lib/matchupProjections'
import { fetchWeekProjections } from '../lib/projections'
import { weekHasMatchups } from '../lib/recaps'
import type { ProjectionsMap } from '../lib/projections'
import { fetchNflWeekScores } from '../lib/sleeperApi'
import type { NflWeekGame } from '../lib/types'
import type { NflState, PlayersMap, SleeperLeague, SleeperMatchup, TeamInfo } from '../lib/types'
import { isWeekLive } from '../lib/weeks'
import { MatchupDetailSheet } from './MatchupDetailSheet'
import { TeamAvatar } from './TeamAvatar'

function formatUpdated(d: Date | null): string {
  if (!d) return '—'
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function LiveScoreboardPanel({
  week,
  league,
  nflState,
  teams,
  players,
  playersLoading,
  ensurePlayers,
  initialMatchups,
  onMatchupsUpdated,
  isActive,
}: {
  week: number
  league: SleeperLeague
  nflState: NflState
  teams: Map<number, TeamInfo>
  players: PlayersMap | null
  playersLoading: boolean
  ensurePlayers: () => void
  initialMatchups?: SleeperMatchup[]
  onMatchupsUpdated: (week: number, rows: SleeperMatchup[]) => void
  isActive: boolean
}) {
  const shouldPoll =
    isActive &&
    (isWeekLive(week, league, nflState) || week === nflState.week)

  const { matchups, lastUpdated, refreshing, refresh } = useLiveWeekPolling(
    week,
    shouldPoll,
    initialMatchups,
    onMatchupsUpdated,
  )

  const [detailId, setDetailId] = useState<number | null>(null)
  const [projections, setProjections] = useState<ProjectionsMap | null>(null)
  const [showProjections, setShowProjections] = useState(false)
  const [nflGames, setNflGames] = useState<NflWeekGame[] | null>(null)

  useEffect(() => {
    ensurePlayers()
  }, [ensurePlayers])

  useEffect(() => {
    setDetailId(null)
  }, [week])

  useEffect(() => {
    if (!isActive) return
    let cancelled = false
    fetchWeekProjections(league.season, week, nflState.season_type).then(
      (map) => {
        if (cancelled) return
        if (map && Object.keys(map).length > 0) {
          setProjections(map)
        } else {
          setProjections(null)
        }
      },
    )
    void fetchNflWeekScores(league.season, week, nflState.season_type)
      .then((games) => {
        if (!cancelled) setNflGames(games)
      })
      .catch(() => {
        if (!cancelled) setNflGames(null)
      })
    return () => {
      cancelled = true
    }
  }, [week, league.season, nflState.season_type, isActive])

  useEffect(() => {
    if (!matchups || !players) {
      setShowProjections(false)
      return
    }
    const show =
      projections != null &&
      weekShouldShowProjectedTotals(matchups, players, nflGames)
    setShowProjections(show)
  }, [matchups, players, projections, nflGames])

  const pairs = useMemo(
    () => (matchups ? groupMatchupPairs(matchups) : []),
    [matchups],
  )

  const detailPair = pairs.find((p) => p.matchupId === detailId)

  if (!matchups || !weekHasMatchups(matchups)) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No scored matchups for Week {week} yet. Check back after lineups lock or
        try another week.
      </p>
    )
  }

  if (playersLoading || !players) {
    return (
      <p className="rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        Loading player names…
      </p>
    )
  }

  return (
    <div className="space-y-4" id="live-scoreboard-panel">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[var(--gwb-muted)]">
          Last updated {formatUpdated(lastUpdated)}
          {shouldPoll && (
            <span className="ml-2 text-amber-300/90">· auto-refresh 60s</span>
          )}
        </p>
        <button
          type="button"
          className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          onClick={() => refresh()}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {pairs.map(({ matchupId, home, away }) => {
          const leader = leaderRosterId(home, away)
          const teamH = teams.get(home.roster_id)
          const teamA = teams.get(away.roster_id)
          const projLine =
            showProjections && projections
              ? pairProjectionLine(home, away, projections)
              : null
          return (
            <li key={matchupId}>
              <button
                type="button"
                className="w-full rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4 text-left transition hover:border-[var(--gwb-accent)]/50"
                onClick={() => setDetailId(matchupId)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex min-w-0 flex-1 items-center gap-2 ${
                      leader === home.roster_id
                        ? 'rounded-lg ring-1 ring-[var(--gwb-accent)]/60'
                        : ''
                    }`}
                  >
                    <TeamAvatar team={teamH} size="sm" />
                    <span className="truncate text-sm font-medium">
                      {teamLabel(home.roster_id, teams)}
                    </span>
                    <span
                      className={`ml-auto shrink-0 text-lg font-bold tabular-nums ${
                        leader === home.roster_id
                          ? 'text-[var(--gwb-accent)]'
                          : ''
                      }`}
                    >
                      {home.points.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="my-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--gwb-muted)]">
                  vs
                </p>
                <div
                  className={`flex items-center gap-2 ${
                    leader === away.roster_id
                      ? 'rounded-lg ring-1 ring-[var(--gwb-accent)]/60'
                      : ''
                  }`}
                >
                  <TeamAvatar team={teamA} size="sm" />
                  <span className="truncate text-sm font-medium">
                    {teamLabel(away.roster_id, teams)}
                  </span>
                  <span
                    className={`ml-auto shrink-0 text-lg font-bold tabular-nums ${
                      leader === away.roster_id
                        ? 'text-[var(--gwb-accent)]'
                        : ''
                    }`}
                  >
                    {away.points.toFixed(2)}
                  </span>
                </div>
                {projLine && (
                  <p className="mt-2 text-center text-[10px] font-semibold tabular-nums tracking-wide text-amber-200/90">
                    {projLine}
                  </p>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {detailPair && (
        <MatchupDetailSheet
          open={detailId !== null}
          onClose={() => setDetailId(null)}
          left={detailPair.home}
          right={detailPair.away}
          teams={teams}
          rosterPositions={league.roster_positions}
          players={players}
          projections={projections}
          showProjections={showProjections}
        />
      )}
    </div>
  )
}

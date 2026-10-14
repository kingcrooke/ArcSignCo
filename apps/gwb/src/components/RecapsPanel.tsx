import { useMemo } from 'react'
import { useLiveWeekPolling } from '../hooks/useLiveWeekPolling'
import { allPlayLine } from '../lib/allPlay'
import { groupMatchupPairs, teamLabel } from '../lib/matchupBoard'
import { buildWeekRecaps, isMatchupNotStarted, weekHasMatchups } from '../lib/recaps'
import { buildWeekReceipt } from '../lib/receiptOfWeek'
import { computeStandingsThroughWeek } from '../lib/standings'
import type {
  MatchupRecap,
  NflState,
  PlayersMap,
  SleeperLeague,
  SleeperMatchup,
  TeamInfo,
} from '../lib/types'
import { isWeekLive } from '../lib/weeks'
import { ReceiptOfWeek } from './ReceiptOfWeek'

function LiveMatchupCard({ recap }: { recap: MatchupRecap }) {
  return (
    <article
      className={`rounded-xl border p-4 ${
        recap.isMatchupOfTheWeek
          ? 'border-[var(--gwb-accent)] bg-[#1a1608]'
          : 'border-[var(--gwb-border)] bg-[var(--gwb-surface)]'
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {recap.isMatchupOfTheWeek && (
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
            Matchup of the week
          </span>
        )}
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-amber-300">
          Live
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {recap.teamA.teamName}{' '}
          <span className="text-[var(--gwb-accent)]">
            {recap.teamA.points.toFixed(1)}
          </span>
          <span className="mx-2 text-[var(--gwb-muted)]">vs</span>
          {recap.teamB.teamName}{' '}
          <span className="text-[var(--gwb-accent)]">
            {recap.teamB.points.toFixed(1)}
          </span>
        </h3>
      </div>
      <p className="mt-2 text-sm text-[var(--gwb-muted)]">{recap.narrative}</p>
      {recap.starsLine && (
        <p className="mt-1 text-sm text-[var(--gwb-text)]">{recap.starsLine}</p>
      )}
    </article>
  )
}

function LiveScoresFallback({
  week,
  matchups,
  teams,
}: {
  week: number
  matchups: SleeperMatchup[]
  teams: Map<number, TeamInfo>
}) {
  const pairs = groupMatchupPairs(matchups)
  if (!pairs.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        Live scores for Week {week} are not available yet. Check back after lineups
        lock.
      </p>
    )
  }
  return (
    <div className="space-y-4">
      {pairs.map(({ matchupId, home, away }) => {
        const homeTeam = teams.get(home.roster_id)
        const awayTeam = teams.get(away.roster_id)
        const homeName = homeTeam?.teamName ?? teamLabel(home.roster_id, teams)
        const awayName = awayTeam?.teamName ?? teamLabel(away.roster_id, teams)
        const margin = Math.abs(home.points - away.points).toFixed(1)
        const statusLine = isMatchupNotStarted(home.points, away.points)
          ? 'Not started'
          : home.points >= away.points
            ? `${homeName} is leading ${awayName} by ${margin} points.`
            : `${awayName} is leading ${homeName} by ${margin} points.`
        return (
          <article
            key={matchupId}
            className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4"
          >
            <span className="mb-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-amber-300">
              Live
            </span>
            <h3 className="text-lg font-semibold">
              {homeName}{' '}
              <span className="text-[var(--gwb-accent)]">
                {home.points.toFixed(1)}
              </span>
              <span className="mx-2 text-[var(--gwb-muted)]">vs</span>
              {awayName}{' '}
              <span className="text-[var(--gwb-accent)]">
                {away.points.toFixed(1)}
              </span>
            </h3>
            <p className="mt-2 text-sm text-[var(--gwb-muted)]">{statusLine}</p>
          </article>
        )
      })}
    </div>
  )
}

export function RecapsPanel({
  recaps,
  week,
  hasScores,
  isLive,
  weekMatchups,
  playersLoading,
  league,
  nflState,
  teams,
  players,
  matchupsByWeek,
  onMatchupsUpdated,
  recapsTabActive,
}: {
  recaps: MatchupRecap[]
  week: number
  hasScores: boolean
  isLive: boolean
  weekMatchups?: SleeperMatchup[]
  playersLoading?: boolean
  league?: SleeperLeague
  nflState?: NflState
  teams?: Map<number, TeamInfo>
  players?: PlayersMap | null
  matchupsByWeek?: Map<number, SleeperMatchup[]>
  onMatchupsUpdated?: (week: number, rows: SleeperMatchup[]) => void
  recapsTabActive?: boolean
}) {
  const shouldPoll =
    Boolean(isLive && recapsTabActive && league && nflState) &&
    isWeekLive(week, league!, nflState!)

  const { matchups: polledMatchups } = useLiveWeekPolling(
    week,
    shouldPoll,
    weekMatchups,
    onMatchupsUpdated,
  )

  const liveMatchups = isLive ? (polledMatchups ?? weekMatchups) : weekMatchups

  const liveRecaps = useMemo(() => {
    if (!isLive || !liveMatchups || !weekHasMatchups(liveMatchups) || !players) {
      return recaps
    }
    if (!league || !matchupsByWeek) return recaps
    const preWeekStandings = computeStandingsThroughWeek(
      matchupsByWeek,
      teams ?? new Map(),
      Math.max(0, week - 1),
    )
    return buildWeekRecaps(liveMatchups, teams ?? new Map(), players, {
      rosterPositions: league.roster_positions,
      preWeekStandings,
      isWeekFinal: false,
      week,
    })
  }, [
    isLive,
    liveMatchups,
    players,
    league,
    matchupsByWeek,
    teams,
    week,
    recaps,
  ])

  if (!hasScores && !isLive) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No scored matchups for Week {week} yet. Check back after lineups lock or try an
        earlier week.
      </p>
    )
  }

  if (isLive) {
    const liveBanner = (
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
        role="status"
      >
        <span className="rounded bg-amber-500/25 px-2 py-0.5 text-xs font-semibold uppercase text-amber-200">
          Live
        </span>
        <span>
          Recaps post when Week {week} is final. Scores below update from Sleeper.
        </span>
      </div>
    )

    if (playersLoading && !liveRecaps.length && liveMatchups?.length) {
      return (
        <div className="space-y-4">
          {liveBanner}
          <LiveScoresFallback
            week={week}
            matchups={liveMatchups}
            teams={teams ?? new Map()}
          />
        </div>
      )
    }

    if (playersLoading) {
      return (
        <div className="space-y-4">
          {liveBanner}
          <p className="rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
            Loading live matchup scores…
          </p>
        </div>
      )
    }

    if (liveRecaps.length) {
      return (
        <div className="space-y-4">
          {liveBanner}
          {liveRecaps.map((r) => (
            <LiveMatchupCard key={r.matchupId} recap={r} />
          ))}
        </div>
      )
    }

    if (liveMatchups?.length) {
      return (
        <div className="space-y-4">
          {liveBanner}
          <LiveScoresFallback
            week={week}
            matchups={liveMatchups}
            teams={teams ?? new Map()}
          />
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {liveBanner}
        <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
          No live scores for Week {week} yet. Check back after lineups lock.
        </p>
      </div>
    )
  }

  if (playersLoading) {
    return (
      <p className="rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        Loading player names for recap details…
      </p>
    )
  }

  const receipt = buildWeekReceipt(recaps)

  return (
    <div className="space-y-4">
      {receipt && <ReceiptOfWeek receipt={receipt} />}
      {recaps.map((r) => (
        <article
          key={r.matchupId}
          className={`rounded-xl border p-4 ${
            r.isMatchupOfTheWeek
              ? 'border-[var(--gwb-accent)] bg-[#1a1608]'
              : 'border-[var(--gwb-border)] bg-[var(--gwb-surface)]'
          }`}
        >
          {r.isMatchupOfTheWeek && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
              Matchup of the week
            </p>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold">
              {r.teamA.teamName}{' '}
              <span className="text-[var(--gwb-accent)]">
                {r.teamA.points.toFixed(1)}
              </span>
              <span className="mx-2 text-[var(--gwb-muted)]">vs</span>
              {r.teamB.teamName}{' '}
              <span className="text-[var(--gwb-accent)]">
                {r.teamB.points.toFixed(1)}
              </span>
            </h3>
            {r.tags.length > 0 && (
              <div className="flex gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#243040] px-2 py-0.5 text-xs uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--gwb-muted)]">{r.narrative}</p>
          {r.starsLine && (
            <p className="mt-1 text-sm text-[var(--gwb-text)]">{r.starsLine}</p>
          )}
          {weekMatchups && (
            <p className="mt-1 text-xs text-[var(--gwb-muted)]">
              {allPlayLine(r.teamA.points, weekMatchups, r.teamA.rosterId)}
            </p>
          )}
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">
                Top scorer · {r.teamA.teamName}
              </dt>
              <dd>
                {r.teamA.topScorer
                  ? `${r.teamA.topScorer.name} · ${r.teamA.topScorer.points.toFixed(1)}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">
                Top scorer · {r.teamB.teamName}
              </dt>
              <dd>
                {r.teamB.topScorer
                  ? `${r.teamB.topScorer.name} · ${r.teamB.topScorer.points.toFixed(1)}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">
                Bench miss · {r.teamA.teamName}
              </dt>
              <dd>{r.teamA.benchMiss?.message ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">
                Bench miss · {r.teamB.teamName}
              </dt>
              <dd>{r.teamB.benchMiss?.message ?? '—'}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

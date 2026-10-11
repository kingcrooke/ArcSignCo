import { useMemo } from 'react'
import { groupMatchupPairs, teamLabel } from '../lib/matchupBoard'
import { weekHasMatchups } from '../lib/recaps'
import { recordLabel } from '../lib/standings'
import type {
  PlayersMap,
  SleeperMatchup,
  StandingRow,
  TeamInfo,
} from '../lib/types'
import { isWeekComplete } from '../lib/weeks'
import type { NflState, SleeperLeague } from '../lib/types'
import { TeamAvatar, type AvatarMood } from './TeamAvatar'

function MatchupCard({
  homeId,
  awayId,
  teams,
  standings,
  homeMood,
  awayMood,
  subtitle,
  neutral,
  homeScore,
  awayScore,
}: {
  homeId: number
  awayId: number
  teams: Map<number, TeamInfo>
  standings: StandingRow[]
  homeMood: AvatarMood
  awayMood: AvatarMood
  subtitle?: string
  neutral?: boolean
  homeScore?: number
  awayScore?: number
}) {
  const home = teams.get(homeId)
  const away = teams.get(awayId)
  const homeRow = standings.find((r) => r.rosterId === homeId)
  const awayRow = standings.find((r) => r.rosterId === awayId)
  return (
    <article
      className="flex flex-col rounded-2xl border border-[var(--gwb-border)] bg-gradient-to-b from-[var(--gwb-surface)] to-[var(--gwb-bg)] p-4"
    >
      <p className="text-center font-['Anton'] text-2xl uppercase tracking-wide text-[var(--gwb-text)]">
        {teamLabel(homeId, teams)}
        <span className="mx-2 text-[var(--gwb-muted)]">vs</span>
        {teamLabel(awayId, teams)}
      </p>
      {subtitle && (
        <p className="mt-1 text-center text-xs text-[var(--gwb-muted)]">{subtitle}</p>
      )}
      <div className="mt-4 flex items-end justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <TeamAvatar team={home} size="lg" mood={homeMood} />
          <p className="text-xs text-[var(--gwb-muted)]">
            {homeRow ? recordLabel(homeRow) : '—'}
          </p>
          {!neutral && homeScore != null && (
            <p className="font-['Bebas_Neue'] text-3xl text-[var(--gwb-accent)]">
              {homeScore.toFixed(2)}
            </p>
          )}
        </div>
        <div
          className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--gwb-accent)] bg-[var(--gwb-bg)] font-['Bebas_Neue'] text-xl text-[var(--gwb-accent-bright)]"
          aria-hidden
        >
          VS
        </div>
        <div className="flex flex-col items-center gap-2">
          <TeamAvatar team={away} size="lg" mood={awayMood} />
          <p className="text-xs text-[var(--gwb-muted)]">
            {awayRow ? recordLabel(awayRow) : '—'}
          </p>
          {!neutral && awayScore != null && (
            <p className="font-['Bebas_Neue'] text-3xl text-[var(--gwb-accent)]">
              {awayScore.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export function DynastyWeekGraphicsPanel({
  week,
  matchups,
  teams,
  standings,
  league,
  nflState,
}: {
  week: number
  matchups?: SleeperMatchup[]
  teams: Map<number, TeamInfo>
  standings: StandingRow[]
  league: SleeperLeague
  nflState: NflState
  players?: PlayersMap | null
}) {
  const pairs = useMemo(
    () => (matchups ? groupMatchupPairs(matchups) : []),
    [matchups],
  )
  const weekFinal = isWeekComplete(week, league, nflState)
  const hasScores = weekHasMatchups(matchups)

  if (!matchups?.length || !pairs.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No matchups to illustrate for Week {week} yet.
      </p>
    )
  }

  return (
    <div className="space-y-8" id="week-graphics-panel">
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
          Matchup cards
        </h3>
        <p className="mb-4 text-xs text-[var(--gwb-muted)]">
          Neutral preview — no winner marked.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2" role="list">
          {pairs.map(({ matchupId, home, away }) => (
            <li key={matchupId}>
              <MatchupCard
                homeId={home.roster_id}
                awayId={away.roster_id}
                teams={teams}
                standings={standings}
                homeMood="base"
                awayMood="base"
                neutral
                subtitle={`Week ${week}`}
              />
            </li>
          ))}
        </ul>
      </section>

      {hasScores && weekFinal && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
            Result cards
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2" role="list">
            {pairs.map(({ matchupId, home, away }) => {
              const homeWon = home.points >= away.points
              return (
                <li key={`result-${matchupId}`}>
                  <div className="space-y-2">
                    <MatchupCard
                      homeId={home.roster_id}
                      awayId={away.roster_id}
                      teams={teams}
                      standings={standings}
                      homeMood={homeWon ? 'hype' : 'loss'}
                      awayMood={homeWon ? 'loss' : 'hype'}
                      homeScore={home.points}
                      awayScore={away.points}
                      subtitle={`Final · ${home.points.toFixed(2)} – ${away.points.toFixed(2)}`}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

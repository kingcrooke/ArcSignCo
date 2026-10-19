import { playerDisplayName } from '../lib/matchupBoard'
import type { WeekReport } from '../lib/weekReport'
import type { PlayersMap, TeamInfo } from '../lib/types'
import { TeamAvatar } from './TeamAvatar'

function pts(n: number): string {
  return n.toFixed(2)
}

function Stat({
  label,
  team,
  mood,
  primary,
  secondary,
}: {
  label: string
  team: TeamInfo | undefined
  mood: 'base' | 'excited' | 'loss'
  primary: string
  secondary: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-2 py-1.5">
      <TeamAvatar team={team} size="sm" mood={mood} />
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--dyn-accent-bright)]">
          {label}
        </p>
        <p className="truncate text-xs font-semibold">{primary}</p>
        <p className="truncate text-[10px] text-[var(--dyn-muted)]">{secondary}</p>
      </div>
    </div>
  )
}

export function WeekReportCard({
  report,
  teams,
  players,
}: {
  report: WeekReport
  teams: Map<number, TeamInfo>
  players: PlayersMap | null
}) {
  const team = (id: number) => teams.get(id)
  const waiverName =
    report.waiver && players
      ? playerDisplayName(report.waiver.playerId, players)
      : report.waiver
        ? 'Player'
        : ''

  return (
    <article
      className="mx-auto flex aspect-[4/5] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-[var(--dyn-border)] bg-[var(--dyn-bg)] text-[var(--dyn-text)]"
      aria-label={`Week ${report.week} report`}
    >
      <header className="bg-gradient-to-br from-[#2a1840] to-[var(--dyn-bg)] px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--dyn-accent-bright)]">
          Dynasty report
        </p>
        <h3 className="font-['Anton'] text-4xl uppercase leading-none">
          Week {report.week}
        </h3>
      </header>

      <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-hidden px-3 py-3">
        <Stat
          label="High score"
          team={team(report.highScore.rosterId)}
          mood="excited"
          primary={report.highScore.name}
          secondary={pts(report.highScore.points)}
        />
        <Stat
          label="Low score"
          team={team(report.lowScore.rosterId)}
          mood="loss"
          primary={report.lowScore.name}
          secondary={pts(report.lowScore.points)}
        />
        {report.closest && (
          <Stat
            label="Closest win"
            team={team(report.closest.winner.rosterId)}
            mood="excited"
            primary={report.closest.winner.name}
            secondary={`${pts(report.closest.margin)} over ${report.closest.loser.name}`}
          />
        )}
        {report.blowout && (
          <Stat
            label="Biggest blowout"
            team={team(report.blowout.winner.rosterId)}
            mood="excited"
            primary={report.blowout.winner.name}
            secondary={`${pts(report.blowout.margin)} over ${report.blowout.loser.name}`}
          />
        )}
        {report.mostBench && (
          <Stat
            label="Most bench"
            team={team(report.mostBench.rosterId)}
            mood="base"
            primary={report.mostBench.name}
            secondary={`${pts(report.mostBench.points)} left on the bench`}
          />
        )}
        {report.waiver && (
          <Stat
            label="Top waiver"
            team={team(report.waiver.rosterId)}
            mood="excited"
            primary={waiverName}
            secondary={`${report.waiver.name} · ${pts(report.waiver.points)}`}
          />
        )}

        {report.bestGame && (
          <div className="col-span-2 rounded-lg border border-[var(--dyn-accent)]/40 bg-[var(--dyn-accent)]/10 px-2 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--dyn-accent-bright)]">
              Best game
              {report.bestGame.badges.length
                ? ` · ${report.bestGame.badges.join(' · ')}`
                : ''}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <TeamAvatar
                  team={team(report.bestGame.winner.rosterId)}
                  size="sm"
                  mood="excited"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">
                    {report.bestGame.winner.name}
                  </p>
                  <p className="text-[10px] tabular-nums text-[var(--dyn-muted)]">
                    {pts(report.bestGame.winner.points)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[var(--dyn-muted)]">vs</span>
              <div className="flex min-w-0 items-center gap-2">
                <div className="min-w-0 text-right">
                  <p className="truncate text-xs font-semibold">
                    {report.bestGame.loser.name}
                  </p>
                  <p className="text-[10px] tabular-nums text-[var(--dyn-muted)]">
                    {pts(report.bestGame.loser.points)}
                  </p>
                </div>
                <TeamAvatar
                  team={team(report.bestGame.loser.rosterId)}
                  size="sm"
                  mood="loss"
                />
              </div>
            </div>
          </div>
        )}

        <div className="col-span-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
            Standings after the week
          </p>
          <ol className="mt-1 space-y-1" role="list">
            {report.top3.map((row) => (
              <li key={row.rosterId} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-[var(--dyn-accent)]">{row.rank}</span>
                <TeamAvatar team={team(row.rosterId)} size="sm" />
                <span className="min-w-0 flex-1 truncate font-medium">{row.name}</span>
                <span className="tabular-nums text-[var(--dyn-muted)]">
                  {row.record} · {pts(row.pointsFor)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  )
}

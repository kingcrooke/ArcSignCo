import type { ReactNode } from 'react'
import type { TeamInfo } from '../lib/types'
import type {
  ReportMatchup,
  ReportSide,
  WeeklyReport,
} from '../lib/weeklyReport'
import { TeamAvatar } from './TeamAvatar'

function teamFor(
  teams: Map<number, TeamInfo>,
  rosterId: number,
  userId: string,
): TeamInfo | undefined {
  if (userId) {
    for (const team of teams.values()) {
      if (team.userId === userId) return team
    }
  }
  return teams.get(rosterId)
}

function pts(n: number): string {
  return n.toFixed(2)
}

function Card({
  kicker,
  title,
  accent,
  children,
}: {
  kicker: string
  title: string
  accent?: string
  children: ReactNode
}) {
  return (
    <article className="flex h-fit flex-col self-start rounded-xl border border-[var(--dyn-border)] bg-[#07050b] text-[var(--dyn-text)]">
      <header className="border-b border-[var(--dyn-border)] px-4 pb-3 pt-4">
        <p className="font-['Bebas_Neue'] text-sm tracking-[0.14em] text-[var(--dyn-accent)]">
          {kicker}
        </p>
        <h4 className="mt-1 font-['Anton'] text-2xl uppercase leading-none">
          {title}
          {accent ? (
            <>
              <br />
              <span className="text-[var(--dyn-accent-bright)]">{accent}</span>
            </>
          ) : null}
        </h4>
      </header>
      <div className="px-4 py-3 text-sm leading-snug">{children}</div>
    </article>
  )
}

function SideLine({
  side,
  teams,
  mood,
}: {
  side: ReportSide
  teams: Map<number, TeamInfo>
  mood: 'excited' | 'loss'
}) {
  return (
    <div className="flex items-center gap-2">
      <TeamAvatar team={teamFor(teams, side.rosterId, side.userId)} mood={mood} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{side.name}</p>
        <p className="text-xs text-[var(--dyn-muted)]">
          {side.topScorers.map((p) => `${p.name} ${pts(p.points)}`).join(' · ') || '—'}
        </p>
      </div>
      <p className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent-bright)]">
        {pts(side.score)}
      </p>
    </div>
  )
}

function MatchupCard({
  game,
  index,
  week,
  teams,
}: {
  game: ReportMatchup
  index: number
  week: number
  teams: Map<number, TeamInfo>
}) {
  return (
    <Card
      kicker={`Dynasty · Week ${week} · Matchup ${index + 1}`}
      title={`${game.winner.name} ${pts(game.winner.score)}`}
      accent={game.tie ? `TIED ${game.loser.name}` : `DEF. ${game.loser.name} ${pts(game.loser.score)}`}
    >
      <div className="space-y-3">
        <SideLine side={game.winner} teams={teams} mood="excited" />
        <SideLine side={game.loser} teams={teams} mood="loss" />
        <p className="text-[var(--dyn-muted)]">{game.recap}</p>
      </div>
    </Card>
  )
}

export function WeeklyReportDeck({
  report,
  teams,
}: {
  report: WeeklyReport
  teams: Map<number, TeamInfo>
}) {
  const top3 = report.standings.slice(0, 3)
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
      <Card
        kicker={`Dynasty · Week ${report.week} · Final report`}
        title={`Week ${report.week}`}
        accent="Final"
      >
        <p>
          {report.matchups.length} matchups. High score{' '}
          {report.highScore ? `${report.highScore.name} ${pts(report.highScore.points)}` : '—'}.
          {report.lowScore ? ` Low score ${report.lowScore.name} ${pts(report.lowScore.points)}.` : ''}
        </p>
        {top3.length > 0 && (
          <ol className="mt-3 space-y-1">
            {top3.map((row) => (
              <li key={row.rosterId}>
                #{row.rank} {row.name} {row.wins}-{row.losses}
                {row.ties ? `-${row.ties}` : ''} · {pts(row.pointsFor)} PF
              </li>
            ))}
          </ol>
        )}
      </Card>

      {report.matchups.map((game, index) => (
        <MatchupCard
          key={game.matchupId}
          game={game}
          index={index}
          week={report.week}
          teams={teams}
        />
      ))}

      <Card kicker={`Dynasty · Week ${report.week}`} title="Week lines" accent="From Sleeper">
        <ul className="space-y-2">
          {report.highScore && (
            <li>High score: {report.highScore.name} {pts(report.highScore.points)}</li>
          )}
          {report.lowScore && (
            <li>Low score: {report.lowScore.name} {pts(report.lowScore.points)}</li>
          )}
          {report.closest && (
            <li>
              Closest game: {report.closest.winnerName} {pts(report.closest.winnerScore)} def.{' '}
              {report.closest.loserName} {pts(report.closest.loserScore)} (margin {pts(report.closest.margin)})
            </li>
          )}
          {report.blowout && (
            <li>
              Biggest blowout: {report.blowout.winnerName} {pts(report.blowout.winnerScore)} def.{' '}
              {report.blowout.loserName} {pts(report.blowout.loserScore)} (margin {pts(report.blowout.margin)})
            </li>
          )}
          {report.topPlayer && (
            <li>
              Top player: {report.topPlayer.name} {pts(report.topPlayer.points)} ({report.topPlayer.manager}, started)
            </li>
          )}
          {report.mostBench && (
            <li>Most bench points: {report.mostBench.name} {pts(report.mostBench.points)}</li>
          )}
          {report.bestGame && (
            <li>
              Best game: {report.bestGame.winnerName} {pts(report.bestGame.winnerScore)} def.{' '}
              {report.bestGame.loserName} {pts(report.bestGame.loserScore)}
              {report.bestGame.upset ? ' (upset)' : ''}
            </li>
          )}
        </ul>
      </Card>

      <Card kicker={`Dynasty · Week ${report.week}`} title="Standings" accent={`After week ${report.week}`}>
        <ol className="space-y-1">
          {report.standings.map((row) => (
            <li key={row.rosterId} className="flex justify-between gap-2">
              <span className="min-w-0 truncate">
                {row.rank}. {row.name}
              </span>
              <span className="shrink-0 tabular-nums text-[var(--dyn-muted)]">
                {row.wins}-{row.losses}
                {row.ties ? `-${row.ties}` : ''} · {pts(row.pointsFor)}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card kicker={`Dynasty · Week ${report.week}`} title="Moves" accent="Waivers and trades">
        {report.trades.length === 0 && report.waivers.length === 0 ? (
          <p className="text-[var(--dyn-muted)]">No completed waiver adds or trades this week.</p>
        ) : (
          <ul className="space-y-2">
            {report.trades.map((trade) => (
              <li key={trade.transactionId}>
                <p className="font-semibold">Trade</p>
                {trade.sides.map((side) => (
                  <p key={side.rosterId} className="text-[var(--dyn-muted)]">
                    {side.manager} received{' '}
                    {[...side.receivedPlayers, ...side.receivedPicks].join(', ') || '—'}
                    {side.sentPlayers.length ? `; sent ${side.sentPlayers.join(', ')}` : ''}
                  </p>
                ))}
              </li>
            ))}
            {report.waivers.map((move) => (
              <li key={move.transactionId}>
                <span className="font-semibold">{move.manager}</span>
                <span className="text-[var(--dyn-muted)]">
                  {' '}
                  added {move.adds.map((a) => a.name).join(', ') || '—'}
                  {move.drops.length ? `, dropped ${move.drops.map((d) => d.name).join(', ')}` : ''}
                  {move.faab != null && move.type === 'waiver' ? ` · $${move.faab} FAAB` : ''}
                  {move.type === 'free_agent' ? ' · free agent' : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

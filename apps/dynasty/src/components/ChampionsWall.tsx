import {
  championsWallRows,
  titlesLeaderboard,
} from '../lib/managerSeasons'
import type { LeagueSeasonSummary } from '../lib/managerSeasons'

export function ChampionsWall({
  leagueSeasonSummaries,
}: {
  leagueSeasonSummaries: LeagueSeasonSummary[]
}) {
  const wall = championsWallRows(leagueSeasonSummaries)
  const leaderboard = titlesLeaderboard(leagueSeasonSummaries)
  if (!wall.length) return null

  return (
    <section
      id="champions-wall"
      className="rounded-xl border border-[var(--dyn-border)] bg-gradient-to-br from-[#1a1028] to-[var(--dyn-surface)] p-4"
      aria-labelledby="champions-wall-heading"
    >
      <h3
        id="champions-wall-heading"
        className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent)]"
      >
        Champions Wall
      </h3>
      <p className="mb-4 text-sm text-[var(--dyn-muted)]">
        Dynasty titles 2019–2025 from each season’s Sleeper winners bracket.
      </p>

      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
          Titles leaderboard
        </p>
        <ul className="mt-2 space-y-1 text-sm" role="list">
          {leaderboard.map((entry) => (
            <li key={entry.name} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">{entry.name}</span>
              <span className="text-[var(--dyn-accent)]">{entry.titles}</span>
              <span className="text-xs text-[var(--dyn-muted)]">
                ({entry.years.join(', ')})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2" role="list">
        {wall.map((row) => (
          <li
            key={row.season}
            className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-bg)] px-3 py-2 text-sm"
          >
            <p className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--dyn-accent-bright)]">
              {row.season}
            </p>
            <p className="mt-0.5">
              <span className="text-[var(--dyn-muted)]">Champion: </span>
              {row.champion}
            </p>
            <p className="mt-0.5">
              <span className="text-[var(--dyn-muted)]">Runner-up: </span>
              {row.runnerUp}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

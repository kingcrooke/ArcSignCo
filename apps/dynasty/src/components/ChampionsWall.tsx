import { championsWallRows, titlesLeaderboard } from '../lib/champions'
import type { LeagueSeasonSummary } from '../lib/managerSeasons'

export function ChampionsWall({
  leagueSeasonSummaries,
}: {
  leagueSeasonSummaries: LeagueSeasonSummary[]
}) {
  const wall = championsWallRows(leagueSeasonSummaries)
  const leaderboard = titlesLeaderboard(wall)

  return (
    <section
      id="champions-wall"
      className="rounded-xl border border-[var(--dyn-border)] bg-gradient-to-br from-[#12091c] to-[var(--dyn-surface)] p-4"
      aria-labelledby="champions-wall-heading"
    >
      <h3
        id="champions-wall-heading"
        className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent)]"
      >
        Dynasty Champions Wall
      </h3>
      <p className="mb-4 text-sm text-[var(--dyn-muted)]">
        Titles from each season&apos;s Sleeper winners bracket, 2019–2025.
      </p>

      {leaderboard.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--dyn-muted)]">
            Titles leaderboard
          </p>
          <ul className="mt-2 space-y-1 text-sm" role="list">
            {leaderboard.map((entry) => (
              <li key={entry.name} className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">{entry.name}</span>
                <span className="text-[var(--dyn-accent-bright)]">{entry.titles}</span>
                <span className="text-xs text-[var(--dyn-muted)]">
                  ({entry.years.join(', ')})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {wall.length === 0 ? (
        <p className="text-sm text-[var(--dyn-muted)]">Champions are still loading.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2" role="list">
          {wall.map((row) => (
            <li
              key={row.season}
              className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-bg)] px-3 py-2 text-sm"
            >
              <p className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--dyn-accent)]">
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
      )}
    </section>
  )
}

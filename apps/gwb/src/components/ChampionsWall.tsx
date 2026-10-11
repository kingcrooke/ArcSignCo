import {
  championsWallRows,
  isFormerMemberKey,
  titlesLeaderboard,
  wallDisplayName,
  type ArchiveChampionRow,
} from '../lib/gwbArchive'
import type { LeagueSeasonSummary } from '../lib/managerSeasons'

function NameTag({ keyName }: { keyName: string }) {
  const former = isFormerMemberKey(keyName)
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span>{wallDisplayName(keyName)}</span>
      {former && (
        <span
          className="rounded bg-[var(--gwb-border)] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]"
        >
          former member
        </span>
      )}
    </span>
  )
}

function ChampionRow({ row }: { row: ArchiveChampionRow }) {
  return (
    <li
      className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2 text-sm"
    >
      <p className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--gwb-accent)]">
        {row.season}
      </p>
      <p className="mt-0.5">
        <span className="text-[var(--gwb-muted)]">Champion: </span>
        <NameTag keyName={String(row.champion)} />
        {row.championRecord && (
          <span className="text-[var(--gwb-muted)]"> ({row.championRecord}{row.championSeed ? `, ${row.championSeed} seed` : ''})</span>
        )}
      </p>
      <p className="mt-0.5">
        <span className="text-[var(--gwb-muted)]">Runner-up: </span>
        <NameTag keyName={String(row.runnerUp)} />
        {row.runnerUpRecord && (
          <span className="text-[var(--gwb-muted)]"> ({row.runnerUpRecord}{row.runnerUpSeed ? `, ${row.runnerUpSeed} seed` : ''})</span>
        )}
      </p>
      {row.finalScore && (
        <p className="mt-0.5 text-xs text-[var(--gwb-muted)]">Final: {row.finalScore}</p>
      )}
      {!row.finalScore && (
        <p className="mt-0.5 text-xs text-[var(--gwb-muted)]">Final score: unknown</p>
      )}
    </li>
  )
}

export function ChampionsWall({
  leagueSeasonSummaries,
}: {
  leagueSeasonSummaries: LeagueSeasonSummary[]
}) {
  const wall = championsWallRows(leagueSeasonSummaries)
  const leaderboard = titlesLeaderboard()

  return (
    <section
      id="champions-wall"
      className="rounded-xl border border-[var(--gwb-border)] bg-gradient-to-br from-[#0d1319] to-[var(--gwb-surface)] p-4"
      aria-labelledby="champions-wall-heading"
    >
      <h3
        id="champions-wall-heading"
        className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]"
      >
        Champions Wall
      </h3>
      <p className="mb-4 text-sm text-[var(--gwb-muted)]">
        GWB titles 2012–2025 from the verified archive; 2019+ seasons also tie to Sleeper.
      </p>

      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gwb-muted)]">
          Titles leaderboard
        </p>
        <ul className="mt-2 space-y-1 text-sm" role="list">
          {leaderboard.map((e) => (
            <li key={e.key} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">
                {e.displayName}
                {e.formerMember && (
                  <span className="ml-1 text-[9px] font-semibold uppercase text-[var(--gwb-muted)]">
                    former member
                  </span>
                )}
              </span>
              <span className="text-[var(--gwb-accent)]">{e.titles}</span>
              <span className="text-xs text-[var(--gwb-muted)]">
                ({e.titleYears.join(', ')})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2" role="list">
        {wall.map((row) => (
          <ChampionRow key={row.season} row={row} />
        ))}
      </ul>
    </section>
  )
}

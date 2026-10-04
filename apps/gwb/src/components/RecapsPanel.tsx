import type { MatchupRecap } from '../lib/types'

export function RecapsPanel({
  recaps,
  week,
  hasScores,
}: {
  recaps: MatchupRecap[]
  week: number
  hasScores: boolean
}) {
  if (!hasScores) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No scored matchups for Week {week} yet. Check back after lineups lock or try an
        earlier week.
      </p>
    )
  }
  if (!recaps.length) {
    return (
      <p className="text-[var(--gwb-muted)]">No head-to-head pairings found this week.</p>
    )
  }
  return (
    <div className="space-y-4">
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
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">Top scorer A</dt>
              <dd>
                {r.teamA.topScorer
                  ? `${r.teamA.topScorer.name} · ${r.teamA.topScorer.points.toFixed(1)}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">Top scorer B</dt>
              <dd>
                {r.teamB.topScorer
                  ? `${r.teamB.topScorer.name} · ${r.teamB.topScorer.points.toFixed(1)}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">Bench miss A</dt>
              <dd>
                {r.teamA.benchMiss
                  ? `${r.teamA.benchMiss.name} left ${r.teamA.benchMiss.points.toFixed(1)} on bench`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[var(--gwb-muted)]">Bench miss B</dt>
              <dd>
                {r.teamB.benchMiss
                  ? `${r.teamB.benchMiss.name} left ${r.teamB.benchMiss.points.toFixed(1)} on bench`
                  : '—'}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

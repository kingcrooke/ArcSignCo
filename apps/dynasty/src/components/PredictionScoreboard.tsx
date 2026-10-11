import predictions from '../content/commissioner-predictions.json'

export function PredictionScoreboard({ week }: { week: number }) {
  const block = predictions.weeks.find((w) => w.week === week)
  if (!block) return null
  const correct = block.picks.filter((p) => p.correct).length
  const total = block.picks.length
  return (
    <div className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-sm">
      <p className="font-semibold text-[var(--gwb-accent)]">
        Crystal ball — Week {week}: {correct} of {total}
      </p>
      <ul className="mt-2 space-y-1 text-[var(--gwb-muted)]">
        {block.picks.map((p) => (
          <li key={p.matchup}>
            {p.matchup}: picked {p.pick}
            {p.correct ? ' ✓' : ` (won ${p.actualWinner})`}
          </li>
        ))}
      </ul>
    </div>
  )
}

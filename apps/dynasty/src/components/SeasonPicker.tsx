import type { LeagueSeasonEntry } from '../lib/constants'

export function SeasonPicker({
  seasons,
  season,
  onChange,
}: {
  seasons: LeagueSeasonEntry[]
  season: string
  onChange: (season: string) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--dyn-muted)]">
      Season
      <select
        className="rounded-lg border border-[var(--dyn-border)] bg-[var(--dyn-surface)] px-3 py-2.5 text-[var(--dyn-text)] text-base"
        value={season}
        onChange={(e) => onChange(e.target.value)}
      >
        {seasons.map((s) => (
          <option key={s.leagueId} value={s.season}>
            {s.season}
            {s.season === seasons[0]?.season ? ' (current)' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

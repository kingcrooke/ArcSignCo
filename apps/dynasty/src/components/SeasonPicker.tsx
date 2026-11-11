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
    <label className="dyn-picker">
      <span className="dyn-picker-label">Season</span>
      <select
        className="dyn-picker-select"
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

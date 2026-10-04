interface WeekPickerProps {
  week: number
  maxWeek: number
  onChange: (w: number) => void
}

export function WeekPicker({ week, maxWeek, onChange }: WeekPickerProps) {
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--gwb-muted)]">
      <span className="font-medium uppercase tracking-wide text-xs">NFL Week</span>
      <select
        className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-[var(--gwb-text)] text-base"
        value={week}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {weeks.map((w) => (
          <option key={w} value={w}>
            Week {w}
          </option>
        ))}
      </select>
    </label>
  )
}

interface WeekPickerProps {
  week: number
  maxWeek: number
  onChange: (w: number) => void
}

export function WeekPicker({ week, maxWeek, onChange }: WeekPickerProps) {
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)
  return (
    <label className="dyn-picker">
      <span className="dyn-picker-label">NFL Week</span>
      <select
        className="dyn-picker-select"
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

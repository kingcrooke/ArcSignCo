export function SoundToggle({
  label,
  pressed,
  onToggle,
}: {
  label: string
  pressed: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-1.5 text-sm font-medium text-[var(--gwb-text)] hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onToggle}
    >
      <span aria-hidden="true">{pressed ? '🔊' : '🔇'}</span>
      {label}
    </button>
  )
}

export function SoundToggle({
  label,
  pressed,
  showTapHint,
  onToggle,
}: {
  label: string
  pressed: boolean
  showTapHint?: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex flex-col items-end gap-1">
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
      {showTapHint && (
        <p
          className="max-w-[11rem] text-right text-[10px] leading-snug text-[var(--gwb-muted)] sm:max-w-none sm:text-xs"
          aria-live="polite"
        >
          Tap anywhere for sound
        </p>
      )}
    </div>
  )
}

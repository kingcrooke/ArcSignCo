export const MULLIGAN_CHIP_TOTAL = 12

const TOTAL = MULLIGAN_CHIP_TOTAL

export function MulliganChipRack({ used }: { used: number }) {
  return (
    <div
      className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"
      aria-label={`${used} of ${TOTAL} mulligans used`}
    >
      <div className="flex max-w-full flex-wrap gap-1">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className={`h-3 w-3 shrink-0 rounded-full border ${
              i < used
                ? 'border-amber-400 bg-amber-400'
                : 'border-[var(--gwb-border)] bg-[#0d1319]'
            }`}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-xs text-[var(--gwb-muted)]">
        {used} used · {TOTAL - used} left
      </span>
    </div>
  )
}

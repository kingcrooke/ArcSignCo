export const MULLIGAN_CHIP_TOTAL = 12

const TOTAL = MULLIGAN_CHIP_TOTAL

export function MulliganChipRack({ used }: { used: number }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label={`${used} of ${TOTAL} mulligans used`}
    >
      <div className="flex gap-1">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full border ${
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

/** Filled by GoatCounter when visitor counter is enabled on gwbleague.goatcounter.com. */
export function GoatCounterVisitor() {
  return (
    <p
      className="mt-1 text-xs text-[var(--gwb-muted)] [&:has(#gwb-visitor-count:empty)]:hidden"
    >
      <span id="gwb-visitor-count" />
      {' '}
      site visits (privacy-friendly analytics)
    </p>
  )
}

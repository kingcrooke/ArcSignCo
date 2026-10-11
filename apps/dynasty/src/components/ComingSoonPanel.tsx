export function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--gwb-border)] bg-[var(--gwb-surface)]/50 p-10 text-center">
      <p className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--gwb-accent-bright)]">
        Coming next
      </p>
      <p className="mt-2 text-sm text-[var(--gwb-muted)]">{label} is on the roadmap for a future phase.</p>
    </div>
  )
}

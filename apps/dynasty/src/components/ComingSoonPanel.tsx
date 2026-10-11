export function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--dyn-border)] bg-[var(--dyn-surface)]/50 p-10 text-center">
      <p className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--dyn-accent-bright)]">
        Coming next
      </p>
      <p className="mt-2 text-sm text-[var(--dyn-muted)]">{label} is on the roadmap for a future phase.</p>
    </div>
  )
}

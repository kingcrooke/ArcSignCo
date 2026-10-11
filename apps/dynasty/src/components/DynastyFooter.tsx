export function DynastyFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--dyn-border)] pt-4 text-xs leading-relaxed text-[var(--dyn-muted)]">
      <p className="font-semibold text-[var(--dyn-text)]">Sound</p>
      <p>
        Tab beds and UI click are original loops generated in this repo (FFmpeg
        synthesis). CC0 1.0 — see{' '}
        <span className="text-[var(--dyn-text)]">AUDIO_CREDITS.md</span> in the
        Dynasty app package.
      </p>
    </footer>
  )
}

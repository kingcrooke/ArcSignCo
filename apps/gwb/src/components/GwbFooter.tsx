export function GwbFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--gwb-border)] pt-4 text-xs leading-relaxed text-[var(--gwb-muted)]">
      <p className="font-semibold text-[var(--gwb-text)]">Sound</p>
      <p>
        &quot;Impact Moderato&quot;, &quot;Volatile Reaction&quot;, &quot;Sneaky Snitch&quot;, and
        &quot;Monkeys Spinning Monkeys&quot; Kevin MacLeod (incompetech.com), licensed under
        Creative Commons: By Attribution 4.0,{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="text-[var(--gwb-accent)] underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://creativecommons.org/licenses/by/4.0/
        </a>
      </p>
    </footer>
  )
}

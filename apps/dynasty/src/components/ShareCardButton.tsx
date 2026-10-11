import { useState } from 'react'
import { shareOrDownloadSlide } from '../lib/shareSlide'

export function ShareCardButton({
  basename,
  title,
  className = '',
}: {
  basename: string
  title: string
  className?: string
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  return (
    <button
      type="button"
      className={`min-h-11 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gwb-accent)] disabled:opacity-50 ${className}`}
      disabled={state === 'busy'}
      onClick={() => {
        setState('busy')
        void shareOrDownloadSlide(basename, title).then((result) => {
          setState(result === 'error' ? 'error' : 'done')
          if (result !== 'error') {
            window.setTimeout(() => setState('idle'), 2000)
          }
        })
      }}
    >
      {state === 'busy'
        ? 'Preparing…'
        : state === 'done'
          ? 'Saved'
          : state === 'error'
            ? 'Try again'
            : 'Share card'}
    </button>
  )
}

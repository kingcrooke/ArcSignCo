import { isWeekLive } from '../lib/weeks'
import type { NflState, SleeperLeague } from '../lib/types'

export type BestGamesScope = 'all' | number

interface BestGamesWeekScopeProps {
  scope: BestGamesScope
  maxWeek: number
  league: SleeperLeague
  nflState: NflState
  onChange: (scope: BestGamesScope) => void
}

export function BestGamesWeekScope({
  scope,
  maxWeek,
  league,
  nflState,
  onChange,
}: BestGamesWeekScopeProps) {
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--gwb-muted)]">
        Games by week
      </span>
      <div
        className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1"
        role="group"
        aria-label="Filter best games by week"
      >
        <ScopeChip
          label="All"
          active={scope === 'all'}
          onClick={() => onChange('all')}
        />
        {weeks.map((w) => {
          const live = isWeekLive(w, league, nflState)
          return (
            <ScopeChip
              key={w}
              label={live ? `Week ${w} · In progress` : `Week ${w}`}
              active={scope === w}
              disabled={live}
              onClick={() => onChange(w)}
            />
          )
        })}
      </div>
    </div>
  )
}

function ScopeChip({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={
        disabled
          ? 'shrink-0 cursor-not-allowed rounded-lg px-3 py-2 text-xs font-medium text-[var(--gwb-muted)] opacity-60'
          : active
            ? 'gwb-section-tab gwb-section-tab--active shrink-0 px-3 py-2 text-xs'
            : 'gwb-section-tab shrink-0 px-3 py-2 text-xs'
      }
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

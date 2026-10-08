import type { TimelineEvent } from '../lib/seasonTimeline'

const KIND_LABEL: Record<TimelineEvent['kind'], string> = {
  win: 'Win',
  loss: 'Loss',
  tie: 'Tie',
  mulligan: 'Mulligan',
  trade: 'Trade',
}

export function SeasonTimelinePanel({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]">
        No timeline events yet.
      </p>
    )
  }

  return (
    <ol className="space-y-2" id="season-timeline-panel">
      {events.map((e) => (
        <li
          key={e.id}
          className="flex gap-3 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2"
        >
          <span className="w-16 shrink-0 text-xs font-semibold uppercase text-[var(--gwb-accent)]">
            {KIND_LABEL[e.kind]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{e.headline}</p>
            {e.detail && (
              <p className="text-xs text-[var(--gwb-muted)]">{e.detail}</p>
            )}
          </div>
          <span className="shrink-0 text-xs text-[var(--gwb-muted)]">
            {e.dateLabel}
          </span>
        </li>
      ))}
    </ol>
  )
}

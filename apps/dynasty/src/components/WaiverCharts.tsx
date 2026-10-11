import { useState } from 'react'
import type { ManagerWaiverRow } from '../lib/waiverWire'

const PALETTE = [
  '#e8b923',
  '#7fd1c7',
  '#f2a3b3',
  '#9bb7ff',
  '#e08a4f',
  '#c6e07a',
  '#d7b4f3',
  '#8fd0ff',
  '#f0d38a',
  '#ff8f8f',
  '#b8c4ce',
  '#6ee7b7',
]

export function rosterColor(rosterId: number): string {
  return PALETTE[(Math.abs(rosterId) - 1) % PALETTE.length] ?? PALETTE[0]
}

function formatWes(n: number): string {
  return n.toFixed(2)
}

export function WaiverEfficiencyChart({
  managers,
  scoringThrough,
}: {
  managers: ManagerWaiverRow[]
  scoringThrough: number
}) {
  const rows = [...managers].sort((a, b) => (b.wes ?? -999) - (a.wes ?? -999))
  if (!rows.length || scoringThrough < 1) {
    return (
      <p className="text-sm text-[var(--gwb-muted)]">
        Efficiency chart appears after a completed week.
      </p>
    )
  }
  const values = rows.map((r) => r.wes ?? 0)
  const lo = Math.min(0, ...values)
  const hi = Math.max(0, ...values)
  const span = hi - lo || 1
  const pad = span * 0.08
  const min = lo - pad
  const max = hi + pad
  const w = 720
  const rowH = 36
  const left = 168
  const right = 56
  const top = 8
  const h = top + rows.length * rowH + 8
  const plot = w - left - right
  const xOf = (v: number) => left + ((v - min) / (max - min)) * plot
  const zero = xOf(0)

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Waiver efficiency through week ${scoringThrough}`}
    >
      <line
        x1={zero}
        y1={top}
        x2={zero}
        y2={h - 8}
        stroke="#f4f7fb"
        strokeWidth={1.25}
      />
      {rows.map((r, i) => {
        const y = top + i * rowH
        const wes = r.wes ?? 0
        const x0 = Math.min(zero, xOf(wes))
        const x1 = Math.max(zero, xOf(wes))
        const fill = r.eligible ? rosterColor(r.rosterId) : '#243040'
        const labelX = wes >= 0 ? x1 + 6 : x0 - 6
        return (
          <g key={r.rosterId}>
            <text
              x={8}
              y={y + 22}
              fill="#f4f7fb"
              fontSize={13}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {r.displayName}
            </text>
            <rect
              x={x0}
              y={y + 8}
              width={Math.max(x1 - x0, 1.5)}
              height={18}
              rx={4}
              fill={fill}
              stroke={r.eligible ? 'none' : '#e8b923'}
              strokeWidth={r.eligible ? 0 : 1.25}
            />
            <text
              x={labelX}
              y={y + 22}
              fill="#f4f7fb"
              fontSize={12}
              fontFamily="Inter, system-ui, sans-serif"
              textAnchor={wes >= 0 ? 'start' : 'end'}
            >
              {r.wes == null ? '—' : formatWes(r.wes)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function WaiverCumulativeChart({
  managers,
  scoringThrough,
}: {
  managers: ManagerWaiverRow[]
  scoringThrough: number
}) {
  const [hidden, setHidden] = useState<Set<number>>(new Set())
  if (scoringThrough < 1) {
    return (
      <p className="text-sm text-[var(--gwb-muted)]">
        The week-by-week line appears after a completed week.
      </p>
    )
  }
  const series = [...managers].sort(
    (a, b) =>
      (b.cumulativeStarted[scoringThrough - 1] ?? 0) -
      (a.cumulativeStarted[scoringThrough - 1] ?? 0),
  )
  const maxY = Math.max(
    10,
    ...series.map((r) => Math.max(0, ...r.cumulativeStarted)),
  )
  const w = 720
  const h = 280
  const left = 40
  const right = 12
  const top = 16
  const bottom = 28
  const plotW = w - left - right
  const plotH = h - top - bottom
  const xOf = (week: number) =>
    left + (scoringThrough === 1 ? plotW / 2 : ((week - 1) / (scoringThrough - 1)) * plotW)
  const yOf = (v: number) => top + (1 - v / maxY) * plotH
  const ticks = [0, maxY / 2, maxY]

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Cumulative started pickup points through week ${scoringThrough}`}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              y1={yOf(tick)}
              x2={w - right}
              y2={yOf(tick)}
              stroke="#243040"
            />
            <text
              x={left - 6}
              y={yOf(tick) + 4}
              fill="#8fa3b8"
              fontSize={11}
              textAnchor="end"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {Math.round(tick)}
            </text>
          </g>
        ))}
        {Array.from({ length: scoringThrough }, (_, i) => i + 1).map((week) => (
          <text
            key={week}
            x={xOf(week)}
            y={h - 8}
            fill="#8fa3b8"
            fontSize={11}
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
          >
            W{week}
          </text>
        ))}
        {series.map((r) => {
          if (hidden.has(r.rosterId)) return null
          const d = r.cumulativeStarted
            .map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i + 1).toFixed(1)},${yOf(v).toFixed(1)}`)
            .join(' ')
          const color = rosterColor(r.rosterId)
          return (
            <g key={r.rosterId}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
              {r.cumulativeStarted.map((v, i) => (
                <circle key={i} cx={xOf(i + 1)} cy={yOf(v)} r={3.2} fill={color} />
              ))}
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {series.map((r) => {
          const off = hidden.has(r.rosterId)
          return (
            <button
              key={r.rosterId}
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${
                off
                  ? 'border-[var(--gwb-border)] text-[var(--gwb-muted)] opacity-50'
                  : 'border-[var(--gwb-border)] text-[var(--gwb-text)]'
              }`}
              onClick={() => {
                setHidden((prev) => {
                  const next = new Set(prev)
                  if (next.has(r.rosterId)) next.delete(r.rosterId)
                  else next.add(r.rosterId)
                  return next
                })
              }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: rosterColor(r.rosterId) }}
              />
              {r.displayName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

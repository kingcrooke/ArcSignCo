import { useState } from 'react'
import { IG_HASHTAGS } from '../lib/constants'
import type { LeagueData } from '../hooks/useLeagueData'
import { buildWeekRecaps, weekHasMatchups } from '../lib/recaps'
import { weekStatusLabel } from '../lib/weeks'
import {
  downloadBlob,
  renderAllStandingsSlides,
  renderPowerSlide,
  renderRecapSlide,
  runOverflowStressCheck,
} from '../instagram/slides'

export function GraphicsPanel({ data }: { data: LeagueData }) {
  const [status, setStatus] = useState<string | null>(null)
  const [caption, setCaption] = useState<string | null>(null)
  const [overflowOk, setOverflowOk] = useState<boolean | null>(null)

  const gw = data.graphicsWeek
  const statusForIg = weekStatusLabel(gw, data.league, data.nflState)
  const recapWeek = data.graphicsWeek
  const recapMatchups = data.matchupsByWeek.get(recapWeek)
  const igRecaps =
    recapMatchups && weekHasMatchups(recapMatchups)
      ? buildWeekRecaps(
          recapMatchups,
          data.teams,
          data.players,
          data.standings,
        )
      : []
  const motwFromCompleted =
    igRecaps.find((r) => r.isMatchupOfTheWeek) ?? igRecaps[0]

  async function run(
    label: string,
    fn: () => Promise<{ blob: Blob; caption: string; overflow: { ok: boolean } }>,
    filename: string,
  ) {
    setStatus(`Rendering ${label}…`)
    try {
      const result = await fn()
      downloadBlob(result.blob, filename)
      setCaption(result.caption)
      setOverflowOk(result.overflow.ok)
      setStatus(`${label} downloaded.`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Render failed')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--gwb-muted)]">
        1080×1350 feed PNGs · defaults to completed Week {gw} · Anton / Bebas Neue /
        Inter · {IG_HASHTAGS}
      </p>
      {data.isSelectedWeekLive && (
        <p className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
          Week {data.selectedWeek} is live. IG exports use Week {gw} (last scored).
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className="rounded-lg bg-[var(--gwb-accent)] px-4 py-3 font-semibold text-[#1a1200]"
          onClick={async () => {
            setStatus('Rendering standings…')
            try {
              const slides = await renderAllStandingsSlides(data.standings, gw)
              slides.forEach((s, i) => {
                downloadBlob(
                  s.blob,
                  slides.length > 1
                    ? `gwb-standings-w${gw}-p${i + 1}.png`
                    : `gwb-standings-w${gw}.png`,
                )
              })
              setCaption(slides[0].caption)
              setOverflowOk(slides.every((s) => s.overflow.ok))
              setStatus(`Standings downloaded (${slides.length} slide${slides.length > 1 ? 's' : ''}).`)
            } catch (e) {
              setStatus(e instanceof Error ? e.message : 'Render failed')
            }
          }}
        >
          Download standings PNG
        </button>
        <button
          type="button"
          className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 font-medium"
          onClick={() =>
            run(
              'Power rankings slide',
              () => renderPowerSlide(data.power, gw),
              `gwb-power-w${gw}.png`,
            )
          }
        >
          Download power PNG
        </button>
        <button
          type="button"
          disabled={!motwFromCompleted}
          className="rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 font-medium disabled:opacity-40"
          onClick={() =>
            motwFromCompleted &&
            run(
              'Recap slide',
              () =>
                renderRecapSlide(motwFromCompleted, recapWeek, statusForIg),
              `gwb-recap-w${recapWeek}.png`,
            )
          }
        >
          Download recap PNG
        </button>
        <button
          type="button"
          className="rounded-lg border border-dashed border-[var(--gwb-border)] px-4 py-3 text-sm text-[var(--gwb-muted)]"
          onClick={async () => {
            setStatus('Running overflow stress check…')
            const r = await runOverflowStressCheck()
            const ok = r.standings.ok && r.power.ok && r.recap.ok
            setOverflowOk(ok)
            setStatus(
              ok
                ? 'Stress check passed (long team names).'
                : `Stress issues: ${[...r.standings.issues, ...r.power.issues, ...r.recap.issues].join('; ')}`,
            )
          }}
        >
          Run overflow QA
        </button>
      </div>
      {status && <p className="text-sm text-[var(--gwb-muted)]">{status}</p>}
      {caption && (
        <div className="rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3 text-sm">
          <p className="text-xs uppercase text-[var(--gwb-muted)]">Caption</p>
          <p className="mt-1">{caption}</p>
        </div>
      )}
      {overflowOk != null && (
        <p className={overflowOk ? 'text-green-400 text-sm' : 'text-amber-400 text-sm'}>
          Layout check: {overflowOk ? 'OK' : 'Review warnings'}
        </p>
      )}
    </div>
  )
}

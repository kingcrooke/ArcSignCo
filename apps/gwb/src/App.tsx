import { useState } from 'react'
import { GraphicsPanel } from './components/GraphicsPanel'
import { PowerPanel } from './components/PowerPanel'
import { CommissionerRecapsPanel } from './components/CommissionerRecapsPanel'
import { RecapsPanel } from './components/RecapsPanel'
import { MulligansPanel } from './components/MulligansPanel'
import { SlidesPanel } from './components/SlidesPanel'
import { StandingsPanel } from './components/StandingsPanel'
import { WeekPicker } from './components/WeekPicker'
import { LEAGUE_NAME } from './lib/constants'
import { weekHasMatchups } from './lib/recaps'
import { useLeagueData } from './hooks/useLeagueData'

type Tab = 'standings' | 'power' | 'recaps' | 'graphics' | 'slides'

const TABS: { id: Tab; label: string }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'power', label: 'Power' },
  { id: 'recaps', label: 'Recaps' },
  { id: 'graphics', label: 'IG' },
  { id: 'slides', label: 'Slides' },
]

export default function App() {
  const { state, error, data, refresh } = useLeagueData()
  const [tab, setTab] = useState<Tab>('standings')

  const maxWeek = Math.max(
    data?.nflState.week ?? 18,
    data?.league.settings.last_scored_leg ?? 18,
  )

  return (
    <div
      className={`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${
        tab === 'slides' ? 'max-w-6xl' : 'max-w-3xl'
      }`}
    >
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]">
          Command Center
        </p>
        <h1 className="mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl">
          {LEAGUE_NAME} League
        </h1>
        <p className="mt-2 text-sm text-[var(--gwb-muted)]">
          REDRAFT · Sleeper public data · No tracking
        </p>
      </header>

      {state === 'loading' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-[var(--gwb-muted)]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--gwb-accent)] border-t-transparent" />
          <p>Loading GWB league data…</p>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center">
          <p className="font-medium text-red-200">Could not load league</p>
          <p className="mt-2 text-sm text-red-300/80">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-[var(--gwb-accent)] px-4 py-2 font-semibold text-[#1a1200]"
            onClick={() => refresh()}
          >
            Retry
          </button>
        </div>
      )}

      {state === 'ready' && data && (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <WeekPicker
              week={data.selectedWeek}
              maxWeek={maxWeek}
              onChange={data.setSelectedWeek}
            />
            <p className="text-sm text-[var(--gwb-muted)]">
              Season {data.league.season} · NFL Week {data.nflState.week}
              {data.isSelectedWeekLive && (
                <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-amber-300">
                  Live
                </span>
              )}
            </p>
          </div>

          <nav
            className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1"
            aria-label="Sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-[var(--gwb-accent)] text-[#1a1200]'
                    : 'text-[var(--gwb-muted)] hover:text-[var(--gwb-text)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {tab === 'standings' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Standings</h2>
              <p className="mb-3 text-xs text-[var(--gwb-muted)]">
                Tiebreak: win%, then points for, then points against.
              </p>
              <StandingsPanel rows={data.standings} />
              <MulligansPanel rows={data.standings} />
            </section>
          )}
          {tab === 'power' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Power rankings
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
                  after Week {data.graphicsWeek}
                </span>
              </h2>
              <PowerPanel rows={data.power} />
            </section>
          )}
          {tab === 'recaps' && (
            <section className="space-y-8">
              <div>
                <h2 className="mb-3 text-lg font-semibold">Commissioner&apos;s recaps</h2>
                <CommissionerRecapsPanel />
              </div>
              <div>
                <h2 className="mb-3 text-lg font-semibold">
                  Week {data.selectedWeek} matchup recaps
                  {data.isSelectedWeekLive ? ' (live scores)' : ''}
                </h2>
                <RecapsPanel
                  recaps={data.recaps}
                  week={data.selectedWeek}
                  hasScores={weekHasMatchups(
                    data.matchupsByWeek.get(data.selectedWeek),
                  )}
                />
              </div>
            </section>
          )}
          {tab === 'graphics' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Instagram graphics</h2>
              <GraphicsPanel data={data} />
            </section>
          )}
          {tab === 'slides' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Slides</h2>
              <SlidesPanel />
            </section>
          )}
        </>
      )}
    </div>
  )
}

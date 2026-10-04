import { useEffect, useState } from 'react'
import { CommissionerRecapsPanel } from './components/CommissionerRecapsPanel'
import { GwbFooter } from './components/GwbFooter'
import { RecapsPanel } from './components/RecapsPanel'
import { MulligansPanel } from './components/MulligansPanel'
import { SoundToggle } from './components/SoundToggle'
import { WeekGraphicsPanel } from './components/WeekGraphicsPanel'
import { StandingsPanel } from './components/StandingsPanel'
import { WeekPicker } from './components/WeekPicker'
import { LEAGUE_NAME } from './lib/constants'
import { weekHasMatchups } from './lib/recaps'
import type { GraphicsSectionKind } from './lib/weekGraphics'
import { useLeagueData } from './hooks/useLeagueData'
import { useSound } from './hooks/useSound'
import { type AppTab } from './hooks/useUrlState'

const TABS: { id: AppTab; label: string }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'gallery', label: 'Graphics' },
  { id: 'recaps', label: 'Recaps' },
  { id: 'mulligans', label: 'Mulligans' },
]

export default function App() {
  const { state, error, data, refresh } = useLeagueData()
  const [tab, setTab] = useState<AppTab>('standings')
  const [slideParam, setSlideParam] = useState<string | null>(null)
  const sound = useSound()
  const [deckKind, setDeckKind] = useState<GraphicsSectionKind | null>(null)

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams(window.location.search)
    const w = params.get('week')
    const t = params.get('tab') as AppTab | null
    const slide = params.get('slide')
    if (w) {
      const n = Number.parseInt(w, 10)
      if (!Number.isNaN(n)) data.setSelectedWeek(n)
    }
    if (t && ['standings', 'gallery', 'recaps', 'mulligans'].includes(t)) {
      setTab(t)
    }
    if (slide) setSlideParam(slide)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once when data loads
  }, [data?.league.league_id])

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams()
    params.set('week', String(data.selectedWeek))
    params.set('tab', tab)
    if (slideParam) params.set('slide', slideParam)
    const qs = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${qs}`,
    )
  }, [data?.selectedWeek, tab, slideParam, data])

  const maxWeek = Math.max(
    data?.nflState.week ?? 18,
    data?.league.settings.last_scored_leg ?? 18,
  )

  useEffect(() => {
    if (tab === 'recaps') data?.ensurePlayers()
  }, [tab, data])

  useEffect(() => {
    if (!sound.armed) return
    if (tab === 'gallery' && deckKind) {
      sound.setDeckBed(deckKind)
      return
    }
    sound.setTabBed(tab)
  }, [tab, deckKind, sound])

  const onTabChange = (next: AppTab) => {
    sound.playClick()
    setTab(next)
    setSlideParam(null)
    setDeckKind(null)
  }

  const onWeekChange = (w: number) => {
    sound.playClick()
    data?.setSelectedWeek(w)
  }

  return (
    <div
      className={`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${
        tab === 'gallery' ? 'max-w-6xl' : 'max-w-3xl'
      }`}
      onClick={() => sound.onUserGesture()}
    >
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]">
            Command Center
          </p>
          <h1 className="mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl">
            {LEAGUE_NAME} League
          </h1>
          <p className="mt-2 text-sm text-[var(--gwb-muted)]">
            REDRAFT · Sleeper public data · No tracking
          </p>
        </div>
        <SoundToggle
          label={sound.label}
          pressed={sound.pressed}
          onToggle={() => {
            sound.unlock()
            sound.onUserGesture()
          }}
        />
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
              onChange={onWeekChange}
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
            className="gwb-section-tabs mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1"
            aria-label="Sections"
          >
            {TABS.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  className={
                    active
                      ? 'gwb-section-tab gwb-section-tab--active'
                      : 'gwb-section-tab'
                  }
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onTabChange(t.id)}
                >
                  {t.label}
                </button>
              )
            })}
          </nav>

          {tab === 'standings' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Standings
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <p className="mb-3 text-xs text-[var(--gwb-muted)]">
                Tiebreak: win%, then points for, then points against.
              </p>
              <StandingsPanel
                rows={data.standings}
                deferralNote={data.standingsDeferralNote}
                matchupsByWeek={data.matchupsByWeek}
                standingsThroughWeek={data.standingsThroughWeek}
                teams={data.teams}
              />
            </section>
          )}
          {tab === 'gallery' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Week {data.selectedWeek} graphics
              </h2>
              <WeekGraphicsPanel
                week={data.selectedWeek}
                initialSlideId={slideParam}
                onSlideUrlChange={setSlideParam}
                onDeckKindChange={setDeckKind}
              />
            </section>
          )}
          {tab === 'recaps' && (
            <section className="space-y-8">
              <div>
                <h2 className="mb-3 text-lg font-semibold">Commissioner&apos;s recaps</h2>
                <CommissionerRecapsPanel week={data.selectedWeek} />
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
                  isLive={data.isSelectedWeekLive}
                  weekMatchups={data.matchupsByWeek.get(data.selectedWeek)}
                  teams={data.teams}
                  playersLoading={data.playersLoading}
                />
              </div>
            </section>
          )}
          {tab === 'mulligans' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Mulligans</h2>
              <MulligansPanel
                rows={data.standings}
                selectedWeek={data.selectedWeek}
                statusThroughWeek={data.standingsThroughWeek}
                deferralNote={data.mulligansDeferralNote}
                onNegativeMulliganOpen={() => sound.playBuzzer()}
              />
            </section>
          )}

          <GwbFooter />
        </>
      )}
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CommissionerRecapsPanel } from './components/CommissionerRecapsPanel'
import { FrankieZonePanel } from './components/FrankieZonePanel'
import { GwbFooter } from './components/GwbFooter'
import { WaiverPanel } from './components/WaiverPanel'
import { RecapsPanel } from './components/RecapsPanel'
import { MulligansPanel } from './components/MulligansPanel'
import { SoundToggle } from './components/SoundToggle'
import { WeekGraphicsPanel } from './components/WeekGraphicsPanel'
import { StandingsPanel } from './components/StandingsPanel'
import { LiveScoreboardPanel } from './components/LiveScoreboardPanel'
import { WeekPicker } from './components/WeekPicker'
import { LEAGUE_NAME } from './lib/constants'
import {
  buildScheduleByWeek,
  computeFrankieZoneView,
  zoneTabLabel,
} from './lib/frankieZone'
import { weekHasMatchups } from './lib/recaps'
import { computeStandingsThroughWeek } from './lib/standings'
import type { GraphicsSectionKind } from './lib/weekGraphics'
import {
  cumulativeDeferralNote,
  lastCompletedWeek,
} from './lib/weeks'
import { useLeagueData } from './hooks/useLeagueData'
import { useSound } from './hooks/useSound'
import { type AppTab } from './hooks/useUrlState'

const BASE_TABS: { id: AppTab; label: string }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'live', label: 'Live' },
  { id: 'gallery', label: 'Graphics' },
  { id: 'recaps', label: 'Recaps' },
  { id: 'mulligans', label: 'Mulligans' },
  { id: 'frankie', label: 'Frankie Zone' },
  { id: 'waiver', label: 'Waiver Wire Champion' },
]

const TAB_IDS: AppTab[] = [
  'standings',
  'live',
  'gallery',
  'recaps',
  'mulligans',
  'frankie',
  'waiver',
]

export default function App() {
  const { state, error, data, refresh } = useLeagueData()
  const [tab, setTab] = useState<AppTab>('standings')
  const [slideParam, setSlideParam] = useState<string | null>(null)
  const [recapFocusId, setRecapFocusId] = useState<string | null>(null)
  const sound = useSound()
  const [deckKind, setDeckKind] = useState<GraphicsSectionKind | null>(null)

  const openRecapFromZone = useCallback(
    (week: number, recapId: string) => {
      if (!data) return
      data.setSelectedWeek(week)
      setRecapFocusId(recapId)
      setSlideParam(null)
      setDeckKind(null)
      setTab('recaps')
    },
    [data],
  )

  const frankieTabLabel = useMemo(() => {
    if (!data) return zoneTabLabel('Frankie')
    const through = lastCompletedWeek(data.league, data.nflState)
    const standings = computeStandingsThroughWeek(
      data.matchupsByWeek,
      data.teams,
      through,
    )
    const view = computeFrankieZoneView({
      standings,
      teams: data.teams,
      matchupsByWeek: data.matchupsByWeek,
      scheduleByWeek: buildScheduleByWeek(data.matchupsByWeek),
      throughWeek: through,
      selectedWeek: through,
      weekInProgress: false,
    })
    return view.tabLabel
  }, [data])

  const tabs = useMemo(
    () =>
      BASE_TABS.map((t) =>
        t.id === 'frankie' ? { ...t, label: frankieTabLabel } : t,
      ),
    [frankieTabLabel],
  )

  const maxWeek = Math.max(
    data?.nflState.week ?? 18,
    data?.league.settings.last_scored_leg ?? 18,
  )

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
    if (t && TAB_IDS.includes(t)) setTab(t)
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

  useEffect(() => {
    if (tab === 'recaps' || tab === 'waiver' || tab === 'live') data?.ensurePlayers()
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
    if (next !== 'gallery' && next !== 'frankie') setSlideParam(null)
    if (next !== 'gallery') setDeckKind(null)
  }

  const onWeekChange = (w: number) => {
    sound.playClick()
    data?.setSelectedWeek(w)
  }

  const frankieSlideId =
    tab === 'frankie' ? slideParam : null

  const gallerySlideId =
    tab === 'gallery' ? slideParam : null

  return (
    <div
      className={`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${
        tab === 'gallery' || tab === 'waiver' ? 'max-w-6xl' : 'max-w-3xl'
      }`}
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
          showTapHint={sound.showTapHint}
          onToggle={() => sound.unlock()}
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
            {tabs.map((t) => {
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

          {tab === 'live' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Week {data.selectedWeek} scoreboard
                {data.isSelectedWeekLive && (
                  <span className="ml-2 text-sm font-normal text-amber-300">
                    LIVE
                  </span>
                )}
              </h2>
              <LiveScoreboardPanel
                week={data.selectedWeek}
                league={data.league}
                nflState={data.nflState}
                teams={data.teams}
                players={data.players}
                playersLoading={data.playersLoading}
                ensurePlayers={data.ensurePlayers}
                initialMatchups={data.matchupsByWeek.get(data.selectedWeek)}
                onMatchupsUpdated={data.updateWeekMatchups}
                isActive={tab === 'live'}
              />
            </section>
          )}
          {tab === 'standings' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Standings
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <p className="mb-3 text-xs text-[var(--gwb-muted)]">
                Sorted by wins, then points for (Sleeper-style).
              </p>
              <StandingsPanel
                rows={data.standings}
                deferralNote={data.standingsDeferralNote}
                teams={data.teams}
                playoffTeams={data.league.settings.playoff_teams ?? null}
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
                initialSlideId={gallerySlideId}
                onSlideUrlChange={setSlideParam}
                onDeckKindChange={setDeckKind}
              />
            </section>
          )}
          {tab === 'recaps' && (
            <section className="space-y-8">
              <div>
                <h2 className="mb-3 text-lg font-semibold">Commissioner&apos;s recaps</h2>
                <CommissionerRecapsPanel
                  week={data.selectedWeek}
                  focusRecapId={recapFocusId}
                  onFocusHandled={() => setRecapFocusId(null)}
                />
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
                statusThroughWeek={data.mulliganStatusThroughWeek}
                deferralNote={data.mulligansDeferralNote}
                weekMatchups={data.matchupsByWeek.get(data.selectedWeek)}
                onNegativeMulliganOpen={() => sound.playBuzzer()}
              />
            </section>
          )}
          {tab === 'frankie' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Frankie Zone
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <FrankieZonePanel
                standings={data.standings}
                teams={data.teams}
                matchupsByWeek={data.matchupsByWeek}
                selectedWeek={data.selectedWeek}
                throughWeek={data.standingsThroughWeek}
                weekInProgress={data.isSelectedWeekLive}
                deferralNote={cumulativeDeferralNote(
                  data.selectedWeek,
                  data.league,
                  data.nflState,
                  'Frankie Zone',
                )}
                playoffWeekStart={data.league.settings.playoff_week_start ?? 15}
                onOpenRecap={openRecapFromZone}
                initialSlideId={frankieSlideId}
                onSlideUrlChange={setSlideParam}
              />
            </section>
          )}
          {tab === 'waiver' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Waiver Wire Champion
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <WaiverPanel
                board={data.waiverBoard}
                players={data.players}
                deferralNote={data.waiverDeferralNote}
                loadError={data.waiverLoadError}
              />
            </section>
          )}

          <GwbFooter />
        </>
      )}
    </div>
  )
}

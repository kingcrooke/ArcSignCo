import { useCallback, useMemo, useState } from 'react'
import { CommissionerRecapsPanel } from './components/CommissionerRecapsPanel'
import { FrankieZonePanel } from './components/FrankieZonePanel'
import { WaiverPanel } from './components/WaiverPanel'
import { RecapsPanel } from './components/RecapsPanel'
import { MulligansPanel } from './components/MulligansPanel'
import { WeekGraphicsPanel } from './components/WeekGraphicsPanel'
import { StandingsPanel } from './components/StandingsPanel'
import { WeekPicker } from './components/WeekPicker'
import { LEAGUE_NAME } from './lib/constants'
import {
  buildScheduleByWeek,
  computeFrankieZoneView,
  zoneTabLabel,
} from './lib/frankieZone'
import { weekHasMatchups } from './lib/recaps'
import { cumulativeDeferralNote, lastCompletedWeek } from './lib/weeks'
import { computeStandingsThroughWeek } from './lib/standings'
import { useLeagueData } from './hooks/useLeagueData'

type Tab = 'standings' | 'gallery' | 'recaps' | 'mulligans' | 'frankie' | 'waivers'

const BASE_TABS: { id: Tab; label: string }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'gallery', label: 'Graphics' },
  { id: 'recaps', label: 'Recaps' },
  { id: 'mulligans', label: 'Mulligans' },
  { id: 'frankie', label: 'Frankie Zone' },
  { id: 'waivers', label: 'Waiver Wire Champion' },
]

export default function App() {
  const { state, error, data, refresh } = useLeagueData()
  const [tab, setTab] = useState<Tab>('standings')
  const [recapFocusId, setRecapFocusId] = useState<string | null>(null)

  const openRecapFromZone = useCallback((week: number, recapId: string) => {
    if (!data) return
    data.setSelectedWeek(week)
    setRecapFocusId(recapId)
    setTab('recaps')
  }, [data])

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

  return (
    <div
      className={`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${
        tab === 'gallery' || tab === 'waivers' ? 'max-w-6xl' : 'max-w-3xl'
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
                  onClick={() => setTab(t.id)}
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
              />
            </section>
          )}
          {tab === 'gallery' && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Week {data.selectedWeek} graphics
              </h2>
              <WeekGraphicsPanel week={data.selectedWeek} />
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
              />
            </section>
          )}
          {tab === 'waivers' && (
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
        </>
      )}
    </div>
  )
}

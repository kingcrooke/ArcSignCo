import { useCallback, useEffect, useRef, useState } from 'react'
import { ComingSoonPanel } from './components/ComingSoonPanel'
import { DynastyFooter } from './components/DynastyFooter'
import { LiveScoreboardPanel } from './components/LiveScoreboardPanel'
import { PlayoffOddsPanel } from './components/PlayoffOddsPanel'
import { SeasonPicker } from './components/SeasonPicker'
import { SoundToggle } from './components/SoundToggle'
import { StandingsPanel } from './components/StandingsPanel'
import { WeekPicker } from './components/WeekPicker'
import {
  LEAGUE_NAME,
  LEAGUE_SEASONS,
  defaultSeason,
  leagueIdForSeason,
} from './lib/constants'
import { maxSelectableWeek } from './lib/seasonContext'
import { useLeagueData } from './hooks/useLeagueData'
import { useSound } from './hooks/useSound'
import type { AppTab } from './hooks/useUrlState'

const BASE_TABS: { id: AppTab; label: string; placeholder?: boolean }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'live', label: 'Live' },
  { id: 'drafts', label: 'Drafts', placeholder: true },
  { id: 'gallery', label: 'Graphics', placeholder: true },
  { id: 'waiver', label: 'Waiver Wire Champion', placeholder: true },
  { id: 'bestgames', label: 'Best Games', placeholder: true },
  { id: 'trades', label: 'Trades', placeholder: true },
  { id: 'awards', label: 'Awards', placeholder: true },
  { id: 'managers', label: 'Managers', placeholder: true },
]

const TAB_IDS: AppTab[] = BASE_TABS.map((t) => t.id)

export default function App() {
  const [season, setSeason] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('season')
    if (s && leagueIdForSeason(s)) return s
    return defaultSeason()
  })
  const leagueId = leagueIdForSeason(season) ?? LEAGUE_SEASONS[0].leagueId
  const { state, error, data, refresh } = useLeagueData(leagueId)
  const [tab, setTab] = useState<AppTab>('standings')
  const sound = useSound()
  const navRef = useRef<HTMLElement>(null)
  const didInitialTabScroll = useRef(false)

  const maxWeek = data
    ? maxSelectableWeek(
        data.league,
        data.nflState,
        data.regularSeasonLastWeek,
      )
    : 18

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams(window.location.search)
    const w = params.get('week')
    const t = params.get('tab') as AppTab | null
    const s = params.get('season')
    if (s && leagueIdForSeason(s)) setSeason(s)
    if (w) {
      const n = Number.parseInt(w, 10)
      if (!Number.isNaN(n)) data.setSelectedWeek(n)
    }
    if (t && TAB_IDS.includes(t)) setTab(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once when league loads
  }, [data?.league.league_id])

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams()
    params.set('season', season)
    params.set('week', String(data.selectedWeek))
    params.set('tab', tab)
    const qs = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}?${qs}`)
  }, [data?.selectedWeek, tab, season, data])

  const scrollActiveTabIntoView = useCallback((behavior: ScrollBehavior) => {
    const nav = navRef.current
    if (!nav) return
    nav
      .querySelector<HTMLElement>('.gwb-section-tab--active')
      ?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior })
  }, [])

  useEffect(() => {
    if (state !== 'ready' || !data) return
    const behavior = didInitialTabScroll.current ? 'smooth' : 'instant'
    didInitialTabScroll.current = true
    requestAnimationFrame(() => scrollActiveTabIntoView(behavior))
  }, [tab, state, data, scrollActiveTabIntoView])

  useEffect(() => {
    if (tab === 'live') data?.ensurePlayers()
  }, [tab, data])

  useEffect(() => {
    if (!sound.armed) return
    sound.setTabBed(tab)
  }, [tab, sound])

  const onTabChange = (next: AppTab) => {
    sound.playClick()
    setTab(next)
  }

  const onWeekChange = (w: number) => {
    sound.playClick()
    data?.setSelectedWeek(w)
  }

  const onSeasonChange = (nextSeason: string) => {
    sound.playClick()
    setSeason(nextSeason)
    setTab('standings')
  }

  const activeTab = BASE_TABS.find((t) => t.id === tab)
  const isPlaceholder = activeTab?.placeholder === true

  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip px-4 pb-8 pt-6 max-w-3xl">
      <header className="mb-6 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]">
            Command Center
          </p>
          <h1 className="mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl">
            {LEAGUE_NAME}
          </h1>
          <p className="mt-2 text-sm text-[var(--gwb-muted)]">
            DYNASTY · Sleeper public data · No tracking
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
          <p>Loading league data…</p>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center">
          <p className="font-medium text-red-200">Could not load league</p>
          <p className="mt-2 text-sm text-red-300/80">{error}</p>
          <button
            type="button"
            className="dynasty-btn-accent mt-4 rounded-lg px-4 py-2 font-semibold"
            onClick={() => refresh()}
          >
            Retry
          </button>
        </div>
      )}

      {state === 'ready' && data && (
        <>
          <div className="mb-4 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <SeasonPicker
                seasons={LEAGUE_SEASONS}
                season={season}
                onChange={onSeasonChange}
              />
              <WeekPicker
                week={data.selectedWeek}
                maxWeek={maxWeek}
                onChange={onWeekChange}
              />
            </div>
            <p className="text-sm text-[var(--gwb-muted)]">
              Season {data.league.season}
              {!data.isHistoricalSeason && (
                <> · NFL Week {data.nflState.week}</>
              )}
              {data.isSelectedWeekLive && !data.isHistoricalSeason && (
                <span className="dynasty-live-pill ml-2">Live</span>
              )}
            </p>
          </div>

          <nav
            ref={navRef}
            className="gwb-section-tabs mb-6 flex w-full min-w-0 flex-nowrap gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1"
            aria-label="Sections"
          >
            {BASE_TABS.map((t) => {
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
                  {t.placeholder ? `${t.label} · Coming next` : t.label}
                </button>
              )
            })}
          </nav>

          {tab === 'live' && !isPlaceholder && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">
                Week {data.selectedWeek} scoreboard
                {data.isSelectedWeekLive && !data.isHistoricalSeason && (
                  <span className="dynasty-live-pill ml-2 text-sm font-normal">
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
                isActive={tab === 'live' && !data.isHistoricalSeason}
                leagueId={leagueId}
              />
            </section>
          )}
          {tab === 'standings' && (
            <section className="min-w-0 w-full">
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
                matchupsByWeek={data.matchupsByWeek}
                standingsThroughWeek={data.standingsThroughWeek}
              />
              {!data.isHistoricalSeason && (
                <div className="mt-8">
                  <h3 className="mb-3 text-base font-semibold">Playoff odds</h3>
                  <PlayoffOddsPanel rows={data.playoffOdds} />
                </div>
              )}
            </section>
          )}
          {isPlaceholder && tab !== 'standings' && tab !== 'live' && (
            <ComingSoonPanel label={activeTab?.label ?? tab} />
          )}

          <DynastyFooter />
        </>
      )}
    </div>
  )
}

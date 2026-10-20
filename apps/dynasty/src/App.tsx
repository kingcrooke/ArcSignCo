import { useCallback, useEffect, useRef, useState } from 'react'
import { BestGamesPanel } from './components/BestGamesPanel'
import type { BestGamesScope } from './components/BestGamesWeekScope'
import { DraftsPanel } from './components/DraftsPanel'
import { DynastyFooter } from './components/DynastyFooter'
import { DynastyManagerPanel } from './components/DynastyManagerPanel'
import { DynastyWeekGraphicsPanel } from './components/DynastyWeekGraphicsPanel'
import { LiveScoreboardPanel } from './components/LiveScoreboardPanel'
import { PlayoffOddsPanel } from './components/PlayoffOddsPanel'
import { SeasonPicker } from './components/SeasonPicker'
import { SoundToggle } from './components/SoundToggle'
import { StandingsPanel } from './components/StandingsPanel'
import { TradeLogPanel } from './components/TradeLogPanel'
import { WaiverPanel } from './components/WaiverPanel'
import { WeeklyAwardsPanel } from './components/WeeklyAwardsPanel'
import { WeekPicker } from './components/WeekPicker'
import {
  CURRENT_LEAGUE_ID,
  LEAGUE_NAME,
  LEAGUE_SEASONS,
  defaultSeason,
  leagueIdForSeason,
} from './lib/constants'
import { playoffResultsForLeague } from './lib/champions'
import { maxSelectableWeek } from './lib/seasonContext'
import { defaultBestGamesWeek, isWeekComplete } from './lib/weeks'
import {
  latestGraphicsContentWeek,
  resolveGraphicsWeek,
} from './lib/weekGraphics'
import { useLeagueChain } from './hooks/useLeagueChain'
import { useLeagueData } from './hooks/useLeagueData'
import { trackDynastyTab } from './lib/goatcounter'
import { useSound } from './hooks/useSound'
import type { AppTab } from './hooks/useUrlState'

const BASE_TABS: { id: AppTab; label: string }[] = [
  { id: 'standings', label: 'Standings' },
  { id: 'live', label: 'Live' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'gallery', label: 'Graphics' },
  { id: 'waiver', label: 'Waiver Wire Champion' },
  { id: 'bestgames', label: 'Best Games' },
  { id: 'trades', label: 'Trades' },
  { id: 'awards', label: 'Awards' },
  { id: 'managers', label: 'Managers' },
]

const TAB_IDS: AppTab[] = BASE_TABS.map((t) => t.id)

const PLAYER_TABS: AppTab[] = [
  'live',
  'waiver',
  'bestgames',
  'trades',
  'drafts',
  'managers',
  'gallery',
]

export default function App() {
  const [season, setSeason] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('season')
    if (s && leagueIdForSeason(s)) return s
    return defaultSeason()
  })
  const leagueId = leagueIdForSeason(season) ?? LEAGUE_SEASONS[0].leagueId
  const { state, error, data, refresh } = useLeagueData(leagueId)
  const chain = useLeagueChain(CURRENT_LEAGUE_ID)
  const [tab, setTab] = useState<AppTab>('standings')
  const [managerRosterId, setManagerRosterId] = useState(1)
  const [bestGamesScope, setBestGamesScope] = useState<BestGamesScope | null>(
    null,
  )
  const [gallerySlideId, setGallerySlideId] = useState<string | null>(null)
  const [graphicsWeekPin, setGraphicsWeekPin] = useState<number | null>(null)
  const [tabFade, setTabFade] = useState({ left: false, right: true })
  const sound = useSound()
  const navRef = useRef<HTMLElement>(null)
  const didInitialTabScroll = useRef(false)
  const skipGoatcounterTab = useRef(true)

  const maxWeek = data
    ? maxSelectableWeek(
        data.league,
        data.nflState,
        data.regularSeasonLastWeek,
      )
    : 18

  const effectiveBestGamesScope: BestGamesScope =
    bestGamesScope ??
    (data ? defaultBestGamesWeek(data.league, data.nflState) : 1)

  const galleryWeek = data
    ? resolveGraphicsWeek({
        selectedWeek: data.selectedWeek,
        pinnedWeek: graphicsWeekPin,
        season: data.league.season,
        maxWeek,
      })
    : 1
  const latestGraphicsWeek = data
    ? latestGraphicsContentWeek(data.league.season, maxWeek)
    : null

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams(window.location.search)
    const w = params.get('week')
    const t = params.get('tab') as AppTab | null
    const s = params.get('season')
    const mgr =
      params.get('manager') ?? params.get('roster')
    if (s && leagueIdForSeason(s)) setSeason(s)
    if (w) {
      const n = Number.parseInt(w, 10)
      if (!Number.isNaN(n)) {
        data.setSelectedWeek(n)
        if (t === 'gallery') setGraphicsWeekPin(n)
      }
    }
    if (t && TAB_IDS.includes(t)) setTab(t)
    if (mgr) {
      const id = Number.parseInt(mgr, 10)
      if (!Number.isNaN(id) && id >= 1 && id <= 12) setManagerRosterId(id)
    }
    const slide = params.get('slide')
    if (slide) setGallerySlideId(slide)
    if (t === 'bestgames') {
      if (w === 'all') setBestGamesScope('all')
      else if (w) {
        const n = Number.parseInt(w, 10)
        setBestGamesScope(!Number.isNaN(n) ? n : defaultBestGamesWeek(data.league, data.nflState))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once when league loads
  }, [data?.league.league_id])

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams()
    params.set('season', season)
    if (tab === 'bestgames') {
      params.set(
        'week',
        effectiveBestGamesScope === 'all'
          ? 'all'
          : String(effectiveBestGamesScope),
      )
    } else if (tab === 'gallery') {
      params.set('week', String(galleryWeek))
    } else {
      params.set('week', String(data.selectedWeek))
    }
    params.set('tab', tab)
    if (tab === 'managers') {
      params.set('manager', String(managerRosterId))
      params.set('roster', String(managerRosterId))
    }
    const qs = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}?${qs}`)
  }, [
    data?.selectedWeek,
    tab,
    season,
    data,
    effectiveBestGamesScope,
    managerRosterId,
    galleryWeek,
  ])

  const scrollActiveTabIntoView = useCallback((behavior: ScrollBehavior) => {
    const nav = navRef.current
    if (!nav) return
    nav
      .querySelector<HTMLElement>('.dyn-section-tab--active')
      ?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior })
  }, [])

  const updateTabFade = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const max = nav.scrollWidth - nav.clientWidth
    setTabFade({
      left: nav.scrollLeft > 2,
      right: max > 2 && nav.scrollLeft < max - 2,
    })
  }, [])

  useEffect(() => {
    if (state !== 'ready' || !data) return
    const behavior = didInitialTabScroll.current ? 'smooth' : 'instant'
    didInitialTabScroll.current = true
    requestAnimationFrame(() => {
      scrollActiveTabIntoView(behavior)
      updateTabFade()
    })
  }, [tab, state, data, scrollActiveTabIntoView, updateTabFade])

  useEffect(() => {
    if (state !== 'ready') return
    const nav = navRef.current
    if (!nav) return
    updateTabFade()
    nav.addEventListener('scroll', updateTabFade, { passive: true })
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => updateTabFade())
    observer?.observe(nav)
    return () => {
      nav.removeEventListener('scroll', updateTabFade)
      observer?.disconnect()
    }
  }, [state, data, updateTabFade])

  useEffect(() => {
    if (PLAYER_TABS.includes(tab)) data?.ensurePlayers()
  }, [tab, data])

  useEffect(() => {
    if (!sound.armed) return
    sound.setTabBed(tab)
  }, [tab, sound])

  useEffect(() => {
    if (skipGoatcounterTab.current) {
      skipGoatcounterTab.current = false
      return
    }
    trackDynastyTab(tab)
  }, [tab])

  const onTabChange = (next: AppTab) => {
    sound.playClick()
    setTab(next)
    if (next === 'bestgames' && data) {
      setBestGamesScope(defaultBestGamesWeek(data.league, data.nflState))
    }
  }

  const onWeekChange = (w: number) => {
    sound.playClick()
    if (tab === 'gallery') setGraphicsWeekPin(w)
    else data?.setSelectedWeek(w)
  }

  const onSeasonChange = (nextSeason: string) => {
    sound.playClick()
    setSeason(nextSeason)
  }

  const wideTab =
    tab === 'gallery' || tab === 'waiver' || tab === 'managers' || tab === 'drafts'

  return (
    <div
      className={`mx-auto flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip px-4 pb-8 pt-6 ${
        wideTab ? 'max-w-6xl' : 'max-w-3xl'
      }`}
    >
      <header className="mb-6 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dyn-accent)]">
            Command Center
          </p>
          <h1 className="mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl">
            {LEAGUE_NAME}
          </h1>
          <p className="mt-2 text-sm text-[var(--dyn-muted)]">
            DYNASTY · Sleeper public data
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
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-[var(--dyn-muted)]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dyn-accent)] border-t-transparent" />
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
                week={tab === 'gallery' ? galleryWeek : data.selectedWeek}
                maxWeek={maxWeek}
                onChange={onWeekChange}
              />
            </div>
            <p className="text-sm text-[var(--dyn-muted)]">
              Season {data.league.season}
              {!data.isHistoricalSeason && (
                <> · NFL Week {data.nflState.week}</>
              )}
              {data.isSelectedWeekLive && !data.isHistoricalSeason && (
                <span className="dynasty-live-pill ml-2">Live</span>
              )}
            </p>
          </div>

          <div
            className={`dyn-section-tabs-wrap mb-6${
              tabFade.left ? ' dyn-section-tabs-wrap--fade-left' : ''
            }${tabFade.right ? ' dyn-section-tabs-wrap--fade-right' : ''}`}
          >
            <nav
              ref={navRef}
              className="dyn-section-tabs flex w-full min-w-0 flex-nowrap gap-1 overflow-x-auto rounded-xl border border-[var(--dyn-border)] bg-[var(--dyn-surface)] p-1"
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
                        ? 'dyn-section-tab dyn-section-tab--active'
                        : 'dyn-section-tab'
                    }
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onTabChange(t.id)}
                  >
                    {t.label}
                  </button>
                )
              })}
            </nav>
            {tabFade.left && (
              <span className="dyn-section-tabs-hint dyn-section-tabs-hint--left" aria-hidden="true">
                ‹
              </span>
            )}
            {tabFade.right && (
              <span className="dyn-section-tabs-hint dyn-section-tabs-hint--right" aria-hidden="true">
                ›
              </span>
            )}
          </div>

          <div className="sr-only" aria-hidden="true">
            {' '}
          </div>

          {tab === 'live' && (
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
                <span className="ml-2 text-sm font-normal text-[var(--dyn-muted)]">
                  {' '}
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <StandingsPanel
                rows={data.standings}
                deferralNote={data.standingsDeferralNote}
                teams={data.teams}
                playoffTeams={data.league.settings.playoff_teams ?? null}
                matchupsByWeek={data.matchupsByWeek}
                standingsThroughWeek={data.standingsThroughWeek}
                faabByRoster={data.faabByRoster}
                seasonComplete={
                  data.isHistoricalSeason || data.league.status === 'complete'
                }
                playoffResultByRoster={playoffResultsForLeague(
                  chain.leagueSeasonSummaries,
                  data.league.league_id,
                )}
              />
              {!data.isHistoricalSeason && (
                <div className="mt-8">
                  <h3 className="mb-3 text-base font-semibold">Playoff odds</h3>
                  <PlayoffOddsPanel rows={data.playoffOdds} />
                </div>
              )}
            </section>
          )}
          {tab === 'drafts' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">Drafts</h2>
              <DraftsPanel
                boards={data.draftBoards}
                tradedPicks={data.tradedPicks}
                tradedPickHistory={data.tradedPickHistory}
                teams={data.teams}
                players={data.players}
                playersLoading={data.playersLoading}
                leagueSeason={data.league.season}
              />
            </section>
          )}
          {tab === 'gallery' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">
                Week {galleryWeek} graphics
              </h2>
              <DynastyWeekGraphicsPanel
                season={data.league.season}
                week={galleryWeek}
                weekComplete={isWeekComplete(
                  galleryWeek,
                  data.league,
                  data.nflState,
                )}
                teams={data.teams}
                initialSlideId={gallerySlideId}
                latestContentWeek={latestGraphicsWeek}
                onSelectWeek={(week) => setGraphicsWeekPin(week)}
              />
            </section>
          )}
          {tab === 'waiver' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">
                Waiver Wire Champion
                <span className="ml-2 text-sm font-normal text-[var(--dyn-muted)]">
                  {' '}
                  through Week {data.standingsThroughWeek}
                </span>
              </h2>
              <WaiverPanel
                board={data.waiverBoard}
                teams={data.teams}
                players={data.players}
                deferralNote={data.waiverDeferralNote}
                loadError={data.waiverLoadError}
              />
            </section>
          )}
          {tab === 'bestgames' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">Best Games</h2>
              <BestGamesPanel
                matchupsByWeek={data.matchupsByWeek}
                league={data.league}
                nflState={data.nflState}
                maxWeek={maxWeek}
                teams={data.teams}
                players={data.players}
                playersLoading={data.playersLoading}
                ensurePlayers={data.ensurePlayers}
                deferralNote={data.standingsDeferralNote}
                scope={effectiveBestGamesScope}
                onScopeChange={(next) => {
                  sound.playClick()
                  setBestGamesScope(next)
                }}
              />
            </section>
          )}
          {tab === 'trades' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">Trade log</h2>
              <TradeLogPanel
                trades={data.tradeLog}
                teams={data.teams}
                priorSeasonsIncluded={[]}
                priorSeasonsFailed={false}
                playersLoading={data.playersLoading || !data.players}
                highlightDraftPicks
                seasonOnly={data.league.season}
              />
            </section>
          )}
          {tab === 'awards' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">Weekly awards</h2>
              <WeeklyAwardsPanel weeks={data.weeklyAwards} teams={data.teams} />
            </section>
          )}
          {tab === 'managers' && (
            <section className="min-w-0 w-full">
              <h2 className="mb-3 text-lg font-semibold">Managers</h2>
              <DynastyManagerPanel
                rosterId={managerRosterId}
                onRosterChange={(id) => {
                  sound.playClick()
                  setManagerRosterId(id)
                }}
                teams={data.teams}
                rosters={data.rosters}
                standings={data.standings}
                players={data.players}
                ensurePlayers={data.ensurePlayers}
                playersLoading={data.playersLoading}
                leagueSeasonSummaries={chain.leagueSeasonSummaries}
                currentSeason={data.league.season}
                allTrades={chain.allTrades}
                tradedPicks={data.tradedPicks}
                tradePriorSeasonsFailed={chain.priorSeasonsFailed}
                draftRounds={data.league.settings.draft_rounds ?? 3}
              />
            </section>
          )}

          <DynastyFooter />
        </>
      )}
    </div>
  )
}

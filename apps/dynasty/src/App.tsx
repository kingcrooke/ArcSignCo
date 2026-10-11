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
import { maxSelectableWeek } from './lib/seasonContext'
import { defaultBestGamesWeek } from './lib/weeks'
import { useLeagueChain } from './hooks/useLeagueChain'
import { useLeagueData } from './hooks/useLeagueData'
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

  const effectiveBestGamesScope: BestGamesScope =
    bestGamesScope ??
    (data ? defaultBestGamesWeek(data.league, data.nflState) : 1)

  useEffect(() => {
    if (!data) return
    const params = new URLSearchParams(window.location.search)
    const w = params.get('week')
    const t = params.get('tab') as AppTab | null
    const s = params.get('season')
    const mgr = params.get('manager')
    if (s && leagueIdForSeason(s)) setSeason(s)
    if (w) {
      const n = Number.parseInt(w, 10)
      if (!Number.isNaN(n)) data.setSelectedWeek(n)
    }
    if (t && TAB_IDS.includes(t)) setTab(t)
    if (mgr) {
      const id = Number.parseInt(mgr, 10)
      if (!Number.isNaN(id)) setManagerRosterId(id)
    }
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
    } else {
      params.set('week', String(data.selectedWeek))
    }
    params.set('tab', tab)
    if (tab === 'managers') params.set('manager', String(managerRosterId))
    const qs = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}?${qs}`)
  }, [
    data?.selectedWeek,
    tab,
    season,
    data,
    effectiveBestGamesScope,
    managerRosterId,
  ])

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
    if (PLAYER_TABS.includes(tab)) data?.ensurePlayers()
  }, [tab, data])

  useEffect(() => {
    if (!sound.armed) return
    sound.setTabBed(tab)
  }, [tab, sound])

  const onTabChange = (next: AppTab) => {
    sound.playClick()
    setTab(next)
    if (next === 'bestgames' && data) {
      setBestGamesScope(defaultBestGamesWeek(data.league, data.nflState))
    }
  }

  const onWeekChange = (w: number) => {
    sound.playClick()
    data?.setSelectedWeek(w)
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
                  {t.label}
                </button>
              )
            })}
          </nav>

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
                <span className="ml-2 text-sm font-normal text-[var(--gwb-muted)]">
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
                Week {data.selectedWeek} graphics
              </h2>
              <DynastyWeekGraphicsPanel
                week={data.selectedWeek}
                matchups={data.matchupsByWeek.get(data.selectedWeek)}
                teams={data.teams}
                standings={data.standings}
                league={data.league}
                nflState={data.nflState}
                players={data.players}
              />
            </section>
          )}
          {tab === 'waiver' && (
            <section className="min-w-0 w-full">
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
              <WeeklyAwardsPanel weeks={data.weeklyAwards} />
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
              />
            </section>
          )}

          <DynastyFooter />
        </>
      )}
    </div>
  )
}

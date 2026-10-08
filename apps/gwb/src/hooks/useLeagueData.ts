import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadPlayersMap } from '../lib/playersCache'
import { buildWeekRecaps, weekHasMatchups } from '../lib/recaps'
import { regularSeasonLastWeek } from '../lib/frankieZone'
import { computePlayoffOdds, type PlayoffOddsRow } from '../lib/playoffOdds'
import { buildSeasonTimeline, type TimelineEvent } from '../lib/seasonTimeline'
import {
  buildTradeLogEntry,
  mergeTradeLogs,
  type TradeLogEntry,
} from '../lib/trades'
import {
  fetchAllMatchupsThroughWeek,
  fetchLeague,
  fetchMatchups,
  fetchMatchupsForWeekRange,
  fetchNflState,
  fetchRosters,
  fetchTradeHistoryChain,
  fetchTransactionsThroughWeek,
  fetchUsers,
} from '../lib/sleeperApi'
import { computeWeeklyAwards, type WeeklyAwardsWeek } from '../lib/weeklyAwards'
import {
  MULLIGAN_LEDGER_ENTRIES,
  mulliganStatusThroughWeek as ledgerMulliganStatusThroughWeek,
  mulligansDeferralNote as ledgerMulligansDeferralNote,
} from '../lib/mulligans'
import { computeWaiverBoard, weekCloses } from '../lib/waiverWire'
import { computeStandings, computeStandingsThroughWeek } from '../lib/standings'
import { buildTeamMap } from '../lib/teams'
import {
  currentNflWeek,
  isWeekComplete,
  isWeekLive,
  lastCompletedWeek,
  cumulativeDeferralNote,
  standingsDeferralNote,
  standingsThroughWeek,
  weekStatusLabel,
} from '../lib/weeks'
import type {
  MatchupRecap,
  NflState,
  PlayersMap,
  SleeperLeague,
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  StandingRow,
  TeamInfo,
} from '../lib/types'
import type { WaiverBoard } from '../lib/waiverWire'

export type LoadState = 'idle' | 'loading' | 'ready' | 'error'

export interface LeagueData {
  league: SleeperLeague
  nflState: NflState
  rosters: SleeperRoster[]
  /** Cumulative standings for the selected (or deferred) week — Standings tab. */
  standings: StandingRow[]
  /** Full-season Sleeper roster standings — legacy label for recaps context. */
  seasonStandings: StandingRow[]
  recaps: MatchupRecap[]
  matchupsByWeek: Map<number, SleeperMatchup[]>
  players: PlayersMap | null
  playersLoading: boolean
  ensurePlayers: () => void
  teams: Map<number, TeamInfo>
  selectedWeek: number
  setSelectedWeek: (w: number) => void
  refresh: () => void
  completedWeek: number
  isSelectedWeekLive: boolean
  weekLabel: string
  standingsThroughWeek: number
  mulliganStatusThroughWeek: number
  standingsDeferralNote: string | null
  mulligansDeferralNote: string | null
  waiverBoard: WaiverBoard
  waiverLoadError: string | null
  waiverDeferralNote: string | null
  updateWeekMatchups: (week: number, rows: SleeperMatchup[]) => void
  tradeLog: TradeLogEntry[]
  tradePriorSeasonsIncluded: string[]
  tradePriorSeasonsFailed: boolean
  weeklyAwards: WeeklyAwardsWeek[]
  playoffOdds: PlayoffOddsRow[]
  seasonTimeline: TimelineEvent[]
  regularSeasonLastWeek: number
}

export function useLeagueData(): {
  state: LoadState
  error: string | null
  data: LeagueData | null
  refresh: () => void
} {
  const [state, setState] = useState<LoadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<PlayersMap | null>(null)
  const [playersLoading, setPlayersLoading] = useState(false)
  const [base, setBase] = useState<{
    league: SleeperLeague
    nflState: NflState
    rosters: SleeperRoster[]
    matchupsByWeek: Map<number, SleeperMatchup[]>
    teams: Map<number, TeamInfo>
    standings: StandingRow[]
    seasonStandings: StandingRow[]
    transactions: SleeperTransaction[]
    waiverLoadError: string | null
    tradeBundles: Awaited<ReturnType<typeof fetchTradeHistoryChain>>['bundles']
    tradePriorSeasonsFailed: boolean
  } | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)

  const updateWeekMatchups = useCallback((week: number, rows: SleeperMatchup[]) => {
    setBase((prev) => {
      if (!prev) return prev
      const matchupsByWeek = new Map(prev.matchupsByWeek)
      matchupsByWeek.set(week, rows)
      return { ...prev, matchupsByWeek }
    })
  }, [])

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const [nflState, league, users, rosters] = await Promise.all([
        fetchNflState(),
        fetchLeague(),
        fetchUsers(),
        fetchRosters(),
      ])
      const nflWeek = currentNflWeek(nflState)
      const completed = lastCompletedWeek(league, nflState)
      const through = Math.max(nflWeek, completed)
      const regLast = regularSeasonLastWeek(
        league.settings.playoff_week_start ?? 15,
      )
      const [matchupsScored, futureMatchups, txResult, tradeChain] =
        await Promise.all([
          fetchAllMatchupsThroughWeek(through),
          through < regLast
            ? fetchMatchupsForWeekRange(through + 1, regLast)
            : Promise.resolve(new Map<number, SleeperMatchup[]>()),
          fetchTransactionsThroughWeek(through).then(
            (transactions) => ({
              transactions,
              waiverLoadError: null as string | null,
            }),
            (e: unknown) => ({
              transactions: [] as SleeperTransaction[],
              waiverLoadError:
                e instanceof Error ? e.message : 'Waiver moves did not load',
            }),
          ),
          fetchTradeHistoryChain(league.league_id),
        ])
      const matchupsByWeek = new Map(matchupsScored)
      for (const [w, rows] of futureMatchups) {
        if (!matchupsByWeek.has(w)) matchupsByWeek.set(w, rows)
      }
      const teams = buildTeamMap(users, rosters)
      const standings = computeStandings(rosters, teams)
      const seasonStandings = standings

      setSelectedWeek(nflWeek)
      setBase({
        league,
        nflState,
        rosters,
        matchupsByWeek,
        teams,
        standings,
        seasonStandings,
        transactions: txResult.transactions,
        waiverLoadError: txResult.waiverLoadError,
        tradeBundles: tradeChain.bundles,
        tradePriorSeasonsFailed: tradeChain.priorSeasonsFailed,
      })
      setState('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load league')
      setState('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const ensurePlayers = useCallback(() => {
    if (players || playersLoading) return
    setPlayersLoading(true)
    loadPlayersMap()
      .then((map) => setPlayers(map))
      .catch(() => setPlayers({}))
      .finally(() => setPlayersLoading(false))
  }, [players, playersLoading])

  const data = useMemo((): LeagueData | null => {
    if (!base) return null
    const {
      rosters,
      matchupsByWeek,
      teams,
      seasonStandings,
      league,
      nflState,
      transactions,
      waiverLoadError,
      tradeBundles,
      tradePriorSeasonsFailed,
    } = base
    const completedWeek = lastCompletedWeek(league, nflState)
    const throughForCumulative = standingsThroughWeek(
      selectedWeek,
      league,
      nflState,
    )
    const standings = computeStandingsThroughWeek(
      matchupsByWeek,
      teams,
      throughForCumulative,
    )
    const deferNote = standingsDeferralNote(selectedWeek, league, nflState)
    const mulliganDeferNote = ledgerMulligansDeferralNote(
      selectedWeek,
      league,
      nflState,
      throughForCumulative,
    )

    const weekMatchups = matchupsByWeek.get(selectedWeek)
    const preWeekStandings = computeStandingsThroughWeek(
      matchupsByWeek,
      teams,
      Math.max(0, selectedWeek - 1),
    )
    const recaps =
      weekMatchups && weekHasMatchups(weekMatchups) && players
        ? buildWeekRecaps(weekMatchups, teams, players, {
            rosterPositions: league.roster_positions,
            preWeekStandings,
            isWeekFinal: isWeekComplete(selectedWeek, league, nflState),
          })
        : []

    const isSelectedWeekLive = isWeekLive(selectedWeek, league, nflState)
    const mulliganThrough = ledgerMulliganStatusThroughWeek(
      throughForCumulative,
      selectedWeek,
    )
    const weekLabel = weekStatusLabel(selectedWeek, league, nflState)
    const waiverBoard = computeWaiverBoard({
      transactions,
      matchupsByWeek,
      teams,
      rosters,
      scoringThrough: throughForCumulative,
      selectedWeek,
      selectedWeekComplete: !isSelectedWeekLive,
    })
    const waiverDeferralNote = cumulativeDeferralNote(
      selectedWeek,
      league,
      nflState,
      'waiver scores',
    )

    const tradeEntries: TradeLogEntry[] = []
    const priorSeasonsIncluded: string[] = []
    for (const bundle of tradeBundles) {
      if (bundle.league.league_id !== league.league_id) {
        priorSeasonsIncluded.push(bundle.league.season)
      }
      for (const tx of bundle.transactions) {
        const entry = buildTradeLogEntry(
          tx,
          bundle.league,
          bundle.teams,
          players,
        )
        if (entry) tradeEntries.push(entry)
      }
    }
    const tradeLog = mergeTradeLogs(tradeEntries)
    const weeklyAwards = computeWeeklyAwards(
      matchupsByWeek,
      teams,
      league,
      nflState,
    )
    const regLast = regularSeasonLastWeek(
      league.settings.playoff_week_start ?? 15,
    )
    const playoffOdds = computePlayoffOdds({
      standings,
      matchupsByWeek,
      throughWeek: throughForCumulative,
      playoffTeams: league.settings.playoff_teams ?? 6,
      regularSeasonLastWeek: regLast,
    })
    const seasonTimeline = buildSeasonTimeline({
      season: league.season,
      matchupsByWeek,
      teams,
      mulliganEntries: MULLIGAN_LEDGER_ENTRIES,
      trades: tradeLog.filter((t) => t.season === league.season),
      weekCloses: weekCloses(transactions, throughForCumulative),
    })

    return {
      league,
      nflState,
      rosters,
      standings,
      seasonStandings,
      recaps,
      matchupsByWeek,
      players,
      playersLoading,
      ensurePlayers,
      teams,
      selectedWeek,
      setSelectedWeek,
      refresh: load,
      completedWeek,
      isSelectedWeekLive,
      weekLabel,
      standingsThroughWeek: throughForCumulative,
      mulliganStatusThroughWeek: mulliganThrough,
      standingsDeferralNote: deferNote,
      mulligansDeferralNote: mulliganDeferNote,
      waiverBoard,
      waiverLoadError,
      waiverDeferralNote,
      updateWeekMatchups,
      tradeLog,
      tradePriorSeasonsIncluded: priorSeasonsIncluded,
      tradePriorSeasonsFailed,
      weeklyAwards,
      playoffOdds,
      seasonTimeline,
      regularSeasonLastWeek: regLast,
    }
  }, [base, selectedWeek, load, players, playersLoading, ensurePlayers, updateWeekMatchups])

  return { state, error, data, refresh: load }
}

export async function ensureWeekMatchups(
  data: LeagueData,
): Promise<SleeperMatchup[] | undefined> {
  const cached = data.matchupsByWeek.get(data.selectedWeek)
  if (cached) return cached
  const fetched = await fetchMatchups(data.selectedWeek)
  if (fetched?.length) {
    data.matchupsByWeek.set(data.selectedWeek, fetched)
    return fetched
  }
  return undefined
}

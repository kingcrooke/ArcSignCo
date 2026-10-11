import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDraftBoards,
  tradedPickHistoryFromTransactions,
  type DraftBoard,
} from '../lib/drafts'
import { loadPlayersMap } from '../lib/playersCache'
import { computePlayoffOdds, type PlayoffOddsRow } from '../lib/playoffOdds'
import {
  effectiveNflStateForLeague,
  isHistoricalSeason as leagueIsHistorical,
} from '../lib/seasonContext'
import {
  buildTradeLogEntry,
  mergeTradeLogs,
  type TradeLogEntry,
} from '../lib/trades'
import {
  fetchAllMatchupsThroughWeek,
  fetchDraftPicks,
  fetchDrafts,
  fetchLeague,
  fetchMatchups,
  fetchMatchupsForWeekRange,
  fetchNflState,
  fetchRosters,
  fetchTradedPicks,
  fetchTransactionsThroughWeek,
  fetchUsers,
} from '../lib/sleeperApi'
import { computeStandingsThroughWeek } from '../lib/standings'
import { buildTeamMap } from '../lib/teams'
import { computeWaiverBoard, type WaiverBoard } from '../lib/waiverWire'
import { computeWeeklyAwards, type WeeklyAwardsWeek } from '../lib/weeklyAwards'
import {
  cumulativeDeferralNote,
  currentNflWeek,
  isWeekLive,
  lastCompletedWeek,
  regularSeasonLastWeek,
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
  SleeperTradedPick,
  SleeperTransaction,
  StandingRow,
  TeamInfo,
} from '../lib/types'
import type { TradedPickHistoryRow } from '../lib/drafts'

export type LoadState = 'idle' | 'loading' | 'ready' | 'error'

export interface LeagueData {
  league: SleeperLeague
  nflState: NflState
  rosters: SleeperRoster[]
  standings: StandingRow[]
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
  standingsDeferralNote: string | null
  updateWeekMatchups: (week: number, rows: SleeperMatchup[]) => void
  playoffOdds: PlayoffOddsRow[]
  regularSeasonLastWeek: number
  isHistoricalSeason: boolean
  waiverBoard: WaiverBoard
  waiverLoadError: string | null
  waiverDeferralNote: string | null
  tradeLog: TradeLogEntry[]
  weeklyAwards: WeeklyAwardsWeek[]
  draftBoards: DraftBoard[]
  tradedPicks: SleeperTradedPick[]
  tradedPickHistory: TradedPickHistoryRow[]
}

export function useLeagueData(leagueId: string): {
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
    isHistoricalSeason: boolean
    rosters: SleeperRoster[]
    matchupsByWeek: Map<number, SleeperMatchup[]>
    teams: Map<number, TeamInfo>
    transactions: SleeperTransaction[]
    waiverLoadError: string | null
    draftBoards: DraftBoard[]
    tradedPicks: SleeperTradedPick[]
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
    setPlayers(null)
    try {
      const [nflStateRaw, league, users, rosters] = await Promise.all([
        fetchNflState(),
        fetchLeague(leagueId),
        fetchUsers(leagueId),
        fetchRosters(leagueId),
      ])
      const nflState = effectiveNflStateForLeague(league, nflStateRaw)
      const historical = leagueIsHistorical(league, nflStateRaw)
      const nflWeek = currentNflWeek(nflState)
      const completed = lastCompletedWeek(league, nflState)
      const regLast = regularSeasonLastWeek(
        league.settings.playoff_week_start ?? 15,
      )
      const through = historical
        ? Math.max(lastCompletedWeek(league, nflState), regLast)
        : Math.max(nflWeek, completed)

      const [
        matchupsScored,
        futureMatchups,
        txResult,
        drafts,
        tradedPicks,
      ] = await Promise.all([
        fetchAllMatchupsThroughWeek(through, leagueId),
        !historical && through < regLast
          ? fetchMatchupsForWeekRange(through + 1, regLast, leagueId)
          : Promise.resolve(new Map<number, SleeperMatchup[]>()),
        fetchTransactionsThroughWeek(through, leagueId).then(
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
        fetchDrafts(leagueId).catch(() => [] as Awaited<ReturnType<typeof fetchDrafts>>),
        fetchTradedPicks(leagueId).catch(() => [] as SleeperTradedPick[]),
      ])

      const picksByDraftId = new Map<string, Awaited<ReturnType<typeof fetchDraftPicks>>>()
      await Promise.all(
        drafts.map(async (d) => {
          const picks = await fetchDraftPicks(d.draft_id).catch(() => [])
          picksByDraftId.set(d.draft_id, picks)
        }),
      )
      const draftBoards = buildDraftBoards(drafts, picksByDraftId)

      const matchupsByWeek = new Map(matchupsScored)
      for (const [w, rows] of futureMatchups) {
        if (!matchupsByWeek.has(w)) matchupsByWeek.set(w, rows)
      }
      const teams = buildTeamMap(users, rosters)
      const defaultWeek = historical ? through : nflWeek

      setSelectedWeek(defaultWeek)
      setBase({
        league,
        nflState,
        isHistoricalSeason: historical,
        rosters,
        matchupsByWeek,
        teams,
        transactions: txResult.transactions,
        waiverLoadError: txResult.waiverLoadError,
        draftBoards,
        tradedPicks,
      })
      setState('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load league')
      setState('error')
    }
  }, [leagueId])

  useEffect(() => {
    load()
  }, [load])

  /** Re-fetch /users + rosters so team_name and avatars stay current (no localStorage cache). */
  useEffect(() => {
    if (state !== 'ready' || !base) return
    const refreshIdentity = async () => {
      try {
        const [users, rosters] = await Promise.all([
          fetchUsers(leagueId),
          fetchRosters(leagueId),
        ])
        const teams = buildTeamMap(users, rosters)
        setBase((prev) =>
          prev ? { ...prev, rosters, teams } : prev,
        )
      } catch {
        /* keep last good identity */
      }
    }
    const onVis = () => {
      if (document.visibilityState === 'visible') refreshIdentity()
    }
    document.addEventListener('visibilitychange', onVis)
    const id = window.setInterval(refreshIdentity, 5 * 60 * 1000)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(id)
    }
  }, [state, leagueId, base?.league.league_id])

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
      league,
      nflState,
      isHistoricalSeason: historical,
      transactions,
      waiverLoadError,
      draftBoards,
      tradedPicks,
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
    const isSelectedWeekLive = isWeekLive(selectedWeek, league, nflState)
    const weekLabel = weekStatusLabel(selectedWeek, league, nflState)
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
    for (const tx of transactions) {
      const entry = buildTradeLogEntry(tx, league, teams, players)
      if (entry) tradeEntries.push(entry)
    }
    const tradeLog = mergeTradeLogs(tradeEntries)
    const weeklyAwards = computeWeeklyAwards(
      matchupsByWeek,
      teams,
      league,
      nflState,
    )
    const tradedPickHistory = tradedPickHistoryFromTransactions(
      transactions,
      league.season,
    )

    return {
      league,
      nflState,
      rosters,
      standings,
      seasonStandings: standings,
      recaps: [],
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
      standingsDeferralNote: deferNote,
      updateWeekMatchups,
      playoffOdds,
      regularSeasonLastWeek: regLast,
      isHistoricalSeason: historical,
      waiverBoard,
      waiverLoadError,
      waiverDeferralNote,
      tradeLog,
      weeklyAwards,
      draftBoards,
      tradedPicks,
      tradedPickHistory,
    }
  }, [base, selectedWeek, load, players, playersLoading, ensurePlayers, updateWeekMatchups])

  return { state, error, data, refresh: load }
}

export async function ensureWeekMatchups(
  data: LeagueData,
  leagueId: string,
): Promise<SleeperMatchup[] | undefined> {
  const cached = data.matchupsByWeek.get(data.selectedWeek)
  if (cached) return cached
  const fetched = await fetchMatchups(data.selectedWeek, leagueId)
  if (fetched?.length) {
    data.matchupsByWeek.set(data.selectedWeek, fetched)
    return fetched
  }
  return undefined
}

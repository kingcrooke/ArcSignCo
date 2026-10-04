import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadPlayersMap } from '../lib/playersCache'
import { buildWeekRecaps, weekHasMatchups } from '../lib/recaps'
import {
  fetchAllMatchupsThroughWeek,
  fetchLeague,
  fetchMatchups,
  fetchNflState,
  fetchRosters,
  fetchTransactionsThroughWeek,
  fetchUsers,
} from '../lib/sleeperApi'
import { computeWaiverBoard } from '../lib/waiverWire'
import { computeStandings, computeStandingsThroughWeek } from '../lib/standings'
import { buildTeamMap } from '../lib/teams'
import {
  currentNflWeek,
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
  /** Full-season Sleeper roster standings — IG graphics & recaps (unchanged). */
  seasonStandings: StandingRow[]
  recaps: MatchupRecap[]
  matchupsByWeek: Map<number, SleeperMatchup[]>
  players: PlayersMap
  teams: Map<number, TeamInfo>
  selectedWeek: number
  setSelectedWeek: (w: number) => void
  refresh: () => void
  completedWeek: number
  isSelectedWeekLive: boolean
  weekLabel: string
  standingsThroughWeek: number
  standingsDeferralNote: string | null
  mulligansDeferralNote: string | null
  waiverBoard: WaiverBoard
  waiverLoadError: string | null
  waiverDeferralNote: string | null
}

export function useLeagueData(): {
  state: LoadState
  error: string | null
  data: LeagueData | null
  refresh: () => void
} {
  const [state, setState] = useState<LoadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [base, setBase] = useState<{
    league: SleeperLeague
    nflState: NflState
    rosters: SleeperRoster[]
    matchupsByWeek: Map<number, SleeperMatchup[]>
    players: PlayersMap
    teams: Map<number, TeamInfo>
    standings: StandingRow[]
    seasonStandings: StandingRow[]
    transactions: SleeperTransaction[]
    waiverLoadError: string | null
  } | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const [nflState, league, users, rosters, players] = await Promise.all([
        fetchNflState(),
        fetchLeague(),
        fetchUsers(),
        fetchRosters(),
        loadPlayersMap(),
      ])
      const nflWeek = currentNflWeek(nflState)
      const completed = lastCompletedWeek(league, nflState)
      const through = Math.max(nflWeek, completed)
      const [matchupsByWeek, txResult] = await Promise.all([
        fetchAllMatchupsThroughWeek(through),
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
      ])
      const teams = buildTeamMap(users, rosters)
      const standings = computeStandings(rosters, teams)
      const seasonStandings = standings

      setSelectedWeek(nflWeek)
      setBase({
        league,
        nflState,
        rosters,
        matchupsByWeek,
        players,
        teams,
        standings,
        seasonStandings,
        transactions: txResult.transactions,
        waiverLoadError: txResult.waiverLoadError,
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

  const data = useMemo((): LeagueData | null => {
    if (!base) return null
    const {
      rosters,
      matchupsByWeek,
      teams,
      players,
      seasonStandings,
      league,
      nflState,
      transactions,
      waiverLoadError,
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
    const mulliganDeferNote = cumulativeDeferralNote(
      selectedWeek,
      league,
      nflState,
      'mulligan status',
    )

    const weekMatchups = matchupsByWeek.get(selectedWeek)
    const recaps =
      weekMatchups && weekHasMatchups(weekMatchups)
        ? buildWeekRecaps(weekMatchups, teams, players, seasonStandings)
        : []

    const isSelectedWeekLive = isWeekLive(selectedWeek, league, nflState)
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

    return {
      league,
      nflState,
      rosters,
      standings,
      seasonStandings,
      recaps,
      matchupsByWeek,
      players,
      teams,
      selectedWeek,
      setSelectedWeek,
      refresh: load,
      completedWeek,
      isSelectedWeekLive,
      weekLabel,
      standingsThroughWeek: throughForCumulative,
      standingsDeferralNote: deferNote,
      mulligansDeferralNote: mulliganDeferNote,
      waiverBoard,
      waiverLoadError,
      waiverDeferralNote,
    }
  }, [base, selectedWeek, load])

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

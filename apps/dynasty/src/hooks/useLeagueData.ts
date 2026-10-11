import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadPlayersMap } from '../lib/playersCache'
import { computePlayoffOdds, type PlayoffOddsRow } from '../lib/playoffOdds'
import {
  effectiveNflStateForLeague,
  isHistoricalSeason as leagueIsHistorical,
} from '../lib/seasonContext'
import {
  fetchAllMatchupsThroughWeek,
  fetchLeague,
  fetchMatchups,
  fetchMatchupsForWeekRange,
  fetchNflState,
  fetchRosters,
  fetchUsers,
} from '../lib/sleeperApi'
import { computeStandingsThroughWeek } from '../lib/standings'
import { buildTeamMap } from '../lib/teams'
import {
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
  StandingRow,
  TeamInfo,
} from '../lib/types'

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
    seasonStandings: StandingRow[]
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
      const [matchupsScored, futureMatchups] = await Promise.all([
        fetchAllMatchupsThroughWeek(through, leagueId),
        !historical && through < regLast
          ? fetchMatchupsForWeekRange(through + 1, regLast, leagueId)
          : Promise.resolve(new Map<number, SleeperMatchup[]>()),
      ])
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
        seasonStandings: [],
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
      isHistoricalSeason: historical,
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
    return {
      league,
      nflState,
      rosters,
      standings,
      seasonStandings,
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

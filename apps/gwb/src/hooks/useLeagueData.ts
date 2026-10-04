import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadPlayersMap } from '../lib/playersCache'
import { computePowerRankings } from '../lib/powerRankings'
import { buildWeekRecaps, weekHasMatchups } from '../lib/recaps'
import {
  fetchAllMatchupsThroughWeek,
  fetchLeague,
  fetchMatchups,
  fetchNflState,
  fetchRosters,
  fetchUsers,
} from '../lib/sleeperApi'
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
  PowerRankingRow,
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
  /** Cumulative standings for the selected (or deferred) week — Standings tab. */
  standings: StandingRow[]
  /** Full-season Sleeper roster standings — IG graphics & recaps (unchanged). */
  seasonStandings: StandingRow[]
  power: PowerRankingRow[]
  recaps: MatchupRecap[]
  matchupsByWeek: Map<number, SleeperMatchup[]>
  players: PlayersMap
  teams: Map<number, TeamInfo>
  selectedWeek: number
  setSelectedWeek: (w: number) => void
  refresh: () => void
  starterSlots: number
  completedWeek: number
  isSelectedWeekLive: boolean
  weekLabel: string
  graphicsWeek: number
  standingsThroughWeek: number
  standingsDeferralNote: string | null
  mulligansDeferralNote: string | null
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
    starterSlots: number
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
      const matchupsByWeek = await fetchAllMatchupsThroughWeek(through)
      const teams = buildTeamMap(users, rosters)
      const standings = computeStandings(rosters, teams)
      const seasonStandings = standings
      const starterSlots =
        league.roster_positions?.filter((p) => p !== 'BN' && !p.startsWith('IR'))
          .length ?? 10

      setSelectedWeek(completed)
      setBase({
        league,
        nflState,
        rosters,
        matchupsByWeek,
        players,
        teams,
        standings,
        seasonStandings,
        starterSlots,
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
      starterSlots,
      league,
      nflState,
    } = base
    const completedWeek = lastCompletedWeek(league, nflState)
    const throughForCumulative = standingsThroughWeek(
      selectedWeek,
      league,
      nflState,
    )
    const analysisWeek = isWeekLive(selectedWeek, league, nflState)
      ? completedWeek
      : selectedWeek
    const graphicsWeek = analysisWeek

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

    const weeksThrough = new Map<number, SleeperMatchup[]>()
    for (const [w, m] of matchupsByWeek) {
      if (w <= analysisWeek) weeksThrough.set(w, m)
    }
    const prevWeeks = new Map<number, SleeperMatchup[]>()
    for (const [w, m] of matchupsByWeek) {
      if (w < analysisWeek) prevWeeks.set(w, m)
    }
    const powerPrev = computePowerRankings(
      rosters,
      teams,
      prevWeeks,
      Math.max(analysisWeek - 1, 1),
      starterSlots,
    )
    const power = computePowerRankings(
      rosters,
      teams,
      weeksThrough,
      analysisWeek,
      starterSlots,
      powerPrev,
    )

    const weekMatchups = matchupsByWeek.get(selectedWeek)
    const recaps =
      weekMatchups && weekHasMatchups(weekMatchups)
        ? buildWeekRecaps(weekMatchups, teams, players, seasonStandings)
        : []

    const isSelectedWeekLive = isWeekLive(selectedWeek, league, nflState)
    const weekLabel = weekStatusLabel(selectedWeek, league, nflState)

    return {
      league,
      nflState,
      rosters,
      standings,
      seasonStandings,
      power,
      recaps,
      matchupsByWeek,
      players,
      teams,
      selectedWeek,
      setSelectedWeek,
      refresh: load,
      starterSlots,
      completedWeek,
      isSelectedWeekLive,
      weekLabel,
      graphicsWeek,
      standingsThroughWeek: throughForCumulative,
      standingsDeferralNote: deferNote,
      mulligansDeferralNote: mulliganDeferNote,
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

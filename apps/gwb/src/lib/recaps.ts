import type {
  MatchupRecap,
  PlayersMap,
  SleeperMatchup,
  StandingRow,
  TeamInfo,
} from './types'

const BLOWOUT_MARGIN = 40
const UPSET_RANK_GAP = 3

function playerPlainName(id: string, players: PlayersMap): string {
  const p = players[id]
  return p?.full_name?.trim() || 'Player'
}

function topStarter(
  m: SleeperMatchup,
  players: PlayersMap,
): { name: string; points: number } | null {
  let best: { name: string; points: number } | null = null
  m.starters.forEach((pid, i) => {
    const pts = m.starters_points[i] ?? 0
    if (!best || pts > best.points) {
      best = { name: playerPlainName(pid, players), points: pts }
    }
  })
  return best
}

function biggestBenchMiss(
  m: SleeperMatchup,
  players: PlayersMap,
): { name: string; points: number; starterPoints: number } | null {
  const starterSet = new Set(m.starters)
  let best: { name: string; points: number; starterPoints: number } | null =
    null
  const starterPts = m.starters_points.filter((p) => p != null)
  if (!starterPts.length) return null
  const minStarter = Math.min(...starterPts)
  for (const [pid, pts] of Object.entries(m.players_points ?? {})) {
    if (starterSet.has(pid)) continue
    if (pts <= minStarter) continue
    const gap = pts - minStarter
    if (!best || gap > best.points - best.starterPoints) {
      best = {
        name: playerPlainName(pid, players),
        points: pts,
        starterPoints: minStarter,
      }
    }
  }
  return best
}

function preWeekRank(
  rosterId: number,
  standings: StandingRow[],
): number {
  return standings.find((s) => s.rosterId === rosterId)?.rank ?? 99
}

function buildScorerLines(
  teamAName: string,
  teamBName: string,
  aPts: number,
  bPts: number,
  topA: { name: string; points: number } | null,
  topB: { name: string; points: number } | null,
): string[] {
  const aWins = aPts >= bPts
  const lines: string[] = []
  const wTop = aWins ? topA : topB
  const wTeam = aWins ? teamAName : teamBName
  const lTop = aWins ? topB : topA
  const lTeam = aWins ? teamBName : teamAName
  if (wTop) lines.push(`${wTop.name} ${wTop.points.toFixed(1)} · ${wTeam}`)
  if (lTop) lines.push(`${lTop.name} ${lTop.points.toFixed(1)} · ${lTeam}`)
  return lines
}

function buildStarsLine(lines: string[]): string | undefined {
  if (!lines.length) return undefined
  if (lines.length === 1) return `Top scorer: ${lines[0]}`
  return `Top scorers: ${lines.join(' · ')}`
}

function buildNarrative(
  aName: string,
  bName: string,
  aPts: number,
  bPts: number,
  tags: string[],
): string {
  const winner = aPts >= bPts ? aName : bName
  const loser = aPts >= bPts ? bName : aName
  const margin = Math.abs(aPts - bPts).toFixed(1)
  const tagLine = tags.length ? ` ${tags.join(' · ')}.` : ''
  return `${winner} topped ${loser} by ${margin} points.${tagLine}`
}

export function buildWeekRecaps(
  matchups: SleeperMatchup[],
  teams: Map<number, TeamInfo>,
  players: PlayersMap,
  standings: StandingRow[],
): MatchupRecap[] {
  const byMatch = new Map<number, SleeperMatchup[]>()
  for (const m of matchups) {
    const list = byMatch.get(m.matchup_id) ?? []
    list.push(m)
    byMatch.set(m.matchup_id, list)
  }

  const recaps: MatchupRecap[] = []
  for (const [matchupId, pair] of byMatch) {
    if (pair.length < 2) continue
    const [a, b] = pair
    const teamA = teams.get(a.roster_id)
    const teamB = teams.get(b.roster_id)
    const margin = Math.abs(a.points - b.points)
    const winnerRosterId = a.points >= b.points ? a.roster_id : b.roster_id
    const tags: string[] = []
    if (margin >= BLOWOUT_MARGIN) tags.push('Blowout')
    const rankA = preWeekRank(a.roster_id, standings)
    const rankB = preWeekRank(b.roster_id, standings)
    const winnerRank = a.points >= b.points ? rankA : rankB
    const loserRank = a.points >= b.points ? rankB : rankA
    if (winnerRank - loserRank >= UPSET_RANK_GAP) tags.push('Upset')

    const topA = topStarter(a, players)
    const topB = topStarter(b, players)
    const scorerLines = buildScorerLines(
      teamA?.teamName ?? 'Team A',
      teamB?.teamName ?? 'Team B',
      a.points,
      b.points,
      topA,
      topB,
    )

    recaps.push({
      matchupId,
      teamA: {
        rosterId: a.roster_id,
        teamName: teamA?.teamName ?? `Team ${a.roster_id}`,
        points: a.points,
        topScorer: topA,
        benchMiss: biggestBenchMiss(a, players),
      },
      teamB: {
        rosterId: b.roster_id,
        teamName: teamB?.teamName ?? `Team ${b.roster_id}`,
        points: b.points,
        topScorer: topB,
        benchMiss: biggestBenchMiss(b, players),
      },
      margin,
      winnerRosterId,
      tags,
      narrative: buildNarrative(
        teamA?.teamName ?? 'Team A',
        teamB?.teamName ?? 'Team B',
        a.points,
        b.points,
        tags,
      ),
      scorerLines,
      starsLine: buildStarsLine(scorerLines),
      isMatchupOfTheWeek: false,
    })
  }

  if (recaps.length) {
    const motw = recaps.reduce((best, r) =>
      r.margin > best.margin ? r : best,
    )
    motw.isMatchupOfTheWeek = true
  }

  return recaps.sort((x, y) => x.matchupId - y.matchupId)
}

export function weekHasMatchups(matchups: SleeperMatchup[] | undefined): boolean {
  if (!matchups?.length) return false
  return matchups.some((m) => m.starters?.length > 0)
}

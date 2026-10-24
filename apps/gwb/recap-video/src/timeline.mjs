import { TEAM_KICKOFF_BUCKET } from './constants.mjs'
import { formatGraphicScore } from './scores.mjs'

const PLAY_WINDOWS = ['kickoff', 'early', 'late', 'night', 'final']

function sumStarters(starters) {
  return starters.reduce((t, s) => t + (s.points ?? 0), 0)
}

function bucketStarterPoints(starters) {
  const buckets = { early: 0, late: 0, night: 0 }
  for (const s of starters) {
    const pts = s.points ?? 0
    if (s.position === 'DEF' || !s.playerId || s.playerId.length <= 3) {
      buckets.late += pts
      continue
    }
    const kick = TEAM_KICKOFF_BUCKET[s.team] ?? 'early'
    if (kick === 'night') buckets.night += pts
    else if (kick === 'late') buckets.late += pts
    else buckets.early += pts
  }
  return buckets
}

/**
 * Cumulative starter totals by kickoff window; ends at exact Sleeper team points.
 */
export function buildScoreTimeline(matchup) {
  const { winner, loser } = matchup
  const wB = bucketStarterPoints(winner.starters)
  const lB = bucketStarterPoints(loser.starters)

  const wFinal = winner.points
  const lFinal = loser.points

  const ticks = []
  let wCum = 0
  let lCum = 0

  for (const key of PLAY_WINDOWS) {
    let label = key
    let note = ''
    if (key === 'kickoff') {
      label = 'Kickoff'
      note = '0–0'
    } else if (key === 'early') {
      wCum += wB.early
      lCum += lB.early
      label = 'Early window'
      note = '1:00 ET games'
    } else if (key === 'late') {
      wCum += wB.late
      lCum += lB.late
      label = 'Afternoon'
      note = '4:00 ET games'
    } else if (key === 'night') {
      wCum += wB.night
      lCum += lB.night
      label = 'Prime time'
      note = 'SNF / MNF'
    } else {
      wCum = wFinal
      lCum = lFinal
      label = 'Final'
      note = 'Sleeper final'
    }

    ticks.push({
      key,
      label,
      note,
      winnerPoints: wCum,
      loserPoints: lCum,
      winnerDisplay: formatGraphicScore(wCum),
      loserDisplay: formatGraphicScore(lCum),
      leader: wCum >= lCum ? matchup.winner.nickname : matchup.loser.nickname,
    })
  }

  return ticks
}

export function topPerformers(side, n = 3) {
  return [...side.starters]
    .filter((s) => s.position !== 'DEF' && s.playerId?.length > 3)
    .sort((a, b) => b.points - a.points)
    .slice(0, n)
}

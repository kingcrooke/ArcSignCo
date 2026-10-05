import { BUCKET_ORDER, TEAM_KICKOFF_BUCKET } from './constants.mjs'

function round1(n) {
  return Math.round(n * 10) / 10
}

/**
 * Approximate in-day score progression from final starter totals.
 * Sleeper does not expose per-play timestamps; we bucket by team kickoff window.
 */
export function buildScoreTimeline(matchup) {
  const { winner, loser } = matchup

  function bucketPoints(starters) {
    const buckets = { projected: 0, early: 0, late: 0, night: 0, final: 0 }
    for (const s of starters) {
      if (s.position === 'DEF' || s.playerId?.length <= 3) {
        buckets.early += s.points * 0.5
        buckets.late += s.points * 0.5
        continue
      }
      const kick = TEAM_KICKOFF_BUCKET[s.team] ?? 'early'
      if (kick === 'early') buckets.early += s.points
      else if (kick === 'late') buckets.late += s.points
      else buckets.night += s.points
    }
    return buckets
  }

  const wB = bucketPoints(winner.starters)
  const lB = bucketPoints(loser.starters)

  const wProj = round1((winner.points + loser.points) / 2 * 0.42)
  const lProj = round1((winner.points + loser.points) / 2 * 0.44)

  const ticks = []
  let wCum = 0
  let lCum = 0

  for (const key of BUCKET_ORDER) {
    let label = key
    let note = ''
    if (key === 'projected') {
      wCum = wProj
      lCum = lProj
      label = 'Projected'
      note = 'Pre-kickoff'
    } else if (key === 'early') {
      wCum = round1(wProj + wB.early)
      lCum = round1(lProj + lB.early)
      label = 'Early window'
      note = '1:00 ET games'
    } else if (key === 'late') {
      wCum = round1(wCum + wB.late)
      lCum = round1(lCum + lB.late)
      label = 'Afternoon'
      note = '4:00 ET games'
    } else if (key === 'night') {
      wCum = round1(wCum + wB.night)
      lCum = round1(lCum + lB.night)
      label = 'Prime time'
      note = 'SNF / MNF'
    } else {
      wCum = round1(winner.points)
      lCum = round1(loser.points)
      label = 'Final'
      note = 'Sleeper final'
    }
    ticks.push({
      key,
      label,
      note,
      winnerPoints: wCum,
      loserPoints: lCum,
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

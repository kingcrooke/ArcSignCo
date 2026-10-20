/**
 * Build Dynasty weekly report data from the Sleeper API.
 *
 * Usage (from apps/dynasty):
 *   node scripts/build-weekly-reports.mjs
 *   node scripts/build-weekly-reports.mjs --season 2026 --weeks 1,2,3,4,5,6
 *
 * Writes src/data/weekly-reports/<season>.json. Facts only: scores, player
 * points, standings, and transactions returned by Sleeper. Re-run to add a
 * later week (for example Week 7) once that week is final.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const API = 'https://api.sleeper.app/v1'
const DEFAULT_LEAGUE = '1312077668782473216'

/**
 * Same Week 1 kickoff instants as `isOffseasonTrade` in src/lib/trades.ts.
 * Transactions that closed before kickoff are offseason, including a
 * Thursday trade filed on leg 1 (2026: Sep 10, 7:52 PM ET is before 8:20).
 */
const WEEK1_KICKOFF_MS = {
  2019: Date.parse('2019-09-05T20:20:00-04:00'),
  2020: Date.parse('2020-09-10T20:20:00-04:00'),
  2021: Date.parse('2021-09-09T20:20:00-04:00'),
  2022: Date.parse('2022-09-08T20:20:00-04:00'),
  2023: Date.parse('2023-09-07T20:20:00-04:00'),
  2024: Date.parse('2024-09-05T20:20:00-04:00'),
  2025: Date.parse('2025-09-04T20:20:00-04:00'),
  2026: Date.parse('2026-09-10T20:20:00-04:00'),
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1 || !process.argv[i + 1]) return fallback
  return process.argv[i + 1]
}

const leagueId = arg('league', DEFAULT_LEAGUE)
const seasonFilter = arg('season', '')
const weeksArg = arg('weeks', '1,2,3,4,5,6')
const weeks = weeksArg
  .split(',')
  .map((w) => Number.parseInt(w.trim(), 10))
  .filter((w) => Number.isFinite(w) && w > 0)

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100
}

function fmt(n) {
  return round2(n).toFixed(2)
}

function playerName(players, id) {
  const p = players[id]
  if (p?.full_name?.trim()) return p.full_name.trim()
  const built = `${p?.first_name ?? ''} ${p?.last_name ?? ''}`.trim()
  if (built) return built
  if (/^[A-Z]{2,4}$/.test(id)) return `${id} DEF`
  return id
}

function teamLabel(team) {
  const name = team?.metadata?.team_name?.trim() || team?.display_name?.trim()
  return name || `Roster ${team?.roster_id ?? '?'}`
}

function recordBefore(stats, rosterId) {
  const s = stats.get(rosterId) ?? { wins: 0, losses: 0, ties: 0 }
  return { ...s }
}

function applyResult(stats, winnerId, loserId, tie) {
  const w = stats.get(winnerId) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
  const l = stats.get(loserId) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
  if (tie) {
    w.ties += 1
    l.ties += 1
  } else {
    w.wins += 1
    l.losses += 1
  }
  stats.set(winnerId, w)
  stats.set(loserId, l)
}

function addPf(stats, rosterId, points) {
  const s = stats.get(rosterId) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
  s.pf = round2(s.pf + points)
  stats.set(rosterId, s)
}

function winPct(rec) {
  const games = rec.wins + rec.losses + rec.ties
  if (games === 0) return null
  return rec.wins / games
}

/** Starters only, paired with Sleeper starters_points. Bench points are ignored. */
function starterScorers(matchup, players) {
  const ids = matchup.starters ?? []
  const points = matchup.starters_points ?? []
  return ids
    .map((playerId, i) => ({
      playerId,
      name: playerName(players, playerId),
      points: round2(points[i]),
      started: true,
    }))
    .filter((r) => r.playerId && r.playerId !== '0' && r.points > 0)
}

function topScorers(matchup, players, limit = 2) {
  return starterScorers(matchup, players)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function benchPoints(matchup) {
  const starters = new Set(matchup.starters ?? [])
  let total = 0
  for (const [id, pts] of Object.entries(matchup.players_points ?? {})) {
    if (starters.has(id)) continue
    total += Number(pts) || 0
  }
  return round2(total)
}

function recapLine(winnerName, winnerScore, loserName, loserScore, winnerTop, loserTop) {
  const wTops = winnerTop.map((p) => `${p.name} ${fmt(p.points)}`).join(', ')
  const lTops = loserTop.map((p) => `${p.name} ${fmt(p.points)}`).join(', ')
  const margin = round2(winnerScore - loserScore)
  return [
    `${winnerName} ${fmt(winnerScore)} defeated ${loserName} ${fmt(loserScore)} by ${fmt(margin)}.`,
    wTops ? `${winnerName} top scorers: ${wTops}.` : '',
    lTops ? `${loserName} top scorers: ${lTops}.` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function txAdds(tx, players, rostersById) {
  const adds = Object.entries(tx.adds ?? {}).map(([playerId, rosterId]) => ({
    playerId,
    name: playerName(players, playerId),
    rosterId,
  }))
  const drops = Object.entries(tx.drops ?? {}).map(([playerId, rosterId]) => ({
    playerId,
    name: playerName(players, playerId),
    rosterId,
  }))
  const rosterId = adds[0]?.rosterId ?? drops[0]?.rosterId ?? tx.roster_ids?.[0]
  const team = rostersById.get(rosterId)
  return {
    transactionId: tx.transaction_id ?? '',
    type: tx.type,
    status: tx.status,
    rosterId: rosterId ?? null,
    userId: team?.owner_id ?? '',
    manager: team ? teamLabel(team) : `Roster ${rosterId}`,
    faab: tx.settings?.waiver_bid ?? null,
    adds,
    drops,
    statusUpdated: tx.status_updated ?? tx.created ?? 0,
  }
}

async function main() {
  const league = await getJson(`${API}/league/${leagueId}`)
  const season = String(league.season)
  if (seasonFilter && season !== seasonFilter) {
    throw new Error(`League ${leagueId} is season ${season}, not ${seasonFilter}`)
  }
  const [users, rosters, players] = await Promise.all([
    getJson(`${API}/league/${leagueId}/users`),
    getJson(`${API}/league/${leagueId}/rosters`),
    getJson(`${API}/players/nfl`),
  ])
  const usersById = new Map(users.map((u) => [u.user_id, u]))
  const rostersById = new Map(
    rosters.map((r) => {
      const user = r.owner_id ? usersById.get(r.owner_id) : null
      return [
        r.roster_id,
        {
          ...r,
          display_name: user?.display_name ?? '',
          metadata: {
            ...(r.metadata ?? {}),
            team_name: user?.metadata?.team_name ?? user?.display_name ?? '',
          },
          owner_id: r.owner_id,
        },
      ]
    }),
  )

  const ownerMap = [...rostersById.values()]
    .sort((a, b) => a.roster_id - b.roster_id)
    .map((r) => ({
      rosterId: r.roster_id,
      userId: r.owner_id,
      displayName: r.display_name,
      teamName: r.metadata.team_name,
    }))
  console.log('owners', JSON.stringify(ownerMap, null, 2))

  const matchupsByWeek = new Map()
  const txByWeek = new Map()
  for (const week of weeks) {
    const [matchups, transactions] = await Promise.all([
      getJson(`${API}/league/${leagueId}/matchups/${week}`),
      getJson(`${API}/league/${leagueId}/transactions/${week}`),
    ])
    matchupsByWeek.set(week, matchups)
    txByWeek.set(week, transactions)
  }

  const stats = new Map()
  const reports = {}

  const orderedWeeks = [...weeks].sort((a, b) => a - b)
  for (const week of orderedWeeks) {
    const matchups = matchupsByWeek.get(week) ?? []
    const byMatch = new Map()
    for (const m of matchups) {
      if (m.matchup_id == null) continue
      const list = byMatch.get(m.matchup_id) ?? []
      list.push(m)
      byMatch.set(m.matchup_id, list)
    }

    const games = []
    for (const [matchupId, pair] of byMatch) {
      if (pair.length !== 2) continue
      const [a, b] = pair
      const aTeam = rostersById.get(a.roster_id)
      const bTeam = rostersById.get(b.roster_id)
      const aName = teamLabel(aTeam)
      const bName = teamLabel(bTeam)
      const aPts = round2(a.points)
      const bPts = round2(b.points)
      const tie = aPts === bPts
      const winner = aPts >= bPts ? a : b
      const loser = aPts >= bPts ? b : a
      const winnerTeam = rostersById.get(winner.roster_id)
      const loserTeam = rostersById.get(loser.roster_id)
      const winnerName = teamLabel(winnerTeam)
      const loserName = teamLabel(loserTeam)
      const winnerTop = topScorers(winner, players)
      const loserTop = topScorers(loser, players)
      const beforeW = recordBefore(stats, winner.roster_id)
      const beforeL = recordBefore(stats, loser.roster_id)
      const wPct = winPct(beforeW)
      const lPct = winPct(beforeL)
      const upset = !tie && wPct != null && lPct != null && wPct < lPct
      games.push({
        matchupId,
        tie,
        upset,
        margin: round2(Math.abs(aPts - bPts)),
        combined: round2(aPts + bPts),
        winner: {
          rosterId: winner.roster_id,
          userId: winnerTeam?.owner_id ?? '',
          name: winnerName,
          score: round2(winner.points),
          recordAfter: null,
          topScorers: winnerTop,
        },
        loser: {
          rosterId: loser.roster_id,
          userId: loserTeam?.owner_id ?? '',
          name: loserName,
          score: round2(loser.points),
          topScorers: loserTop,
        },
        recap: tie
          ? `${aName} and ${bName} tied ${fmt(aPts)}-${fmt(bPts)}. ${aName} top scorers: ${topScorers(a, players).map((p) => `${p.name} ${fmt(p.points)}`).join(', ') || 'none'}. ${bName} top scorers: ${topScorers(b, players).map((p) => `${p.name} ${fmt(p.points)}`).join(', ') || 'none'}.`
          : recapLine(winnerName, winner.points, loserName, loser.points, winnerTop, loserTop),
        bench: [
          {
            rosterId: a.roster_id,
            userId: aTeam?.owner_id ?? '',
            name: aName,
            points: benchPoints(a),
          },
          {
            rosterId: b.roster_id,
            userId: bTeam?.owner_id ?? '',
            name: bName,
            points: benchPoints(b),
          },
        ],
      })
      if (tie) {
        const sa = stats.get(a.roster_id) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
        const sb = stats.get(b.roster_id) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
        sa.ties += 1
        sb.ties += 1
        stats.set(a.roster_id, sa)
        stats.set(b.roster_id, sb)
      } else {
        applyResult(stats, winner.roster_id, loser.roster_id, false)
      }
      addPf(stats, a.roster_id, aPts)
      addPf(stats, b.roster_id, bPts)
    }

    for (const g of games) {
      const rec = stats.get(g.winner.rosterId)
      g.winner.recordAfter = rec
        ? `${rec.wins}-${rec.losses}${rec.ties ? `-${rec.ties}` : ''}`
        : ''
    }

    const sides = matchups
      .filter((m) => m.matchup_id != null)
      .map((m) => {
        const team = rostersById.get(m.roster_id)
        return {
          rosterId: m.roster_id,
          userId: team?.owner_id ?? '',
          name: teamLabel(team),
          points: round2(m.points),
        }
      })
      .filter((s) => s.points > 0)
    const high = [...sides].sort((a, b) => b.points - a.points)[0] ?? null
    const low = [...sides].sort((a, b) => a.points - b.points)[0] ?? null
    const decided = games.filter((g) => !g.tie)
    const closest = [...decided].sort((a, b) => a.margin - b.margin)[0] ?? null
    const blowout = [...decided].sort((a, b) => b.margin - a.margin)[0] ?? null

    let topPlayer = null
    for (const m of matchups) {
      const team = rostersById.get(m.roster_id)
      for (const row of starterScorers(m, players)) {
        const better =
          !topPlayer ||
          row.points > topPlayer.points ||
          (row.points === topPlayer.points && row.name.localeCompare(topPlayer.name) < 0)
        if (!better) continue
        topPlayer = {
          playerId: row.playerId,
          name: row.name,
          points: row.points,
          started: true,
          rosterId: m.roster_id,
          userId: team?.owner_id ?? '',
          manager: teamLabel(team),
        }
      }
    }

    const benchRows = games.flatMap((g) => g.bench)
    const mostBench = [...benchRows].sort((a, b) => b.points - a.points)[0] ?? null

    const best = [...decided].sort((a, b) => {
      const score = (g) => {
        const closeness = Math.max(0, 40 - g.margin)
        const shootout = g.combined / 5
        const upsetBonus = g.upset ? 12 : 0
        return closeness + shootout + upsetBonus
      }
      return score(b) - score(a)
    })[0] ?? null

    const week1Kickoff = WEEK1_KICKOFF_MS[Number(season)] ?? null
    const transactions = (txByWeek.get(week) ?? []).filter((tx) => {
      if (tx.status !== 'complete') return false
      const when = tx.status_updated ?? tx.created ?? 0
      if (week === 1 && week1Kickoff != null && when < week1Kickoff) return false
      return true
    })
    const waivers = transactions
      .filter((tx) => tx.type === 'waiver' || tx.type === 'free_agent')
      .filter((tx) => tx.adds && Object.keys(tx.adds).length)
      .map((tx) => txAdds(tx, players, rostersById))
    const trades = transactions
      .filter((tx) => tx.type === 'trade')
      .map((tx) => {
        const sides = (tx.roster_ids ?? []).map((rosterId) => {
          const team = rostersById.get(rosterId)
          const received = Object.entries(tx.adds ?? {})
            .filter(([, rid]) => rid === rosterId)
            .map(([playerId]) => playerName(players, playerId))
          const sent = Object.entries(tx.drops ?? {})
            .filter(([, rid]) => rid === rosterId)
            .map(([playerId]) => playerName(players, playerId))
          const picksIn = (tx.draft_picks ?? [])
            .filter((p) => p.owner_id === rosterId)
            .map((p) => {
              const orig = rostersById.get(p.roster_id)
              return `${String(p.season).slice(-2)} Rd ${p.round} (${teamLabel(orig)})`
            })
          return {
            rosterId,
            userId: team?.owner_id ?? '',
            manager: teamLabel(team),
            receivedPlayers: received,
            sentPlayers: sent,
            receivedPicks: picksIn,
          }
        })
        return {
          transactionId: tx.transaction_id ?? '',
          statusUpdated: tx.status_updated ?? 0,
          sides,
        }
      })

    const standings = [...rostersById.values()]
      .map((r) => {
        const s = stats.get(r.roster_id) ?? { wins: 0, losses: 0, ties: 0, pf: 0 }
        return {
          rosterId: r.roster_id,
          userId: r.owner_id ?? '',
          name: teamLabel(r),
          wins: s.wins,
          losses: s.losses,
          ties: s.ties,
          pointsFor: round2(s.pf),
        }
      })
      .sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor || a.rosterId - b.rosterId)
      .map((row, i) => ({ rank: i + 1, ...row }))

    reports[String(week)] = {
      season,
      leagueId,
      week,
      source: 'sleeper',
      matchups: games.map((g) => ({
        matchupId: g.matchupId,
        margin: g.margin,
        upset: g.upset,
        tie: g.tie,
        recap: g.recap,
        winner: g.winner,
        loser: g.loser,
      })),
      highScore: high,
      lowScore: low,
      closest: closest
        ? {
            margin: closest.margin,
            winnerName: closest.winner.name,
            winnerScore: closest.winner.score,
            loserName: closest.loser.name,
            loserScore: closest.loser.score,
            matchupId: closest.matchupId,
          }
        : null,
      blowout: blowout
        ? {
            margin: blowout.margin,
            winnerName: blowout.winner.name,
            winnerScore: blowout.winner.score,
            loserName: blowout.loser.name,
            loserScore: blowout.loser.score,
            matchupId: blowout.matchupId,
          }
        : null,
      topPlayer,
      mostBench,
      bestGame: best
        ? {
            matchupId: best.matchupId,
            winnerName: best.winner.name,
            winnerScore: best.winner.score,
            loserName: best.loser.name,
            loserScore: best.loser.score,
            margin: best.margin,
            upset: best.upset,
          }
        : null,
      standings,
      waivers,
      trades,
    }
    console.log(
      `week ${week}: games ${games.length}, high ${high?.name} ${high?.points}, waivers ${waivers.length}, trades ${trades.length}`,
    )
  }

  const outDir = path.join(ROOT, 'src/data/weekly-reports')
  await mkdir(outDir, { recursive: true })
  const outFile = path.join(outDir, `${season}.json`)
  await writeFile(outFile, `${JSON.stringify({ season, leagueId, weeks: reports }, null, 2)}\n`)
  console.log('wrote', outFile)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

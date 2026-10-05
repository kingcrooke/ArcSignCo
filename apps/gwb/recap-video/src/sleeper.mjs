import { LEAGUE_ID, NICKNAME_BY_ROSTER } from './constants.mjs'

const PLAYERS_CACHE = new Map()

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sleeper ${url}: ${res.status}`)
  return res.json()
}

export async function loadPlayersMap() {
  if (PLAYERS_CACHE.has('all')) return PLAYERS_CACHE.get('all')
  const all = await fetchJson('https://api.sleeper.app/v1/players/nfl')
  PLAYERS_CACHE.set('all', all)
  return all
}

export function playerLabel(players, playerId) {
  if (!playerId || playerId.length <= 3) {
    return { name: playerId, position: 'DEF', team: playerId, number: '' }
  }
  const p = players[playerId] ?? {}
  const name =
    p.full_name ?? (`${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || playerId)
  return {
    name,
    position: p.position ?? '?',
    team: p.team ?? 'FA',
    number: p.number != null ? String(p.number) : '',
  }
}

export async function fetchRosters() {
  return fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`)
}

export async function fetchMatchups(week) {
  return fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${week}`)
}

export async function recordsThroughWeek(week) {
  const wins = Object.create(null)
  const losses = Object.create(null)
  for (let w = 1; w <= week; w++) {
    const rows = await fetchMatchups(w)
    const byMid = new Map()
    for (const r of rows) {
      if (!byMid.has(r.matchup_id)) byMid.set(r.matchup_id, [])
      byMid.get(r.matchup_id).push(r)
    }
    for (const pair of byMid.values()) {
      if (pair.length !== 2) continue
      const [a, b] = pair
      if (a.points > b.points) {
        wins[a.roster_id] = (wins[a.roster_id] ?? 0) + 1
        losses[b.roster_id] = (losses[b.roster_id] ?? 0) + 1
      } else if (b.points > a.points) {
        wins[b.roster_id] = (wins[b.roster_id] ?? 0) + 1
        losses[a.roster_id] = (losses[a.roster_id] ?? 0) + 1
      }
    }
  }
  return { wins, losses }
}

export async function recordsBeforeWeek(week) {
  const wins = Object.create(null)
  const losses = Object.create(null)
  for (let w = 1; w < week; w++) {
    const rows = await fetchMatchups(w)
    const byMid = new Map()
    for (const r of rows) {
      if (!byMid.has(r.matchup_id)) byMid.set(r.matchup_id, [])
      byMid.get(r.matchup_id).push(r)
    }
    for (const pair of byMid.values()) {
      if (pair.length !== 2) continue
      const [a, b] = pair
      if (a.points > b.points) {
        wins[a.roster_id] = (wins[a.roster_id] ?? 0) + 1
        losses[b.roster_id] = (losses[b.roster_id] ?? 0) + 1
      } else if (b.points > a.points) {
        wins[b.roster_id] = (wins[b.roster_id] ?? 0) + 1
        losses[a.roster_id] = (losses[a.roster_id] ?? 0) + 1
      }
    }
  }
  return { wins, losses }
}

export function nickname(rosterId, usersByRoster) {
  return NICKNAME_BY_ROSTER[rosterId] ?? usersByRoster.get(rosterId)?.display_name ?? `R${rosterId}`
}

export async function resolveMatchup({ week, matchupId, mulliganLedgerPath }) {
  const [matchups, rosters, players, records] = await Promise.all([
    fetchMatchups(week),
    fetchRosters(),
    loadPlayersMap(),
    recordsBeforeWeek(week),
  ])

  const pair = matchups.filter((m) => m.matchup_id === matchupId)
  if (pair.length !== 2) {
    throw new Error(`Week ${week} matchup_id ${matchupId}: expected 2 rows, got ${pair.length}`)
  }

  const rosterMap = new Map(rosters.map((r) => [r.roster_id, r]))
  const users = await fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`)
  const ownerToUser = new Map(users.map((u) => [u.user_id, u]))
  const usersByRoster = new Map()
  for (const r of rosters) {
    const u = ownerToUser.get(r.owner_id)
    usersByRoster.set(r.roster_id, u)
  }

  const sides = pair.map((row) => {
    const roster = rosterMap.get(row.roster_id)
    const starters = row.starters.map((pid, i) => {
      const meta = playerLabel(players, pid)
      return {
        playerId: pid,
        points: row.starters_points[i] ?? 0,
        ...meta,
      }
    })
    const topScorer = starters.reduce((best, s) => (s.points > best.points ? s : best), starters[0])
    const qbStarter = starters.find((s) => s.position === 'QB') ?? starters[0]
    const teamName =
      usersByRoster.get(row.roster_id)?.metadata?.team_name ??
      roster?.metadata?.team_name ??
      `Team ${row.roster_id}`

    return {
      rosterId: row.roster_id,
      nickname: nickname(row.roster_id, usersByRoster),
      teamName,
      points: row.points,
      recordBefore: `${records.wins[row.roster_id] ?? 0}-${records.losses[row.roster_id] ?? 0}`,
      starters,
      topScorer,
      qbStarter,
      defaultQb: playerLabel(players, roster?.starters?.find((pid) => players[pid]?.position === 'QB') ?? qbStarter.playerId),
    }
  })

  sides.sort((a, b) => b.points - a.points)
  const winner = sides[0]
  const loser = sides[1]

  let mulligan = null
  if (mulliganLedgerPath) {
    const { readFile } = await import('node:fs/promises')
    const ledger = JSON.parse(await readFile(mulliganLedgerPath, 'utf8'))
    mulligan =
      ledger.entries?.find((e) => e.week === week && (e.rosterId === winner.rosterId || e.rosterId === loser.rosterId)) ??
      null
  }

  const upset =
    (records.wins[loser.rosterId] ?? 0) > (records.wins[winner.rosterId] ?? 0) ||
    ((records.losses[winner.rosterId] ?? 0) > (records.losses[loser.rosterId] ?? 0) &&
      (records.wins[winner.rosterId] ?? 0) <= (records.wins[loser.rosterId] ?? 0))

  return {
    leagueId: LEAGUE_ID,
    week,
    matchupId,
    season: (await fetchJson('https://api.sleeper.app/v1/state/nfl')).season,
    winner,
    loser,
    margin: Math.abs(winner.points - loser.points),
    upset,
    mulligan,
    jersey: {
      winner: winner.topScorer,
      loser: loser.qbStarter,
    },
  }
}

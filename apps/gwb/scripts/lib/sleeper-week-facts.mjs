import { LEAGUE_ID, MANAGER_BY_USER_ID } from './gwb-managers.mjs'

const SLEEPER = 'https://api.sleeper.app/v1'

export async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

export async function loadPlayersNfl() {
  return fetchJson(`${SLEEPER}/players/nfl`)
}

export function playerInfo(players, pid) {
  if (!pid || typeof pid !== 'string' || /^[A-Z]{2,3}$/.test(pid)) {
    return { id: pid, name: String(pid ?? ''), team: String(pid ?? ''), number: null, position: 'DEF' }
  }
  const p = players[pid] ?? {}
  return {
    id: pid,
    name: p.full_name ?? pid,
    team: p.team ?? '',
    number: p.number ?? null,
    position: p.position ?? '',
  }
}

export function topStarterScorer(match, players) {
  let bestId = null
  let bestPts = -Infinity
  for (const pid of match.starters ?? []) {
    const pts = match.players_points?.[pid] ?? 0
    if (pts > bestPts) {
      bestPts = pts
      bestId = pid
    }
  }
  return { ...playerInfo(players, bestId), points: bestPts }
}

export function startingQb(match, players) {
  const pid = match.starters?.[0]
  return playerInfo(players, pid)
}

/** Winner jersey for result art (Crooke rule). */
export function winnerJersey(manager, topScorer, startingQb) {
  if (manager === 'Crooke') {
    return { name: 'Lamar Jackson', team: 'BAL', number: 8 }
  }
  return {
    name: topScorer.name,
    team: topScorer.team,
    number: topScorer.number,
  }
}

export function loserJersey(manager, startingQb) {
  if (manager === 'Crooke') {
    return { name: 'Lamar Jackson', team: 'BAL', number: 8 }
  }
  return {
    name: startingQb.name,
    team: startingQb.team,
    number: startingQb.number,
  }
}

export async function loadWeekMatchupFacts(week) {
  const [matchups, rosters, players] = await Promise.all([
    fetchJson(`${SLEEPER}/league/${LEAGUE_ID}/matchups/${week}`),
    fetchJson(`${SLEEPER}/league/${LEAGUE_ID}/rosters`),
    loadPlayersNfl(),
  ])
  const byRoster = new Map(rosters.map((r) => [r.roster_id, r]))
  const pairs = new Map()
  for (const m of matchups) {
    const list = pairs.get(m.matchup_id) ?? []
    list.push(m)
    pairs.set(m.matchup_id, list)
  }

  const results = []
  for (const matchupNum of [...pairs.keys()].sort((a, b) => a - b)) {
    const [a, b] = pairs.get(matchupNum)
    const home = a
    const away = b
    const homeWon = home.points >= away.points
    const win = homeWon ? home : away
    const lose = homeWon ? away : home
    const winR = byRoster.get(win.roster_id)
    const loseR = byRoster.get(lose.roster_id)
    const winner = MANAGER_BY_USER_ID[winR.owner_id]
    const loser = MANAGER_BY_USER_ID[loseR.owner_id]
    const wRec = `${winR.settings.wins}-${winR.settings.losses}`
    const lRec = `${loseR.settings.wins}-${loseR.settings.losses}`
    const wTop = topStarterScorer(win, players)
    const wQb = startingQb(win, players)
    const lQb = startingQb(lose, players)
    const wJersey = winnerJersey(winner, wTop, wQb)
    const lJersey = loserJersey(loser, lQb)

    results.push({
      id: `results-w${week}-m${matchupNum}`,
      matchupNum,
      winner,
      loser,
      winnerPoints: win.points,
      loserPoints: lose.points,
      winnerRecord: wRec,
      loserRecord: lRec,
      winnerTopScorer: wTop,
      loserStartingQb: lQb,
      winnerJersey: wJersey,
      loserJersey: lJersey,
    })
  }
  return { week, results, rosters, players, matchups }
}

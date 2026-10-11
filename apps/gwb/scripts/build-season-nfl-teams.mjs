/**
 * Build src/content/season-nfl-teams.json — NFL team per player per GWB season.
 * Uses Sleeper season stats (team field), never current player.team.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/content/season-nfl-teams.json')
const LEAGUE_ID = '1389375326257184768'
const API = 'https://api.sleeper.app/v1'
const STATS = 'https://api.sleeper.app/stats/nfl'

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json()
}

async function leagueChain(startId) {
  const leagues = []
  let id = startId
  for (let i = 0; i < 12 && id; i++) {
    const league = await getJson(`${API}/league/${id}`)
    leagues.push(league)
    id = league.previous_league_id ?? null
  }
  return leagues
}

async function playerIdsForLeague(leagueId) {
  const rosters = await getJson(`${API}/league/${leagueId}/rosters`)
  const ids = new Set()
  for (const r of rosters) {
    for (const pid of r.players ?? []) ids.add(pid)
  }
  return ids
}

async function teamsForSeason(season, playerIds) {
  const rows = await getJson(`${STATS}/${season}?season_type=regular`)
  if (!Array.isArray(rows)) throw new Error(`Unexpected stats shape for ${season}`)
  const map = {}
  for (const row of rows) {
    const pid = row.player_id
    if (!pid || !playerIds.has(String(pid))) continue
    const team = row.team
    if (typeof team === 'string' && team.trim()) {
      map[String(pid)] = team.trim()
    }
  }
  return map
}

async function main() {
  const leagues = await leagueChain(LEAGUE_ID)
  const out = {}
  for (const league of leagues) {
    if (league.status !== 'complete') continue
    const season = league.season
    const playerIds = await playerIdsForLeague(league.league_id)
    console.log(`Season ${season}: ${playerIds.size} rostered players`)
    out[season] = await teamsForSeason(season, playerIds)
    console.log(`  mapped teams for ${Object.keys(out[season]).length} players`)
  }
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`)
  console.log('Wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

import { PLAYERS_CACHE_KEY, SLEEPER_API } from './constants'
import type { PlayerSlim, PlayersMap } from './types'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface StoredPlayers {
  fetchedAt: number
  players: PlayersMap
}

function slimPlayer(raw: Record<string, unknown>): PlayerSlim | null {
  if (!raw || typeof raw !== 'object') return null
  const first = String(raw.first_name ?? '')
  const last = String(raw.last_name ?? '')
  const full =
    (raw.full_name as string) || `${first} ${last}`.trim() || 'Unknown'
  return {
    first_name: first,
    last_name: last,
    position: (raw.position as string) ?? null,
    team: (raw.team as string) ?? null,
    full_name: full,
  }
}

function readCache(): StoredPlayers | null {
  try {
    const raw = localStorage.getItem(PLAYERS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredPlayers
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(players: PlayersMap): void {
  const payload: StoredPlayers = { fetchedAt: Date.now(), players }
  try {
    localStorage.setItem(PLAYERS_CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* quota — app still works with partial data */
  }
}

/** Fetch full NFL player dump once; keep only fields we need. */
export async function loadPlayersMap(
  forceRefresh = false,
): Promise<PlayersMap> {
  if (!forceRefresh) {
    const cached = readCache()
    if (cached) return cached.players
  }

  const res = await fetch(`${SLEEPER_API}/players/nfl`)
  if (!res.ok) throw new Error(`Failed to load players (${res.status})`)
  const all = (await res.json()) as Record<string, Record<string, unknown>>
  const players: PlayersMap = {}
  for (const [id, raw] of Object.entries(all)) {
    const slim = slimPlayer(raw)
    if (slim) players[id] = slim
  }
  writeCache(players)
  return players
}

export function playerLabel(id: string, players: PlayersMap): string {
  const p = players[id]
  if (!p) return id.length < 8 ? id : 'Player'
  if (p.position) return `${p.full_name} (${p.position})`
  return p.full_name
}

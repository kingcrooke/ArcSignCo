const PROJ_BASE = 'https://api.sleeper.app/projections/nfl'

export type ProjectionsMap = Record<string, number>

interface ProjectionRow {
  player_id?: string
  stats?: {
    pts_ppr?: number
    pts_std?: number
    pts_half_ppr?: number
  }
}

/** Best-effort weekly projections; returns null on network/CORS failure. */
export async function fetchWeekProjections(
  season: string,
  week: number,
  seasonType = 'regular',
): Promise<ProjectionsMap | null> {
  const url = `${PROJ_BASE}/${season}/${week}?season_type=${seasonType}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const raw = await res.json()
    const map: ProjectionsMap = {}

    if (Array.isArray(raw)) {
      for (const row of raw as ProjectionRow[]) {
        const id = row.player_id
        if (!id) continue
        const pts =
          row.stats?.pts_ppr ??
          row.stats?.pts_half_ppr ??
          row.stats?.pts_std
        if (typeof pts === 'number' && !Number.isNaN(pts)) {
          map[id] = pts
        }
      }
      return Object.keys(map).length ? map : null
    }

    if (raw && typeof raw === 'object') {
      for (const [id, row] of Object.entries(raw as Record<string, ProjectionRow>)) {
        const stats = row.stats ?? (row as { pts_ppr?: number }).pts_ppr
        const pts =
          typeof stats === 'object'
            ? stats.pts_ppr ?? stats.pts_std
            : (row as { pts_ppr?: number }).pts_ppr
        if (typeof pts === 'number' && !Number.isNaN(pts)) {
          map[id] = pts
        }
      }
      return Object.keys(map).length ? map : null
    }

    return null
  } catch {
    return null
  }
}

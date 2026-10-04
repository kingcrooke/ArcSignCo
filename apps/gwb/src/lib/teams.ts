import type { SleeperRoster, SleeperUser, TeamInfo } from './types'

/** True when team_name is empty or only punctuation / whitespace. */
export function isGarbageTeamName(name: string | undefined | null): boolean {
  if (!name) return true
  const trimmed = name.trim()
  if (!trimmed) return true
  return !/[a-zA-Z0-9]/.test(trimmed)
}

export function getTeamName(user: SleeperUser | undefined, rosterId: number): string {
  const raw = user?.metadata?.team_name
  const trimmed = raw?.trim()
  if (trimmed && !isGarbageTeamName(trimmed)) return trimmed
  if (user?.display_name?.trim()) return user.display_name.trim()
  return `Team ${rosterId}`
}

export function buildTeamMap(
  users: SleeperUser[],
  rosters: SleeperRoster[],
): Map<number, TeamInfo> {
  const byUser = new Map(users.map((u) => [u.user_id, u]))
  const map = new Map<number, TeamInfo>()
  for (const r of rosters) {
    const user = r.owner_id ? byUser.get(r.owner_id) : undefined
    map.set(r.roster_id, {
      rosterId: r.roster_id,
      userId: r.owner_id ?? '',
      displayName: user?.display_name?.trim() ?? `Roster ${r.roster_id}`,
      teamName: getTeamName(user, r.roster_id),
    })
  }
  return map
}

export function rosterPointsFor(settings: SleeperRoster['settings']): number {
  return settings.fpts + settings.fpts_decimal / 100
}

export function rosterPointsAgainst(settings: SleeperRoster['settings']): number {
  return settings.fpts_against + settings.fpts_against_decimal / 100
}

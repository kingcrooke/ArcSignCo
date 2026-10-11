/** League-facing public names (group chat nicknames), keyed by Sleeper user_id. */
const PUBLIC_NAME_BY_USER_ID: Record<string, string> = {
  '401754707162333184': 'Danny', // Santagua
  '429321092230815744': 'Mauricio', // NutCrusher
  '427945970563559424': 'Narking', // NarkingR
  '475769424679268352': 'Kayser', // powpeazy
  '420639669546385408': 'Eric', // AltaDei
  '429316063394541568': 'Hady', // MaduRaso
  '475825464573685760': 'Steven', // hairychest
  '427930731889565696': 'Crooke', // kingCrooke
  '475828957426479104': 'Manny', // Mnny
  '427903132685574144': 'Jamil', // BigBlue01
  '475847480039174144': 'Frankie', // GetThePapers2x
  '427906596501213184': 'Matt', // SeasonUnderdogs
}

/** Sleeper user_ids for managers in the current league season. */
export const CURRENT_MANAGER_USER_IDS = new Set(Object.keys(PUBLIC_NAME_BY_USER_ID))

/** Legacy roster_id map for the 2026 league only (12 teams). */
const PUBLIC_NAME_BY_ROSTER: Record<number, string> = {
  1: 'Danny',
  2: 'Mauricio',
  3: 'Narking',
  4: 'Kayser',
  5: 'Eric',
  6: 'Hady',
  7: 'Steven',
  8: 'Crooke',
  9: 'Manny',
  10: 'Jamil',
  11: 'Frankie',
  12: 'Matt',
}

/**
 * Display name for a manager in a given season.
 * Applies chat nicknames only when user_id is a current league member.
 */
export function managerDisplayName(
  userId: string,
  seasonSleeperDisplayName: string,
): string {
  if (!userId) return seasonSleeperDisplayName
  if (CURRENT_MANAGER_USER_IDS.has(userId)) {
    return PUBLIC_NAME_BY_USER_ID[userId] ?? seasonSleeperDisplayName
  }
  return seasonSleeperDisplayName
}

/** Canonical display name for a manager in UI copy, captions, and receipts. */
export function publicManagerName(rosterId: number, fallback = ''): string {
  return PUBLIC_NAME_BY_ROSTER[rosterId] ?? fallback
}

export function managerNickname(
  rosterId: number,
  displayName: string,
  userId?: string,
): string {
  if (userId) return managerDisplayName(userId, displayName)
  return publicManagerName(rosterId, displayName)
}

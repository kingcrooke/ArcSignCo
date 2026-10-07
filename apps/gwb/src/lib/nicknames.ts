/** League-facing public names (group chat nicknames), keyed by Sleeper roster_id. */
const PUBLIC_NAME_BY_ROSTER: Record<number, string> = {
  1: 'Danny',
  2: 'Mauricio',
  3: 'Narking',
  4: 'Kayser',
  5: 'Eric',
  6: 'Hadi',
  7: 'Steven',
  8: 'Crooke',
  9: 'Manny',
  10: 'Jamil',
  11: 'Frankie',
  12: 'Matt',
}

/** Canonical display name for a manager in UI copy, captions, and receipts. */
export function publicManagerName(rosterId: number, fallback = ''): string {
  return PUBLIC_NAME_BY_ROSTER[rosterId] ?? fallback
}

export function managerNickname(rosterId: number, displayName: string): string {
  return publicManagerName(rosterId, displayName)
}

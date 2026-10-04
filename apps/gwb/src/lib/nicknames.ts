/** League-facing nicknames (group chat names), keyed by Sleeper roster_id. */
const NICKNAME_BY_ROSTER: Record<number, string> = {
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

export function managerNickname(rosterId: number, displayName: string): string {
  return NICKNAME_BY_ROSTER[rosterId] ?? displayName
}

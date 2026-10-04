const ET = 'America/New_York'

/** Parse commissioner recap timestamps; date-only values are noon Eastern. */
export function parsePostedAt(iso: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return Date.parse(`${iso}T12:00:00`)
  }
  return Date.parse(iso)
}

export function formatPostedDay(iso: string): string {
  const ms = parsePostedAt(iso)
  if (Number.isNaN(ms)) return iso
  return new Date(ms).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: ET,
  })
}

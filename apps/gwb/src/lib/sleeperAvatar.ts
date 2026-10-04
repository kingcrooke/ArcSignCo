/** Resolve Sleeper user avatar hash or full URL to a thumb URL. */
export function sleeperAvatarUrl(
  avatar: string | undefined | null,
): string | null {
  if (!avatar) return null
  const trimmed = avatar.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://sleepercdn.com/avatars/thumbs/${trimmed}`
}

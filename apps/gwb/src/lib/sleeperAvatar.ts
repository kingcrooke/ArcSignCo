/** Sleeper CDN thumb URL from the users.avatar hash field (not upload URL hashes). */
export function sleeperAvatarThumbUrl(
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

/** Primary manager photo: metadata.avatar URL as-is, else users.avatar thumb. */
export function sleeperAvatarPrimaryUrl(
  metadataAvatar: string | undefined | null,
  userAvatar: string | undefined | null,
): string | null {
  const meta = metadataAvatar?.trim()
  if (meta) return meta
  return sleeperAvatarThumbUrl(userAvatar)
}

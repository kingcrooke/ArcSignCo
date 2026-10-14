import { useEffect, useState } from 'react'
import { managerNickname } from '../lib/nicknames'
import type { TeamInfo } from '../lib/types'

export function TeamAvatar({
  team,
  size = 'md',
}: {
  team: TeamInfo | undefined
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const initials = teamInitials(team)
  const [useInitials, setUseInitials] = useState(!team?.avatarUrl)

  useEffect(() => {
    setUseInitials(!team?.avatarUrl)
  }, [team?.avatarUrl])

  if (useInitials || !team?.avatarUrl) {
    return (
      <div
        className={`${dim} flex shrink-0 items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={team.avatarUrl}
      alt=""
      referrerPolicy="no-referrer"
      className={`${dim} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`}
      onError={() => setUseInitials(true)}
    />
  )
}

function teamInitials(team: TeamInfo | undefined): string {
  const label = team
    ? managerNickname(team.rosterId, team.displayName, team.userId)
    : ''
  if (!label) return '?'
  const parts = label.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return label.slice(0, 2).toUpperCase()
}

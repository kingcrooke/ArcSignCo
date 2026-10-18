import { useEffect, useState } from 'react'
import { managerNickname } from '../lib/nicknames'
import type { TeamInfo } from '../lib/types'

type AvatarPhase = 'primary' | 'fallback' | 'initials'

function avatarPhaseForTeam(team: TeamInfo | undefined): AvatarPhase {
  if (team?.avatarUrl) return 'primary'
  if (team?.avatarThumbUrl) return 'fallback'
  return 'initials'
}

function srcForPhase(team: TeamInfo, phase: AvatarPhase): string | null {
  if (phase === 'primary') return team.avatarUrl
  if (phase === 'fallback') return team.avatarThumbUrl
  return null
}

export function TeamAvatar({
  team,
  size = 'md',
}: {
  team: TeamInfo | undefined
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const initials = teamInitials(team)
  const [phase, setPhase] = useState<AvatarPhase>(() => avatarPhaseForTeam(team))

  useEffect(() => {
    setPhase(avatarPhaseForTeam(team))
  }, [team?.avatarUrl, team?.avatarThumbUrl])

  const src = team ? srcForPhase(team, phase) : null

  if (phase === 'initials' || !src) {
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
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className={`${dim} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`}
      onError={() => {
        if (phase === 'primary' && team?.avatarThumbUrl) {
          setPhase('fallback')
          return
        }
        setPhase('initials')
      }}
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

import { useEffect, useState } from 'react'
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
      className={`${dim} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`}
      onError={() => setUseInitials(true)}
      onLoad={(e) => {
        const img = e.currentTarget
        if (img.naturalWidth < 2 || img.naturalHeight < 2) {
          setUseInitials(true)
          return
        }
        if (imageLooksBlankOrDark(img)) {
          setUseInitials(true)
        }
      }}
    />
  )
}

/** Detect empty or near-solid-dark Sleeper thumbs that read as a black circle. */
function imageLooksBlankOrDark(img: HTMLImageElement): boolean {
  try {
    const size = 8
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false
    ctx.drawImage(img, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)
    let sum = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      sum += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    const avg = sum / (data.length / 4)
    return avg < 0.08
  } catch {
    return false
  }
}

function teamInitials(team: TeamInfo | undefined): string {
  if (!team?.teamName) return '?'
  const parts = team.teamName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return team.teamName.slice(0, 2).toUpperCase()
}

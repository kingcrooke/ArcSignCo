import { describe, expect, it } from 'vitest'
import {
  sleeperAvatarPrimaryUrl,
  sleeperAvatarThumbUrl,
} from './sleeperAvatar'

describe('sleeperAvatar', () => {
  it('uses metadata upload URL as primary', () => {
    const upload =
      'https://sleepercdn.com/uploads/d1bb3ecbd53dcfb4e42f102db66b1ee0.jpg'
    expect(sleeperAvatarPrimaryUrl(upload, '4ba072e6248388d12d79bfee723b9155')).toBe(
      upload,
    )
  })

  it('falls back to users.avatar thumb hash', () => {
    expect(sleeperAvatarPrimaryUrl(null, 'ac57817f2ffbde2801cceef3147500ff')).toBe(
      'https://sleepercdn.com/avatars/thumbs/ac57817f2ffbde2801cceef3147500ff',
    )
    expect(sleeperAvatarThumbUrl('ac57817f2ffbde2801cceef3147500ff')).toBe(
      'https://sleepercdn.com/avatars/thumbs/ac57817f2ffbde2801cceef3147500ff',
    )
  })
})

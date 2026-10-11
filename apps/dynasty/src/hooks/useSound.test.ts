import { describe, expect, it } from 'vitest'
import { audioSrc } from './useSound'

const FILES = ['impact-loop.mp3', 'volatile-loop.mp3', 'click.mp3']

describe('audioSrc', () => {
  it('puts a slash between audio and every file for both base shapes', () => {
    for (const base of ['/dynasty-1581d86a/', '/dynasty-1581d86a', '/']) {
      for (const file of FILES) {
        const url = audioSrc(file, base)
        expect(url).toBe(`${base.endsWith('/') ? base : `${base}/`}audio/${file}`)
        expect(url.includes(`audio${file}`)).toBe(false)
      }
    }
  })
})

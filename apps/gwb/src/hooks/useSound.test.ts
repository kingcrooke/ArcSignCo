import { describe, expect, it } from 'vitest'
import { audioSrc } from './useSound'

const FILES = [
  'impact-loop.mp3',
  'volatile-loop.mp3',
  'sneaky-loop.mp3',
  'monkeys-loop.mp3',
  'click.mp3',
  'buzzer.mp3',
]

describe('audioSrc', () => {
  it('puts a slash between audio and every file for both base shapes', () => {
    for (const base of ['/gwb-fe006a16/', '/gwb-fe006a16', '/']) {
      for (const file of FILES) {
        const url = audioSrc(file, base)
        expect(url).toBe(`${base.endsWith('/') ? base : `${base}/`}audio/${file}`)
        expect(url.includes(`audio${file}`)).toBe(false)
      }
    }
  })
})

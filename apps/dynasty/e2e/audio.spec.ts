import { expect, test } from '@playwright/test'

const TAB_LOOP_FILES = {
  standings: 'volatile-loop.mp3',
  live: 'sneaky-loop.mp3',
  drafts: 'monkeys-loop.mp3',
  gallery: 'volatile-loop.mp3',
  waiver: 'impact-loop.mp3',
  bestgames: 'sneaky-loop.mp3',
  trades: 'monkeys-loop.mp3',
  awards: 'volatile-loop.mp3',
  managers: 'sneaky-loop.mp3',
} as const

const UNIQUE_LOOPS = [...new Set(Object.values(TAB_LOOP_FILES))]

test.describe('tab audio beds', () => {
  test('loops are reachable and sound unlocks on tap', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Dynasty of Champions/i }),
    ).toBeVisible({ timeout: 90_000 })

    const soundBtn = page.getByRole('button', { name: /Sound (on|off)/i })
    await expect(soundBtn).toBeVisible()

    const result = await page.evaluate(async (files) => {
      const root = new URL('.', window.location.href).href
      const checks: Record<string, number> = {}
      for (const file of Object.values(files)) {
        const res = await fetch(`${root}audio/${file}`, { cache: 'no-store' })
        checks[file] = res.status
      }

      const audio = new Audio()
      audio.loop = true
      audio.volume = 0.35
      audio.src = `${root}audio/${files.standings}`
      let unlocked = false
      try {
        await audio.play()
        unlocked = !audio.paused
      } catch {
        unlocked = false
      }
      return { checks, unlocked, paused: audio.paused }
    }, TAB_LOOP_FILES)

    for (const [file, status] of Object.entries(result.checks)) {
      expect(status, file).toBe(200)
    }

    await page.mouse.click(400, 400)
    const afterTap = await page.evaluate(async (files) => {
      const root = new URL('.', window.location.href).href
      const audio = new Audio()
      audio.loop = true
      audio.volume = 0.35
      audio.src = `${root}audio/${files.live}`
      await audio.play()
      return {
        paused: audio.paused,
        currentSrc: audio.currentSrc.includes('sneaky-loop'),
      }
    }, TAB_LOOP_FILES)

    expect(afterTap.currentSrc).toBe(true)
    expect(afterTap.paused).toBe(false)
  })

  test('switching tabs requests a different loop file', async ({ page }) => {
    await page.goto('/')
    await page.mouse.click(300, 300)
    const heard: string[] = []
    page.on('request', (req) => {
      const u = req.url()
      if (u.includes('/audio/') && u.endsWith('-loop.mp3')) {
        heard.push(u.split('/').pop() ?? '')
      }
    })
    await page.getByRole('button', { name: 'Live', exact: true }).click()
    await page.getByRole('button', { name: 'Drafts', exact: true }).click()
    await page.waitForTimeout(800)
    expect(heard.some((f) => f === 'sneaky-loop.mp3')).toBe(true)
    expect(heard.some((f) => f === 'monkeys-loop.mp3')).toBe(true)
  })

  test('macLeod loop assets exist', async ({ page }) => {
    await page.goto('/')
    const root = new URL('.', page.url()).href
    for (const file of UNIQUE_LOOPS) {
      const res = await page.request.get(`${root}audio/${file}`)
      expect(res.status(), file).toBe(200)
    }
  })
})

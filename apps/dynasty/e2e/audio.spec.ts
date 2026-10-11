import { expect, test } from '@playwright/test'

const TAB_LOOP_FILES = {
  standings: 'loop-standings.mp3',
  live: 'loop-live.mp3',
  drafts: 'loop-drafts.mp3',
  gallery: 'loop-gallery.mp3',
  waiver: 'loop-waiver.mp3',
  bestgames: 'loop-bestgames.mp3',
  trades: 'loop-trades.mp3',
  awards: 'loop-awards.mp3',
  managers: 'loop-managers.mp3',
} as const

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
      audio.volume = 0.55
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
      audio.volume = 0.55
      audio.src = `${root}audio/${files.live}`
      await audio.play()
      return { paused: audio.paused, currentSrc: audio.currentSrc.includes('loop-live') }
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
      if (u.includes('/audio/loop-') && u.endsWith('.mp3')) {
        heard.push(u.split('/').pop() ?? '')
      }
    })
    await page.getByRole('button', { name: 'Live', exact: true }).click()
    await page.getByRole('button', { name: 'Drafts', exact: true }).click()
    await page.waitForTimeout(800)
    expect(heard.some((f) => f.includes('live'))).toBe(true)
    expect(heard.some((f) => f.includes('drafts'))).toBe(true)
  })
})

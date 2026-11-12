import { expect, test } from '@playwright/test'

const LONG_TITLE =
  'A-Lamb-e que tengo hambre 162.96 - MahomiesRidley4MooreJeffe 147.90'

test.describe('graphics thumbnail titles wrap', () => {
  for (const size of [
    { width: 360, height: 800 },
    { width: 1280, height: 900 },
  ]) {
    test(`week 1 caption is fully visible at ${size.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(size)
      await page.goto('/?season=2026&tab=gallery&week=1', {
        waitUntil: 'domcontentloaded',
      })
      await expect(
        page.getByRole('heading', { name: /Dynasty of Champions/i }),
      ).toBeVisible({ timeout: 90_000 })
      await expect(
        page.getByRole('heading', { name: /Week 1 graphics/i }),
      ).toBeVisible({ timeout: 90_000 })

      const caption = page
        .locator('#week-graphics-panel p')
        .filter({ hasText: LONG_TITLE })
        .first()
      await expect(caption).toBeVisible({ timeout: 90_000 })
      await caption.scrollIntoViewIfNeeded()

      const metrics = await caption.evaluate((el) => {
        const style = getComputedStyle(el)
        const doc = document.documentElement
        const range = document.createRange()
        range.selectNodeContents(el)
        const rects = [...range.getClientRects()]
        const box = el.getBoundingClientRect()
        const last = rects[rects.length - 1]
        const textFits =
          rects.length > 0 &&
          last.right <= box.right + 1 &&
          last.bottom <= box.bottom + 1 &&
          rects.every((r) => r.left >= box.left - 1)
        return {
          whiteSpace: style.whiteSpace,
          textOverflow: style.textOverflow,
          overflowWrap: style.overflowWrap,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          pageOverflow: doc.scrollWidth - doc.clientWidth,
          textFits,
          lineCount: rects.length,
        }
      })

      expect(metrics.whiteSpace).not.toBe('nowrap')
      expect(metrics.textOverflow).not.toBe('ellipsis')
      expect(metrics.overflowWrap).toBe('break-word')
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
      expect(metrics.textFits).toBe(true)
      expect(metrics.pageOverflow).toBeLessThanOrEqual(1)
      if (size.width === 360) {
        expect(metrics.lineCount).toBeGreaterThan(1)
        expect(metrics.clientHeight).toBeGreaterThan(24)
      }
    })
  }
})

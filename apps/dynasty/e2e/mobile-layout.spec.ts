import { expect, test } from '@playwright/test'

const MOBILE_TABS: { id: string; heading: RegExp }[] = [
  { id: 'standings', heading: /Standings/i },
  { id: 'live', heading: /scoreboard/i },
  { id: 'drafts', heading: /^Drafts$/i },
  { id: 'gallery', heading: /graphics/i },
  { id: 'waiver', heading: /Waiver Wire Champion/i },
  { id: 'bestgames', heading: /Best Games/i },
  { id: 'trades', heading: /Trade log/i },
  { id: 'awards', heading: /Weekly awards/i },
  { id: 'managers', heading: /^Managers$/i },
]

async function waitForShell(page: import('@playwright/test').Page) {
  await expect(
    page.getByRole('heading', { name: /Dynasty of Champions/i }),
  ).toBeVisible({ timeout: 90_000 })
}

test.describe('picker alignment', () => {
  for (const size of [
    { width: 360, height: 800 },
    { width: 1280, height: 900 },
  ]) {
    test(`season and week selects align at ${size.width}px`, async ({ page }) => {
      await page.setViewportSize(size)
      await page.goto('/?tab=standings', { waitUntil: 'domcontentloaded' })
      await waitForShell(page)
      const pickers = page.locator('[data-testid="dynasty-pickers"] select')
      await expect(pickers).toHaveCount(2, { timeout: 90_000 })

      const delta = await page.evaluate(() => {
        const root = document.querySelector('[data-testid="dynasty-pickers"]')
        if (!root) return null
        const selects = [...root.querySelectorAll('select')]
        if (selects.length < 2) return null
        const a = selects[0].getBoundingClientRect()
        const b = selects[1].getBoundingClientRect()
        return {
          top: Math.abs(a.top - b.top),
          bottom: Math.abs(a.bottom - b.bottom),
        }
      })

      expect(delta).not.toBeNull()
      expect(delta!.top).toBeLessThan(0.5)
      expect(delta!.bottom).toBeLessThan(0.5)
    })
  }
})

test.describe('mobile layout 360px', () => {
  test.use({ viewport: { width: 360, height: 800 } })

  for (const { id, heading } of MOBILE_TABS) {
    test(`tab ${id} has no horizontal overflow and visible section tabs`, async ({
      page,
    }) => {
      await page.goto(`/?tab=${id}`, { waitUntil: 'domcontentloaded' })
      await expect(
        page.getByRole('heading', { name: /Dynasty of Champions/i }),
      ).toBeVisible({ timeout: 90_000 })
      await expect(page.getByRole('heading', { name: heading })).toBeVisible({
        timeout: 90_000,
      })

      const layout = await page.evaluate(() => {
        const doc = document.documentElement
        const noPageOverflow = doc.scrollWidth <= doc.clientWidth + 1
        const nav = document.querySelector('nav.dyn-section-tabs')
        if (!nav) {
          return { noPageOverflow, allTabsVisible: false }
        }
        const buttons = [...nav.querySelectorAll('button')]
        const navRect = nav.getBoundingClientRect()
        const allTabsVisible = buttons.every((b) => {
          const r = b.getBoundingClientRect()
          return (
            r.width > 0 &&
            r.height > 0 &&
            r.left >= navRect.left - 2 &&
            r.right <= navRect.right + 2
          )
        })
        return { noPageOverflow, allTabsVisible }
      })

      expect(layout.noPageOverflow).toBe(true)
      expect(layout.allTabsVisible).toBe(true)
    })
  }
})

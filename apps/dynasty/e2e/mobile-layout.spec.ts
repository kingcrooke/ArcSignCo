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

import { expect, test } from '@playwright/test'

test('loads Dynasty of Champions shell', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /Dynasty of Champions/i }),
  ).toBeVisible({ timeout: 90_000 })
  await expect(page.getByRole('button', { name: 'Standings', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Live', exact: true })).toBeVisible()
})

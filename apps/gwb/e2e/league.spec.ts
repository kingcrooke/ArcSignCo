import { expect, test } from '@playwright/test'

test('loads real GWB league data and core sections', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /GWB League/i })).toBeVisible({
    timeout: 90_000,
  })
  await expect(page.locator('table').getByText('Hairy Chest').first()).toBeVisible({
    timeout: 90_000,
  })
  await expect(page.getByRole('button', { name: 'IG', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Power', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Live' }).click()
  await expect(page.locator('#live-scoreboard-panel')).toBeVisible({
    timeout: 90_000,
  })

  await page.getByRole('button', { name: 'Graphics' }).click()
  await expect(page.getByRole('heading', { name: /Week \d+ graphics/i })).toBeVisible()

  await page.getByRole('button', { name: 'Recaps' }).click()
  await expect(page.getByRole('heading', { name: /Commissioner's recaps/i })).toBeVisible()
  await expect(page.getByText(/Week \d+ matchup recaps/)).toBeVisible()

  await page.getByRole('button', { name: 'Mulligans' }).click()
  await expect(page.locator('#mulligans-section')).toBeVisible()

  await page.getByRole('button', { name: /Zone$/ }).click()
  await expect(page.locator('#frankie-zone-section')).toBeVisible()
  await expect(page.getByRole('heading', { name: /THE .* ZONE/ })).toBeVisible()

  await page.getByRole('button', { name: 'Waiver Wire Champion' }).click()
  await expect(page.locator('#waiver-wire-panel')).toBeVisible()
  await expect(page.getByText('Waiver Efficiency Score')).toBeVisible()
  await expect(page).toHaveURL(/tab=waiver/)

  await page.goto('/?tab=waiver&week=3')
  await expect(page.locator('#waiver-wire-panel')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Narking' })).toBeVisible()

  await page.getByRole('button', { name: 'Graphics' }).click()
  await page.getByLabel('NFL Week').selectOption('1')
  await expect(page.getByRole('heading', { name: 'Results', exact: true })).toBeVisible()
})

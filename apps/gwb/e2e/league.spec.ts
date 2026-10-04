import { expect, test } from '@playwright/test'

test('loads real GWB league data and core sections', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /GWB League/i })).toBeVisible({
    timeout: 90_000,
  })
  await expect(page.getByRole('cell', { name: 'Hairy Chest' })).toBeVisible({
    timeout: 90_000,
  })
  await expect(page.getByRole('button', { name: 'IG' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Mulligans' }).click()
  await expect(page.locator('#mulligans-section')).toBeVisible()

  await page.getByRole('button', { name: 'Power' }).click()
  await expect(page.getByText('How power score works')).toBeVisible()

  await page.getByRole('button', { name: 'Recaps' }).click()
  await expect(page.getByRole('heading', { name: /Commissioner's recaps/i })).toBeVisible()
  await expect(page.getByText(/Week \d+ matchup recaps/)).toBeVisible()

  await page.getByRole('button', { name: 'Graphics' }).click()
  await expect(page.getByRole('heading', { name: /Week \d+ graphics/i })).toBeVisible()
  await page.getByLabel('NFL Week').selectOption('1')
  await expect(page.getByRole('heading', { name: 'Results', exact: true })).toBeVisible()
})

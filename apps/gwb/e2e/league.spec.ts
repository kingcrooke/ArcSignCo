import { expect, test } from '@playwright/test'

test('loads real GWB league data and core sections', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /GWB League/i })).toBeVisible({
    timeout: 90_000,
  })
  await expect(page.getByRole('cell', { name: 'Hairy Chest' })).toBeVisible({
    timeout: 90_000,
  })

  await page.getByRole('button', { name: 'Power' }).click()
  await expect(page.getByText('How power score works')).toBeVisible()

  await page.getByRole('button', { name: 'Recaps' }).click()
  await expect(page.getByText(/Week \d+ recaps/)).toBeVisible()

  await page.getByRole('button', { name: 'IG' }).click()
  await expect(page.getByText('Instagram graphics')).toBeVisible()
})

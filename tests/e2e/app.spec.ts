import { expect, test } from '@playwright/test'

test.describe('App shell', () => {
  test('loads the landing page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /ALU Visualizer/i })).toBeVisible()
    await expect(
      page.getByText(/Phase 1 will focus on the pure simulation core/i),
    ).toBeVisible()
  })
})

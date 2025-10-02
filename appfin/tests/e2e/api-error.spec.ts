import { test, expect } from '@playwright/test'

test('shows friendly message when API fails', async ({ page }) => {
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'test-user',
          name: 'Playwright User',
          email: 'playwright@example.com',
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }),
    })
  })

  await page.route('**/api/budgets', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal error' }),
    })
  })

  await page.goto('/budgets')

  await expect(page.getByText('Erro ao carregar orçamentos')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
})

import { test, expect } from '@playwright/test'

test('navigates to budgets page and renders data', async ({ page }) => {
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
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'budget-1',
          name: 'Teste de Navegação',
          description: 'Cobertura Playwright',
          amount: 1000,
          spent: 250,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          project: { id: 'project-1', name: 'Projeto XPTO' },
          approvals: [],
        },
      ]),
    })
  })

  await page.goto('/budgets')

  await expect(
    page.getByRole('heading', { name: 'Orçamentos', level: 1 })
  ).toBeVisible()
  await expect(page.getByText('Teste de Navegação')).toBeVisible()
  await expect(page.getByText('Projeto XPTO')).toBeVisible()
})

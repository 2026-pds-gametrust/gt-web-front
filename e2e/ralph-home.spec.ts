import { test, expect } from '@playwright/test';
import { installDiscoveryMocks } from './ralph/mock-discovery';

test.describe('ralph home', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('shows hero, skeleton resolves to rails, and retry on feed error', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Tecnologia usada/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Em destaque agora/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Começar a vender' })).toBeVisible();
  });

  test('feed error shows banner with retry instead of leaving home', async ({ page }) => {
    await page.route(/\/search(\?|$)/, async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/');
    await expect(page.getByRole('alert')).toContainText(/vitrine/i, { timeout: 10000 });
    await expect(page.getByRole('button', { name: /Tentar de novo/i })).toBeVisible();
    expect(page.url()).toMatch(/\/$/);
  });
});

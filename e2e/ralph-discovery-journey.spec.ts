import { test, expect } from '@playwright/test';
import { installDiscoveryMocks } from './ralph/mock-discovery';

test.describe('ralph discovery journey', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('home search opens listing detail', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Tecnologia usada/i })).toBeVisible();

    await page.getByRole('search').locator('input').first().fill('rtx 4060');
    await page.getByRole('button', { name: /Buscar/i }).first().click();
    await expect(page).toHaveURL(/\/buscar\?q=/);

    await page.getByRole('link', { name: /Oferta: ASUS Dual RTX 4060/i }).click();
    await expect(page).toHaveURL(/\/anuncio\/lst-4060-verified/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ASUS Dual RTX 4060');
  });
});

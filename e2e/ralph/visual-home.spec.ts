import { test, expect } from '@playwright/test';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph visual — home', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('home hero and rails baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Tecnologia usada/i })).toBeVisible();
    await expect(page.locator('.home-search-panel')).toHaveScreenshot('home-hero.png');
  });
});

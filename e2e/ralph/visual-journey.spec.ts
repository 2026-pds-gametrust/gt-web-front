import { test, expect } from '@playwright/test';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph visual — discovery journey', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('listing page header baseline after journey', async ({ page }) => {
    await page.goto('/buscar?q=rtx');
    await page.getByRole('link', { name: /Oferta: ASUS Dual RTX 4060/i }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main')).toHaveScreenshot('listing-from-journey.png');
  });
});

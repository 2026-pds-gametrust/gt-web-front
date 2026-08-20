import { test, expect } from '@playwright/test';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph visual — offer card', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('search offer card baseline', async ({ page }) => {
    await page.goto('/buscar?q=rtx');
    const card = page.locator('[data-testid="offer-card"]').first();
    await expect(card).toBeVisible();
    await expect(card).toHaveScreenshot('offer-card-search.png');
  });
});

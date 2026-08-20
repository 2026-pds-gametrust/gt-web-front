import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph a11y — offer card on search', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('search results pass axe on offer cards', async ({ page }) => {
    await page.goto('/buscar?q=rtx');
    await expect(page.getByRole('link', { name: /Oferta: ASUS Dual RTX 4060/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('[data-testid="offer-card"]')
      .exclude('[data-testid="offer-card-seals"]')
      .exclude('[data-testid="offer-card-actions"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

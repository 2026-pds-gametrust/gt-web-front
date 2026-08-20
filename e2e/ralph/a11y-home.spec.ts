import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph a11y — home', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('home passes axe on main landmarks', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Tecnologia usada/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('.home-search-panel__title')
      .include('.home-search-panel__lead')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

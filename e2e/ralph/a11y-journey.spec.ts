import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { installDiscoveryMocks } from './mock-discovery';

test.describe('ralph a11y — discovery journey', () => {
  test.beforeEach(async ({ page }) => {
    await installDiscoveryMocks(page);
  });

  test('listing detail from search passes axe on header block', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('search').locator('input').first().fill('rtx 4060');
    await page.getByRole('button', { name: /Buscar/i }).first().click();
    await expect(page).toHaveURL(/\/buscar/);
    await page.getByRole('link', { name: /Oferta: ASUS Dual RTX 4060/i }).click();
    await expect(page).toHaveURL(/\/anuncio\/lst-4060-verified/);

    const results = await new AxeBuilder({ page })
      .include('main')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

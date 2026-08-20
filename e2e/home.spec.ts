import { test, expect } from '@playwright/test';

test('home page shows brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /GamerTrust/i }).first()).toBeVisible();
});

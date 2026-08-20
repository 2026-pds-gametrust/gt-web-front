import { test, expect, type Page } from '@playwright/test';

/**
 * Seller listing management against a real gt-backend.
 *
 * Seller listing management against a real gt-backend.
 * Uses GET /listings/mine — the authenticated seller inventory endpoint.
 * Seed with `scripts/e2e/seed-journey.ts` in gt-backend.
 */
const SELLER = {
  email: process.env.E2E_SELLER_EMAIL ?? process.env.E2E_EMAIL,
  password: process.env.E2E_SELLER_PASSWORD ?? process.env.E2E_PASSWORD,
};

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

test.describe('my listings', () => {
  test.skip(!SELLER.email || !SELLER.password, 'Set E2E_EMAIL / E2E_PASSWORD');

  test('is reachable from the navigation and lists only the actor offers', async ({ page }) => {
    await signIn(page, SELLER);

    await page.getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Meus anúncios' })
      .click();
    await expect(page).toHaveURL(/\/meus-anuncios/);
    await expect(page.getByRole('heading', { name: 'Meus anúncios' })).toBeVisible();

    // Either the seller has offers, or the empty state points at the wizard.
    const offers = page.getByRole('list', { name: 'Seus anúncios' });
    const empty = page.getByRole('heading', { name: 'Você ainda não tem anúncios' });
    await expect(offers.or(empty).first()).toBeVisible({ timeout: 15_000 });
  });

  test('an anonymous visitor is sent to the login screen', async ({ page }) => {
    await page.goto('/meus-anuncios');
    await expect(page).toHaveURL(/\/entrar/);
  });
});

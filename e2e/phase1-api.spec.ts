import { test, expect, type Page } from '@playwright/test';

/**
 * These run against a real gt-backend. Discovery is public, so those specs
 * always run; anything behind a session needs an account seeded in that
 * backend, provided via env — otherwise the spec is skipped rather than
 * failing for a reason that has nothing to do with the frontend.
 */
const MEMBER = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
};

const BACKOFFICE = {
  email: process.env.E2E_BACKOFFICE_EMAIL,
  password: process.env.E2E_BACKOFFICE_PASSWORD,
};

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

test.describe('discovery (public)', () => {
  test('home renders and search navigates', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
    await page.getByRole('search').locator('input').first().fill('RTX');
    await page.getByRole('button', { name: /Buscar/i }).first().click();
    await expect(page).toHaveURL(/\/buscar/);
  });

  test('anonymous visitor is sent to the login screen', async ({ page }) => {
    await page.goto('/favoritos');
    await expect(page).toHaveURL(/\/entrar/);
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});

test.describe('authenticated', () => {
  test.skip(!MEMBER.email || !MEMBER.password, 'Set E2E_EMAIL / E2E_PASSWORD');

  test('favorites page loads for the signed-in actor', async ({ page }) => {
    await signIn(page, MEMBER);
    await page.goto('/favoritos');
    await expect(page.getByRole('heading', { name: 'Favoritos' })).toBeVisible();
  });

  test('moderation is closed to a member without the backoffice group', async ({ page }) => {
    await signIn(page, MEMBER);
    await page.goto('/moderacao');
    await expect(page.getByRole('heading', { name: 'Sem permissão' })).toBeVisible();
  });
});

test.describe('backoffice', () => {
  test.skip(
    !BACKOFFICE.email || !BACKOFFICE.password,
    'Set E2E_BACKOFFICE_EMAIL / E2E_BACKOFFICE_PASSWORD',
  );

  test('moderation queue is reachable', async ({ page }) => {
    await signIn(page, BACKOFFICE);
    await page.goto('/moderacao');
    await expect(page.getByRole('heading', { name: 'Moderação' })).toBeVisible();
  });
});

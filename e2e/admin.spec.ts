import { test, expect, type Page } from '@playwright/test';

/**
 * Backoffice screens against a real gt-backend. Until these existed, catalog and user
 * administration could only be driven with curl.
 *
 * Seed with `scripts/e2e/seed-journey.ts` in gt-backend and export what it prints.
 */
const BACKOFFICE = {
  email: process.env.E2E_BACKOFFICE_EMAIL,
  password: process.env.E2E_BACKOFFICE_PASSWORD,
};

const MEMBER = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
};

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

test.describe('catalog admin', () => {
  test.skip(
    !BACKOFFICE.email || !BACKOFFICE.password,
    'Set E2E_BACKOFFICE_EMAIL / E2E_BACKOFFICE_PASSWORD',
  );

  test('creates a category and it shows up in the list', async ({ page }) => {
    await signIn(page, BACKOFFICE);
    await page.goto('/admin/catalogo');
    await expect(page.getByRole('heading', { name: 'Catálogo' })).toBeVisible();

    const unique = `E2E Cat ${Date.now()}`;
    await page.locator('#tax-name').fill(unique);
    await page.locator('#tax-synonyms').fill(`syn${Date.now()}`);
    await page.getByRole('button', { name: 'Criar' }).click();

    // The row only appears after POST /categories succeeded and the list reloaded.
    await expect(page.getByRole('list', { name: 'Categorias' }).getByText(unique)).toBeVisible({
      timeout: 20_000,
    });
  });

  test('creates a product under an existing category', async ({ page }) => {
    await signIn(page, BACKOFFICE);
    await page.goto('/admin/catalogo');
    await page.getByRole('button', { name: 'Produtos' }).click();

    const categorySelect = page.locator('#prod-category');
    await expect
      .poll(() => categorySelect.locator('option').count(), { timeout: 15_000 })
      .toBeGreaterThan(1);
    await categorySelect.selectOption({ index: 1 });

    const model = `RTX ${Date.now()}`;
    await page.locator('#prod-brand').fill('NVIDIA');
    await page.locator('#prod-model').fill(model);
    await page.getByRole('button', { name: 'Criar' }).click();

    await expect(page.getByRole('list', { name: 'Produtos' }).getByText(model)).toBeVisible({
      timeout: 20_000,
    });
  });

  test('is closed to a member without the backoffice group', async ({ page }) => {
    test.skip(!MEMBER.email || !MEMBER.password, 'Set E2E_EMAIL / E2E_PASSWORD');
    await signIn(page, MEMBER);
    await page.goto('/admin/catalogo');
    await expect(page.getByRole('heading', { name: 'Sem permissão' })).toBeVisible();
  });
});

test.describe('users admin', () => {
  test.skip(
    !BACKOFFICE.email || !BACKOFFICE.password,
    'Set E2E_BACKOFFICE_EMAIL / E2E_BACKOFFICE_PASSWORD',
  );

  test('lists users for an operator', async ({ page }) => {
    await signIn(page, BACKOFFICE);
    await page.goto('/admin/usuarios');
    await expect(page.getByRole('heading', { name: 'Usuários' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Usuários' })).toBeVisible({ timeout: 20_000 });
  });

  test('a backoffice account cannot change groups', async ({ page }) => {
    await signIn(page, BACKOFFICE);
    await page.goto('/admin/usuarios');
    // PUT /users/{id}/groups is ADMIN only, so the control is not offered here.
    await expect(page.getByText('Sua conta não está no grupo admin')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Alterar grupos' })).toHaveCount(0);
  });
});

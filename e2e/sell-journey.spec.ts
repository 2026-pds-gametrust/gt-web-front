import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, type Page } from '@playwright/test';

/**
 * Sell wizard end to end against a real gt-backend.
 *
 * The deepest write path in the product: it uploads media through the four-step grant
 * flow, creates a listing and submits it for verification, which on the backend fans out
 * to a verification case over SNS/SQS. Seed with `scripts/e2e/seed-journey.ts` in
 * gt-backend and export the variables it prints.
 */
const MEMBER = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
};

// The project is ESM: no __dirname here.
const here = path.dirname(fileURLToPath(import.meta.url));
const PHOTO = path.join(here, 'fixtures/listing-photo.jpg');
const VIDEO = path.join(here, 'fixtures/listing-video.mp4');

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

test.describe('sell wizard', () => {
  test.skip(!MEMBER.email || !MEMBER.password, 'Set E2E_EMAIL / E2E_PASSWORD');

  test('a member can walk the wizard and submit a listing for review', async ({ page }) => {
    // Two real media uploads, each waiting on backend processing off SQS.
    test.setTimeout(180_000);

    const listingCalls: { status: number; body: string }[] = [];
    page.on('response', async (response) => {
      const url = response.url();
      // Only backend traffic: the Vite dev server also serves a module named listings-api.
      if (!url.includes('localhost:3000') || !url.includes('/listings')) return;
      let body = '';
      try {
        body = (await response.text()).slice(0, 200);
      } catch {
        // body already consumed
      }
      listingCalls.push({ status: response.status(), body });
    });

    await signIn(page, MEMBER);
    await page.goto('/vender');

    // step 1 — identify: the product list comes from the backend catalog
    await expect(page.getByRole('heading', { name: 'Identificar o produto' })).toBeVisible();
    const productSelect = page.locator('#sell-product');
    // The list arrives from GET /products after mount, so the select starts with just
    // the placeholder — wait for the catalog instead of reading it straight away.
    await expect
      .poll(() => productSelect.locator('option').count(), { timeout: 10_000 })
      .toBeGreaterThan(1);
    await productSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continuar' }).click();

    // step 2 — describe
    await expect(page.getByRole('heading', { name: 'Descrever a unidade' })).toBeVisible();
    await page.locator('#sell-defects').fill('risco cosmético na tampa');
    await page.locator('#sell-accessories').fill('caixa, cabo');
    await page.getByRole('button', { name: 'Continuar' }).click();

    // step 3 — media: each upload only resolves once the asset reaches READY, which on
    // the backend means the media.asset.uploaded event was consumed off SQS.
    await expect(page.getByRole('heading', { name: 'Fotos e vídeo' })).toBeVisible();
    const continueMedia = page.getByRole('button', { name: 'Continuar' });
    await expect(continueMedia).toBeDisabled();

    await page.locator('#sell-photo').setInputFiles(PHOTO);
    await expect(
      page.getByText('Foto 1 pronta'),
      async () => `erro na tela: ${(await page.locator('[role="alert"]').allTextContents()).join(' | ')}`,
    ).toBeVisible({ timeout: 60_000 });

    await page.locator('#sell-video').setInputFiles(VIDEO);
    await expect(page.getByText('Vídeo pronto')).toBeVisible({ timeout: 45_000 });

    // Still blocked until a shipping mode is chosen.
    await expect(continueMedia).toBeDisabled();
    await page.getByRole('checkbox', { name: 'Retirada em mãos' }).check();
    await expect(continueMedia).toBeEnabled();
    await continueMedia.click();

    // step 4 — price
    await expect(page.getByRole('heading', { name: 'Definir preço' })).toBeVisible();
    await page.locator('#sell-price').fill('3200');
    await page.getByRole('button', { name: 'Continuar' }).click();

    // step 5 — evidence checklist
    await expect(page.getByRole('heading', { name: 'Checklist de evidências' })).toBeVisible();
    const checkboxes = page.locator('.checkbox-list input[type="checkbox"]');
    const total = await checkboxes.count();
    for (let i = 0; i < total; i += 1) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: 'Continuar' }).click();

    // step 6 — review and submit
    await expect(page.getByRole('heading', { name: 'Revisar e enviar' })).toBeVisible();
    await page.getByRole('button', { name: 'Enviar para revisão' }).click();

    await expect(
      page.getByRole('heading', { name: 'Anúncio enviado para revisão' }),
      `chamadas a /listings: ${JSON.stringify(listingCalls)}`,
    ).toBeVisible({ timeout: 30_000 });

    // POST /listings must have been accepted, not merely attempted.
    expect(listingCalls.some((call) => call.status === 201)).toBe(true);
  });

  test('the media step blocks instead of failing at submit', async ({ page }) => {
    await signIn(page, MEMBER);
    await page.goto('/vender');

    const productSelect = page.locator('#sell-product');
    await expect
      .poll(() => productSelect.locator('option').count(), { timeout: 10_000 })
      .toBeGreaterThan(1);
    await productSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();

    // The wizard stops here rather than letting the backend answer a generic 400.
    await expect(page.getByRole('heading', { name: 'Fotos e vídeo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  });
});

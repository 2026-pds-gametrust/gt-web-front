import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

/**
 * Chat journey against real gt-backend + frontend.
 *
 * Requires:
 * - gt-backend running on localhost:3000
 * - E2E_EMAIL / E2E_PASSWORD (buyer)
 * - E2E_CHAT_LISTING_ID — published listing owned by another user
 *
 * Seed helper: gt-backend/scripts/e2e/seed-journey.ts (export listing id for chat).
 */
const MEMBER = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
};

const CHAT_LISTING_ID = process.env.E2E_CHAT_LISTING_ID ?? process.env.E2E_LISTING_ID;

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

async function fetchPublishedListingForChat(
  request: APIRequestContext,
  token: string,
): Promise<string | null> {
  if (CHAT_LISTING_ID) return CHAT_LISTING_ID;

  const meRes = await request.get('http://localhost:3000/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok()) return null;
  const me = (await meRes.json()) as { id: string };

  const listingsRes = await request.get('http://localhost:3000/listings?limit=20');
  if (!listingsRes.ok()) return null;
  const page = (await listingsRes.json()) as {
    items: Array<{ id: string; sellerId: string; status: string }>;
  };

  const candidate = page.items.find(
    (item) => item.status === 'PUBLISHED' && item.sellerId !== me.id,
  );
  return candidate?.id ?? null;
}

test.describe('listing chat (public)', () => {
  test('anonymous visitor is redirected from inbox', async ({ page }) => {
    await page.goto('/mensagens');
    await expect(page).toHaveURL(/\/entrar/);
  });
});

test.describe('listing chat (authenticated)', () => {
  test.skip(!MEMBER.email || !MEMBER.password, 'Set E2E_EMAIL / E2E_PASSWORD');

  test('buyer opens chat from listing and sends a message', async ({ page, request }) => {
    test.setTimeout(60_000);

    await signIn(page, MEMBER);

    const token = await page.evaluate(() => {
      const raw = localStorage.getItem('gametrust.session');
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as { accessToken?: string };
        return parsed.accessToken ?? null;
      } catch {
        return null;
      }
    });

    test.skip(!token, 'Session token missing after login');

    const listingId = await fetchPublishedListingForChat(request, token as string);
    test.skip(!listingId, 'Set E2E_CHAT_LISTING_ID or seed a published listing from another seller');

    await page.goto(`/anuncio/${listingId}`);
    await expect(page.getByRole('button', { name: 'Enviar mensagem' })).toBeVisible();
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page).toHaveURL(/\/mensagens\//);
    await expect(page.getByRole('link', { name: 'Ver anúncio' })).toBeVisible();
    await expect(page.getByLabel('Mensagem')).toBeVisible();

    const uniqueBody = `Olá, ainda disponível para retirada? (e2e ${Math.random().toString(36).slice(2, 8)})`;
    await page.getByLabel('Mensagem').fill(uniqueBody);
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByText(uniqueBody)).toBeVisible({ timeout: 15_000 });

    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: /Mensagens/i })
      .click();
    await expect(page).toHaveURL(/\/mensagens/);
    await expect(page.getByRole('heading', { name: 'Mensagens' })).toBeVisible();
    await expect(page.getByText(uniqueBody.slice(0, 24))).toBeVisible();
  });
});

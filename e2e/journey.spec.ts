import { test, expect, type Page } from '@playwright/test';

/**
 * Full journey against a real gt-backend: sign in, find a listing that was published
 * through the backend funnel, open it, favourite it and see it on the favourites page.
 *
 * Unlike the smoke specs, every assertion here depends on data that travelled
 * frontend -> backend -> Mongo -> search index -> frontend, so a broken link anywhere
 * in that chain fails the test. Seed it with `scripts/e2e/seed-journey.ts` in gt-backend,
 * which prints the exports this spec consumes.
 */
const MEMBER = {
  email: process.env.E2E_EMAIL,
  password: process.env.E2E_PASSWORD,
};

const LISTING_TITLE = process.env.E2E_LISTING_TITLE;
const LISTING_ID = process.env.E2E_LISTING_ID;

async function signIn(page: Page, account: { email?: string; password?: string }) {
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(account.email as string);
  await page.getByLabel('Senha').fill(account.password as string);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

test.describe('journey: discover -> listing -> favourite', () => {
  test.skip(
    !MEMBER.email || !MEMBER.password || !LISTING_TITLE || !LISTING_ID,
    'Run gt-backend scripts/e2e/seed-journey.ts and export the printed variables',
  );

  test('a published listing is searchable, viewable and favouritable', async ({ page }) => {
    await signIn(page, MEMBER);

    // Search resolves against the backend index, not fixtures.
    await page.goto(`/buscar?q=${LISTING_TITLE}`);
    const offerLink = page.getByRole('link', { name: `Oferta: ${LISTING_TITLE}` });
    await expect(offerLink).toBeVisible();

    await offerLink.click();
    await expect(page).toHaveURL(new RegExp(`/anuncio/${LISTING_ID}`));
    await expect(page.getByRole('heading', { name: LISTING_TITLE as string })).toBeVisible();

    // Favouriting writes through POST /favorites and flips the button state.
    const favourite = page.getByRole('button', { name: 'Favoritar' });
    await expect(favourite).toBeVisible();
    await favourite.click();

    const favourited = page.getByRole('button', { name: 'Remover dos favoritos' });
    await expect(favourited).toBeVisible();
    await expect(favourited).toHaveAttribute('aria-pressed', 'true');

    // The favourites page reads it back from the backend for this actor.
    await page.goto('/favoritos');
    await expect(page.getByRole('heading', { name: 'Favoritos' })).toBeVisible();
    await expect(page.getByText(LISTING_TITLE as string).first()).toBeVisible();

    // Leave the actor as we found it so re-runs start from the same state.
    await page.goto(`/anuncio/${LISTING_ID}`);
    await page.getByRole('button', { name: 'Remover dos favoritos' }).click();
    await expect(page.getByRole('button', { name: 'Favoritar' })).toBeVisible();
  });

  test('the listing survives a reload straight from its URL', async ({ page }) => {
    await page.goto(`/anuncio/${LISTING_ID}`);
    await expect(page.getByRole('heading', { name: LISTING_TITLE as string })).toBeVisible();
  });
});

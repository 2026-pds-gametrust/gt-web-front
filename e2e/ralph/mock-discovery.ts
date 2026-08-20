import type { Page } from '@playwright/test';

const SAMPLE_LISTING = {
  id: 'lst-4060-verified',
  listingId: 'lst-4060-verified',
  productId: 'prod-rtx-4060',
  categoryId: 'cat-gpu',
  sellerId: 'seller-ana',
  title: 'ASUS Dual RTX 4060 8GB — com selo',
  brand: 'ASUS',
  model: 'Dual GeForce RTX 4060 8GB',
  condition: 'LIKE_NEW',
  status: 'PUBLISHED',
  priceCents: 164900,
  currency: 'BRL',
  locationApprox: 'São Paulo, SP',
  trustScore: 72,
  sellerLevel: 'TRUSTED',
  sealTypes: ['POSSESSION', 'FUNCTIONING'],
  searchText: 'rtx 4060 asus',
  thumbnailUrl: 'https://placehold.co/400x300/png',
  sourceOccurredAt: '2026-08-01T12:00:00.000Z',
};

const PLAIN_LISTING = {
  ...SAMPLE_LISTING,
  id: 'lst-4070-plain',
  listingId: 'lst-4070-plain',
  title: 'MSI Ventus RTX 4070 12GB',
  sealTypes: [],
  trustScore: 55,
  sellerLevel: 'STANDARD',
};

const CATEGORIES = [
  {
    id: 'cat-gpu',
    slug: 'placas-de-video',
    name: 'Placas de Vídeo',
    status: 'ACTIVE',
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
  },
];

const LISTING_DETAIL = {
  id: 'lst-4060-verified',
  sellerId: 'seller-ana',
  productId: 'prod-rtx-4060',
  title: 'ASUS Dual RTX 4060 8GB — com selo',
  description: 'Placa usada com caixa.',
  condition: 'LIKE_NEW',
  priceCents: 164900,
  currency: 'BRL',
  acceptsOffers: false,
  buyNowEnabled: true,
  quantity: 1,
  status: 'PUBLISHED',
  locationApprox: 'São Paulo, SP',
  media: {
    photoUrls: ['https://placehold.co/800x600/png'],
    coverPhotoUrl: 'https://placehold.co/800x600/png',
  },
  shipping: { modes: ['SHIPPING'], freeShipping: true },
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
};

const PRODUCT = {
  id: 'prod-rtx-4060',
  brand: 'ASUS',
  model: 'Dual GeForce RTX 4060 8GB',
  categoryId: 'cat-gpu',
  status: 'ACTIVE',
};

function json(route: import('@playwright/test').Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/** Stub discovery endpoints so Ralph E2E runs without gt-backend. */
export async function installDiscoveryMocks(page: Page) {
  await page.route(/http:\/\/127\.0\.0\.1:3000\/.*/, async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method().toUpperCase();

    if (path === '/categories' && method === 'GET') {
      return json(route, CATEGORIES);
    }

    if (path === '/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const docs = q.includes('4070') ? [PLAIN_LISTING] : [SAMPLE_LISTING, PLAIN_LISTING];
      return json(route, docs);
    }

    if (path === '/listings/lst-4060-verified' && method === 'GET') {
      return json(route, LISTING_DETAIL);
    }

    if (path === '/products/prod-rtx-4060' && method === 'GET') {
      return json(route, PRODUCT);
    }

    if (path.startsWith('/seals') && method === 'GET') {
      return json(route, []);
    }

    if (path.startsWith('/trust-events') && method === 'GET') {
      return json(route, [{ id: 'te-1', sellerId: 'seller-ana', reason: 'Entregas no prazo' }]);
    }

    if (path === '/trust-scores/seller-ana' && method === 'GET') {
      return json(route, { sellerId: 'seller-ana', score: 72, updatedAt: '2026-08-01T12:00:00.000Z' });
    }

    if (path === '/seller-levels/seller-ana' && method === 'GET') {
      return json(route, { sellerId: 'seller-ana', level: 'TRUSTED' });
    }

    if (path.startsWith('/listings') && method === 'GET') {
      return json(route, { items: [LISTING_DETAIL], total: 1, limit: 20, offset: 0 });
    }

    if (path.startsWith('/auth/') || path.startsWith('/users')) {
      return json(route, {});
    }

    return json(route, []);
  });

  await page.route(/http:\/\/localhost:3000\/.*/, async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method().toUpperCase();

    if (path === '/categories' && method === 'GET') {
      return json(route, CATEGORIES);
    }

    if (path === '/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const docs = q.includes('4070') ? [PLAIN_LISTING] : [SAMPLE_LISTING, PLAIN_LISTING];
      return json(route, docs);
    }

    if (path === '/listings/lst-4060-verified' && method === 'GET') {
      return json(route, LISTING_DETAIL);
    }

    if (path === '/products/prod-rtx-4060' && method === 'GET') {
      return json(route, PRODUCT);
    }

    if (path.startsWith('/seals') && method === 'GET') {
      return json(route, []);
    }

    if (path.startsWith('/trust-events') && method === 'GET') {
      return json(route, [{ id: 'te-1', sellerId: 'seller-ana', reason: 'Entregas no prazo' }]);
    }

    if (path === '/trust-scores/seller-ana' && method === 'GET') {
      return json(route, { sellerId: 'seller-ana', score: 72, updatedAt: '2026-08-01T12:00:00.000Z' });
    }

    if (path === '/seller-levels/seller-ana' && method === 'GET') {
      return json(route, { sellerId: 'seller-ana', level: 'TRUSTED' });
    }

    if (path.startsWith('/listings') && method === 'GET') {
      return json(route, { items: [LISTING_DETAIL], total: 1, limit: 20, offset: 0 });
    }

    return json(route, []);
  });
}

export { SAMPLE_LISTING, PLAIN_LISTING };

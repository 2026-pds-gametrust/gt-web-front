import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page, Route } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const PHOTO_BYTES = fs.readFileSync(path.join(here, '../fixtures/listing-photo.jpg'));

const NOW = '2026-08-01T12:00:00.000Z';
const PHOTO_URL = 'http://localhost:3000/__media/gpu.jpg';

const CARLOS = {
  id: 'user-carlos-1',
  fullName: 'Carlos Silva',
  email: 'carlos@example.com',
  phone: '11999999999',
  cpf: '12345678901',
  birthDate: '1990-05-12',
  verified: false,
  phoneVerified: false,
  status: 'ACTIVE',
  groups: ['app-user'],
  createdAt: NOW,
};

const CAMILA = {
  ...CARLOS,
  id: 'user-camila-1',
  fullName: 'Camila Rocha',
  email: 'camila@example.com',
  groups: ['backoffice', 'admin'],
};

const SELLER_ANA = {
  ...CARLOS,
  id: 'seller-ana',
  fullName: 'Ana Souza',
  email: 'ana@example.com',
  verified: true,
};

const LUCAS = {
  ...CARLOS,
  id: 'user-lucas-1',
  fullName: 'Lucas Mendes',
  email: 'lucas@example.com',
};

const RAFAEL = {
  ...CARLOS,
  id: 'user-rafael-1',
  fullName: 'Rafael Gomes',
  email: 'rafael@example.com',
  verified: true,
  status: 'BLOCKED',
};

const MARIANA = {
  ...CARLOS,
  id: 'user-mariana-1',
  fullName: 'Mariana Costa',
  email: 'mariana@example.com',
  status: 'PENDING_VERIFICATION',
};

const CATEGORIES = [
  {
    id: 'cat-gpu',
    slug: 'placas-de-video',
    name: 'Placas de Vídeo',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-notebook',
    slug: 'notebooks',
    name: 'Notebooks',
    status: 'ACTIVE',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

const PRODUCT_4060 = {
  id: 'prod-rtx-4060',
  categoryId: 'cat-gpu',
  brand: 'ASUS',
  model: 'Dual GeForce RTX 4060 8GB',
  slug: 'asus-dual-rtx-4060-8gb',
  status: 'ACTIVE',
  createdAt: NOW,
  updatedAt: NOW,
};

const PRODUCT_4070 = {
  id: 'prod-rtx-4070',
  categoryId: 'cat-gpu',
  brand: 'MSI',
  model: 'Ventus RTX 4070 12GB',
  slug: 'msi-ventus-rtx-4070-12gb',
  status: 'ACTIVE',
  createdAt: NOW,
  updatedAt: NOW,
};

const LISTING_VERIFIED = {
  id: 'lst-4060-verified',
  sellerId: 'seller-ana',
  productId: 'prod-rtx-4060',
  title: 'ASUS Dual RTX 4060 8GB — com selo',
  description: 'Placa usada com caixa original e evidência de posse.',
  condition: 'LIKE_NEW',
  priceCents: 164900,
  currency: 'BRL',
  acceptsOffers: false,
  buyNowEnabled: true,
  quantity: 1,
  status: 'PUBLISHED',
  locationApprox: 'São Paulo, SP',
  media: {
    photoUrls: [PHOTO_URL],
    coverPhotoUrl: PHOTO_URL,
  },
  shipping: { modes: ['SHIPPING'], freeShipping: true },
  createdAt: NOW,
  updatedAt: NOW,
};

const LISTING_PLAIN = {
  ...LISTING_VERIFIED,
  id: 'lst-4070-plain',
  productId: 'prod-rtx-4070',
  title: 'MSI Ventus RTX 4070 12GB',
  description: 'Unidade em bom estado, sem selo concedido.',
  condition: 'GOOD',
  priceCents: 289900,
  status: 'PUBLISHED',
  locationApprox: 'Campinas, SP',
  shipping: { modes: ['PICKUP', 'SHIPPING'], freeShipping: false },
};

const SEARCH_VERIFIED = {
  id: 'lst-4060-verified',
  listingId: 'lst-4060-verified',
  productId: 'prod-rtx-4060',
  categoryId: 'cat-gpu',
  sellerId: 'seller-ana',
  title: LISTING_VERIFIED.title,
  brand: 'ASUS',
  model: PRODUCT_4060.model,
  condition: 'LIKE_NEW',
  status: 'PUBLISHED',
  priceCents: 164900,
  currency: 'BRL',
  locationApprox: 'São Paulo, SP',
  trustScore: 72,
  sellerLevel: 'TRUSTED',
  sealTypes: ['POSSESSION', 'FUNCTIONING'],
  searchText: 'rtx 4060 asus',
  thumbnailUrl: PHOTO_URL,
  freeShipping: true,
  sourceOccurredAt: NOW,
};

const SEARCH_PLAIN = {
  ...SEARCH_VERIFIED,
  id: 'lst-4070-plain',
  listingId: 'lst-4070-plain',
  productId: 'prod-rtx-4070',
  title: LISTING_PLAIN.title,
  brand: 'MSI',
  model: PRODUCT_4070.model,
  condition: 'GOOD',
  priceCents: 289900,
  sealTypes: [],
  trustScore: 55,
  sellerLevel: 'STANDARD',
  freeShipping: false,
  locationApprox: 'Campinas, SP',
  searchText: 'rtx 4070 msi',
  facets: { sponsored: true },
};

const SEARCH_SPONSORED = SEARCH_PLAIN;

const MINE = [
  {
    ...LISTING_VERIFIED,
    id: 'lst-mine-published',
    sellerId: CARLOS.id,
    title: 'RTX 4060 publicada',
    status: 'PUBLISHED',
    verificationCase: { id: 'vc-pub', status: 'APPROVED', updatedAt: NOW },
  },
  {
    ...LISTING_VERIFIED,
    id: 'lst-mine-review',
    sellerId: CARLOS.id,
    title: 'RTX 4060 em revisão',
    status: 'SUBMITTED',
    verificationCase: { id: 'vc-review', status: 'IN_REVIEW', updatedAt: NOW },
  },
  {
    ...LISTING_VERIFIED,
    id: 'lst-mine-revise',
    sellerId: CARLOS.id,
    title: 'RTX 4060 para corrigir',
    status: 'DRAFT',
    description: 'Risco na tampa',
    media: {
      photoUrls: [PHOTO_URL],
      assetIds: ['asset-photo-1', 'asset-photo-2', 'asset-photo-3'],
      videoAssetId: 'asset-video-1',
    },
    verificationCase: {
      id: 'vc-revise',
      status: 'CHANGES_REQUESTED',
      decisionReason: 'Código de posse ilegível na foto frontal.',
      requiredChanges: [
        { target: 'PHOTO', reason: 'Refaça a foto frontal com o código visível.' },
        { target: 'DESCRIPTION', reason: 'Descreva o risco da tampa com mais detalhe.' },
      ],
      updatedAt: NOW,
    },
  },
];

const CONVERSATION = {
  id: 'conv-1',
  listingId: 'lst-4060-verified',
  buyerId: CARLOS.id,
  sellerId: 'seller-ana',
  status: 'ACTIVE',
  buyerUnreadCount: 1,
  sellerUnreadCount: 0,
  lastMessageAt: NOW,
  lastMessagePreview: 'A placa liga e tem nota?',
  createdAt: NOW,
  listing: { id: 'lst-4060-verified', title: LISTING_VERIFIED.title },
  otherParticipant: { userId: 'seller-ana', displayName: 'Ana Souza' },
};

const MESSAGES = {
  items: [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: CARLOS.id,
      body: 'A placa liga e tem nota?',
      status: 'VISIBLE',
      createdAt: NOW,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'seller-ana',
      body: 'Liga sim. Tenho a caixa e o código de posse nas fotos.',
      status: 'VISIBLE',
      createdAt: '2026-08-01T12:05:00.000Z',
    },
  ],
};

const QUEUE = {
  items: [
    {
      id: 'vc-1',
      listingId: 'lst-4060-verified',
      status: 'PENDING',
      aiAnalysisScore: 78,
      createdAt: NOW,
      listingTitle: LISTING_VERIFIED.title,
      listingStatus: 'SUBMITTED',
      listingCoverPhotoUrl: PHOTO_URL,
      sellerId: 'seller-ana',
      sellerDisplayName: 'Ana Souza',
    },
    {
      id: 'vc-2',
      listingId: 'lst-4070-plain',
      status: 'IN_REVIEW',
      aiAnalysisScore: 41,
      moderatorId: CAMILA.id,
      createdAt: NOW,
      listingTitle: LISTING_PLAIN.title,
      listingStatus: 'SUBMITTED',
      sellerId: 'seller-ana',
      sellerDisplayName: 'Ana Souza',
    },
  ],
  total: 2,
  limit: 20,
  offset: 0,
  stats: {
    total: 2,
    pending: 1,
    inReview: 1,
    approved: 4,
    changesRequested: 1,
    rejected: 0,
  },
};

function sessionFor(user: typeof CARLOS) {
  return {
    user,
    accessToken: `jwt-${user.id}`,
    refreshToken: `rt-${user.id}`,
  };
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

function empty(route: Route, status = 200) {
  return route.fulfill({ status, body: '' });
}

function listingById(id: string) {
  if (id === LISTING_VERIFIED.id) return LISTING_VERIFIED;
  if (id === LISTING_PLAIN.id) return LISTING_PLAIN;
  const mine = MINE.find((item) => item.id === id);
  if (mine) return mine;
  return {
    ...LISTING_VERIFIED,
    id,
    sellerId: CARLOS.id,
    title: 'Rascunho de anúncio',
    status: 'DRAFT',
  };
}

function productById(id: string) {
  if (id === PRODUCT_4070.id) return PRODUCT_4070;
  return PRODUCT_4060;
}

function userById(id: string) {
  if (id === CAMILA.id) return CAMILA;
  if (id === SELLER_ANA.id) return SELLER_ANA;
  if (id === LUCAS.id) return LUCAS;
  if (id === RAFAEL.id) return RAFAEL;
  if (id === MARIANA.id) return MARIANA;
  return CARLOS;
}

export async function installScreenshotMocks(page: Page) {
  let actor = CARLOS;
  const createdListings = new Map<string, Record<string, unknown>>();
  let assetSeq = 0;

  await page.route(/https?:\/\/(localhost|127\.0\.0\.1):3000\/.*/, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const method = request.method().toUpperCase();

    if (pathname.includes('socket.io') || pathname.startsWith('/listing-chat/')) {
      return route.abort();
    }

    if (pathname === '/__media/gpu.jpg') {
      return route.fulfill({ status: 200, contentType: 'image/jpeg', body: PHOTO_BYTES });
    }

    if (pathname.startsWith('/__upload/') && method === 'PUT') {
      return empty(route);
    }

    if (pathname === '/auth/login' && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as { email?: string; password?: string };
      if (!body.password || body.password === 'errada') {
        return json(route, { error: 'Unauthorized', code: 'AUTH_INVALID_CREDENTIALS' }, 401);
      }
      if ((body.email ?? '').includes('camila')) actor = CAMILA;
      else if ((body.email ?? '').includes('lucas')) actor = LUCAS;
      else actor = CARLOS;
      return json(route, sessionFor(actor));
    }

    if (pathname === '/auth/register' && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as { fullName?: string; email?: string };
      actor = {
        ...LUCAS,
        fullName: body.fullName ?? LUCAS.fullName,
        email: body.email ?? LUCAS.email,
      };
      return json(route, sessionFor(actor), 201);
    }

    if (pathname === '/auth/me' && method === 'GET') {
      return json(route, actor);
    }

    if (pathname === '/auth/logout' && method === 'POST') {
      actor = CARLOS;
      return empty(route, 204);
    }

    if (pathname === '/auth/refresh' && method === 'POST') {
      return json(route, sessionFor(actor));
    }

    if (pathname === '/categories' && method === 'GET') {
      return json(route, CATEGORIES);
    }

    if (pathname === '/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      if (q.includes('zzzz') || q.includes('inexistente')) {
        return json(route, []);
      }
      if (q.includes('4070')) return json(route, [SEARCH_SPONSORED]);
      if (q.includes('4060')) return json(route, [SEARCH_VERIFIED]);
      return json(route, [SEARCH_VERIFIED, SEARCH_SPONSORED]);
    }

    if (pathname === '/products' && method === 'GET') {
      return json(route, [PRODUCT_4060, PRODUCT_4070]);
    }

    if (pathname.startsWith('/products/') && method === 'GET') {
      const id = pathname.split('/')[2] ?? '';
      if (pathname.endsWith('/price-history')) return json(route, []);
      return json(route, productById(id));
    }

    if (pathname === '/services' && method === 'GET') {
      return json(route, [
        {
          id: 'svc-install',
          slug: 'instalacao',
          name: 'Instalação',
          synonyms: ['montar'],
          status: 'ACTIVE',
          createdAt: NOW,
        },
      ]);
    }

    if (pathname === '/listings/mine' && method === 'GET') {
      return json(route, { items: MINE, total: MINE.length, limit: 20, offset: 0 });
    }

    const listingProof = pathname.match(/^\/listings\/([^/]+)\/proof-code$/);
    if (listingProof && method === 'GET') {
      return json(route, {
        code: 'GT-7K3M',
        caseId: 'vc-review',
        listingId: listingProof[1],
        issuedAt: NOW,
      });
    }

    const listingAction = pathname.match(/^\/listings\/([^/]+)\/(submit|pause|publish)$/);
    if (listingAction && method === 'POST') {
      const current = listingById(listingAction[1]);
      const status = listingAction[2] === 'pause' ? 'PAUSED' : 'SUBMITTED';
      return json(route, { ...current, status });
    }

    if (pathname.match(/^\/listings\/[^/]+\/events$/) && method === 'GET') {
      return json(route, []);
    }

    const listingIdMatch = pathname.match(/^\/listings\/([^/]+)$/);
    if (listingIdMatch && method === 'GET') {
      return json(route, listingById(listingIdMatch[1]));
    }

    if (listingIdMatch && method === 'PUT') {
      return json(route, { ...listingById(listingIdMatch[1]), ...(request.postDataJSON() ?? {}) });
    }

    if (pathname === '/listings' && method === 'GET') {
      return json(route, [LISTING_VERIFIED, LISTING_PLAIN]);
    }

    if (pathname === '/listings' && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as { id?: string };
      const id = body.id ?? `lst-draft-${Date.now()}`;
      const created = { ...LISTING_VERIFIED, ...body, id, status: 'DRAFT', sellerId: actor.id };
      createdListings.set(id, created);
      return json(route, created, 201);
    }

    if (pathname === '/seals' && method === 'GET') {
      const listingId = url.searchParams.get('listingId');
      if (listingId === 'lst-4070-plain') return json(route, []);
      return json(route, [
        {
          id: 'seal-pos',
          listingId: listingId ?? 'lst-4060-verified',
          caseId: 'vc-1',
          type: 'POSSESSION',
          status: 'GRANTED',
          grantedAt: NOW,
          createdAt: NOW,
          updatedAt: NOW,
        },
        {
          id: 'seal-fun',
          listingId: listingId ?? 'lst-4060-verified',
          caseId: 'vc-1',
          type: 'FUNCTIONING',
          status: 'GRANTED',
          grantedAt: NOW,
          createdAt: NOW,
          updatedAt: NOW,
        },
      ]);
    }

    if (pathname.startsWith('/trust-scores/') && method === 'GET') {
      const sellerId = pathname.split('/')[2];
      return json(route, {
        id: `ts-${sellerId}`,
        sellerId,
        score: sellerId === CARLOS.id ? 48 : 72,
        components: { salesCount: 12 },
        computedAt: NOW,
      });
    }

    if (pathname.startsWith('/seller-levels/') && method === 'GET') {
      const sellerId = pathname.split('/')[2];
      return json(route, {
        id: `sl-${sellerId}`,
        sellerId,
        level: sellerId === CARLOS.id ? 'EVOLVING' : 'TRUSTED',
        updatedAt: NOW,
      });
    }

    if (pathname === '/trust-events' && method === 'GET') {
      return json(route, [
        {
          id: 'te-1',
          sellerId: url.searchParams.get('sellerId') ?? 'seller-ana',
          type: 'SEAL_GRANTED',
          sourceEventId: 'src-1',
          payload: { reason: 'Posse conferida nas fotos' },
          occurredAt: NOW,
          createdAt: NOW,
        },
        {
          id: 'te-2',
          sellerId: url.searchParams.get('sellerId') ?? 'seller-ana',
          type: 'ORDER_COMPLETED',
          sourceEventId: 'src-2',
          payload: { reason: 'Entregas no prazo' },
          occurredAt: NOW,
          createdAt: NOW,
        },
      ]);
    }

    if (pathname === '/favorites' && method === 'GET') {
      return json(route, [
        {
          id: 'fav-1',
          userId: actor.id,
          targetType: 'LISTING',
          targetId: 'lst-4060-verified',
          createdAt: NOW,
        },
      ]);
    }

    if (pathname === '/favorites' && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as { id?: string; targetType?: string; targetId?: string };
      return json(
        route,
        {
          id: body.id ?? 'fav-new',
          userId: actor.id,
          targetType: body.targetType,
          targetId: body.targetId,
          createdAt: NOW,
        },
        201,
      );
    }

    if (pathname.startsWith('/favorites/') && method === 'DELETE') {
      return empty(route, 204);
    }

    if (pathname === '/conversations' && method === 'POST') {
      return json(route, CONVERSATION, 201);
    }

    if (pathname === '/conversations' && method === 'GET') {
      return json(route, { items: [CONVERSATION] });
    }

    if (pathname.match(/^\/conversations\/[^/]+\/messages$/) && method === 'GET') {
      return json(route, MESSAGES);
    }

    if (pathname.match(/^\/conversations\/[^/]+\/messages$/) && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as { body?: string };
      return json(
        route,
        {
          id: `msg-${Date.now()}`,
          conversationId: 'conv-1',
          senderId: actor.id,
          body: body.body ?? '',
          status: 'VISIBLE',
          createdAt: new Date().toISOString(),
        },
        201,
      );
    }

    if (pathname.match(/^\/conversations\/[^/]+\/(read|block|reports)/) && method === 'POST') {
      return empty(route, 204);
    }

    if (pathname.match(/^\/conversations\/[^/]+$/) && method === 'GET') {
      return json(route, CONVERSATION);
    }

    if (pathname === '/verification-cases' && method === 'GET') {
      return json(route, QUEUE);
    }

    if (pathname.match(/^\/verification-cases\/[^/]+\/evidence$/) && method === 'GET') {
      return json(route, [
        {
          id: 'ev-1',
          caseId: 'vc-1',
          type: 'PHOTO',
          storageKey: 's3://ev-1',
          label: 'Foto frontal',
          createdAt: NOW,
        },
      ]);
    }

    if (pathname.match(/^\/verification-cases\/[^/]+\/proof-code$/) && method === 'GET') {
      return json(route, {
        code: 'GT-7K3M',
        caseId: 'vc-1',
        listingId: 'lst-4060-verified',
        issuedAt: NOW,
      });
    }

    if (pathname.match(/^\/verification-cases\/[^/]+$/) && method === 'GET') {
      return json(route, {
        id: pathname.split('/')[2],
        listingId: 'lst-4060-verified',
        status: 'PENDING',
        createdAt: NOW,
      });
    }

    if (pathname === '/users' && method === 'GET') {
      return json(route, [CARLOS, CAMILA, SELLER_ANA, LUCAS, RAFAEL, MARIANA]);
    }

    if (pathname.startsWith('/users/') && method === 'GET') {
      return json(route, userById(pathname.split('/')[2] ?? CARLOS.id));
    }

    if (pathname === '/profiles/me' && method === 'GET') {
      return json(route, {
        id: `profile-${actor.id}`,
        userId: actor.id,
        displayName: actor.fullName.split(' ')[0],
        bio: 'Vendedor ocasional de hardware usado.',
        locationApprox: 'São Paulo, SP',
        addresses: [],
        createdAt: NOW,
      });
    }

    if (pathname.startsWith('/profiles/by-user/') && method === 'GET') {
      const userId = pathname.split('/')[3] ?? SELLER_ANA.id;
      const user = userById(userId);
      return json(route, {
        id: `profile-${userId}`,
        userId,
        displayName: user.fullName.split(' ')[0],
        bio: 'Anuncia com evidência, sem fingir selo.',
        locationApprox: 'São Paulo, SP',
        addresses: [],
        createdAt: NOW,
      });
    }

    if (pathname.startsWith('/cep/') && method === 'GET') {
      return json(route, {
        postalCode: pathname.split('/')[2],
        city: 'São Paulo',
        state: 'SP',
        street: 'Rua Augusta',
        district: 'Consolação',
      });
    }

    if (pathname === '/media/uploads' && method === 'POST') {
      assetSeq += 1;
      const id = `asset-${assetSeq}`;
      const body = (request.postDataJSON() ?? {}) as { purpose?: string; contentType?: string; byteSize?: number };
      return json(
        route,
        {
          id,
          purpose: body.purpose ?? 'LISTING',
          ownerId: actor.id,
          status: 'PENDING_UPLOAD',
          contentType: body.contentType ?? 'image/jpeg',
          byteSize: body.byteSize ?? 100,
          variants: [],
          createdAt: NOW,
          upload: {
            url: `http://localhost:3000/__upload/${id}`,
            method: 'PUT',
            expiresAt: '2026-08-01T13:00:00.000Z',
          },
        },
        201,
      );
    }

    const mediaId = pathname.match(/^\/media\/uploads\/([^/]+)\/complete$/)?.[1]
      ?? pathname.match(/^\/media\/assets\/([^/]+)(?:\/content)?$/)?.[1];
    if (mediaId && (method === 'POST' || method === 'GET')) {
      if (pathname.endsWith('/content')) {
        return json(route, { url: PHOTO_URL, expiresAt: '2026-08-01T13:00:00.000Z' });
      }
      return json(route, {
        id: mediaId,
        purpose: 'LISTING',
        ownerId: actor.id,
        status: 'READY',
        contentType: 'image/jpeg',
        byteSize: 6500,
        variants: [],
        createdAt: NOW,
      });
    }

    if (method === 'OPTIONS') {
      return empty(route);
    }

    return json(route, Array.isArray([]) ? [] : {});
  });
}

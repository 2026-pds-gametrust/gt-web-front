import type { IUser } from '@entities/user/model';
import { EUserGroup, EUserStatus } from '@entities/user/model';
import type { IAuthSession } from '@entities/auth-session/model';
import type { ISearchDocument } from '@entities/search-document/model';

/** Small, explicit payloads for tests — the shapes the API contract promises. */

export function aUser(overrides: Partial<IUser> = {}): IUser {
  return {
    id: 'user-carlos-1',
    fullName: 'Carlos Silva',
    email: 'carlos@example.com',
    phone: '11999999999',
    cpf: '12345678901',
    birthDate: '1990-05-12',
    verified: false,
    phoneVerified: false,
    status: EUserStatus.ACTIVE,
    groups: [EUserGroup.APP_USER],
    createdAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  };
}

export function aSession(overrides: Partial<IAuthSession> = {}): IAuthSession {
  return {
    user: aUser(),
    accessToken: 'jwt-access-1',
    refreshToken: 'rt-1',
    ...overrides,
  };
}

export function aSearchDocument(
  overrides: Partial<ISearchDocument> = {},
): ISearchDocument {
  return {
    id: 'lst-4060',
    listingId: 'lst-4060',
    productId: 'prod-rtx-4060',
    categoryId: 'cat-gpu',
    sellerId: 'seller-ana',
    title: 'ASUS Dual RTX 4060 8GB',
    brand: 'ASUS',
    model: 'Dual GeForce RTX 4060 8GB',
    condition: 'LIKE_NEW',
    status: 'PUBLISHED',
    priceCents: 164900,
    currency: 'BRL',
    searchText: 'rtx 4060',
    sourceOccurredAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  };
}

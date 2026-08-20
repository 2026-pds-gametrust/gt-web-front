import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ModerationPage } from './moderation-page';
import { EVerificationCaseStatus } from '@entities/verification-case/model';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { clearSession } from '@shared/lib/http';
import { aUser } from '@shared/lib/testing/fixtures';
import { EUserGroup } from '@entities/user/model';

const assign = jest.fn().mockResolvedValue({
  id: 'case-pending-1',
  listingId: 'lst-4060-plain',
  status: EVerificationCaseStatus.IN_REVIEW,
  moderatorId: 'moderator-1',
  createdAt: '2026-08-05T10:00:00.000Z',
});

const approve = jest.fn().mockResolvedValue({
  id: 'case-pending-1',
  listingId: 'lst-4060-plain',
  status: EVerificationCaseStatus.APPROVED,
  decisionReason: 'ok',
  createdAt: '2026-08-05T10:00:00.000Z',
});

jest.mock('@features/verification/api/verification-api', () => ({
  verificationApi: {
    listVerificationCases: jest.fn().mockResolvedValue({
      items: [
        {
          id: 'case-pending-1',
          listingId: 'lst-4060-plain',
          status: 'PENDING',
          createdAt: '2026-08-05T10:00:00.000Z',
          listingTitle: 'RTX 4060 sem selo',
          sellerId: 'seller-bruno',
          sellerDisplayName: 'Bruno GT',
          aiAnalysisScore: 72,
          checklist: {
            aiAnalysis: {
              analysisId: 'analysis-1',
              score: 72,
              promptVersion: 'v1',
              analyzedAt: '2026-08-05T10:05:00.000Z',
              items: [
                {
                  id: 'photo-front-visible',
                  status: 'PASS',
                  weight: 15,
                  reason: 'Produto visível.',
                },
              ],
            },
          },
          listingCoverPhotoUrl:
            'http://localhost:4566/gt-media-public/public/listing/photo.webp',
        },
      ],
      total: 1,
      limit: 20,
      offset: 0,
      stats: {
        total: 1,
        pending: 1,
        inReview: 0,
        approved: 0,
        changesRequested: 0,
        rejected: 0,
      },
    }),
    listEvidence: jest.fn().mockResolvedValue([
      {
        id: 'ev-1',
        caseId: 'case-pending-1',
        type: 'PHOTO',
        storageKey: 'evidence/x.jpg',
        label: 'Foto frontal',
        createdAt: '2026-08-05T10:00:00.000Z',
      },
    ]),
    getProofCode: jest.fn().mockResolvedValue({
      code: 'AB12CD34',
      caseId: 'case-pending-1',
      listingId: 'lst-4060-plain',
      issuedAt: '2026-08-05T10:00:00.000Z',
    }),
    assignVerificationCase: (...args: unknown[]) => assign(...args),
    approveVerificationCase: (...args: unknown[]) => approve(...args),
    rejectVerificationCase: jest.fn(),
    requestVerificationChanges: jest.fn(),
    listSeals: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('@features/listings/api/listings-api', () => ({
  listingsApi: {
    getListing: jest.fn().mockResolvedValue({
      id: 'lst-4060-plain',
      title: 'RTX 4060 sem selo',
      status: 'SUBMITTED',
      sellerId: 'seller-bruno',
      productId: 'prod-4060',
      condition: 'GOOD',
      priceCents: 250000,
      currency: 'BRL',
      shipping: { modes: ['PICKUP'] },
      acceptsOffers: false,
      buyNowEnabled: true,
      quantity: 1,
      createdAt: '2026-08-05T10:00:00.000Z',
      media: {
        photoUrls: ['http://localhost:4566/gt-media-public/public/listing/photo.webp'],
        videoUrl: 'http://localhost:4566/gt-media-public/public/listing/video.mp4',
        assetIds: ['photo-asset-1'],
        videoAssetId: 'video-asset-1',
      },
    }),
    publishListing: jest.fn().mockResolvedValue({ id: 'lst-4060-plain', status: 'PUBLISHED' }),
    pauseListing: jest.fn(),
  },
}));

jest.mock('@features/search/api/search-api', () => ({
  searchApi: {
    reconcile: jest.fn().mockResolvedValue({ listingsReindexed: 2, synonymsUpserted: 1 }),
  },
}));

jest.mock('@features/trust-display/api/trust-api', () => ({
  trustApi: {
    recomputeTrustScore: jest.fn().mockResolvedValue({ score: 50 }),
    getTrustDisplay: jest.fn().mockResolvedValue({
      score: 42,
      level: 'EVOLVING',
      reasons: ['Identidade verificada'],
    }),
  },
}));

jest.mock('@features/identity/api/identity-api', () => ({
  identityApi: {
    getUser: jest.fn().mockResolvedValue({
      id: 'seller-bruno',
      fullName: 'Bruno Vendedor',
      email: 'bruno@example.com',
      phone: '11999990000',
      cpf: '12345678901',
      birthDate: '1990-01-01',
      verified: true,
      phoneVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    getProfileByUser: jest.fn().mockResolvedValue({
      id: 'profile-bruno',
      userId: 'seller-bruno',
      displayName: 'Bruno GT',
      locationApprox: 'São Paulo, SP',
      addresses: [],
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
  },
}));

jest.mock('@features/catalog/api/catalog-api', () => ({
  catalogApi: {
    getProduct: jest.fn().mockResolvedValue({
      id: 'prod-4060',
      brand: 'NVIDIA',
      model: 'RTX 4060',
    }),
  },
}));

/** Seeds a session directly: this suite is about the group gate, not about login. */
function signInAs(...groups: EUserGroup[]) {
  useAuthStore.setState({
    user: aUser({ id: 'moderator-1', groups }),
    status: 'authenticated',
    error: null,
  });
}

describe('ModerationPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    useAuthStore.setState({ user: null, status: 'idle', error: null });
    approve.mockClear();
    assign.mockClear();
  });

  it('shows queue, evidence and can approve', async () => {
    signInAs(EUserGroup.BACKOFFICE);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Moderação' })).toBeInTheDocument();
    expect(await screen.findByText('1 caso(s)')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /RTX 4060 sem selo/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Solicitar alterações' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Aprovar e conceder selo' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aprovar e conceder selo' }));
    expect(assign).toHaveBeenCalledWith('case-pending-1', 'moderator-1');
    expect(approve).toHaveBeenCalled();
  });

  it('disables the operational actions for an actor outside the backoffice group', async () => {
    signInAs(EUserGroup.APP_USER);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>,
    );

    const approveButton = await screen.findByRole('button', {
      name: 'Aprovar e conceder selo',
    });
    expect(approveButton).toBeDisabled();
    expect(screen.getByText(/não está no grupo backoffice/i)).toBeInTheDocument();

    await user.click(approveButton);
    expect(approve).not.toHaveBeenCalled();
  });
});

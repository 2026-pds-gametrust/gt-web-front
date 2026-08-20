import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { installHttpStub } from '@shared/lib/testing/http-stub';
import { StartChatButton } from './start-chat-button';
import { EListingStatus } from '@entities/listing/model';
import { EUserGroup, EUserStatus } from '@entities/user/model';
import type { IListing } from '@entities/listing/model';
import { useAuthStore } from '@features/auth/model/use-auth-store';

const listing: IListing = {
  id: 'listing-1',
  productId: 'prod-1',
  sellerId: 'seller-1',
  title: 'RTX 4070 usada',
  description: 'Placa em bom estado',
  condition: 'GOOD',
  priceCents: 320000,
  currency: 'BRL',
  status: EListingStatus.PUBLISHED,
  shipping: { modes: ['PICKUP'], freeShipping: false },
  warranty: { type: 'NONE' },
  media: [],
  attributes: {},
  locationApprox: 'SP',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('StartChatButton', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'buyer-1',
        email: 'buyer@test.com',
        fullName: 'Lucas Comprador',
        phone: '11999999999',
        cpf: '12345678901',
        birthDate: '1995-01-01',
        verified: true,
        phoneVerified: true,
        groups: [EUserGroup.APP_USER],
        status: EUserStatus.ACTIVE,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      status: 'authenticated',
      error: null,
    });
  });

  it('opens conversation and navigates when buyer clicks', async () => {
    const stub = installHttpStub({
      'POST /conversations': [
        201,
        {
          id: 'conv-1',
          listingId: listing.id,
          buyerId: 'buyer-1',
          sellerId: listing.sellerId,
          status: 'ACTIVE',
          buyerUnreadCount: 0,
          sellerUnreadCount: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });

    render(
      <MemoryRouter>
        <StartChatButton listing={listing} />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    await waitFor(() => {
      expect(stub.callsFor('POST /conversations')).toHaveLength(1);
    });

    stub.restore();
  });

  it('does not render for the listing owner', () => {
    useAuthStore.setState({
      user: {
        id: listing.sellerId,
        email: 'seller@test.com',
        fullName: 'Rafael Vendedor',
        phone: '11988888888',
        cpf: '10987654321',
        birthDate: '1990-01-01',
        verified: true,
        phoneVerified: true,
        groups: [EUserGroup.APP_USER],
        status: EUserStatus.ACTIVE,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      status: 'authenticated',
      error: null,
    });

    render(
      <MemoryRouter>
        <StartChatButton listing={listing} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('button', { name: 'Enviar mensagem' })).not.toBeInTheDocument();
  });
});

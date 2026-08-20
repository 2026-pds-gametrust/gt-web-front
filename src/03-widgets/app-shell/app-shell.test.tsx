import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './app-shell';
import { installHttpStub } from '@shared/lib/testing/http-stub';
import { setSession, clearSession, resetSessionCache } from '@shared/lib/http';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { useChatUnreadStore } from '@features/listing-chat/model/use-chat-unread-store';
import { EUserGroup, EUserStatus } from '@entities/user/model';

describe('AppShell Mensagens nav', () => {
  afterEach(() => {
    clearSession();
    resetSessionCache();
    useChatUnreadStore.getState().clear();
    useAuthStore.setState({ user: null, status: 'anonymous', error: null });
  });

  it('should render Mensagens in the principal navigation', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <p>conteúdo</p>
        </AppShell>
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(nav).toHaveTextContent('Mensagens');
    expect(nav.querySelector('a[href="/mensagens"]')).toBeTruthy();
  });

  it('should show unread badge when authenticated and inbox has unread', async () => {
    setSession({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'buyer-1',
    });
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

    const stub = installHttpStub({
      'GET /conversations': [
        200,
        {
          items: [
            {
              id: 'conv-1',
              listingId: 'listing-1',
              buyerId: 'buyer-1',
              sellerId: 'seller-1',
              status: 'ACTIVE',
              buyerUnreadCount: 3,
              sellerUnreadCount: 0,
              createdAt: '2026-01-01T00:00:00.000Z',
              listing: { id: 'listing-1', title: 'RTX 4070' },
              otherParticipant: { userId: 'seller-1', displayName: 'Rafael' },
            },
          ],
        },
      ],
    });

    render(
      <MemoryRouter>
        <AppShell>
          <p>conteúdo</p>
        </AppShell>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('3 mensagens não lidas')).toBeInTheDocument();
    });

    stub.restore();
  });
});

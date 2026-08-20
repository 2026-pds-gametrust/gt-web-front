import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ChatThread } from './chat-thread';
import { installHttpStub } from '@shared/lib/testing/http-stub';
import { setSession, clearSession, resetSessionCache } from '@shared/lib/http';
import type { IConversationSummary } from '@entities/conversation/model';

const conversation: IConversationSummary = {
  id: 'conv-1',
  listingId: 'listing-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  status: 'ACTIVE',
  buyerUnreadCount: 0,
  sellerUnreadCount: 0,
  createdAt: '2026-08-20T10:00:00.000Z',
  listing: { id: 'listing-1', title: 'Sony PS5 Digital 1TB' },
  otherParticipant: { userId: 'seller-1', displayName: 'Rafael' },
};

describe('ChatThread', () => {
  beforeEach(() => {
    setSession({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'buyer-1',
    });
  });

  afterEach(() => {
    clearSession();
    resetSessionCache();
  });

  it('should render listing context and send a message', async () => {
    const stub = installHttpStub({
      'GET /conversations/:id/messages': [200, { items: [] }],
      'POST /conversations/:id/messages': [
        201,
        {
          id: 'msg-1',
          conversationId: conversation.id,
          senderId: 'buyer-1',
          body: 'Ainda disponível para retirada?',
          status: 'VISIBLE',
          createdAt: '2026-08-20T12:00:00.000Z',
        },
      ],
    });

    render(
      <MemoryRouter>
        <ChatThread conversation={conversation} listingTitle={conversation.listing.title} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sony PS5 Digital 1TB' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Ver anúncio' })).toHaveAttribute(
        'href',
        '/anuncio/listing-1',
      );
      expect(screen.getByText(/Comprando/)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText('Mensagem'), 'Ainda disponível para retirada?');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(screen.getByText('Ainda disponível para retirada?')).toBeInTheDocument();
    });

    stub.restore();
  });

  it('should group history by day without inventing extra messages', async () => {
    const stub = installHttpStub({
      'GET /conversations/:id/messages': [
        200,
        {
          items: [
            {
              id: 'msg-old',
              conversationId: conversation.id,
              senderId: 'seller-1',
              body: 'Posso enviar amanhã',
              status: 'VISIBLE',
              createdAt: '2026-08-19T10:00:00.000Z',
            },
            {
              id: 'msg-new',
              conversationId: conversation.id,
              senderId: 'buyer-1',
              body: 'Combinado',
              status: 'VISIBLE',
              createdAt: '2026-08-20T10:00:00.000Z',
            },
          ],
        },
      ],
    });

    render(
      <MemoryRouter>
        <ChatThread conversation={conversation} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Posso enviar amanhã')).toBeInTheDocument();
      expect(screen.getByText('Combinado')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);

    stub.restore();
  });
});

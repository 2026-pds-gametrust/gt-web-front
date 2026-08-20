import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChatInbox } from './chat-inbox';
import { installHttpStub } from '@shared/lib/testing/http-stub';
import { setSession, clearSession, resetSessionCache } from '@shared/lib/http';

const conversation = {
  id: 'conv-1',
  listingId: 'listing-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  status: 'ACTIVE' as const,
  buyerUnreadCount: 1,
  sellerUnreadCount: 0,
  lastMessagePreview: 'Ainda disponível?',
  lastMessageAt: '2026-01-02T12:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  listing: { id: 'listing-1', title: 'Sony PS5 Digital 1TB' },
  otherParticipant: { userId: 'seller-1', displayName: 'Rafael' },
};

const readConversation = {
  id: 'conv-2',
  listingId: 'listing-2',
  buyerId: 'buyer-1',
  sellerId: 'seller-2',
  status: 'ACTIVE' as const,
  buyerUnreadCount: 0,
  sellerUnreadCount: 0,
  lastMessagePreview: 'Combinado para sábado',
  lastMessageAt: '2026-01-01T12:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  listing: { id: 'listing-2', title: 'RTX 4070 usada' },
  otherParticipant: { userId: 'seller-2', displayName: 'Carlos' },
};

describe('ChatInbox', () => {
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

  it('should list conversation history', async () => {
    const stub = installHttpStub({
      'GET /conversations': [200, { items: [conversation] }],
    });

    render(
      <MemoryRouter>
        <ChatInbox />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Mensagens' })).toBeInTheDocument();
      expect(screen.getByText('Sony PS5 Digital 1TB')).toBeInTheDocument();
      expect(screen.getByText(/Ainda disponível/)).toBeInTheDocument();
      expect(screen.getByText('Comprando')).toBeInTheDocument();
      expect(screen.getByText('Rafael')).toBeInTheDocument();
    });

    stub.restore();
  });

  it('should mark active conversation in the list when conversationId is set', async () => {
    const stub = installHttpStub({
      'GET /conversations': [200, { items: [conversation] }],
      'POST /conversations/:id/read': [204],
      'GET /conversations/:id/messages': [200, { items: [] }],
    });

    render(
      <MemoryRouter initialEntries={[`/mensagens/${conversation.id}`]}>
        <Routes>
          <Route path="/mensagens/:conversationId" element={<ChatInbox conversationId={conversation.id} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Sony PS5 Digital 1TB/i });
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    stub.restore();
  });

  it('should filter unread conversations without inventing counts', async () => {
    const stub = installHttpStub({
      'GET /conversations': [200, { items: [conversation, readConversation] }],
    });

    render(
      <MemoryRouter>
        <ChatInbox />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sony PS5 Digital 1TB')).toBeInTheDocument();
      expect(screen.getByText('RTX 4070 usada')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Não lidas/i }));

    expect(screen.getByText('Sony PS5 Digital 1TB')).toBeInTheDocument();
    expect(screen.queryByText('RTX 4070 usada')).not.toBeInTheDocument();

    const filters = screen.getByRole('group', { name: 'Filtrar mensagens' });
    expect(within(filters).getByRole('button', { name: /Não lidas/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    stub.restore();
  });

  it('should filter by listing title in the search field', async () => {
    const stub = installHttpStub({
      'GET /conversations': [200, { items: [conversation, readConversation] }],
    });

    render(
      <MemoryRouter>
        <ChatInbox />
      </MemoryRouter>,
    );

    await screen.findByText('RTX 4070 usada');
    await userEvent.type(screen.getByLabelText('Filtrar conversas'), 'ps5');

    expect(screen.getByText('Sony PS5 Digital 1TB')).toBeInTheDocument();
    expect(screen.queryByText('RTX 4070 usada')).not.toBeInTheDocument();

    stub.restore();
  });
});

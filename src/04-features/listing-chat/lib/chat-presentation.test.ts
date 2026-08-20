import type { IConversationSummary } from '@entities/conversation/model';
import type { IMessage } from '@entities/message/model';
import {
  applyIncomingPreview,
  avatarToneIndex,
  conversationRole,
  formatClock,
  formatDayLabel,
  formatRelativeTime,
  groupMessagesByDay,
  matchesConversationQuery,
  participantInitials,
  roleLabel,
  unreadForActor,
} from './chat-presentation';

const baseConversation: IConversationSummary = {
  id: 'conv-1',
  listingId: 'listing-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  status: 'ACTIVE',
  buyerUnreadCount: 1,
  sellerUnreadCount: 0,
  lastMessagePreview: 'Ainda disponível?',
  lastMessageAt: '2026-08-20T12:00:00.000Z',
  createdAt: '2026-08-01T00:00:00.000Z',
  listing: { id: 'listing-1', title: 'Sony PS5 Digital 1TB' },
  otherParticipant: { userId: 'seller-1', displayName: 'Rafael Gomes' },
};

function aMessage(overrides: Partial<IMessage> = {}): IMessage {
  return {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'seller-1',
    body: 'Sim, está',
    status: 'VISIBLE',
    createdAt: '2026-08-20T12:05:00.000Z',
    ...overrides,
  };
}

describe('chat-presentation', () => {
  it('derives buyer/seller role without inventing identity', () => {
    expect(conversationRole(baseConversation, 'buyer-1')).toBe('buyer');
    expect(conversationRole(baseConversation, 'seller-1')).toBe('seller');
    expect(conversationRole(baseConversation, 'other')).toBe('unknown');
    expect(roleLabel('buyer')).toBe('Comprando');
    expect(roleLabel('seller')).toBe('Vendendo');
    expect(roleLabel('unknown')).toBeNull();
  });

  it('builds initials from the display name only', () => {
    expect(participantInitials('Rafael Gomes')).toBe('RG');
    expect(participantInitials('Beatriz')).toBe('BE');
    expect(participantInitials('  ')).toBe('?');
  });

  it('keeps avatar tone stable and within the palette', () => {
    expect(avatarToneIndex('seller-1')).toBe(avatarToneIndex('seller-1'));
    expect(avatarToneIndex('seller-1')).toBeGreaterThanOrEqual(0);
    expect(avatarToneIndex('seller-1')).toBeLessThan(4);
  });

  it('formats relative time from a known now', () => {
    const now = Date.parse('2026-08-20T12:10:00.000Z');
    expect(formatRelativeTime('2026-08-20T12:09:50.000Z', now)).toBe('agora');
    expect(formatRelativeTime('2026-08-20T12:05:00.000Z', now)).toBe('há 5 min');
    expect(formatRelativeTime('2026-08-20T10:10:00.000Z', now)).toBe('há 2 h');
    expect(formatRelativeTime('2026-08-19T12:10:00.000Z', now)).toBe('ontem');
  });

  it('labels calendar days in Portuguese', () => {
    const now = new Date('2026-08-20T18:00:00');
    expect(formatDayLabel('2026-08-20T09:00:00', now)).toBe('Hoje');
    expect(formatDayLabel('2026-08-19T09:00:00', now)).toBe('Ontem');
    expect(formatClock('2026-08-20T09:05:00')).toMatch(/\d{2}:\d{2}/);
  });

  it('filters inbox by listing, participant or preview', () => {
    expect(matchesConversationQuery(baseConversation, 'ps5')).toBe(true);
    expect(matchesConversationQuery(baseConversation, 'rafael')).toBe(true);
    expect(matchesConversationQuery(baseConversation, 'disponível')).toBe(true);
    expect(matchesConversationQuery(baseConversation, 'xbox')).toBe(false);
  });

  it('counts unread only for the signed-in actor', () => {
    expect(unreadForActor(baseConversation, 'buyer-1')).toBe(1);
    expect(unreadForActor(baseConversation, 'seller-1')).toBe(0);
    expect(unreadForActor(baseConversation, null)).toBe(0);
  });

  it('bumps unread and preview for incoming messages on inactive threads', () => {
    const next = applyIncomingPreview(
      [baseConversation],
      { conversationId: 'conv-1', message: aMessage() },
      'buyer-1',
    );
    expect(next[0].lastMessagePreview).toBe('Sim, está');
    expect(next[0].buyerUnreadCount).toBe(2);
  });

  it('does not invent unread when the open thread or the actor sent the message', () => {
    const open = applyIncomingPreview(
      [baseConversation],
      { conversationId: 'conv-1', message: aMessage() },
      'buyer-1',
      'conv-1',
    );
    expect(open[0].buyerUnreadCount).toBe(1);

    const own = applyIncomingPreview(
      [baseConversation],
      { conversationId: 'conv-1', message: aMessage({ senderId: 'buyer-1', body: 'Combinado' }) },
      'buyer-1',
    );
    expect(own[0].buyerUnreadCount).toBe(1);
    expect(own[0].lastMessagePreview).toBe('Combinado');
  });

  it('groups messages by calendar day', () => {
    const now = new Date('2026-08-20T18:00:00');
    const groups = groupMessagesByDay(
      [
        aMessage({ id: 'a', createdAt: '2026-08-19T10:00:00' }),
        aMessage({ id: 'b', createdAt: '2026-08-20T10:00:00' }),
        aMessage({ id: 'c', createdAt: '2026-08-20T11:00:00' }),
      ],
      now,
    );
    expect(groups).toHaveLength(2);
    expect(groups[0].dayLabel).toBe('Ontem');
    expect(groups[1].messages).toHaveLength(2);
  });
});

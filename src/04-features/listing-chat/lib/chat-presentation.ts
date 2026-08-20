import type { IConversationSummary } from '@entities/conversation/model';
import type { IMessage } from '@entities/message/model';

export type ConversationRole = 'buyer' | 'seller' | 'unknown';

export function conversationRole(
  item: Pick<IConversationSummary, 'buyerId' | 'sellerId'>,
  actorId: string | null | undefined,
): ConversationRole {
  if (!actorId) return 'unknown';
  if (item.buyerId === actorId) return 'buyer';
  if (item.sellerId === actorId) return 'seller';
  return 'unknown';
}

export function roleLabel(role: ConversationRole): string | null {
  if (role === 'buyer') return 'Comprando';
  if (role === 'seller') return 'Vendendo';
  return null;
}

export function participantInitials(name?: string): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export function avatarToneIndex(seed: string, modulo = 4): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo > 0 ? hash % modulo : 0;
}

export function formatRelativeTime(iso?: string, now = Date.now()): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const diff = Math.max(0, now - then);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'agora';
  if (diff < hour) return `há ${Math.floor(diff / minute)} min`;
  if (diff < day) return `há ${Math.floor(diff / hour)} h`;
  if (diff < 2 * day) return 'ontem';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso));
}

export function formatClock(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function formatDayLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const startOfDay = (value: Date) =>
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date);
}

export function unreadForActor(
  item: Pick<IConversationSummary, 'buyerId' | 'sellerId' | 'buyerUnreadCount' | 'sellerUnreadCount'>,
  actorId: string | null | undefined,
): number {
  if (!actorId) return 0;
  if (item.buyerId === actorId) return item.buyerUnreadCount;
  if (item.sellerId === actorId) return item.sellerUnreadCount;
  return 0;
}

export function matchesConversationQuery(item: IConversationSummary, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    item.listing.title.toLowerCase().includes(needle) ||
    (item.otherParticipant.displayName ?? '').toLowerCase().includes(needle) ||
    (item.lastMessagePreview ?? '').toLowerCase().includes(needle)
  );
}

export function applyIncomingPreview(
  items: IConversationSummary[],
  payload: { conversationId: string; message: IMessage },
  actorId: string | null | undefined,
  activeConversationId?: string,
): IConversationSummary[] {
  return items
    .map((item) => {
      if (item.id !== payload.conversationId) return item;
      const fromSelf = payload.message.senderId === actorId;
      const isActive = item.id === activeConversationId;
      const bump = !fromSelf && !isActive ? 1 : 0;
      return {
        ...item,
        lastMessagePreview: payload.message.body,
        lastMessageAt: payload.message.createdAt,
        buyerUnreadCount:
          item.buyerId === actorId ? item.buyerUnreadCount + bump : item.buyerUnreadCount,
        sellerUnreadCount:
          item.sellerId === actorId ? item.sellerUnreadCount + bump : item.sellerUnreadCount,
      };
    })
    .sort((a, b) => {
      const at = a.lastMessageAt ?? a.createdAt;
      const bt = b.lastMessageAt ?? b.createdAt;
      return bt.localeCompare(at);
    });
}

export type MessageGroup = {
  dayLabel: string;
  messages: IMessage[];
};

export function groupMessagesByDay(messages: IMessage[], now = new Date()): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const message of messages) {
    const dayLabel = formatDayLabel(message.createdAt, now);
    const last = groups[groups.length - 1];
    if (last && last.dayLabel === dayLabel) {
      last.messages.push(message);
    } else {
      groups.push({ dayLabel, messages: [message] });
    }
  }
  return groups;
}

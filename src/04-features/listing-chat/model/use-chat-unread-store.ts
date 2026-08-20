import { create } from 'zustand';
import { listingChatApi } from '@features/listing-chat/api/listing-chat-api';
import { getActorId } from '@shared/lib/http';

type ChatUnreadState = {
  totalUnread: number;
  loading: boolean;
  refresh: () => Promise<void>;
  clear: () => void;
};

/**
 * Nav badge source of truth for Mensagens.
 * Refresh after login, inbox load, send/read — never invents counts.
 */
export const useChatUnreadStore = create<ChatUnreadState>((set) => ({
  totalUnread: 0,
  loading: false,

  async refresh() {
    if (!getActorId()) {
      set({ totalUnread: 0, loading: false });
      return;
    }
    set({ loading: true });
    try {
      const totalUnread = await listingChatApi.totalUnreadCount();
      set({ totalUnread, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  clear() {
    set({ totalUnread: 0, loading: false });
  },
}));

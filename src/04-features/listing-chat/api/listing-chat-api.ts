import { ApiError, getActorId, httpClient } from '@shared/lib/http';
import type { IConversation, IConversationPage } from '@entities/conversation/model';
import type { IMessage, IMessagePage } from '@entities/message/model';

export const listingChatApi = {
  async openConversation(listingId: string): Promise<IConversation> {
    const { data } = await httpClient.post<IConversation>('/conversations', { listingId });
    return data;
  },

  async listConversations(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<IConversationPage> {
    const { data } = await httpClient.get<IConversationPage>('/conversations', { params });
    return data;
  },

  async getConversation(conversationId: string): Promise<IConversation | null> {
    try {
      const { data } = await httpClient.get<IConversation>(`/conversations/${conversationId}`);
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async listMessages(
    conversationId: string,
    params?: { limit?: number; before?: string },
  ): Promise<IMessagePage> {
    const { data } = await httpClient.get<IMessagePage>(
      `/conversations/${conversationId}/messages`,
      { params },
    );
    return data;
  },

  async sendMessage(conversationId: string, body: string): Promise<IMessage> {
    const { data } = await httpClient.post<IMessage>(
      `/conversations/${conversationId}/messages`,
      { body },
    );
    return data;
  },

  async markRead(conversationId: string): Promise<void> {
    await httpClient.post(`/conversations/${conversationId}/read`);
  },

  async blockParticipant(conversationId: string): Promise<void> {
    await httpClient.post(`/conversations/${conversationId}/block`);
  },

  async reportConversation(conversationId: string, reason: string): Promise<void> {
    await httpClient.post(`/conversations/${conversationId}/reports`, { reason });
  },

  async reportMessage(
    conversationId: string,
    messageId: string,
    reason: string,
  ): Promise<void> {
    await httpClient.post(
      `/conversations/${conversationId}/messages/${messageId}/reports`,
      { reason },
    );
  },

  /** Unread count for the signed-in actor across inbox (client-side sum). */
  async totalUnreadCount(): Promise<number> {
    const actorId = getActorId();
    if (!actorId) return 0;

    const page = await listingChatApi.listConversations({ limit: 50 });
    return page.items.reduce((sum, item) => {
      if (item.buyerId === actorId) return sum + item.buyerUnreadCount;
      if (item.sellerId === actorId) return sum + item.sellerUnreadCount;
      return sum;
    }, 0);
  },
};

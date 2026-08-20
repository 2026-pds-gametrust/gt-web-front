export const EConversationStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export type EConversationStatus =
  (typeof EConversationStatus)[keyof typeof EConversationStatus];

export interface IConversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: EConversationStatus;
  buyerUnreadCount: number;
  sellerUnreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IConversationParticipant {
  userId: string;
  displayName?: string;
}

export interface IConversationListingContext {
  id: string;
  title: string;
}

export interface IConversationSummary extends IConversation {
  listing: IConversationListingContext;
  otherParticipant: IConversationParticipant;
}

export interface IConversationPage {
  items: IConversationSummary[];
  nextCursor?: string;
}

export const EMessageStatus = {
  VISIBLE: 'VISIBLE',
} as const;

export type EMessageStatus = (typeof EMessageStatus)[keyof typeof EMessageStatus];

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  status: EMessageStatus;
  createdAt: string;
}

export interface IMessagePage {
  items: IMessage[];
  nextCursor?: string;
}

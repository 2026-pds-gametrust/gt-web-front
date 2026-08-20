export const ETrustEventType = {
  USER_VERIFIED: 'USER_VERIFIED',
  SEAL_GRANTED: 'SEAL_GRANTED',
  SEAL_REVOKED: 'SEAL_REVOKED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
} as const;

export type ETrustEventType = (typeof ETrustEventType)[keyof typeof ETrustEventType];

export const TRUST_EVENT_REASON_LABELS: Record<ETrustEventType, string> = {
  USER_VERIFIED: 'Identidade verificada',
  SEAL_GRANTED: 'Selo concedido',
  SEAL_REVOKED: 'Selo revogado',
  ORDER_COMPLETED: 'Pedido concluído',
};

export interface ITrustEvent {
  id: string;
  sellerId: string;
  type: ETrustEventType;
  sourceEventId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
}

export type INewTrustEvent = {
  id: string;
  sellerId: string;
  type: ETrustEventType;
  sourceEventId: string;
  payload: Record<string, unknown>;
  occurredAt?: string;
};

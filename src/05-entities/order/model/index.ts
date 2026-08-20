export const EOrderStatus = {
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export type EOrderStatus = (typeof EOrderStatus)[keyof typeof EOrderStatus];

export const EOrderShippingMode = {
  PICKUP: 'PICKUP',
  SHIPPING: 'SHIPPING',
} as const;

export type EOrderShippingMode =
  (typeof EOrderShippingMode)[keyof typeof EOrderShippingMode];

export interface IOrder {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  shippingMode: EOrderShippingMode;
  priceCents: number;
  currency: string;
  status: EOrderStatus;
  reservationExpiresAt: string;
  createdAt: string;
  updatedAt?: string;
}

export type INewOrder = {
  id?: string;
  listingId: string;
  shippingMode: EOrderShippingMode;
};

export interface IOrderPage {
  items: IOrder[];
  page: number;
  pageSize: number;
  total: number;
}

export const ORDER_STATUS_LABELS: Record<EOrderStatus, string> = {
  AWAITING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
};

export const ORDER_SHIPPING_LABELS: Record<EOrderShippingMode, string> = {
  PICKUP: 'Retirada',
  SHIPPING: 'Envio',
};

export const EPriceHistorySource = {
  LISTING_PUBLISHED: 'LISTING_PUBLISHED',
  LISTING_SOLD: 'LISTING_SOLD',
  MANUAL: 'MANUAL',
} as const;

export type EPriceHistorySource =
  (typeof EPriceHistorySource)[keyof typeof EPriceHistorySource];

export interface IPriceHistory {
  id: string;
  productId: string;
  priceCents: number;
  currency: string;
  source: EPriceHistorySource;
  observedAt: string;
  createdAt: string;
}

export const ETrustLevel = {
  NEW: 'NEW',
  EVOLVING: 'EVOLVING',
  TRUSTED: 'TRUSTED',
  EXCELLENT: 'EXCELLENT',
} as const;

export type ETrustLevel = (typeof ETrustLevel)[keyof typeof ETrustLevel];

export const TRUST_LEVEL_LABELS: Record<ETrustLevel, string> = {
  NEW: 'Novo',
  EVOLVING: 'Em evolução',
  TRUSTED: 'Confiável',
  EXCELLENT: 'Excelente',
};

export interface ISellerLevel {
  id: string;
  sellerId: string;
  level: ETrustLevel;
  updatedAt?: string;
}

export const ESealType = {
  POSSESSION: 'POSSESSION',
  FUNCTIONING: 'FUNCTIONING',
  IDENTITY: 'IDENTITY',
  PROTECTED_PURCHASE: 'PROTECTED_PURCHASE',
  WARRANTY: 'WARRANTY',
} as const;

export type ESealType = (typeof ESealType)[keyof typeof ESealType];

export const ESealStatus = {
  GRANTED: 'GRANTED',
  SUSPENDED: 'SUSPENDED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;

export type ESealStatus = (typeof ESealStatus)[keyof typeof ESealStatus];

export interface ISeal {
  id: string;
  listingId: string;
  caseId: string;
  type: ESealType;
  status: ESealStatus;
  grantedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const SEAL_LABELS: Record<ESealType, string> = {
  POSSESSION: 'Posse verificada',
  FUNCTIONING: 'Funcionamento revisado',
  IDENTITY: 'Identidade verificada',
  PROTECTED_PURCHASE: 'Compra protegida',
  WARRANTY: 'Garantia disponível',
};

export const SEAL_EXPLANATIONS: Record<ESealType, string> = {
  POSSESSION:
    'Evidências compatíveis com posse no momento da análise. Não garante autenticidade futura.',
  FUNCTIONING:
    'Teste solicitado foi apresentado e revisado. Não é garantia total de funcionamento contínuo.',
  IDENTITY: 'O vendedor concluiu a confirmação de identidade na plataforma.',
  PROTECTED_PURCHASE: 'Pagamento e contestação seguem as regras de compra protegida da GamerTrust.',
  WARRANTY: 'Há prazo e cobertura de garantia visíveis neste anúncio.',
};

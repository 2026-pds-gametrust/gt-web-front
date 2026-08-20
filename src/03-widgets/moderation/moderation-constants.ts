import { EVerificationCaseStatus } from '@entities/verification-case/model';

export const STATUS_LABEL: Record<EVerificationCaseStatus, string> = {
  [EVerificationCaseStatus.PENDING]: 'Pendente',
  [EVerificationCaseStatus.IN_REVIEW]: 'Em análise',
  [EVerificationCaseStatus.APPROVED]: 'Aprovado',
  [EVerificationCaseStatus.CHANGES_REQUESTED]: 'Ajustes solicitados',
  [EVerificationCaseStatus.REJECTED]: 'Rejeitado',
};

export const LISTING_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  SUBMITTED: 'Enviado',
  PUBLISHED: 'Publicado',
  PAUSED: 'Pausado',
  EXPIRED: 'Expirado',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
  REJECTED: 'Rejeitado (definitivo)',
};

export const CONDITION_LABEL: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

export const SHIPPING_LABEL: Record<string, string> = {
  PICKUP: 'Retirada',
  SHIPPING: 'Envio',
};

export type ModerationStatusFilter = 'ALL' | EVerificationCaseStatus;

export const MODERATION_QUEUE_PAGE_SIZE = 20;

export type ModerationScoreFilter = 'ALL' | 'LOW' | 'MID' | 'HIGH' | 'NO_SCORE';

export const SCORE_FILTER_OPTIONS: {
  value: ModerationScoreFilter;
  label: string;
}[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'LOW', label: '0–40' },
  { value: 'MID', label: '41–70' },
  { value: 'HIGH', label: '71–100' },
  { value: 'NO_SCORE', label: 'Sem score' },
];

export const CHECKLIST_ITEM_LABEL: Record<string, string> = {
  'photo-front-visible': 'Produto visível de frente',
  'photo-lighting-focus': 'Iluminação e foco',
  'photo-serial-label': 'Número de série / etiqueta',
  'photo-no-sensitive-data': 'Sem dados sensíveis',
  'video-boot-test': 'Teste em vídeo',
  'text-condition-coherent': 'Descrição coerente',
  'text-defects-mentioned': 'Defeitos mencionados',
};

export function scoreFilterToQuery(filter: ModerationScoreFilter): {
  minScore?: number;
  maxScore?: number;
  hasAiScore?: boolean;
} {
  switch (filter) {
    case 'LOW':
      return { minScore: 0, maxScore: 40 };
    case 'MID':
      return { minScore: 41, maxScore: 70 };
    case 'HIGH':
      return { minScore: 71, maxScore: 100 };
    case 'NO_SCORE':
      return { hasAiScore: false };
    default:
      return {};
  }
}

export const STATUS_FILTER_OPTIONS: {
  value: ModerationStatusFilter;
  label: string;
}[] = [
  { value: 'ALL', label: 'Todos' },
  { value: EVerificationCaseStatus.PENDING, label: STATUS_LABEL.PENDING },
  { value: EVerificationCaseStatus.IN_REVIEW, label: STATUS_LABEL.IN_REVIEW },
  { value: EVerificationCaseStatus.APPROVED, label: STATUS_LABEL.APPROVED },
  {
    value: EVerificationCaseStatus.CHANGES_REQUESTED,
    label: STATUS_LABEL.CHANGES_REQUESTED,
  },
  { value: EVerificationCaseStatus.REJECTED, label: STATUS_LABEL.REJECTED },
];

export function formatModerationDate(iso: string | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

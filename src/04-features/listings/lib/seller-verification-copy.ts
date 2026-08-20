import type { ISellerVerificationSummary } from '@entities/listing/model';
import type { IRequiredChange } from '@entities/verification-case/model';

const VERIFICATION_LABEL: Record<ISellerVerificationSummary['status'], string> = {
  PENDING: 'Aguardando revisão',
  IN_REVIEW: 'Em análise',
  APPROVED: 'Verificação aprovada',
  CHANGES_REQUESTED: 'Ajustes solicitados — corrija e reenvie',
  REJECTED: 'Reprovado definitivamente',
};

const TARGET_LABEL: Record<IRequiredChange['target'], string> = {
  PHOTO: 'Foto',
  VIDEO: 'Vídeo',
  DESCRIPTION: 'Descrição',
};

export function sellerVerificationLabel(
  verificationCase?: ISellerVerificationSummary,
): string | null {
  if (!verificationCase) {
    return null;
  }
  const base = VERIFICATION_LABEL[verificationCase.status];
  if (
    verificationCase.status === 'REJECTED' &&
    verificationCase.decisionReason?.trim()
  ) {
    return `${base}: ${verificationCase.decisionReason.trim()}`;
  }
  if (
    verificationCase.status === 'CHANGES_REQUESTED' &&
    verificationCase.decisionReason?.trim()
  ) {
    return `${base}: ${verificationCase.decisionReason.trim()}`;
  }
  return base;
}

export function formatRequiredChangeItem(change: IRequiredChange): string {
  const target = TARGET_LABEL[change.target] ?? change.target;
  if (change.assetId) {
    return `${target} (${change.assetId.slice(0, 8)}…): ${change.reason}`;
  }
  return `${target}: ${change.reason}`;
}

export function needsRevision(
  listingStatus: string,
  verificationCase?: ISellerVerificationSummary,
): boolean {
  return (
    listingStatus === 'DRAFT' &&
    verificationCase?.status === 'CHANGES_REQUESTED' &&
    Boolean(verificationCase.requiredChanges?.length)
  );
}

export function isTerminalRejection(
  listingStatus: string,
  verificationCase?: ISellerVerificationSummary,
): boolean {
  return (
    listingStatus === 'REJECTED' ||
    verificationCase?.status === 'REJECTED'
  );
}

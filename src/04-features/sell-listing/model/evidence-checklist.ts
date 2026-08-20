import { EEvidenceType } from '@entities/evidence-item/model';

/**
 * What the seller is asked to prepare before submitting. This is form copy, not
 * API data: evidence only becomes an `EvidenceItem` after
 * `POST /verification-cases/{caseId}/evidence`, once a case exists.
 */
export interface IEvidenceChecklistItem {
  id: string;
  type: EEvidenceType;
  label: string;
}

export const EVIDENCE_CHECKLIST: IEvidenceChecklistItem[] = [
  {
    id: 'photo-front',
    type: EEvidenceType.PHOTO,
    label: 'Foto frontal do produto',
  },
  {
    id: 'photo-serial',
    type: EEvidenceType.PHOTO,
    label: 'Foto do número de série / etiqueta',
  },
  {
    id: 'video-boot',
    type: EEvidenceType.VIDEO,
    label: 'Vídeo curto ligando / benchmark básico',
  },
  {
    id: 'photo-invoice',
    type: EEvidenceType.PHOTO,
    label: 'Nota fiscal ou comprovante de compra',
  },
  {
    id: 'proof-code',
    type: EEvidenceType.PROOF_CODE_HASH,
    label: 'Código de posse anotado e visível junto ao produto',
  },
];

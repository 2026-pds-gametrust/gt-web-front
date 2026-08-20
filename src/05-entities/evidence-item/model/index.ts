export const EEvidenceType = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
  PROOF_CODE_HASH: 'PROOF_CODE_HASH',
} as const;

export type EEvidenceType = (typeof EEvidenceType)[keyof typeof EEvidenceType];

export interface IEvidenceItem {
  id: string;
  caseId: string;
  type: EEvidenceType;
  storageKey: string;
  assetId?: string;
  label?: string;
  contentHash?: string;
  createdAt: string;
}

export type INewEvidenceItem = {
  id: string;
  type: EEvidenceType;
  storageKey: string;
  contentHash?: string;
  label?: string;
};

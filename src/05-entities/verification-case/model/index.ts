import type { IRequiredChange } from './required-change';

export const EVerificationCaseStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  REJECTED: 'REJECTED',
} as const;

export type EVerificationCaseStatus =
  (typeof EVerificationCaseStatus)[keyof typeof EVerificationCaseStatus];

export type {
  ERequiredChangeTarget,
  IRequiredChange,
  IRequiredChangeInput,
  IRequestVerificationChanges,
} from './required-change';
export { ERequiredChangeTarget as ERequiredChangeTargetEnum } from './required-change';

export interface IVerificationCase {
  id: string;
  listingId: string;
  status: EVerificationCaseStatus;
  checklist?: Record<string, unknown>;
  decisionReason?: string;
  moderatorId?: string;
  requiredChanges?: IRequiredChange[];
  previousCaseId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type INewVerificationCase = {
  id: string;
  listingId: string;
  checklist?: Record<string, unknown>;
};

export type { IProofCode } from './proof-code';

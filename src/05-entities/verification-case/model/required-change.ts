export const ERequiredChangeTarget = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
  DESCRIPTION: 'DESCRIPTION',
} as const;

export type ERequiredChangeTarget =
  (typeof ERequiredChangeTarget)[keyof typeof ERequiredChangeTarget];

export interface IRequiredChange {
  target: ERequiredChangeTarget;
  reason: string;
  assetId?: string;
  checklistItemId?: string;
}

export interface IRequiredChangeInput {
  target: ERequiredChangeTarget;
  reason: string;
  assetId?: string;
  checklistItemId?: string;
}

export interface IRequestVerificationChanges {
  summary: string;
  requiredChanges: IRequiredChangeInput[];
}

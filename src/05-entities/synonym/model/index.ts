export const ESynonymTargetType = {
  CATEGORY: 'CATEGORY',
  SERVICE: 'SERVICE',
} as const;

export type ESynonymTargetType = (typeof ESynonymTargetType)[keyof typeof ESynonymTargetType];

export interface ISynonym {
  id: string;
  normalizedTerm: string;
  targetType: ESynonymTargetType;
  targetId: string;
  canonicalName: string;
  updatedAt?: string;
}

export interface ISearchReconcileResult {
  listingsReindexed: number;
  synonymsUpserted: number;
}

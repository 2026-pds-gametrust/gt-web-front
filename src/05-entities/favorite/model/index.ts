export const EFavoriteTargetType = {
  PRODUCT: 'PRODUCT',
  LISTING: 'LISTING',
} as const;

export type EFavoriteTargetType = (typeof EFavoriteTargetType)[keyof typeof EFavoriteTargetType];

export interface IFavorite {
  id: string;
  userId: string;
  targetType: EFavoriteTargetType;
  targetId: string;
  createdAt: string;
}

export type INewFavorite = {
  id: string;
  userId?: string;
  targetType: EFavoriteTargetType;
  targetId: string;
};

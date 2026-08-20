export const EListingStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  PUBLISHED: 'PUBLISHED',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  REJECTED: 'REJECTED',
} as const;

export type EListingStatus = (typeof EListingStatus)[keyof typeof EListingStatus];

export const EListingCondition = {
  NEW: 'NEW',
  LIKE_NEW: 'LIKE_NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR',
} as const;

export type EListingCondition = (typeof EListingCondition)[keyof typeof EListingCondition];

export const EShippingMode = {
  PICKUP: 'PICKUP',
  SHIPPING: 'SHIPPING',
} as const;

export type EShippingMode = (typeof EShippingMode)[keyof typeof EShippingMode];

export const EWarrantyType = {
  NONE: 'NONE',
  SELLER: 'SELLER',
  MANUFACTURER_REMAINING: 'MANUFACTURER_REMAINING',
} as const;

export type EWarrantyType = (typeof EWarrantyType)[keyof typeof EWarrantyType];

export interface IListingMedia {
  photoUrls: string[];
  videoUrl?: string;
  coverPhotoUrl?: string;
  /** READY LISTING image assets; the backend resolves them into public URLs. */
  assetIds?: string[];
  /** READY LISTING video/mp4 asset — required to create a listing. */
  videoAssetId?: string;
}

export interface IListingShipping {
  modes: EShippingMode[];
  packageWeightGrams?: number;
  packageLengthCm?: number;
  packageWidthCm?: number;
  packageHeightCm?: number;
  freeShipping?: boolean;
}

export interface IListingWarranty {
  type: EWarrantyType;
  months?: number;
}

export interface IListing {
  id: string;
  sellerId: string;
  productId: string;
  title: string;
  description?: string;
  condition: EListingCondition;
  priceCents: number;
  listPriceCents?: number;
  currency: string;
  attributes?: Record<string, string | number | boolean | string[]>;
  media: IListingMedia;
  shipping: IListingShipping;
  locationApprox?: string;
  warranty?: IListingWarranty;
  acceptsOffers: boolean;
  buyNowEnabled: boolean;
  quantity: number;
  status: EListingStatus;
  createdAt: string;
  updatedAt?: string;
}

export type INewListing = {
  id: string;
  sellerId: string;
  productId: string;
  title: string;
  description?: string;
  condition: EListingCondition;
  priceCents: number;
  listPriceCents?: number;
  currency?: string;
  attributes?: Record<string, string | number | boolean | string[]>;
  media: IListingMedia;
  shipping: IListingShipping;
  locationApprox?: string;
  warranty?: IListingWarranty;
  acceptsOffers?: boolean;
  buyNowEnabled?: boolean;
  quantity?: number;
};

export type IUpdateListing = Partial<Omit<INewListing, 'id' | 'sellerId'>>;

import type { IRequiredChange } from '@entities/verification-case/model';

export interface ISellerVerificationSummary {
  id: string;
  status:
    | 'PENDING'
    | 'IN_REVIEW'
    | 'APPROVED'
    | 'CHANGES_REQUESTED'
    | 'REJECTED';
  decisionReason?: string;
  requiredChanges?: IRequiredChange[];
  previousCaseId?: string;
  updatedAt?: string;
}

export interface ISellerListing extends IListing {
  verificationCase?: ISellerVerificationSummary;
}

export interface IListingPage {
  items: IListing[];
  total: number;
  limit: number;
  offset: number;
}

export interface ISellerListingPage {
  items: ISellerListing[];
  total: number;
  limit: number;
  offset: number;
}

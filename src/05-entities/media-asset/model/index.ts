export const EMediaPurpose = {
  PRODUCT: 'PRODUCT',
  LISTING: 'LISTING',
  EVIDENCE: 'EVIDENCE',
} as const;

export type EMediaPurpose = (typeof EMediaPurpose)[keyof typeof EMediaPurpose];

export const EMediaAssetStatus = {
  PENDING_UPLOAD: 'PENDING_UPLOAD',
  UPLOADED: 'UPLOADED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
} as const;

export type EMediaAssetStatus =
  (typeof EMediaAssetStatus)[keyof typeof EMediaAssetStatus];

export const EMediaVariantSize = {
  THUMBNAIL: 'THUMBNAIL',
  CARD: 'CARD',
  FULL: 'FULL',
} as const;

export type EMediaVariantSize =
  (typeof EMediaVariantSize)[keyof typeof EMediaVariantSize];

export const EMediaVariantFormat = {
  WEBP: 'WEBP',
  JPEG: 'JPEG',
} as const;

export type EMediaVariantFormat =
  (typeof EMediaVariantFormat)[keyof typeof EMediaVariantFormat];

export const EMediaContentType = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  MP4: 'video/mp4',
} as const;

export type EMediaContentType =
  (typeof EMediaContentType)[keyof typeof EMediaContentType];

/** video/mp4 is accepted for LISTING only, and carries its own size ceiling. */
export const MEDIA_VIDEO_CONTENT_TYPES: string[] = [EMediaContentType.MP4];

export function isVideoContentType(contentType: string): boolean {
  return MEDIA_VIDEO_CONTENT_TYPES.includes(contentType);
}

/** 10 MiB — the documented ceiling for images on POST /media/uploads. */
export const MEDIA_MAX_BYTE_SIZE = 10_485_760;

/** 50 MiB — the documented ceiling for video/mp4. */
export const MEDIA_MAX_VIDEO_BYTE_SIZE = 52_428_800;

export interface IMediaVariant {
  size: EMediaVariantSize;
  format: EMediaVariantFormat;
  width: number;
  height: number;
  byteSize: number;
  /** Absent for EVIDENCE assets — they never expose public URLs. */
  publicUrl?: string;
}

export interface IMediaAsset {
  id: string;
  purpose: EMediaPurpose;
  ownerId: string;
  status: EMediaAssetStatus;
  contentType: string;
  byteSize: number;
  variants: IMediaVariant[];
  createdAt: string;
  updatedAt?: string;
}

/** `POST /media/uploads` */
export interface INewMediaUpload {
  id?: string;
  purpose: EMediaPurpose;
  ownerId: string;
  contentType: EMediaContentType;
  byteSize: number;
}

/** Short-lived presigned target — the binary PUT does not go through the API. */
export interface IMediaUploadTarget {
  url: string;
  headers?: Record<string, string>;
  method?: string;
  expiresAt: string;
}

export type IMediaUploadGrant = IMediaAsset & {
  upload: IMediaUploadTarget;
};

/** `GET /media/assets/{id}/content` */
export interface IMediaContentGrant {
  url: string;
  expiresAt: string;
}

/** Only READY assets may be rendered — never PENDING_UPLOAD/PROCESSING/FAILED. */
export function isRenderable(asset: IMediaAsset | null | undefined): boolean {
  return asset?.status === EMediaAssetStatus.READY;
}

export function findVariant(
  asset: IMediaAsset | null | undefined,
  size: EMediaVariantSize,
): IMediaVariant | undefined {
  if (!isRenderable(asset)) return undefined;
  return asset?.variants.find((variant) => variant.size === size);
}

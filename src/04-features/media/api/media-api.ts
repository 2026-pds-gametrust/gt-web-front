import axios from 'axios';
import { getActorId, httpClient } from '@shared/lib/http';
import type {
  IMediaAsset,
  IMediaContentGrant,
  IMediaUploadGrant,
  INewMediaUpload,
} from '@entities/media-asset/model';
import {
  EMediaAssetStatus,
  EMediaContentType,
  MEDIA_MAX_BYTE_SIZE,
  MEDIA_MAX_VIDEO_BYTE_SIZE,
  isVideoContentType,
  type EMediaPurpose,
} from '@entities/media-asset/model';

const ALLOWED_CONTENT_TYPES: string[] = Object.values(EMediaContentType);

export class MediaUploadError extends Error {
  readonly reason: 'CONTENT_TYPE' | 'BYTE_SIZE' | 'PROCESSING_FAILED' | 'TIMEOUT';

  constructor(reason: MediaUploadError['reason'], message: string) {
    super(message);
    this.name = 'MediaUploadError';
    this.reason = reason;
  }
}

function assertUploadable(file: { type: string; size: number }): EMediaContentType {
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    throw new MediaUploadError(
      'CONTENT_TYPE',
      'Envie uma imagem JPEG, PNG ou WEBP, ou um vídeo MP4.',
    );
  }

  // Video carries its own ceiling: 50 MiB against the 10 MiB used for images.
  const isVideo = isVideoContentType(file.type);
  const maxBytes = isVideo ? MEDIA_MAX_VIDEO_BYTE_SIZE : MEDIA_MAX_BYTE_SIZE;
  if (file.size <= 0 || file.size > maxBytes) {
    throw new MediaUploadError(
      'BYTE_SIZE',
      isVideo ? 'O vídeo precisa ter até 50 MB.' : 'A imagem precisa ter até 10 MB.',
    );
  }

  return file.type as EMediaContentType;
}

/**
 * Headers the grant may carry for server-side clients but that a browser refuses to let
 * JavaScript set — the user agent derives them from the request itself. Forwarding them
 * verbatim makes the PUT fail with "Refused to set unsafe header".
 */
const BROWSER_FORBIDDEN_HEADERS = ['content-length', 'host', 'connection'];

function sanitizeUploadHeaders(
  headers: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (!headers) return undefined;
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([name]) => !BROWSER_FORBIDDEN_HEADERS.includes(name.toLowerCase()),
    ),
  );
}

export interface IUploadImageInput {
  file: File;
  purpose: EMediaPurpose;
  /** Defaults to the session actor — never a header-supplied identity. */
  ownerId?: string;
  onStatusChange?: (asset: IMediaAsset) => void;
}

export interface IWaitOptions {
  intervalMs?: number;
  timeoutMs?: number;
  onStatusChange?: (asset: IMediaAsset) => void;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const mediaApi = {
  /** `POST /media/uploads` → 201 asset + short-lived presigned target. */
  async createUploadGrant(input: INewMediaUpload): Promise<IMediaUploadGrant> {
    const { data } = await httpClient.post<IMediaUploadGrant>('/media/uploads', input);
    return data;
  },

  /**
   * The binary itself goes straight to storage on the presigned URL — not
   * through the API — so it must not carry our Bearer token or baseURL.
   */
  async uploadBinary(grant: IMediaUploadGrant, file: Blob): Promise<void> {
    await axios.request({
      url: grant.upload.url,
      method: grant.upload.method ?? 'PUT',
      data: file,
      headers: sanitizeUploadHeaders(grant.upload.headers) ?? {
        'Content-Type': file.type,
      },
    });
  },

  /** `POST /media/uploads/{id}/complete` → 200; processing may start here. */
  async completeUpload(id: string): Promise<IMediaAsset> {
    const { data } = await httpClient.post<IMediaAsset>(`/media/uploads/${id}/complete`);
    return data;
  },

  /** `GET /media/assets/{id}` → 200 metadata. Evidence exposes no public URL. */
  async getAsset(id: string): Promise<IMediaAsset | null> {
    const { data } = await httpClient.get<IMediaAsset>(`/media/assets/${id}`);
    return data;
  },

  /** `GET /media/assets/{id}/content` → 200 short-lived presigned GET. */
  async getContentGrant(id: string): Promise<IMediaContentGrant> {
    const { data } = await httpClient.get<IMediaContentGrant>(
      `/media/assets/${id}/content`,
    );
    return data;
  },

  /**
   * Polls until the asset is READY. Nothing may be rendered — or attached to a
   * listing — while it is PENDING_UPLOAD, UPLOADED or PROCESSING.
   */
  async waitUntilReady(id: string, options: IWaitOptions = {}): Promise<IMediaAsset> {
    const { intervalMs = 800, timeoutMs = 30_000, onStatusChange } = options;
    const deadline = Date.now() + timeoutMs;

    for (;;) {
      const asset = await this.getAsset(id);
      if (asset) {
        onStatusChange?.(asset);
        if (asset.status === EMediaAssetStatus.READY) return asset;
        if (asset.status === EMediaAssetStatus.FAILED) {
          throw new MediaUploadError(
            'PROCESSING_FAILED',
            'O processamento da imagem falhou. Envie outra foto.',
          );
        }
      }

      if (Date.now() >= deadline) {
        throw new MediaUploadError(
          'TIMEOUT',
          'A imagem ainda está sendo processada. Tente de novo em instantes.',
        );
      }
      await wait(intervalMs);
    }
  },

  /**
   * The documented four-step flow: grant → binary PUT → complete → poll READY.
   * Resolves only with an asset that is safe to attach to a listing.
   *
   * Handles images and video alike — `complete` answers UPLOADED and only the poll
   * that follows guarantees the asset can be attached.
   */
  async uploadAsset({
    file,
    purpose,
    ownerId,
    onStatusChange,
  }: IUploadImageInput): Promise<IMediaAsset> {
    const contentType = assertUploadable(file);
    const owner = ownerId ?? getActorId();
    if (!owner) {
      throw new MediaUploadError('CONTENT_TYPE', 'Entre na sua conta para enviar fotos.');
    }

    const grant = await this.createUploadGrant({
      purpose,
      ownerId: owner,
      contentType,
      byteSize: file.size,
    });

    await this.uploadBinary(grant, file);
    const completed = await this.completeUpload(grant.id);
    onStatusChange?.(completed);

    return this.waitUntilReady(grant.id, { onStatusChange });
  },

  /** Kept for callers that only ever send images. */
  async uploadImage(input: IUploadImageInput): Promise<IMediaAsset> {
    return this.uploadAsset(input);
  },
};

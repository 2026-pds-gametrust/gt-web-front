import axios from 'axios';
import { clearSession, setSession } from '@shared/lib/http';
import { installHttpStub, type IHttpStub } from '@shared/lib/testing/http-stub';
import {
  EMediaAssetStatus,
  EMediaPurpose,
  MEDIA_MAX_BYTE_SIZE,
  type IMediaAsset,
} from '@entities/media-asset/model';
import { MediaUploadError, mediaApi } from '../api/media-api';

function fakeFile(type: string, size: number): File {
  // Only `type` and `size` are read before the presigned PUT.
  return { type, size } as File;
}

function anAsset(overrides: Partial<IMediaAsset> = {}): IMediaAsset {
  return {
    id: 'asset-1',
    purpose: EMediaPurpose.LISTING,
    ownerId: 'user-carlos-1',
    status: EMediaAssetStatus.PENDING_UPLOAD,
    contentType: 'image/jpeg',
    byteSize: 245_000,
    variants: [],
    createdAt: '2026-08-01T12:00:00.000Z',
    ...overrides,
  };
}

const GRANT = {
  ...anAsset(),
  upload: {
    url: 'https://storage.example/uploads/asset-1',
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    expiresAt: '2026-08-01T12:10:00.000Z',
  },
};

let stub: IHttpStub;

describe('media upload flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    stub = installHttpStub();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    stub.restore();
  });

  it('runs grant → binary PUT → complete → poll and resolves only when READY', async () => {
    const put = jest.spyOn(axios, 'request').mockResolvedValue({ status: 200 });
    let polls = 0;

    stub.setRoutes({
      'POST /media/uploads': [201, GRANT],
      'POST /media/uploads/:id/complete': [
        200,
        anAsset({ status: EMediaAssetStatus.PROCESSING }),
      ],
      'GET /media/assets/:id': () => {
        polls += 1;
        return polls === 1
          ? [200, anAsset({ status: EMediaAssetStatus.PROCESSING })]
          : [
              200,
              anAsset({
                status: EMediaAssetStatus.READY,
                variants: [
                  {
                    size: 'THUMBNAIL',
                    format: 'WEBP',
                    width: 160,
                    height: 160,
                    byteSize: 4_000,
                    publicUrl: 'https://cdn.example/thumb.webp',
                  },
                ],
              }),
            ];
      },
    });

    const statuses: string[] = [];
    const asset = await mediaApi.uploadImage({
      file: fakeFile('image/jpeg', 245_000),
      purpose: EMediaPurpose.LISTING,
      ownerId: 'user-carlos-1',
      onStatusChange: (current) => statuses.push(current.status),
    });

    expect(asset.status).toBe(EMediaAssetStatus.READY);
    expect(statuses).toEqual(['PROCESSING', 'PROCESSING', 'READY']);

    // The binary goes straight to storage: no baseURL, no Bearer.
    expect(put).toHaveBeenCalledWith(
      expect.objectContaining({ url: GRANT.upload.url, method: 'PUT' }),
    );
    expect(stub.calls.some((call) => call.url.includes('storage.example'))).toBe(false);
  }, 10_000);

  it('takes the owner from the session when the caller omits it', async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ status: 200 });
    setSession({ accessToken: 'jwt', refreshToken: 'rt', userId: 'user-carlos-1' });

    stub.setRoutes({
      'POST /media/uploads': [201, GRANT],
      'POST /media/uploads/:id/complete': [200, anAsset({ status: 'PROCESSING' })],
      'GET /media/assets/:id': [200, anAsset({ status: EMediaAssetStatus.READY })],
    });

    await mediaApi.uploadImage({
      file: fakeFile('image/png', 2_000),
      purpose: EMediaPurpose.LISTING,
    });

    expect(stub.callsFor('POST /media/uploads')[0]?.body).toMatchObject({
      ownerId: 'user-carlos-1',
      purpose: 'LISTING',
      contentType: 'image/png',
      byteSize: 2_000,
    });
  });

  it('surfaces a FAILED asset instead of waiting for a timeout', async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ status: 200 });

    stub.setRoutes({
      'POST /media/uploads': [201, GRANT],
      'POST /media/uploads/:id/complete': [200, anAsset({ status: 'PROCESSING' })],
      'GET /media/assets/:id': [200, anAsset({ status: EMediaAssetStatus.FAILED })],
    });

    await expect(
      mediaApi.uploadImage({
        file: fakeFile('image/jpeg', 1_000),
        purpose: EMediaPurpose.LISTING,
        ownerId: 'user-carlos-1',
      }),
    ).rejects.toMatchObject({ name: 'MediaUploadError', reason: 'PROCESSING_FAILED' });
  });

  it('rejects unsupported types and oversized files before asking for a grant', async () => {
    await expect(
      mediaApi.uploadImage({
        file: fakeFile('image/gif', 1_000),
        purpose: EMediaPurpose.LISTING,
        ownerId: 'user-carlos-1',
      }),
    ).rejects.toMatchObject({ name: 'MediaUploadError', reason: 'CONTENT_TYPE' });

    await expect(
      mediaApi.uploadImage({
        file: fakeFile('image/jpeg', MEDIA_MAX_BYTE_SIZE + 1),
        purpose: EMediaPurpose.LISTING,
        ownerId: 'user-carlos-1',
      }),
    ).rejects.toBeInstanceOf(MediaUploadError);

    // Nothing was requested: the ceiling is enforced before the round trip.
    expect(stub.calls).toHaveLength(0);
  });

  it('maps a rejected grant to an ApiError with its code', async () => {
    stub.setRoutes({
      'POST /media/uploads': [400, { error: 'Invalid size', code: 'FIELD_INVALID' }],
    });

    await expect(
      mediaApi.createUploadGrant({
        purpose: EMediaPurpose.PRODUCT,
        ownerId: 'user-carlos-1',
        contentType: 'image/jpeg',
        byteSize: 999,
      }),
    ).rejects.toMatchObject({ name: 'ApiError', status: 400, code: 'FIELD_INVALID' });
  });
});

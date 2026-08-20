import { ApiError } from '@shared/lib/http';
import { EListingCondition, EListingStatus, EShippingMode, type IListing } from '@entities/listing/model';
import { describeModerationError } from './describe-moderation-error';

const listing: IListing = {
  id: 'lst-1',
  sellerId: 'seller-1',
  productId: 'prod-1',
  title: 'RTX 4090',
  condition: EListingCondition.GOOD,
  priceCents: 1,
  currency: 'BRL',
  media: { photoUrls: ['https://cdn.example/p.webp'] },
  shipping: { modes: [EShippingMode.SHIPPING] },
  acceptsOffers: false,
  buyNowEnabled: true,
  quantity: 1,
  status: EListingStatus.SUBMITTED,
  createdAt: '2026-08-20T12:00:00.000Z',
};

describe('describeModerationError', () => {
  it('should explain missing PHOTO evidence', () => {
    const error = new ApiError({
      message: 'required',
      kind: 'translated',
      status: 400,
      code: 'STATUS_REQUIRES_FIELDS',
    });
    expect(describeModerationError(error, listing)).toMatch(/evidência PHOTO/i);
  });

  it('should explain missing shipping package on publish', () => {
    const error = new ApiError({
      message: 'invalid',
      kind: 'translated',
      status: 400,
      code: 'FIELD_INVALID',
    });
    expect(describeModerationError(error, listing)).toMatch(/peso e medidas/i);
  });
});

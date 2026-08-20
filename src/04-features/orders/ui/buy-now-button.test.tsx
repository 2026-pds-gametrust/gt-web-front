import {
  EListingCondition,
  EListingStatus,
  EShippingMode,
  type IListing,
} from '@entities/listing/model';
import { buyNowEligibility } from './buy-now-button';

const baseListing: IListing = {
  id: 'lst-1',
  sellerId: 'seller-1',
  productId: 'prod-1',
  title: 'RTX 4090',
  condition: EListingCondition.GOOD,
  priceCents: 350000,
  currency: 'BRL',
  media: { photoUrls: ['https://cdn.example/p.webp'] },
  shipping: { modes: [EShippingMode.PICKUP] },
  acceptsOffers: false,
  buyNowEnabled: true,
  quantity: 1,
  status: EListingStatus.PUBLISHED,
  createdAt: '2026-08-20T12:00:00.000Z',
};

describe('buyNowEligibility', () => {
  it('should allow a different authenticated buyer', () => {
    expect(buyNowEligibility(baseListing, 'buyer-1')).toEqual({ eligible: true });
  });

  it('should hide CTA for the seller', () => {
    expect(buyNowEligibility(baseListing, 'seller-1')).toMatchObject({
      eligible: false,
      hideCta: true,
    });
  });

  it('should block sold listings', () => {
    expect(
      buyNowEligibility({ ...baseListing, status: EListingStatus.SOLD }, 'buyer-1'),
    ).toMatchObject({ eligible: false });
  });

  it('should block when buyNow is disabled', () => {
    expect(
      buyNowEligibility({ ...baseListing, buyNowEnabled: false }, 'buyer-1'),
    ).toMatchObject({ eligible: false });
  });
});

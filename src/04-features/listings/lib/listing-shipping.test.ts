import { EListingCondition, EListingStatus, EShippingMode, type IListing } from '@entities/listing/model';
import {
  buildListingShipping,
  formatShippingSummary,
  listingDeliveryIncompleteReason,
  listingIsBlockedFromPublish,
  packageDimsAreComplete,
} from './listing-shipping';

function listing(shipping: IListing['shipping']): IListing {
  return {
    id: 'lst-1',
    sellerId: 'seller-1',
    productId: 'prod-1',
    title: 'RTX 4090',
    condition: EListingCondition.GOOD,
    priceCents: 1,
    currency: 'BRL',
    media: { photoUrls: ['https://cdn.example/p.webp'] },
    shipping,
    acceptsOffers: false,
    buyNowEnabled: true,
    quantity: 1,
    status: EListingStatus.SUBMITTED,
    createdAt: '2026-08-20T12:00:00.000Z',
  };
}

describe('listingIsBlockedFromPublish', () => {
  it('should allow pickup-only listings', () => {
    expect(
      listingIsBlockedFromPublish(listing({ modes: [EShippingMode.PICKUP] })),
    ).toBe(false);
  });

  it('should block shipping without package size', () => {
    expect(
      listingIsBlockedFromPublish(listing({ modes: [EShippingMode.SHIPPING] })),
    ).toBe(true);
  });

  it('should allow shipping when weight and box size are present', () => {
    expect(
      listingIsBlockedFromPublish(
        listing({
          modes: [EShippingMode.SHIPPING],
          packageWeightGrams: 800,
          packageLengthCm: 30,
          packageWidthCm: 20,
          packageHeightCm: 10,
        }),
      ),
    ).toBe(false);
  });
});

describe('buildListingShipping', () => {
  it('should omit package fields for pickup-only', () => {
    expect(
      buildListingShipping([EShippingMode.PICKUP], { packageWeightGrams: 800 }),
    ).toEqual({ modes: [EShippingMode.PICKUP] });
  });
});

describe('listingDeliveryIncompleteReason', () => {
  it('should ask for a delivery mode when none is selected', () => {
    expect(
      listingDeliveryIncompleteReason([], {
        packageWeightGrams: 0,
        packageLengthCm: 0,
        packageWidthCm: 0,
        packageHeightCm: 0,
      }),
    ).toMatch(/forma de entrega/i);
  });

  it('should ask for package size when shipping is selected', () => {
    expect(
      listingDeliveryIncompleteReason([EShippingMode.SHIPPING], {
        packageWeightGrams: 0,
        packageLengthCm: 0,
        packageWidthCm: 0,
        packageHeightCm: 0,
      }),
    ).toMatch(/peso e medidas/i);
  });
});

describe('formatShippingSummary', () => {
  it('should show missing package on shipping without box size', () => {
    expect(
      formatShippingSummary([EShippingMode.SHIPPING], {
        packageWeightGrams: 0,
        packageLengthCm: 0,
        packageWidthCm: 0,
        packageHeightCm: 0,
      }),
    ).toMatch(/falta peso e medidas/i);
  });

  it('should include box size when complete', () => {
    expect(
      formatShippingSummary([EShippingMode.SHIPPING], {
        packageWeightGrams: 800,
        packageLengthCm: 30,
        packageWidthCm: 20,
        packageHeightCm: 10,
      }),
    ).toBe('Envio por transportadora · 800 g · 30×20×10 cm');
  });
});

describe('packageDimsAreComplete', () => {
  it('should reject zero weight', () => {
    expect(
      packageDimsAreComplete({
        packageWeightGrams: 0,
        packageLengthCm: 10,
        packageWidthCm: 10,
        packageHeightCm: 10,
      }),
    ).toBe(false);
  });
});

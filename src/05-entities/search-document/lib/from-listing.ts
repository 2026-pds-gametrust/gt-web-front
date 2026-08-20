import type { IListing } from '@entities/listing/model';
import type { IProduct } from '@entities/product/model';
import type { ISearchDocument } from '../model';

/**
 * Local projection of a Listing into the card shape, for screens that already
 * hold listings and must not pretend they came out of `GET /search` (the
 * product page, "other offers of this model").
 *
 * Only fields the caller actually has are filled. Trust and seals are left
 * undefined on purpose: they belong to `/trust-scores` and `/seals`, and a card
 * must never show a seal it did not read from the API.
 */
export function searchDocumentFromListing(
  listing: IListing,
  product?: IProduct | null,
): ISearchDocument {
  const brand = product?.brand;
  const model = product?.model;

  return {
    id: listing.id,
    listingId: listing.id,
    productId: listing.productId,
    categoryId: product?.categoryId ?? '',
    sellerId: listing.sellerId,
    title: listing.title,
    brand,
    model,
    condition: listing.condition,
    status: listing.status,
    priceCents: listing.priceCents,
    listPriceCents: listing.listPriceCents,
    currency: listing.currency,
    locationApprox: listing.locationApprox,
    shippingModes: listing.shipping.modes,
    freeShipping: listing.shipping.freeShipping,
    thumbnailUrl: listing.media.photoUrls[0],
    searchText: [listing.title, brand, model].filter(Boolean).join(' ').toLowerCase(),
    sourceOccurredAt: listing.updatedAt ?? listing.createdAt,
    updatedAt: listing.updatedAt,
  };
}

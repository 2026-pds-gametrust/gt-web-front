import { catalogApi } from '@features/catalog/api/catalog-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { trustApi } from '@features/trust-display/api/trust-api';
import { verificationApi } from '@features/verification/api/verification-api';
import type { ITrustDisplay } from '@entities/trust-score/model';

/** Facade for listing detail page — composes domain feature APIs. */
export const listingApi = {
  getListing: (id: string) => listingsApi.getListing(id),
  /** Granted seals only — a card never paints a seal it did not read. */
  getSeals: (listingId: string) => verificationApi.getGrantedSeals(listingId),
  /** Returns ITrustDisplay for UI (score + level + reasons). */
  getTrustScore: (sellerId: string): Promise<ITrustDisplay | null> =>
    trustApi.getTrustDisplay(sellerId),
  getListingsByProduct: (productId: string) => listingsApi.getListingsByProduct(productId),
  getSimilarListings: (listingId: string) => listingsApi.getSimilarListings(listingId),
  getProduct: (id: string) => catalogApi.getProduct(id),
};

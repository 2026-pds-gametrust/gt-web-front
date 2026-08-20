/**
 * Projection of a PUBLISHED listing, as returned by `GET /search`.
 *
 * Every field here exists in the OpenAPI `SearchDocument` schema. Anything the
 * card wants but the contract does not carry (badges, "reasons", editorial
 * copy) has to be fetched from its own endpoint — it is never invented here.
 */
export interface ISearchDocument {
  id: string;
  listingId: string;
  productId: string;
  categoryId: string;
  sellerId: string;
  title: string;
  brand?: string;
  model?: string;
  condition: string;
  status: string;
  priceCents: number;
  listPriceCents?: number;
  currency: string;
  locationApprox?: string;
  shippingModes?: string[];
  freeShipping?: boolean;
  trustScore?: number;
  sellerLevel?: string;
  sealTypes?: string[];
  facets?: Record<string, string | number | boolean>;
  searchText: string;
  thumbnailUrl?: string;
  embedding?: number[] | null;
  sourceOccurredAt: string;
  updatedAt?: string;
}

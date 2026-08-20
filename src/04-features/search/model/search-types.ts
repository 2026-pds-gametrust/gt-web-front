import type { ISearchDocument } from '@entities/search-document/model';

export interface ISearchFilters {
  condition?: string;
  brand?: string;
  /** Only offers that already carry a granted seal. */
  verifiedOnly?: boolean;
  minPriceCents?: number;
  maxPriceCents?: number;
  freeShipping?: boolean;
}

export interface ISearchParams {
  q?: string;
  /** UI toggle only — the API always answers with offer documents. */
  view?: 'offers' | 'products';
  filters?: ISearchFilters;
  categoryId?: string;
  userId?: string;
}

export interface IProductGroup {
  productId: string;
  brand: string;
  model: string;
  offerCount: number;
  minPriceCents: number;
  maxPriceCents: number;
  currency: string;
}

/**
 * `GET /search` answers a flat `SearchDocument[]`. Grouping by model, facet
 * values and the total are derived on the client from that array — there is no
 * aggregation endpoint, so nothing here is invented, only counted.
 */
export interface ISearchResult {
  documents: ISearchDocument[];
  productGroups: IProductGroup[];
  facets: {
    conditions: string[];
    brands: string[];
  };
  total: number;
}

export interface ICategoryShortcut {
  id: string;
  name: string;
  href: string;
}

export interface IHomeFeed {
  categories: ICategoryShortcut[];
  /** Documents whose listing already carries at least one granted seal. */
  verifiedOffers: ISearchDocument[];
  popularOffers: ISearchDocument[];
}

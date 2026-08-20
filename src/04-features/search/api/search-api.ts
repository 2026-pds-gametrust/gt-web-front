import { httpClient } from '@shared/lib/http';
import type { ISearchDocument } from '@entities/search-document/model';
import type { ICategory } from '@entities/category/model';
import type { ISynonym, ISearchReconcileResult } from '@entities/synonym/model';
import type {
  IHomeFeed,
  IProductGroup,
  ISearchFilters,
  ISearchParams,
  ISearchResult,
} from '../model/search-types';

const HOME_RAIL_SIZE = 8;
const MAX_SUGGESTIONS = 6;

function groupByProduct(documents: ISearchDocument[]): IProductGroup[] {
  const groups = new Map<string, IProductGroup>();

  for (const doc of documents) {
    const current = groups.get(doc.productId);
    if (!current) {
      groups.set(doc.productId, {
        productId: doc.productId,
        brand: doc.brand ?? '',
        model: doc.model ?? doc.title,
        offerCount: 1,
        minPriceCents: doc.priceCents,
        maxPriceCents: doc.priceCents,
        currency: doc.currency,
      });
      continue;
    }
    current.offerCount += 1;
    current.minPriceCents = Math.min(current.minPriceCents, doc.priceCents);
    current.maxPriceCents = Math.max(current.maxPriceCents, doc.priceCents);
  }

  return [...groups.values()];
}

function distinct(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function narrowByFilters(
  documents: ISearchDocument[],
  filters: ISearchFilters | undefined,
): ISearchDocument[] {
  if (!filters) return documents;

  return documents.filter((doc) => {
    if (filters.condition && doc.condition !== filters.condition) return false;
    if (filters.brand && doc.brand !== filters.brand) return false;
    if (filters.verifiedOnly && (doc.sealTypes?.length ?? 0) === 0) return false;
    if (filters.freeShipping && !doc.freeShipping) return false;
    if (filters.minPriceCents !== undefined && doc.priceCents < filters.minPriceCents) {
      return false;
    }
    if (filters.maxPriceCents !== undefined && doc.priceCents > filters.maxPriceCents) {
      return false;
    }
    return true;
  });
}

export const searchApi = {
  /** `GET /search` — returns SearchDocument[]; the shaping below is client-side. */
  async search(params: ISearchParams = {}): Promise<ISearchResult> {
    const { data } = await httpClient.get<ISearchDocument[]>('/search', {
      params: {
        q: params.q,
        categoryId: params.categoryId,
        userId: params.userId,
        // The contract takes facet filters as a JSON string.
        filters: params.filters ? JSON.stringify(params.filters) : undefined,
      },
    });

    // The contract does not pin down which facet keys the index honours, so the
    // same narrowing is re-applied here against fields the document really has.
    // Idempotent when the server already filtered; correct when it did not.
    const documents = narrowByFilters(Array.isArray(data) ? data : [], params.filters);

    return {
      documents,
      productGroups: groupByProduct(documents),
      facets: {
        conditions: distinct(documents.map((doc) => doc.condition)),
        brands: distinct(documents.map((doc) => doc.brand)),
      },
      total: documents.length,
    };
  },

  async listSynonyms(): Promise<ISynonym[]> {
    const { data } = await httpClient.get<ISynonym[]>('/synonyms');
    return data;
  },

  async reconcile(): Promise<ISearchReconcileResult> {
    const { data } = await httpClient.post<ISearchReconcileResult>('/search/reconcile');
    return data;
  },

  /**
   * Autocomplete over what the index actually holds. There is no suggestions
   * endpoint, so the terms come from the documents `GET /search` returns for
   * the partial query — never from a made-up term list.
   */
  async getSuggestions(q: string): Promise<string[]> {
    const query = q.trim();
    if (query.length < 2) return [];

    const { documents } = await this.search({ q: query });
    const terms = documents.flatMap((doc) => [
      doc.brand && doc.model ? `${doc.brand} ${doc.model}` : undefined,
      doc.title,
    ]);

    return distinct(terms).slice(0, MAX_SUGGESTIONS);
  },

  /**
   * Home rails composed from public discovery endpoints. Anything editorial
   * (campaign banners, "recommended because…") has no endpoint in this API and
   * is therefore not shown at all.
   */
  async getHomeFeed(): Promise<IHomeFeed> {
    const [categories, result] = await Promise.all([
      httpClient
        .get<ICategory[]>('/categories')
        .then((response) => response.data)
        .catch(() => [] as ICategory[]),
      this.search(),
    ]);

    const verifiedOffers = result.documents
      .filter((doc) => (doc.sealTypes?.length ?? 0) > 0)
      .slice(0, HOME_RAIL_SIZE);

    return {
      categories: categories.slice(0, 8).map((category) => ({
        id: category.id,
        name: category.name,
        href: `/buscar?categoria=${encodeURIComponent(category.id)}`,
      })),
      verifiedOffers,
      popularOffers: result.documents.slice(0, HOME_RAIL_SIZE),
    };
  },
};

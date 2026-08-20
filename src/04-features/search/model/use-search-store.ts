import { create } from 'zustand';
import type { ISearchDocument } from '@entities/search-document/model';
import type { ISearchResult } from './search-types';
import { searchApi } from '../api/search-api';

export type SearchView = 'offers' | 'products';

type SearchState = {
  query: string;
  view: SearchView;
  conditionFilter: string | null;
  brandFilter: string | null;
  verifiedOnly: boolean;
  loading: boolean;
  error: string | null;
  result: ISearchResult | null;
  suggestions: string[];
  setQuery: (query: string) => void;
  setView: (view: SearchView) => void;
  setConditionFilter: (value: string | null) => void;
  setBrandFilter: (value: string | null) => void;
  setVerifiedOnly: (value: boolean) => void;
  fetchSuggestions: (q: string) => Promise<void>;
  runSearch: (overrides?: Partial<{ q: string; view: SearchView; verifiedOnly: boolean }>) => Promise<void>;
};

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  view: 'offers',
  conditionFilter: null,
  brandFilter: null,
  verifiedOnly: false,
  loading: false,
  error: null,
  result: null,
  suggestions: [],

  setQuery: (query) => set({ query }),
  setView: (view) => set({ view }),
  setConditionFilter: (conditionFilter) => set({ conditionFilter }),
  setBrandFilter: (brandFilter) => set({ brandFilter }),
  setVerifiedOnly: (verifiedOnly) => set({ verifiedOnly }),

  fetchSuggestions: async (q) => {
    const suggestions = await searchApi.getSuggestions(q);
    set({ suggestions });
  },

  runSearch: async (overrides = {}) => {
    const state = get();
    const q = overrides.q ?? state.query;
    const view = overrides.view ?? state.view;
    const verifiedOnly = overrides.verifiedOnly ?? state.verifiedOnly;
    set({ loading: true, error: null, query: q, view, verifiedOnly });
    try {
      const result = await searchApi.search({
        q,
        view,
        filters: {
          condition: state.conditionFilter ?? undefined,
          brand: state.brandFilter ?? undefined,
          verifiedOnly: verifiedOnly || undefined,
        },
      });
      set({ result, loading: false });
    } catch {
      set({ loading: false, error: 'Não foi possível carregar os resultados.' });
    }
  },
}));

export type { ISearchDocument };

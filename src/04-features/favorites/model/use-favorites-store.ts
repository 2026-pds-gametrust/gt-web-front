import { create } from 'zustand';
import { favoritesApi } from '../api/favorites-api';
import {
  EFavoriteTargetType,
  type EFavoriteTargetType as FavoriteTarget,
  type IFavorite,
} from '@entities/favorite/model';
type FavoritesState = {
  items: IFavorite[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  toggle: (targetType: FavoriteTarget, targetId: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  isFavorite: (targetType: FavoriteTarget, targetId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // No userId argument: the actor comes from the session (JWT), never the UI.
  async load() {
    set({ loading: true, error: null });
    try {
      const items = await favoritesApi.listFavorites();
      set({ items, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Não foi possível carregar favoritos',
      });
    }
  },

  isFavorite(targetType, targetId) {
    return get().items.some((f) => f.targetType === targetType && f.targetId === targetId);
  },

  async toggle(targetType, targetId) {
    const existing = get().items.find(
      (f) => f.targetType === targetType && f.targetId === targetId,
    );
    if (existing) {
      await favoritesApi.deleteFavorite(existing.id);
      set({ items: get().items.filter((f) => f.id !== existing.id) });
      return;
    }
    const created = await favoritesApi.createFavorite({
      id: `fav-${Date.now()}`,
      targetType,
      targetId,
    });
    set({ items: [...get().items, created] });
  },

  async remove(id) {
    await favoritesApi.deleteFavorite(id);
    set({ items: get().items.filter((f) => f.id !== id) });
  },
}));

export { EFavoriteTargetType };

import { useEffect } from 'react';
import {
  EFavoriteTargetType,
  useFavoritesStore,
} from '@features/favorites/model/use-favorites-store';

type FavoriteToggleProps = {
  targetType: (typeof EFavoriteTargetType)[keyof typeof EFavoriteTargetType];
  targetId: string;
  label?: string;
};

export function FavoriteToggle({
  targetType,
  targetId,
  label = 'Favoritar',
}: FavoriteToggleProps) {
  const load = useFavoritesStore((s) => s.load);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(targetType, targetId));

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <button
      type="button"
      className={`gt-button gt-button--ghost favorite-toggle${isFavorite ? ' is-active' : ''}`}
      aria-pressed={isFavorite}
      onClick={() => {
        void toggle(targetType, targetId);
      }}
    >
      {isFavorite ? 'Remover dos favoritos' : label}
    </button>
  );
}

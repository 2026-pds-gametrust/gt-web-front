import { useEffect } from 'react';
import {
  EFavoriteTargetType,
  useFavoritesStore,
} from '@features/favorites/model/use-favorites-store';

type FavoriteToggleProps = {
  targetType: (typeof EFavoriteTargetType)[keyof typeof EFavoriteTargetType];
  targetId: string;
  /** Accessible name when the item is not yet favorited. */
  label?: string;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="favorite-toggle__icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 20.25 10.55 18.93C6.4 15.16 3.5 12.52 3.5 9.25 3.5 6.62 5.62 4.5 8.25 4.5c1.54 0 3.04.72 4 1.84A5.16 5.16 0 0 1 16.25 4.5c2.63 0 4.75 2.12 4.75 4.75 0 3.27-2.9 5.91-7.05 9.68L12 20.25Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FavoriteToggle({
  targetType,
  targetId,
  label = 'Favoritar',
}: FavoriteToggleProps) {
  const load = useFavoritesStore((s) => s.load);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(targetType, targetId));
  const name = isFavorite ? 'Remover dos favoritos' : label;

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <button
      type="button"
      className={`favorite-toggle${isFavorite ? ' is-active' : ''}`}
      aria-label={name}
      aria-pressed={isFavorite}
      title={name}
      onClick={() => {
        void toggle(targetType, targetId);
      }}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
}

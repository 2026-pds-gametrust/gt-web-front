import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesPage } from './favorites-page';
import { useFavoritesStore } from '@features/favorites/model/use-favorites-store';
import { EFavoriteTargetType } from '@entities/favorite/model';

jest.mock('@features/favorites/api/favorites-api', () => ({
  favoritesApi: {
    listFavorites: jest.fn().mockResolvedValue([
      {
        id: 'fav-1',
        userId: 'user-dev-1',
        targetType: 'LISTING',
        targetId: 'lst-4060-verified',
        createdAt: '2026-08-01T12:00:00.000Z',
      },
    ]),
    createFavorite: jest.fn(),
    deleteFavorite: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('@features/catalog/api/catalog-api', () => ({
  catalogApi: {
    getProduct: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('@features/listings/api/listings-api', () => ({
  listingsApi: {
    getListing: jest.fn().mockResolvedValue({
      id: 'lst-4060-verified',
      title: 'ASUS Dual RTX 4060',
      priceCents: 164900,
      currency: 'BRL',
    }),
  },
}));

describe('FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ items: [], loading: false, error: null });
  });

  it('lists favorites and allows remove', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Favoritos' })).toBeInTheDocument();
    expect(await screen.findByText('ASUS Dual RTX 4060')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover' }));
    await waitFor(() => {
      expect(useFavoritesStore.getState().items).toEqual([]);
    });
  });
});

describe('favorites store toggle', () => {
  it('adds and removes favorite targets', async () => {
    const { favoritesApi } = jest.requireMock('@features/favorites/api/favorites-api') as {
      favoritesApi: {
        createFavorite: jest.Mock;
        deleteFavorite: jest.Mock;
      };
    };
    favoritesApi.createFavorite.mockResolvedValue({
      id: 'fav-new',
      userId: 'user-dev-1',
      targetType: EFavoriteTargetType.PRODUCT,
      targetId: 'prod-1',
      createdAt: '2026-08-01T12:00:00.000Z',
    });

    useFavoritesStore.setState({ items: [], loading: false, error: null });
    await useFavoritesStore.getState().toggle(EFavoriteTargetType.PRODUCT, 'prod-1');
    expect(useFavoritesStore.getState().isFavorite(EFavoriteTargetType.PRODUCT, 'prod-1')).toBe(
      true,
    );

    await useFavoritesStore.getState().toggle(EFavoriteTargetType.PRODUCT, 'prod-1');
    expect(useFavoritesStore.getState().isFavorite(EFavoriteTargetType.PRODUCT, 'prod-1')).toBe(
      false,
    );
  });
});

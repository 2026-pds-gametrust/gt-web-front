import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteToggle } from './favorite-toggle';
import {
  EFavoriteTargetType,
  useFavoritesStore,
} from '@features/favorites/model/use-favorites-store';

jest.mock('@features/favorites/model/use-favorites-store', () => {
  const actual = jest.requireActual('@features/favorites/model/use-favorites-store');
  return {
    ...actual,
    useFavoritesStore: jest.fn(),
  };
});

const useFavoritesStoreMock = useFavoritesStore as unknown as jest.Mock;

describe('FavoriteToggle', () => {
  const load = jest.fn().mockResolvedValue(undefined);
  const toggle = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    load.mockClear();
    toggle.mockClear();
  });

  it('shows a heart control labelled Favoritar when inactive', () => {
    useFavoritesStoreMock.mockImplementation((selector: (s: unknown) => unknown) =>
      selector({
        load,
        toggle,
        isFavorite: () => false,
      }),
    );

    render(
      <FavoriteToggle targetType={EFavoriteTargetType.LISTING} targetId="lst-1" />,
    );

    const button = screen.getByRole('button', { name: 'Favoritar' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).not.toHaveTextContent('Favoritar');
  });

  it('fills the heart and exposes Remover dos favoritos when active', async () => {
    useFavoritesStoreMock.mockImplementation((selector: (s: unknown) => unknown) =>
      selector({
        load,
        toggle,
        isFavorite: () => true,
      }),
    );
    const user = userEvent.setup();

    render(
      <FavoriteToggle targetType={EFavoriteTargetType.LISTING} targetId="lst-1" />,
    );

    const button = screen.getByRole('button', { name: 'Remover dos favoritos' });
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);
    expect(toggle).toHaveBeenCalledWith(EFavoriteTargetType.LISTING, 'lst-1');
  });
});

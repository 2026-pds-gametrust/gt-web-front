import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState title="Nenhum favorito ainda" action={<a href="/buscar">Buscar ofertas</a>}>
        Salve modelos para comparar.
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { name: 'Nenhum favorito ainda' })).toBeInTheDocument();
    expect(screen.getByText('Salve modelos para comparar.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buscar ofertas' })).toBeInTheDocument();
  });
});

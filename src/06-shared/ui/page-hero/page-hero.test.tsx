import { render, screen } from '@testing-library/react';
import { PageHero } from './page-hero';

describe('PageHero', () => {
  it('associates the heading with the section', () => {
    render(
      <PageHero titleId="search-heading" title="Buscar">
        <p>Compare modelos e ofertas.</p>
      </PageHero>,
    );

    expect(screen.getByRole('region', { name: 'Buscar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Buscar' })).toHaveAttribute('id', 'search-heading');
  });
});

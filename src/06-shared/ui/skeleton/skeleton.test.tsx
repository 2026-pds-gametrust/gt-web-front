import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('announces loading for the page variant', () => {
    render(<Skeleton label="Carregando vitrine…" />);

    expect(screen.getByText('Carregando vitrine…')).toBeInTheDocument();
    expect(screen.getByText('Carregando vitrine…').closest('[aria-busy="true"]')).toBeTruthy();
  });
});

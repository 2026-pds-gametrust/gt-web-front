import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ServerErrorPage } from './server-error-page';

describe('ServerErrorPage', () => {
  it('lets the visitor retry without inventing verification', () => {
    render(
      <MemoryRouter>
        <ServerErrorPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /frame drop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /início/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Principal' })).not.toBeInTheDocument();
    expect(screen.getByText(/nada foi publicado nem marcado como verificado/i)).toBeInTheDocument();
  });
});

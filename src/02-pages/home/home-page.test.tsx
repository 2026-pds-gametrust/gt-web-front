import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './home-page';
import { installHttpStub, type IHttpStub } from '@shared/lib/testing/http-stub';
import { aSearchDocument } from '@shared/lib/testing/fixtures';

const CATEGORIES = [
  {
    id: 'cat-gpu',
    slug: 'placas-de-video',
    name: 'Placas de Vídeo',
    status: 'ACTIVE',
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
  },
];

const SEALED = aSearchDocument({
  id: 'lst-4060-verified',
  listingId: 'lst-4060-verified',
  title: 'ASUS Dual RTX 4060 8GB — com selo',
  sealTypes: ['POSSESSION', 'FUNCTIONING'],
});

const PLAIN = aSearchDocument({
  id: 'lst-4070-plain',
  listingId: 'lst-4070-plain',
  title: 'MSI Ventus RTX 4070 12GB',
});

let stub: IHttpStub;

describe('HomePage', () => {
  beforeEach(() => {
    stub = installHttpStub();
  });

  afterEach(() => {
    stub.restore();
  });

  it('builds the rails from /categories and /search', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [200, [SEALED, PLAIN]],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(await screen.findAllByRole('search')).not.toHaveLength(0);
    expect(await screen.findByRole('navigation', { name: 'Departamentos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Placas de Vídeo' })).toBeInTheDocument();

    const verifiedRail = screen
      .getByRole('heading', { name: /Ofertas com verificação concluída/i })
      .closest('section');
    expect(verifiedRail).toHaveTextContent('com selo');
    expect(verifiedRail).not.toHaveTextContent('MSI Ventus');

    expect(screen.getByRole('link', { name: 'Começar a vender' })).toHaveAttribute('href', '/vender');
  });

  it('hides the verified rail when nothing carries a seal', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [200, [PLAIN]],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /Em destaque agora/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Ofertas com verificação concluída/i }),
    ).not.toBeInTheDocument();
  });

  it('shows card skeleton while loading then resolves', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [200, [PLAIN]],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Carregando vitrine/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Em destaque agora/i })).toBeInTheDocument();
  });

  it('shows FeedbackBanner with retry on feed error without leaving home', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [500, { error: 'boom' }],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(/vitrine/i);
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Tecnologia usada/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Em destaque agora/i })).not.toBeInTheDocument();
  });

  it('retries feed load from the error banner', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [500, { error: 'boom' }],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await screen.findByRole('alert');
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [200, [PLAIN]],
    });

    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByRole('heading', { name: /Em destaque agora/i })).toBeInTheDocument();
  });

  it('shows empty state when search returns no offers', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [200, []],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /Nenhuma oferta na vitrine/i })).toBeInTheDocument();
  });
});


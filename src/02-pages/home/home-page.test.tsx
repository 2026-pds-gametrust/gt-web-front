import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './home-page';
import { ServerErrorPage } from '@pages/error/server-error-page';
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

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/erro" element={<ServerErrorPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

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

    // The verified rail only holds documents that carry granted seals.
    const verifiedRail = screen
      .getByRole('heading', { name: /Ofertas com verificação concluída/i })
      .closest('section');
    expect(verifiedRail).toHaveTextContent('com selo');
    expect(verifiedRail).not.toHaveTextContent('MSI Ventus');

    expect(screen.getByRole('link', { name: 'Vender' })).toHaveAttribute('href', '/vender');
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

  it('redirects to the server error scene when search is down', async () => {
    stub.setRoutes({
      'GET /categories': [200, CATEGORIES],
      'GET /search': [500, { error: 'boom' }],
    });

    renderHome();

    expect(await screen.findByRole('heading', { name: /frame drop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Em destaque agora/i })).not.toBeInTheDocument();
  });
});

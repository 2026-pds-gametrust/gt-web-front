import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { OfferCard } from './offer-card';
import { aSearchDocument } from '@shared/lib/testing/fixtures';
import { ESealType } from '@entities/seal/model';

function renderCard(overrides: Parameters<typeof aSearchDocument>[0] = {}) {
  const document = aSearchDocument(overrides);
  return render(
    <MemoryRouter>
      <OfferCard document={document} reason="Próximo a você" />
    </MemoryRouter>,
  );
}

describe('OfferCard', () => {
  it('renders price, product link and offer title with accessible article name', () => {
    renderCard({ title: 'ASUS Dual RTX 4060 8GB' });

    expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('heading', { level: 3, name: 'ASUS Dual RTX 4060 8GB' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ASUS Dual GeForce RTX 4060 8GB' })).toHaveAttribute(
      'href',
      '/produto/prod-rtx-4060',
    );
    expect(screen.getByText(/R\$\s*1\.649,00/)).toBeInTheDocument();
    expect(screen.getByText(/Motivo: Próximo a você/)).toBeInTheDocument();
  });

  it('shows granted seals only via SealBadge (max 3)', () => {
    renderCard({
      sealTypes: [ESealType.POSSESSION, ESealType.FUNCTIONING, ESealType.WARRANTY],
    });

    expect(screen.getByRole('button', { name: 'Posse verificada' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Funcionamento revisado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Garantia disponível' })).toBeInTheDocument();
  });

  it('labels sponsored offers without seal styling', () => {
    renderCard({ facets: { sponsored: true } });
    expect(screen.getByText('Patrocinado')).toBeInTheDocument();
    expect(screen.queryByText('Posse verificada')).not.toBeInTheDocument();
  });

  it('keeps favoritar and comparar disabled with em breve labels', () => {
    renderCard();
    expect(screen.getByRole('button', { name: 'Favoritar (em breve)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Comparar (em breve)' })).toBeDisabled();
  });

  it('expands seal explanation on chip click', async () => {
    const user = userEvent.setup();
    renderCard({ sealTypes: [ESealType.POSSESSION] });

    await user.click(screen.getByRole('button', { name: 'Posse verificada' }));
    expect(screen.getByRole('region')).toHaveTextContent(/Posse verificada/i);
  });
});

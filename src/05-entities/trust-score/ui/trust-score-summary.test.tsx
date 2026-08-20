import { render, screen } from '@testing-library/react';
import { ETrustLevel } from '@entities/seller-level/model';
import { TrustScoreSummary } from './trust-score-summary';

describe('TrustScoreSummary', () => {
  it('shows level, score and reasons', () => {
    render(
      <TrustScoreSummary
        trust={{
          score: 92,
          level: ETrustLevel.EXCELLENT,
          reasons: ['12 vendas concluídas', '98% sem problema'],
        }}
      />,
    );
    expect(screen.getByText(/Excelente/)).toBeInTheDocument();
    expect(screen.getByText(/92/)).toBeInTheDocument();
    expect(screen.getByText('12 vendas concluídas')).toBeInTheDocument();
    expect(screen.getByText('98% sem problema')).toBeInTheDocument();
  });

  it('compact mode shows seller level and optional top reason', () => {
    const { rerender } = render(
      <TrustScoreSummary
        compact
        trust={{ score: 70, level: ETrustLevel.TRUSTED, reasons: [] }}
      />,
    );
    expect(screen.getByText(/Confiável/)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    rerender(
      <TrustScoreSummary
        compact
        trust={{
          score: 92,
          level: ETrustLevel.EXCELLENT,
          reasons: ['48 vendas concluídas', '99% sem problema'],
        }}
      />,
    );
    expect(screen.getByText('48 vendas concluídas')).toBeInTheDocument();
    expect(screen.queryByText('99% sem problema')).not.toBeInTheDocument();
  });
});

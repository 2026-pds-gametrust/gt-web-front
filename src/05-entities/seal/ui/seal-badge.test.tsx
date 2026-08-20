import { render, screen } from '@testing-library/react';
import { ESealStatus, ESealType } from '../model';
import { SealBadge, SealDetail } from './seal-badge';

describe('SealBadge', () => {
  it('renders GRANTED seal label', () => {
    render(<SealBadge type={ESealType.POSSESSION} status={ESealStatus.GRANTED} />);
    expect(screen.getByText('Posse verificada')).toBeInTheDocument();
  });

  it('hides non-GRANTED seals (no fake verification)', () => {
    const { container } = render(
      <SealBadge type={ESealType.POSSESSION} status={ESealStatus.SUSPENDED} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('SealDetail', () => {
  it('explains granted seal with date', () => {
    render(
      <SealDetail
        seal={{
          id: 's1',
          listingId: 'l1',
          caseId: 'c1',
          type: ESealType.FUNCTIONING,
          status: ESealStatus.GRANTED,
          grantedAt: '2026-07-01T12:00:00.000Z',
          createdAt: '2026-07-01T12:00:00.000Z',
          updatedAt: '2026-07-01T12:00:00.000Z',
        }}
      />,
    );
    expect(screen.getByText('Funcionamento revisado')).toBeInTheDocument();
    expect(screen.getByText(/Teste solicitado foi apresentado/i)).toBeInTheDocument();
    expect(screen.getByText(/Concedido em/i)).toBeInTheDocument();
  });
});

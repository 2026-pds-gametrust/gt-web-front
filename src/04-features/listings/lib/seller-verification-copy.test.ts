import { sellerVerificationLabel } from '@features/listings/lib/seller-verification-copy';
import type { ISellerVerificationSummary } from '@entities/listing/model';

describe('sellerVerificationLabel', () => {
  it('should map IN_REVIEW to product copy', () => {
    const summary: ISellerVerificationSummary = {
      id: 'case-1',
      status: 'IN_REVIEW',
    };
    expect(sellerVerificationLabel(summary)).toBe('Em análise');
  });

  it('should append decision reason when rejected', () => {
    const summary: ISellerVerificationSummary = {
      id: 'case-2',
      status: 'REJECTED',
      decisionReason: 'Fotos insuficientes',
    };
    expect(sellerVerificationLabel(summary)).toBe(
      'Reprovado — ajuste e reenvie: Fotos insuficientes',
    );
  });

  it('should return null when no case exists', () => {
    expect(sellerVerificationLabel(undefined)).toBeNull();
  });
});

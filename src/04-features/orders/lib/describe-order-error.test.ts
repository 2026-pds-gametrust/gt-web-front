import { ApiError } from '@shared/lib/http';
import { describeOrderError } from './describe-order-error';

describe('describeOrderError', () => {
  it('should explain reservation conflict', () => {
    const error = new ApiError({
      message: 'reserved',
      kind: 'translated',
      status: 409,
      code: 'LISTING_ALREADY_RESERVED',
    });
    expect(describeOrderError(error)).toMatch(/reservada ou vendida/i);
  });

  it('should explain buying own listing', () => {
    const error = new ApiError({
      message: 'own',
      kind: 'translated',
      status: 403,
      code: 'FIELD_INVALID',
    });
    expect(describeOrderError(error)).toMatch(/próprio anúncio/i);
  });

  it('should explain network failure', () => {
    const error = new ApiError({
      message: 'down',
      kind: 'network',
    });
    expect(describeOrderError(error)).toMatch(/rede/i);
  });
});

import { buildTrustDisplay } from './build-trust-display';
import { ETrustLevel } from '@entities/seller-level/model';
import { ETrustEventType } from '@entities/trust-event/model';

describe('buildTrustDisplay', () => {
  it('returns null when nothing is available', () => {
    expect(buildTrustDisplay(null, null, [])).toBeNull();
  });

  it('composes score, level and reasons from events without inventing', () => {
    const display = buildTrustDisplay(
      {
        id: 'ts-1',
        sellerId: 'seller-1',
        score: 80,
        components: {},
        computedAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'sl-1',
        sellerId: 'seller-1',
        level: ETrustLevel.TRUSTED,
      },
      [
        {
          id: 'te-1',
          sellerId: 'seller-1',
          type: ETrustEventType.ORDER_COMPLETED,
          sourceEventId: 'ord-1',
          payload: { reason: '22 vendas concluídas' },
          occurredAt: '2026-08-02T00:00:00.000Z',
          createdAt: '2026-08-02T00:00:00.000Z',
        },
        {
          id: 'te-2',
          sellerId: 'seller-1',
          type: ETrustEventType.USER_VERIFIED,
          sourceEventId: 'usr-1',
          payload: {},
          occurredAt: '2026-08-01T00:00:00.000Z',
          createdAt: '2026-08-01T00:00:00.000Z',
        },
      ],
    );

    expect(display).toEqual({
      score: 80,
      level: ETrustLevel.TRUSTED,
      reasons: ['22 vendas concluídas', 'Identidade verificada'],
    });
  });
});

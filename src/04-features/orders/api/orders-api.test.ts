import { installHttpStub } from '@shared/lib/testing/http-stub';
import { ordersApi } from './orders-api';
import { EOrderShippingMode, EOrderStatus } from '@entities/order/model';

const sampleOrder = {
  id: 'ord-1',
  listingId: 'lst-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  shippingMode: EOrderShippingMode.PICKUP,
  priceCents: 1000,
  currency: 'BRL',
  status: EOrderStatus.CONFIRMED,
  reservationExpiresAt: '2026-08-20T12:15:00.000Z',
  createdAt: '2026-08-20T12:00:00.000Z',
};

describe('ordersApi', () => {
  it('should POST /orders with listingId and shippingMode', async () => {
    const stub = installHttpStub({
      'POST /orders': [201, sampleOrder],
    });

    const order = await ordersApi.createOrder({
      id: 'ord-1',
      listingId: 'lst-1',
      shippingMode: EOrderShippingMode.PICKUP,
    });

    expect(order.status).toBe(EOrderStatus.CONFIRMED);
    expect(stub.callsFor('POST /orders')[0]?.body).toEqual({
      id: 'ord-1',
      listingId: 'lst-1',
      shippingMode: 'PICKUP',
    });
    stub.restore();
  });

  it('should GET /orders and /orders/:id', async () => {
    const stub = installHttpStub({
      'GET /orders': [200, { items: [sampleOrder], page: 1, pageSize: 20, total: 1 }],
      'GET /orders/:id': [200, sampleOrder],
    });

    const page = await ordersApi.listOrders();
    expect(page.items).toHaveLength(1);

    const detail = await ordersApi.getOrder('ord-1');
    expect(detail.id).toBe('ord-1');
    stub.restore();
  });
});

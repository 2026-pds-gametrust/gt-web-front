import { httpClient } from '@shared/lib/http';
import type {
  EOrderShippingMode,
  EOrderStatus,
  INewOrder,
  IOrder,
  IOrderPage,
} from '@entities/order/model';

export type IListOrdersQuery = {
  page?: number;
  pageSize?: number;
  status?: EOrderStatus;
};

export const ordersApi = {
  /** `POST /orders` — buy-now; ownership from JWT. */
  async createOrder(input: INewOrder): Promise<IOrder> {
    const body: {
      id?: string;
      listingId: string;
      shippingMode: EOrderShippingMode;
    } = {
      listingId: input.listingId,
      shippingMode: input.shippingMode,
    };
    if (input.id) {
      body.id = input.id;
    }
    const { data } = await httpClient.post<IOrder>('/orders', body);
    return data;
  },

  /** `GET /orders` — scoped to buyer or seller of the bearer. */
  async listOrders(query: IListOrdersQuery = {}): Promise<IOrderPage> {
    const { data } = await httpClient.get<IOrderPage>('/orders', {
      params: {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20,
        ...(query.status ? { status: query.status } : {}),
      },
    });
    return data;
  },

  /** `GET /orders/{id}` — buyer or seller only; 404 otherwise. */
  async getOrder(id: string): Promise<IOrder> {
    const { data } = await httpClient.get<IOrder>(`/orders/${id}`);
    return data;
  },
};

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@shared/ui/button/button';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { ordersApi } from '@features/orders/api';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import {
  ORDER_SHIPPING_LABELS,
  ORDER_STATUS_LABELS,
  type IOrder,
} from '@entities/order/model';
import { formatMoney } from '@shared/lib/format';
import { describeOrderError } from '@features/orders/lib/describe-order-error';

export function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const page = await ordersApi.listOrders({ page: 1, pageSize: 50 });
        if (!cancelled) {
          setOrders(page.items);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(describeOrderError(err));
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <PageHero titleId="orders-heading" title="Compras e vendas">
        <p>
          Pedidos em que você é comprador ou vendedor. Proteção da plataforma — sem inventar
          status de pagamento externo.
        </p>
      </PageHero>

      {loading ? <Skeleton label="Carregando pedidos…" /> : null}
      {error ? (
        <FeedbackBanner variant="error" title="Pedidos indisponíveis" message={error} />
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <EmptyState
          title="Nenhum pedido ainda"
          action={
            <Link className={buttonClassName()} to="/buscar">
              Buscar ofertas
            </Link>
          }
        >
          Quando você comprar ou vender com Compra protegida, o pedido aparece aqui.
        </EmptyState>
      ) : null}

      {!loading && orders.length > 0 ? (
        <ul className="mb-8 grid list-none gap-3 p-0 m-0">
          {orders.map((order) => {
            const role =
              user?.id === order.buyerId
                ? 'Compra'
                : user?.id === order.sellerId
                  ? 'Venda'
                  : 'Pedido';
            return (
              <li key={order.id} className="m-0">
                <Link to={`/compras/${order.id}`} className="grid gap-1 rounded-lg border border-border bg-surface p-4 text-inherit no-underline hover:border-accent">
                  <span className="text-[0.8rem] font-bold uppercase tracking-[0.04em] text-muted">{role}</span>
                  <span className="font-bold">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="font-display text-[1.15rem] font-extrabold">
                    {formatMoney(order.priceCents, order.currency)}
                  </span>
                  <span className="text-[0.875rem] text-muted">
                    {ORDER_SHIPPING_LABELS[order.shippingMode]} ·{' '}
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </AppShell>
  );
}

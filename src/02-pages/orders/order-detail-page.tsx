import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buttonClassName } from '@shared/ui/button/button';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { ordersApi } from '@features/orders/api';
import { listingApi } from '@features/listing-detail/api/listing-api';
import { describeOrderError } from '@features/orders/lib/describe-order-error';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import {
  ORDER_SHIPPING_LABELS,
  ORDER_STATUS_LABELS,
  type IOrder,
} from '@entities/order/model';
import type { IListing } from '@entities/listing/model';
import { formatMoney } from '@shared/lib/format';
import { ApiError } from '@shared/lib/http';
import { NotFoundPage } from '@pages/error/not-found-page';

export function OrderDetailPage() {
  const { orderId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const item = await ordersApi.getOrder(orderId);
        if (cancelled) return;
        setOrder(item);
        setNotFound(false);
        const offer = await listingApi.getListing(item.listingId).catch(() => null);
        if (!cancelled) setListing(offer);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setOrder(null);
        } else {
          setError(describeOrderError(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <AppShell>
        <Skeleton label="Carregando pedido…" />
      </AppShell>
    );
  }

  if (notFound || !order) {
    return <NotFoundPage />;
  }

  const role =
    user?.id === order.buyerId
      ? 'Você é o comprador'
      : user?.id === order.sellerId
        ? 'Você é o vendedor'
        : null;

  return (
    <AppShell>
      <PageHero titleId="order-detail-heading" title="Pedido">
        <p>
          {ORDER_STATUS_LABELS[order.status]}
          {role ? ` · ${role}` : ''}
        </p>
      </PageHero>

      {error ? (
        <FeedbackBanner variant="error" title="Detalhe indisponível" message={error} />
      ) : null}

      <section className="mb-4 rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:text-[1.1rem]" aria-labelledby="order-summary">
        <h2 id="order-summary">Resumo</h2>
        <p className="mb-3 mt-0 font-display text-2xl font-extrabold">
          {formatMoney(order.priceCents, order.currency)}
        </p>
        <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
          <li>Status: {ORDER_STATUS_LABELS[order.status]}</li>
          <li>Entrega: {ORDER_SHIPPING_LABELS[order.shippingMode]}</li>
          <li>Criado em: {new Date(order.createdAt).toLocaleString('pt-BR')}</li>
          {order.status === 'AWAITING_PAYMENT' ? (
            <li>
              Aguardando confirmação da proteção. O anúncio fica reservado até o pagamento
              protegido concluir.
            </li>
          ) : null}
          {order.status === 'CONFIRMED' ? (
            <li>
              Compra confirmada com proteção da plataforma. Código de entrega e contestação
              ficam em waves seguintes.
            </li>
          ) : null}
        </ul>
        {listing ? (
          <p>
            Oferta:{' '}
            <Link to={`/anuncio/${listing.id}`}>{listing.title}</Link>
          </p>
        ) : (
          <p>Anúncio: {order.listingId}</p>
        )}
      </section>

      <p>
        <Link className={buttonClassName({ variant: 'ghost' })} to="/compras">
          Voltar para compras e vendas
        </Link>
      </p>
    </AppShell>
  );
}

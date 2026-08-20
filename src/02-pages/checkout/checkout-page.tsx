import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { listingApi } from '@features/listing-detail/api/listing-api';
import { ordersApi } from '@features/orders/api';
import { describeOrderError } from '@features/orders/lib/describe-order-error';
import { buyNowEligibility } from '@features/orders/ui/buy-now-button';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import {
  EShippingMode,
  type EShippingMode as TShippingMode,
  type IListing,
} from '@entities/listing/model';
import type { IProduct } from '@entities/product/model';
import {
  EOrderShippingMode,
  type EOrderShippingMode as TOrderShippingMode,
} from '@entities/order/model';
import { formatMoney } from '@shared/lib/format';
import { ApiError } from '@shared/lib/http';
import { NotFoundPage } from '@pages/error/not-found-page';

function toOrderShippingMode(mode: TShippingMode): TOrderShippingMode {
  return mode === EShippingMode.SHIPPING
    ? EOrderShippingMode.SHIPPING
    : EOrderShippingMode.PICKUP;
}

export function CheckoutPage() {
  const { listingId = '' } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [listing, setListing] = useState<IListing | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shippingMode, setShippingMode] = useState<TShippingMode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const item = await listingApi.getListing(listingId);
        if (cancelled) return;
        if (!item) {
          setNotFound(true);
          setListing(null);
          return;
        }
        const prod = await listingApi.getProduct(item.productId).catch(() => null);
        if (cancelled) return;
        setListing(item);
        setProduct(prod);
        setShippingMode(item.shipping.modes[0] ?? null);
        setNotFound(false);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError('Não foi possível carregar o anúncio para checkout.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const eligibility = useMemo(
    () => (listing ? buyNowEligibility(listing, user?.id) : null),
    [listing, user?.id],
  );

  async function onConfirm() {
    if (!listing || !shippingMode || !user) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await ordersApi.createOrder({
        id: crypto.randomUUID(),
        listingId: listing.id,
        shippingMode: toOrderShippingMode(shippingMode),
      });
      navigate(`/compras/${order.id}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/entrar', { state: { from: `/checkout/${listingId}` } });
        return;
      }
      setError(describeOrderError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <Skeleton label="Preparando compra…" />
      </AppShell>
    );
  }

  if (notFound || !listing) {
    return <NotFoundPage />;
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <AppShell>
        <PageHero titleId="checkout-blocked" title="Compra indisponível">
          <p>{eligibility.reason}</p>
          <Link className={buttonClassName()} to={`/anuncio/${listing.id}`}>
            Voltar ao anúncio
          </Link>
        </PageHero>
      </AppShell>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: `/checkout/${listingId}` }} />;
  }

  return (
    <AppShell>
      <PageHero titleId="checkout-heading" title="Confirmar compra protegida">
        <p>
          Uma unidade por transação. O valor fica em proteção da plataforma até a confirmação —
          sem adquirente externo neste fluxo.
        </p>
      </PageHero>

      {error ? (
        <FeedbackBanner variant="error" title="Não foi possível comprar" message={error} />
      ) : null}

      <section className="mb-4 rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:text-[1.1rem]" aria-labelledby="checkout-offer">
        <h2 id="checkout-offer">Oferta</h2>
        <p className="mb-2 mt-0 font-bold">{listing.title}</p>
        {product ? (
          <p className="mb-2 mt-0">
            Modelo:{' '}
            <Link to={`/produto/${product.id}`}>
              {product.brand} {product.model}
            </Link>
          </p>
        ) : null}
        <p className="mb-3 mt-0 font-display text-2xl font-extrabold">
          {formatMoney(listing.priceCents, listing.currency)}
        </p>
        <Link to={`/anuncio/${listing.id}`}>Revisar anúncio</Link>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:text-[1.1rem]" aria-labelledby="checkout-shipping">
        <h2 id="checkout-shipping">Entrega</h2>
        <fieldset className="m-0 grid gap-2 border-0 p-0">
          <legend className="sr-only">Modo de entrega</legend>
          {listing.shipping.modes.map((mode) => (
            <label key={mode} className="flex min-h-11 items-center gap-3">
              <input
                type="radio"
                name="shippingMode"
                value={mode}
                checked={shippingMode === mode}
                onChange={() => setShippingMode(mode)}
              />
              {mode === EShippingMode.PICKUP ? 'Retirada' : 'Envio'}
              {mode === EShippingMode.SHIPPING && listing.shipping.freeShipping
                ? ' (frete grátis declarado pelo vendedor)'
                : ''}
            </label>
          ))}
        </fieldset>
        <p className="mt-3 mb-0 text-[0.9rem] text-muted">
          Cotação de frete por CEP e código de entrega ficam fora deste fluxo.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          loading={submitting}
          disabled={!shippingMode || submitting}
          onClick={() => void onConfirm()}
        >
          Confirmar compra protegida
        </Button>
        <Link className={buttonClassName({ variant: 'ghost' })} to={`/anuncio/${listing.id}`}>
          Cancelar
        </Link>
      </div>
    </AppShell>
  );
}

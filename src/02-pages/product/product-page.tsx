import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { OfferCard } from '@widgets/offer-card/offer-card';
import { catalogApi } from '@features/catalog/api/catalog-api';
import type { IProduct } from '@entities/product/model';
import type { IListing } from '@entities/listing/model';
import type { ISearchDocument } from '@entities/search-document/model';
import { FavoriteToggle } from '@features/favorites/ui/favorite-toggle';
import { EFavoriteTargetType } from '@entities/favorite/model';
import { searchDocumentFromListing } from '@entities/search-document/lib/from-listing';
import { formatMoney } from '@shared/lib/format';
import { buttonClassName } from '@shared/ui/button/button';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { NotFoundPage } from '@pages/error/not-found-page';
import { ApiError } from '@shared/lib/http';

export function ProductPage() {
  const { productId = '' } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [listings, setListings] = useState<IListing[]>([]);
  const [cards, setCards] = useState<ISearchDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prod, offers] = await Promise.all([
        catalogApi.getProduct(productId),
        catalogApi.getListingsByProduct(productId),
      ]);
      setProduct(prod);
      setListings(offers);
      setCards(offers.map((listing) => searchDocumentFromListing(listing, prod)));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProduct(null);
        setError(null);
      } else {
        setError('Não foi possível carregar este produto agora.');
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const priceRange = useMemo(() => {
    if (listings.length === 0) return null;
    const prices = listings.map((l) => l.priceCents);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: listings[0]?.currency ?? 'BRL',
    };
  }, [listings]);

  if (loading) {
    return (
      <AppShell>
        <Skeleton label="Carregando produto…" />
      </AppShell>
    );
  }

  if (error) {
    return <Navigate to="/erro" replace state={{ from: `/produto/${productId}` }} />;
  }

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <AppShell>
      <PageHero titleId="product-heading" title={product.model}>
        <p className="m-0 text-[0.875rem] text-muted">{product.brand}</p>
        <p>
          Modelo de catálogo — as ofertas abaixo são unidades usadas de vendedores diferentes.
        </p>
        <FavoriteToggle targetType={EFavoriteTargetType.PRODUCT} targetId={product.id} />
        {priceRange ? (
          <p className="font-display text-[1.75rem] font-extrabold tracking-[-0.03em]">
            {priceRange.min === priceRange.max
              ? formatMoney(priceRange.min, priceRange.currency)
              : `${formatMoney(priceRange.min, priceRange.currency)} – ${formatMoney(priceRange.max, priceRange.currency)}`}
          </p>
        ) : (
          <p>Sem ofertas publicadas no momento.</p>
        )}
      </PageHero>

      {product.specs ? (
        <section className="mb-12 animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="specs-heading">
          <h2 id="specs-heading">Especificações do modelo</h2>
          <ul className="mb-1 mt-0 pl-[1.1rem] [&_li]:mb-1">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {String(value)}
              </li>
            ))}
          </ul>
          {product.mpn ? <p className="m-0 text-[0.875rem] text-muted">MPN: {product.mpn}</p> : null}
        </section>
      ) : null}

      <section className="mb-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.02em]" aria-labelledby="offers-heading">
        <h2 id="offers-heading">Ofertas deste produto</h2>
        {cards.length === 0 ? (
          <EmptyState title="Sem ofertas publicadas" action={<Link className={buttonClassName({ variant: 'ghost' })} to="/buscar">Buscar outros modelos</Link>}>
            Este modelo ainda não tem unidades à venda.
          </EmptyState>
        ) : (
          <div className="gt-stagger grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {cards.map((doc) => (
              <OfferCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

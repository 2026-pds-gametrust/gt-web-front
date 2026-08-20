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
        <p className="offer-card__meta">{product.brand}</p>
        <p>
          Modelo de catálogo — as ofertas abaixo são unidades usadas de vendedores diferentes.
        </p>
        <FavoriteToggle targetType={EFavoriteTargetType.PRODUCT} targetId={product.id} />
        {priceRange ? (
          <p className="listing-price">
            {priceRange.min === priceRange.max
              ? formatMoney(priceRange.min, priceRange.currency)
              : `${formatMoney(priceRange.min, priceRange.currency)} – ${formatMoney(priceRange.max, priceRange.currency)}`}
          </p>
        ) : (
          <p>Sem ofertas publicadas no momento.</p>
        )}
      </PageHero>

      {product.specs ? (
        <section className="listing-section section-block" aria-labelledby="specs-heading">
          <h2 id="specs-heading">Especificações do modelo</h2>
          <ul className="spec-list">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {String(value)}
              </li>
            ))}
          </ul>
          {product.mpn ? <p className="offer-card__meta">MPN: {product.mpn}</p> : null}
        </section>
      ) : null}

      <section className="section-block" aria-labelledby="offers-heading">
        <h2 id="offers-heading">Ofertas deste produto</h2>
        {cards.length === 0 ? (
          <EmptyState title="Sem ofertas publicadas" action={<Link className="gt-button gt-button--ghost" to="/buscar">Buscar outros modelos</Link>}>
            Este modelo ainda não tem unidades à venda.
          </EmptyState>
        ) : (
          <div className="offer-grid gt-stagger">
            {cards.map((doc) => (
              <OfferCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

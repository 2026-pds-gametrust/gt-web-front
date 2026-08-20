import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export function ProductPage() {
  const { productId = '' } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [listings, setListings] = useState<IListing[]>([]);
  const [cards, setCards] = useState<ISearchDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      const [prod, offers] = await Promise.all([
        catalogApi.getProduct(productId),
        catalogApi.getListingsByProduct(productId),
      ]);
      if (cancelled) return;
      setProduct(prod);
      setListings(offers);
      const docs = offers.map((listing) => searchDocumentFromListing(listing, prod));
      setCards(docs);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

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
        <p>Carregando produto…</p>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell>
        <div className="empty-state">
          <h2>Produto não encontrado</h2>
          <p>O modelo pode ter sido removido do catálogo mock.</p>
          <Link to="/buscar">Voltar à busca</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="product-heading">
        <p className="offer-card__meta">{product.brand}</p>
        <h1 id="product-heading">{product.model}</h1>
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
      </section>

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
        <div className="offer-grid">
          {cards.map((doc) => (
            <OfferCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

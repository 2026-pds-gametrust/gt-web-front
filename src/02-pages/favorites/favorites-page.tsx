import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { useFavoritesStore } from '@features/favorites/model/use-favorites-store';
import { EFavoriteTargetType } from '@entities/favorite/model';
import { catalogApi } from '@features/catalog/api/catalog-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { formatMoney } from '@shared/lib/format';
import type { IProduct } from '@entities/product/model';
import type { IListing } from '@entities/listing/model';

type ResolvedFavorite = {
  id: string;
  targetType: string;
  targetId: string;
  title: string;
  href: string;
  subtitle?: string;
};

export function FavoritesPage() {
  const items = useFavoritesStore((s) => s.items);
  const loading = useFavoritesStore((s) => s.loading);
  const error = useFavoritesStore((s) => s.error);
  const load = useFavoritesStore((s) => s.load);
  const remove = useFavoritesStore((s) => s.remove);
  const [resolved, setResolved] = useState<ResolvedFavorite[]>([]);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setResolving(true);
    void (async () => {
      const rows: ResolvedFavorite[] = [];
      for (const fav of items) {
        if (fav.targetType === EFavoriteTargetType.PRODUCT) {
          const product: IProduct | null = await catalogApi.getProduct(fav.targetId);
          rows.push({
            id: fav.id,
            targetType: fav.targetType,
            targetId: fav.targetId,
            title: product ? `${product.brand} ${product.model}` : fav.targetId,
            subtitle: product ? 'Modelo do catálogo' : 'Produto',
            href: `/produto/${fav.targetId}`,
          });
        } else {
          const listing: IListing | null = await listingsApi.getListing(fav.targetId);
          rows.push({
            id: fav.id,
            targetType: fav.targetType,
            targetId: fav.targetId,
            title: listing?.title ?? fav.targetId,
            subtitle: listing
              ? `Oferta · ${formatMoney(listing.priceCents, listing.currency)}`
              : 'Anúncio',
            href: `/anuncio/${fav.targetId}`,
          });
        }
      }
      if (!cancelled) {
        setResolved(rows);
        setResolving(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <AppShell>
      <PageHero titleId="favorites-heading" title="Favoritos">
        <p>Salve modelos e ofertas para comparar com calma — sem inventar verificação.</p>
      </PageHero>

      {loading || resolving ? <Skeleton label="Carregando favoritos…" /> : null}
      {error ? (
        <FeedbackBanner variant="error" title="Favoritos indisponíveis" message={error} />
      ) : null}

      {!loading && !resolving && resolved.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          action={
            <Link className="gt-button" to="/buscar">
              Buscar ofertas
            </Link>
          }
        >
          Salve modelos e ofertas para comparar com calma — sem inventar verificação.
        </EmptyState>
      ) : null}

      <ul className="panel-list">
        {resolved.map((row) => (
          <li key={row.id} className="panel-list__item">
            <div>
              <Link to={row.href} className="panel-list__title">
                {row.title}
              </Link>
              <p className="panel-list__meta">
                {row.targetType === EFavoriteTargetType.PRODUCT ? 'Produto' : 'Oferta'} ·{' '}
                {row.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="gt-button gt-button--ghost"
              onClick={() => {
                void remove(row.id);
              }}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

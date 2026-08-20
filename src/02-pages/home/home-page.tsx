import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { CategoryShortcuts } from '@widgets/category-shortcuts/category-shortcuts';
import { TrustStrip } from '@widgets/trust-strip/trust-strip';
import { OfferRail } from '@widgets/offer-rail/offer-rail';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { searchApi } from '@features/search/api/search-api';
import type { IHomeFeed } from '@features/search/model/search-types';

export function HomePage() {
  const [feed, setFeed] = useState<IHomeFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchApi.getHomeFeed();
      setFeed(data);
    } catch {
      setError('Não foi possível carregar a vitrine agora.');
      setFeed(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  if (!loading && error) {
    return <Navigate to="/erro" replace state={{ from: '/' }} />;
  }

  return (
    <AppShell>
      <section className="home-search-panel gt-fade-up" aria-labelledby="home-search-heading">
        <h1 id="home-search-heading" className="home-search-panel__title">
          Tecnologia usada. Confiança renovada.
        </h1>
        <p className="home-search-panel__lead">
          Compare modelos e ofertas com evidência. Selos só aparecem depois da verificação
          concluída.
        </p>
        <SearchBar size="hero" />
      </section>

      {loading ? <Skeleton label="Carregando vitrine…" /> : null}

      {!loading && feed ? (
        <>
          <CategoryShortcuts categories={feed.categories} />

          {feed.verifiedOffers.length > 0 ? (
            <OfferRail
              id="verified-heading"
              title="Ofertas com verificação concluída"
              offers={feed.verifiedOffers}
              seeAllHref="/buscar"
              seeAllLabel="Ver verificadas"
              accent
            />
          ) : null}

          {feed.popularOffers.length > 0 ? (
            <OfferRail
              id="popular-heading"
              title="Em destaque agora"
              offers={feed.popularOffers}
              seeAllHref="/buscar"
            />
          ) : null}

          <TrustStrip />

          <section
            className="seller-entry seller-entry--brand gt-fade-up"
            aria-labelledby="seller-entry-heading"
          >
            <div>
              <h2 id="seller-entry-heading">Quer anunciar?</h2>
              <p>
                Publique ofertas com evidências reais. Selos só aparecem depois da verificação
                aprovada.
              </p>
            </div>
            <Link className="gt-button" to="/vender">
              Começar a vender
            </Link>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

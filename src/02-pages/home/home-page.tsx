import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { CategoryShortcuts } from '@widgets/category-shortcuts/category-shortcuts';
import { TrustStrip } from '@widgets/trust-strip/trust-strip';
import { OfferRail } from '@widgets/offer-rail/offer-rail';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Button } from '@shared/ui/button/button';
import { searchApi } from '@features/search/api/search-api';
import type { IHomeFeed } from '@features/search/model/search-types';

function HomeSkeleton() {
  return (
    <div className="home-skeleton" aria-hidden="true">
      <div className="home-skeleton__block" style={{ width: '40%' }} />
      <div className="home-skeleton__grid">
        <div className="home-skeleton__card" />
        <div className="home-skeleton__card" />
        <div className="home-skeleton__card" />
      </div>
    </div>
  );
}

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

  return (
    <AppShell>
      <section className="home-search-panel" aria-label="Busca principal">
        <SearchBar size="hero" />
      </section>

      {loading ? <HomeSkeleton /> : null}

      {error ? (
        <FeedbackBanner
          variant="error"
          title="Vitrine indisponível"
          message={error}
          action={
            <Button type="button" onClick={() => void loadFeed()}>
              Tentar de novo
            </Button>
          }
        />
      ) : null}

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
            className="seller-entry seller-entry--brand"
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

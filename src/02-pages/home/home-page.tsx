import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { CategoryShortcuts } from '@widgets/category-shortcuts/category-shortcuts';
import { TrustStrip } from '@widgets/trust-strip/trust-strip';
import { OfferRail } from '@widgets/offer-rail/offer-rail';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { Button, buttonClassName } from '@shared/ui/button/button';
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

  const vitrineEmpty =
    !loading &&
    !error &&
    feed &&
    feed.verifiedOffers.length === 0 &&
    feed.popularOffers.length === 0;

  return (
    <AppShell>
      <section className="mb-6 animate-fade-up rounded border border-border border-l-4 border-l-accent bg-surface p-8 px-6 shadow-gt" aria-labelledby="home-search-heading">
        <h1 id="home-search-heading" className="mb-2 mt-0 font-display text-[clamp(1.6rem,4vw,2.25rem)] font-extrabold italic uppercase tracking-[-0.04em]">
          Tecnologia usada. Confiança renovada.
        </h1>
        <p className="mb-4 mt-0 max-w-[36rem] text-muted">
          Compare modelos e ofertas com evidência. Selos só aparecem depois da verificação
          concluída.
        </p>
        <SearchBar size="hero" />
      </section>

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

      {loading ? <Skeleton variant="card" label="Carregando vitrine…" /> : null}

      {!loading && feed ? (
        <>
          <CategoryShortcuts categories={feed.categories} />

          {vitrineEmpty ? (
            <EmptyState title="Nenhuma oferta na vitrine agora">
              <p>Use a busca acima para encontrar modelos ou volte mais tarde.</p>
            </EmptyState>
          ) : null}

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
            className="mb-8 flex animate-fade-up flex-wrap items-center justify-between gap-4 rounded border border-[#2a2a2a] border-t-[3px] border-t-accent bg-header p-6 text-header-text"
            aria-labelledby="seller-entry-heading"
          >
            <div>
              <h2 id="seller-entry-heading" className="mb-1 mt-0 font-display text-xl font-extrabold italic uppercase">
                Quer anunciar?
              </h2>
              <p className="m-0 max-w-[40rem] text-header-text/80">
                Publique ofertas com evidências reais. Selos só aparecem depois da verificação
                aprovada.
              </p>
            </div>
            <Link className={buttonClassName()} to="/vender">
              Começar a vender
            </Link>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

import { useEffect } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { OfferCard } from '@widgets/offer-card/offer-card';
import { useSearchStore } from '@features/search/model/use-search-store';
import { formatMoney } from '@shared/lib/format';
import { Button } from '@shared/ui/button/button';
import { cn } from '@shared/lib/cn';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { Skeleton } from '@shared/ui/skeleton/skeleton';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

const CHIP =
  'min-h-11 rounded border border-border-strong bg-surface px-3 text-sm font-semibold focus-ring';
const CHIP_ACTIVE = 'border-accent bg-accent-soft font-bold text-accent-hover';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const q = params.get('q') ?? '';
  const verifiedOnly = params.get('selo') === 'verificado';
  const {
    view,
    setView,
    conditionFilter,
    brandFilter,
    setConditionFilter,
    setBrandFilter,
    result,
    loading,
    error,
    runSearch,
  } = useSearchStore();

  useEffect(() => {
    void runSearch({ q, verifiedOnly });
  }, [q, verifiedOnly, conditionFilter, brandFilter, runSearch]);

  function toggleCondition(value: string) {
    setConditionFilter(conditionFilter === value ? null : value);
  }

  function toggleBrand(value: string) {
    setBrandFilter(brandFilter === value ? null : value);
  }

  function changeView(next: 'offers' | 'products') {
    setView(next);
  }

  const empty = !loading && result && result.total === 0;

  if (!loading && error) {
    return (
      <Navigate
        to="/erro"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return (
    <AppShell>
      <PageHero
        titleId="search-heading"
        title={verifiedOnly ? 'Ofertas verificadas' : 'Buscar'}
      >
        <p>
          {verifiedOnly
            ? 'Somente anúncios com pelo menos um selo concedido após processo.'
            : 'Compare modelos e ofertas. Patrocínios aparecem rotulados — nunca como selo de confiança.'}
        </p>
        <SearchBar initialQuery={q} />
      </PageHero>

      <div className="mb-4 flex flex-wrap items-center gap-3" role="group" aria-label="Modo de visualização">
        <button
          type="button"
          className={cn(CHIP, view === 'offers' && CHIP_ACTIVE)}
          aria-pressed={view === 'offers'}
          onClick={() => changeView('offers')}
        >
          Ofertas
        </button>
        <button
          type="button"
          className={cn(CHIP, view === 'products' && CHIP_ACTIVE)}
          aria-pressed={view === 'products'}
          onClick={() => changeView('products')}
        >
          Agrupado por produto
        </button>
      </div>

      {result ? (
        <div className="mb-4 flex flex-wrap items-center gap-3" role="group" aria-label="Filtros">
          {result.facets.conditions.map((condition) => (
            <button
              key={condition}
              type="button"
              className={cn(CHIP, conditionFilter === condition && CHIP_ACTIVE)}
              aria-pressed={conditionFilter === condition}
              onClick={() => toggleCondition(condition)}
            >
              {CONDITION_LABELS[condition] ?? condition}
            </button>
          ))}
          {result.facets.brands.map((brand) => (
            <button
              key={brand}
              type="button"
              className={cn(CHIP, brandFilter === brand && CHIP_ACTIVE)}
              aria-pressed={brandFilter === brand}
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </button>
          ))}
          {(conditionFilter || brandFilter) && (
            <Button
              variant="ghost"
              onClick={() => {
                setConditionFilter(null);
                setBrandFilter(null);
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      ) : null}

      {loading ? <Skeleton label="Carregando resultados…" /> : null}

      {empty ? (
        <EmptyState
          title={`Nenhum resultado para “${q || 'sua busca'}”`}
          action={
            <Button
              onClick={() => {
                setConditionFilter(null);
                setBrandFilter(null);
                setParams(q ? { q } : {});
                void runSearch({ q });
              }}
            >
              Tentar de novo
            </Button>
          }
        >
          Tente outro modelo, remova filtros ou explore categorias populares como Placas de Vídeo e
          Notebooks.
        </EmptyState>
      ) : null}

      {!loading && result && result.total > 0 && view === 'offers' ? (
        <div className="gt-stagger grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {result.documents.map((doc) => (
            <OfferCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : null}

      {!loading && result && result.total > 0 && view === 'products' ? (
        <div className="gt-stagger flex flex-col gap-3">
          {result.productGroups.map((group) => (
            <Link
              key={group.productId}
              to={`/produto/${group.productId}`}
              className="gt-hover-lift flex animate-fade-up flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <div>
                <h3 className="mb-1 mt-0 font-display text-[1.05rem]">
                  {group.brand} {group.model}
                </h3>
                <p className="m-0 text-[0.9rem] text-muted">
                  {group.offerCount} {group.offerCount === 1 ? 'oferta' : 'ofertas'}
                </p>
              </div>
              <p>
                {formatMoney(group.minPriceCents, group.currency)}
                {group.maxPriceCents !== group.minPriceCents
                  ? ` – ${formatMoney(group.maxPriceCents, group.currency)}`
                  : ''}
              </p>
            </Link>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}

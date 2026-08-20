import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { OfferCard } from '@widgets/offer-card/offer-card';
import { useSearchStore } from '@features/search/model/use-search-store';
import { formatMoney } from '@shared/lib/format';
import { Button } from '@shared/ui/button/button';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
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

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="search-heading">
        <h1 id="search-heading">{verifiedOnly ? 'Ofertas verificadas' : 'Buscar'}</h1>
        <p>
          {verifiedOnly
            ? 'Somente anúncios com pelo menos um selo concedido após processo.'
            : 'Compare modelos e ofertas. Patrocínios aparecem rotulados — nunca como selo de confiança.'}
        </p>
        <SearchBar initialQuery={q} />
      </section>

      <div className="toolbar" role="group" aria-label="Modo de visualização">
        <button
          type="button"
          className={`gt-chip${view === 'offers' ? ' is-active' : ''}`}
          aria-pressed={view === 'offers'}
          onClick={() => changeView('offers')}
        >
          Ofertas
        </button>
        <button
          type="button"
          className={`gt-chip${view === 'products' ? ' is-active' : ''}`}
          aria-pressed={view === 'products'}
          onClick={() => changeView('products')}
        >
          Agrupado por produto
        </button>
      </div>

      {result ? (
        <div className="toolbar" role="group" aria-label="Filtros">
          {result.facets.conditions.map((condition) => (
            <button
              key={condition}
              type="button"
              className={`gt-chip${conditionFilter === condition ? ' is-active' : ''}`}
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
              className={`gt-chip${brandFilter === brand ? ' is-active' : ''}`}
              aria-pressed={brandFilter === brand}
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </button>
          ))}
          {(conditionFilter || brandFilter) && (
            <Button
              className="gt-button gt-button--ghost"
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

      {loading ? <p>Carregando resultados…</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      {empty ? (
        <div className="empty-state">
          <h2>Nenhum resultado para “{q || 'sua busca'}”</h2>
          <p>
            Tente outro modelo, remova filtros ou explore categorias populares como Placas de Vídeo e
            Notebooks.
          </p>
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
        </div>
      ) : null}

      {!loading && result && result.total > 0 && view === 'offers' ? (
        <div className="offer-grid">
          {result.documents.map((doc) => (
            <OfferCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : null}

      {!loading && result && result.total > 0 && view === 'products' ? (
        <div className="product-group-list">
          {result.productGroups.map((group) => (
            <Link
              key={group.productId}
              to={`/produto/${group.productId}`}
              className="product-group-card"
            >
              <div>
                <h3>
                  {group.brand} {group.model}
                </h3>
                <p>
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

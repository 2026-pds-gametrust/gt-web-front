import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { OfferCard } from '@widgets/offer-card/offer-card';
import { Button } from '@shared/ui/button/button';
import { listingApi } from '@features/listing-detail/api/listing-api';
import type { IListing } from '@entities/listing/model';
import type { IProduct } from '@entities/product/model';
import type { ISeal } from '@entities/seal/model';
import { ESealStatus } from '@entities/seal/model';
import { SealBadge, SealDetail } from '@entities/seal/ui/seal-badge';
import type { ITrustDisplay } from '@entities/trust-score/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';
import type { ISearchDocument } from '@entities/search-document/model';
import { searchDocumentFromListing } from '@entities/search-document/lib/from-listing';
import { FavoriteToggle } from '@features/favorites/ui/favorite-toggle';
import { EFavoriteTargetType } from '@entities/favorite/model';
import { formatMoney } from '@shared/lib/format';
import { ListingMediaGallery } from '@widgets/listing-media/listing-media-gallery';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

export function ListingPage() {
  const { listingId = '' } = useParams();
  const [listing, setListing] = useState<IListing | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [seals, setSeals] = useState<ISeal[]>([]);
  const [trust, setTrust] = useState<ITrustDisplay | null>(null);
  const [otherOffers, setOtherOffers] = useState<ISearchDocument[]>([]);
  const [similar, setSimilar] = useState<ISearchDocument[]>([]);
  const [activeSeal, setActiveSeal] = useState<ISeal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const item = await listingApi.getListing(listingId);
        if (cancelled) return;

        if (!item) {
          setListing(null);
          return;
        }

        const [prod, grantedSeals, trustScore, siblings, similarDocs] = await Promise.all([
          listingApi.getProduct(item.productId).catch(() => null),
          listingApi.getSeals(item.id).catch(() => []),
          listingApi.getTrustScore(item.sellerId).catch(() => null),
          listingApi.getListingsByProduct(item.productId).catch(() => []),
          listingApi.getSimilarListings(item.id).catch(() => []),
        ]);

        if (cancelled) return;

        setListing(item);
        setProduct(prod);
        setSeals(grantedSeals.filter((s) => s.status === ESealStatus.GRANTED));
        setTrust(trustScore);
        setOtherOffers(
          siblings
            .filter((l) => l.id !== item.id)
            .map((l) => searchDocumentFromListing(l, prod)),
        );
        setSimilar(similarDocs);
      } catch {
        if (!cancelled) setListing(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (loading) {
    return (
      <AppShell>
        <p>Carregando anúncio…</p>
      </AppShell>
    );
  }

  if (!listing) {
    return (
      <AppShell>
        <div className="empty-state">
          <h2>Anúncio não encontrado</h2>
          <Link to="/">Voltar ao início</Link>
        </div>
      </AppShell>
    );
  }

  const defects = Array.isArray(listing.attributes?.defects)
    ? (listing.attributes?.defects as string[])
    : [];
  const accessories = Array.isArray(listing.attributes?.accessories)
    ? (listing.attributes?.accessories as string[])
    : [];

  return (
    <AppShell>
      <article className="listing-layout">
        {/* 1 — photos / title */}
        <section className="listing-hero" aria-labelledby="listing-title">
          <ListingMediaGallery media={listing.media} title={listing.title} />
          <div className="listing-hero__info">
            <h1 id="listing-title">{listing.title}</h1>
            <p className="offer-card__meta">
              {CONDITION_LABELS[listing.condition] ?? listing.condition}
              {listing.locationApprox ? ` · ${listing.locationApprox}` : ''}
            </p>
            {product ? (
              <p className="listing-hero__product">
                Modelo:{' '}
                <Link to={`/produto/${product.id}`}>
                  {product.brand} {product.model}
                </Link>
              </p>
            ) : null}
          </div>
        </section>

        {/* 2 — price + CTA */}
        <section className="listing-section" aria-labelledby="price-heading">
          <h2 id="price-heading" className="visually-hidden">
            Preço
          </h2>
          <p className="listing-price">
            {formatMoney(listing.priceCents, listing.currency)}
            {listing.listPriceCents ? (
              <span className="offer-card__list-price">
                {formatMoney(listing.listPriceCents, listing.currency)}
              </span>
            ) : null}
          </p>
          <Button type="button" disabled>
            Compra protegida
          </Button>
          <FavoriteToggle targetType={EFavoriteTargetType.LISTING} targetId={listing.id} />
          <p className="listing-cta-note">
            Checkout ainda não disponível neste mock. O rótulo indica proteção da plataforma quando
            houver fluxo de pagamento.
          </p>
        </section>

        {/* 3 — seals */}
        <section className="listing-section" aria-labelledby="seals-heading">
          <h2 id="seals-heading">Selos</h2>
          {seals.length === 0 ? (
            <p>Este anúncio ainda não possui selos concedidos após verificação.</p>
          ) : (
            <div className="seal-list">
              {seals.map((seal) => (
                <SealBadge
                  key={seal.id}
                  type={seal.type}
                  status={seal.status}
                  grantedAt={seal.grantedAt}
                  interactive
                  expanded={activeSeal?.id === seal.id}
                  onClick={() => setActiveSeal(seal)}
                />
              ))}
            </div>
          )}
          {activeSeal ? <SealDetail seal={activeSeal} /> : null}
        </section>

        {/* 4 — shipping / protection */}
        <section className="listing-section" aria-labelledby="shipping-heading">
          <h2 id="shipping-heading">Entrega e proteção</h2>
          <ul className="bullet-list">
            <li>
              Modos:{' '}
              {listing.shipping.modes
                .map((m) => (m === 'PICKUP' ? 'Retirada' : 'Envio'))
                .join(', ')}
            </li>
            {listing.shipping.freeShipping ? <li>Frete grátis (intenção do vendedor)</li> : null}
            <li>Compra protegida: regras da plataforma aplicam-se no checkout (fora deste mock).</li>
          </ul>
        </section>

        {/* 5 — defects */}
        <section className="listing-section" aria-labelledby="defects-heading">
          <h2 id="defects-heading">Defeitos e conservação</h2>
          {defects.length > 0 ? (
            <ul className="bullet-list">
              {defects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum defeito declarado pelo vendedor.</p>
          )}
        </section>

        {/* 6 — accessories */}
        <section className="listing-section" aria-labelledby="acc-heading">
          <h2 id="acc-heading">Acessórios</h2>
          {accessories.length > 0 ? (
            <ul className="bullet-list">
              {accessories.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Sem acessórios listados.</p>
          )}
        </section>

        {/* 7 — specs */}
        <section className="listing-section" aria-labelledby="listing-specs">
          <h2 id="listing-specs">Especificações do modelo</h2>
          {product?.specs ? (
            <ul className="spec-list">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {String(value)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem especificações de catálogo.</p>
          )}
        </section>

        {/* 8 — tests / evidence summary */}
        <section className="listing-section" aria-labelledby="tests-heading">
          <h2 id="tests-heading">Resumo de testes e evidências</h2>
          {seals.some((s) => s.type === 'FUNCTIONING') ? (
            <p>
              Teste de funcionamento foi apresentado e revisado. Detalhes completos ficam no caso de
              verificação (não inventamos resultados aqui).
            </p>
          ) : (
            <p>
              Não há resumo de testes publicados para este anúncio. Sem selo de funcionamento
              concedido.
            </p>
          )}
        </section>

        {/* 9 — seller trust */}
        <section className="listing-section" aria-labelledby="seller-heading">
          <h2 id="seller-heading">Vendedor</h2>
          {trust ? <TrustScoreSummary trust={trust} /> : <p>Sem TrustScore disponível.</p>}
        </section>

        {/* 10 — other offers */}
        <section className="section-block" aria-labelledby="other-heading">
          <h2 id="other-heading">Outras ofertas do mesmo produto</h2>
          {otherOffers.length > 0 ? (
            <div className="offer-grid">
              {otherOffers.map((doc) => (
                <OfferCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <p>Não há outras ofertas publicadas deste modelo.</p>
          )}
        </section>

        {/* 11 — similar */}
        <section className="section-block" aria-labelledby="similar-heading">
          <h2 id="similar-heading">Semelhantes</h2>
          {similar.length > 0 ? (
            <div className="offer-grid">
              {similar.map((doc) => (
                <OfferCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <p>Sem itens semelhantes no mock.</p>
          )}
        </section>
      </article>
    </AppShell>
  );
}

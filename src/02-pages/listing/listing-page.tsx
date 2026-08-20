import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { OfferCard } from '@widgets/offer-card/offer-card';
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
import { StartChatButton } from '@features/listing-chat/ui/start-chat-button';
import { BuyNowButton } from '@features/orders/ui/buy-now-button';
import { FavoriteToggle } from '@features/favorites/ui/favorite-toggle';
import { EFavoriteTargetType } from '@entities/favorite/model';
import { formatMoney } from '@shared/lib/format';
import { ListingMediaGallery } from '@widgets/listing-media/listing-media-gallery';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { NotFoundPage } from '@pages/error/not-found-page';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const item = await listingApi.getListing(listingId);
        if (cancelled) return;

        if (!item) {
          setListing(null);
          setError(null);
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
        setError(null);
      } catch {
        if (!cancelled) {
          setListing(null);
          setError('Não foi possível carregar este anúncio agora.');
        }
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
        <Skeleton label="Carregando anúncio…" />
      </AppShell>
    );
  }

  if (error) {
    return <Navigate to="/erro" replace state={{ from: `/anuncio/${listingId}` }} />;
  }

  if (!listing) {
    return <NotFoundPage />;
  }

  const defects = Array.isArray(listing.attributes?.defects)
    ? (listing.attributes?.defects as string[])
    : [];
  const accessories = Array.isArray(listing.attributes?.accessories)
    ? (listing.attributes?.accessories as string[])
    : [];

  return (
    <AppShell>
      <article className="flex animate-fade-up flex-col gap-8">
        {/* 1 — photos / title */}
        <section className="grid gap-6 rounded-lg border border-border bg-surface p-6 shadow-gt wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] wide:items-start wide:gap-8" aria-labelledby="listing-title">
          <ListingMediaGallery media={listing.media} title={listing.title} />
          <div className="grid content-start gap-3">
            <h1 id="listing-title" className="m-0 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">{listing.title}</h1>
            <p className="m-0 text-[0.875rem] text-muted">
              {CONDITION_LABELS[listing.condition] ?? listing.condition}
              {listing.locationApprox ? ` · ${listing.locationApprox}` : ''}
            </p>
            {product ? (
              <p className="m-0 text-[0.95rem] [&_a]:font-bold [&_a]:text-inherit [&_a:hover]:text-accent">
                Modelo:{' '}
                <Link to={`/produto/${product.id}`}>
                  {product.brand} {product.model}
                </Link>
              </p>
            ) : null}
          </div>
        </section>

        {/* 2 — price + CTA */}
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="price-heading">
          <h2 id="price-heading" className="sr-only">
            Preço
          </h2>
          <p className="font-display text-[1.75rem] font-extrabold tracking-[-0.03em]">
            {formatMoney(listing.priceCents, listing.currency)}
            {listing.listPriceCents ? (
              <span className="ml-2 text-[0.875rem] font-normal text-muted line-through">
                {formatMoney(listing.listPriceCents, listing.currency)}
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <StartChatButton listing={listing} />
            <BuyNowButton listing={listing} />
            <FavoriteToggle targetType={EFavoriteTargetType.LISTING} targetId={listing.id} />
          </div>
        </section>

        {/* 3 — seals */}
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="seals-heading">
          <h2 id="seals-heading">Selos</h2>
          {seals.length === 0 ? (
            <p>Este anúncio ainda não possui selos concedidos após verificação.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
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
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="shipping-heading">
          <h2 id="shipping-heading">Entrega e proteção</h2>
          <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
            <li>
              Modos:{' '}
              {listing.shipping.modes
                .map((m) => (m === 'PICKUP' ? 'Retirada' : 'Envio'))
                .join(', ')}
            </li>
            {listing.shipping.freeShipping ? <li>Frete grátis (intenção do vendedor)</li> : null}
            <li>Compra protegida: valor em escrow da plataforma no checkout (sem adquirente externo neste fluxo).</li>
          </ul>
        </section>

        {/* 5 — defects */}
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="defects-heading">
          <h2 id="defects-heading">Defeitos e conservação</h2>
          {defects.length > 0 ? (
            <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
              {defects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum defeito declarado pelo vendedor.</p>
          )}
        </section>

        {/* 6 — accessories */}
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="acc-heading">
          <h2 id="acc-heading">Acessórios</h2>
          {accessories.length > 0 ? (
            <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
              {accessories.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Sem acessórios listados.</p>
          )}
        </section>

        {/* 7 — specs */}
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="listing-specs">
          <h2 id="listing-specs">Especificações do modelo</h2>
          {product?.specs ? (
            <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
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
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="tests-heading">
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
        <section className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-[1.1rem] [&_h2]:font-bold" aria-labelledby="seller-heading">
          <h2 id="seller-heading">Vendedor</h2>
          {trust ? <TrustScoreSummary trust={trust} /> : <p>Sem TrustScore disponível.</p>}
        </section>

        {/* 10 — other offers */}
        <section className="mb-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.02em]" aria-labelledby="other-heading">
          <h2 id="other-heading">Outras ofertas do mesmo produto</h2>
          {otherOffers.length > 0 ? (
            <div className="gt-stagger grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {otherOffers.map((doc) => (
                <OfferCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <p>Não há outras ofertas publicadas deste modelo.</p>
          )}
        </section>

        {/* 11 — similar */}
        <section className="mb-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.02em]" aria-labelledby="similar-heading">
          <h2 id="similar-heading">Semelhantes</h2>
          {similar.length > 0 ? (
            <div className="gt-stagger grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
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

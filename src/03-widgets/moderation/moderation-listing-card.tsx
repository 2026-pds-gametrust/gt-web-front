import { Link } from 'react-router-dom';
import type { IListing } from '@entities/listing/model';
import type { IProduct } from '@entities/product/model';
import type { ISeal } from '@entities/seal/model';
import { SealBadge } from '@entities/seal/ui/seal-badge';
import { formatMoney } from '@shared/lib/format';
import { cn } from '@shared/lib/cn';
import {
  CONDITION_LABEL,
  LISTING_STATUS_LABEL,
  SHIPPING_LABEL,
  formatModerationDate,
  shortId,
} from './moderation-constants';

const MOD_CARD = 'rounded-lg border border-border bg-surface p-4';

type ModerationListingCardProps = {
  listing: IListing | null;
  product: IProduct | null;
  seals: ISeal[];
  loading: boolean;
  listingId: string;
};

export function ModerationListingCard({
  listing,
  product,
  seals,
  loading,
  listingId,
}: ModerationListingCardProps) {
  if (loading) {
    return (
      <section
        className={cn(MOD_CARD, '[&_h3]:m-0 [&_h3]:font-display')}
        aria-labelledby="listing-heading"
      >
        <h3 id="listing-heading">Anúncio</h3>
        <p className="text-muted">Carregando anúncio…</p>
      </section>
    );
  }

  if (!listing) {
    return (
      <section
        className={cn(MOD_CARD, '[&_h3]:m-0 [&_h3]:font-display')}
        aria-labelledby="listing-heading"
      >
        <h3 id="listing-heading">Anúncio</h3>
        <p className="m-0 mt-3 text-[0.9rem] text-muted">
          Anúncio {shortId(listingId)} indisponível.
        </p>
      </section>
    );
  }

  const defects = Array.isArray(listing.attributes?.defects)
    ? (listing.attributes.defects as string[])
    : [];
  const accessories = Array.isArray(listing.attributes?.accessories)
    ? (listing.attributes.accessories as string[])
    : [];

  return (
    <section
      className={cn(
        MOD_CARD,
        '[&_h3]:m-0 [&_h3]:font-display [&_h4]:m-0 [&_h4]:font-display [&_h5]:m-0 [&_h5]:font-display',
      )}
      aria-labelledby="listing-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 id="listing-heading">Anúncio</h3>
        <Link className="text-[0.875rem] font-semibold" to={`/anuncio/${listing.id}`}>
          Abrir página pública
        </Link>
      </div>

      <h4 className="mb-4 text-[1.1rem]">{listing.title}</h4>

      <dl className="m-0 grid gap-3">
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Preço</dt>
          <dd className="m-0 text-[1.25rem] font-semibold text-accent-hover">
            {formatMoney(listing.priceCents, listing.currency)}
          </dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Status</dt>
          <dd className="m-0 font-semibold">{LISTING_STATUS_LABEL[listing.status] ?? listing.status}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Condição</dt>
          <dd className="m-0 font-semibold">{CONDITION_LABEL[listing.condition] ?? listing.condition}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Entrega</dt>
          <dd className="m-0 font-semibold">
            {listing.shipping.modes
              .map((mode) => SHIPPING_LABEL[mode] ?? mode)
              .join(', ') || '—'}
            {listing.shipping.modes.includes('SHIPPING') &&
            !listing.shipping.packageWeightGrams ? (
              <span> — falta peso e medidas da embalagem</span>
            ) : null}
          </dd>
        </div>
        {product ? (
          <div className="grid gap-[0.15rem]">
            <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Produto catálogo</dt>
            <dd className="m-0 font-semibold">
              <Link to={`/produto/${product.id}`}>
                {product.brand} {product.model}
              </Link>
            </dd>
          </div>
        ) : null}
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Criado em</dt>
          <dd className="m-0 font-semibold">{formatModerationDate(listing.createdAt)}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">ID</dt>
          <dd className="m-0 font-semibold">
            <code>{listing.id}</code>
          </dd>
        </div>
      </dl>

      {seals.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {seals.map((seal) => (
            <SealBadge
              key={seal.id}
              type={seal.type}
              status={seal.status}
              grantedAt={seal.grantedAt}
            />
          ))}
        </div>
      ) : (
        <p className="m-0 mt-3 text-[0.9rem] text-muted">Sem selo concedido neste anúncio.</p>
      )}

      {listing.description?.trim() ? (
        <div className="mt-4 border-t border-border pt-4">
          <h5 className="mb-2 text-[0.9rem]">Descrição</h5>
          <p>{listing.description}</p>
        </div>
      ) : null}

      {defects.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <h5 className="mb-2 text-[0.9rem]">Defeitos declarados</h5>
          <ul className="m-0 pl-[1.1rem]">
            {defects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {accessories.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <h5 className="mb-2 text-[0.9rem]">Acessórios</h5>
          <ul className="m-0 pl-[1.1rem]">
            {accessories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

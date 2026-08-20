import { Link } from 'react-router-dom';
import type { IListing } from '@entities/listing/model';
import type { IProduct } from '@entities/product/model';
import type { ISeal } from '@entities/seal/model';
import { SealBadge } from '@entities/seal/ui/seal-badge';
import { formatMoney } from '@shared/lib/format';
import {
  CONDITION_LABEL,
  LISTING_STATUS_LABEL,
  SHIPPING_LABEL,
  formatModerationDate,
  shortId,
} from './moderation-constants';

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
      <section className="moderation-card moderation-card--listing" aria-labelledby="listing-heading">
        <h3 id="listing-heading">Anúncio</h3>
        <p className="home-status">Carregando anúncio…</p>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="moderation-card moderation-card--listing" aria-labelledby="listing-heading">
        <h3 id="listing-heading">Anúncio</h3>
        <p className="moderation-card__empty">Anúncio {shortId(listingId)} indisponível.</p>
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
    <section className="moderation-card moderation-card--listing" aria-labelledby="listing-heading">
      <div className="moderation-card__header">
        <h3 id="listing-heading">Anúncio</h3>
        <Link className="moderation-card__link" to={`/anuncio/${listing.id}`}>
          Abrir página pública
        </Link>
      </div>

      <h4 className="moderation-card__title">{listing.title}</h4>

      <dl className="moderation-meta">
        <div>
          <dt>Preço</dt>
          <dd className="moderation-card__price">{formatMoney(listing.priceCents, listing.currency)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{LISTING_STATUS_LABEL[listing.status] ?? listing.status}</dd>
        </div>
        <div>
          <dt>Condição</dt>
          <dd>{CONDITION_LABEL[listing.condition] ?? listing.condition}</dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>
            {listing.shipping.modes
              .map((mode) => SHIPPING_LABEL[mode] ?? mode)
              .join(', ') || '—'}
          </dd>
        </div>
        {product ? (
          <div>
            <dt>Produto catálogo</dt>
            <dd>
              <Link to={`/produto/${product.id}`}>
                {product.brand} {product.model}
              </Link>
            </dd>
          </div>
        ) : null}
        <div>
          <dt>Criado em</dt>
          <dd>{formatModerationDate(listing.createdAt)}</dd>
        </div>
        <div>
          <dt>ID</dt>
          <dd>
            <code>{listing.id}</code>
          </dd>
        </div>
      </dl>

      {seals.length > 0 ? (
        <div className="moderation-card__seals">
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
        <p className="moderation-card__empty">Sem selo concedido neste anúncio.</p>
      )}

      {listing.description?.trim() ? (
        <div className="moderation-card__section">
          <h5>Descrição</h5>
          <p>{listing.description}</p>
        </div>
      ) : null}

      {defects.length > 0 ? (
        <div className="moderation-card__section">
          <h5>Defeitos declarados</h5>
          <ul className="moderation-inline-list">
            {defects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {accessories.length > 0 ? (
        <div className="moderation-card__section">
          <h5>Acessórios</h5>
          <ul className="moderation-inline-list">
            {accessories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

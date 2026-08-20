import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ISearchDocument } from '@entities/search-document/model';
import { SEAL_EXPLANATIONS, SEAL_LABELS, type ESealType } from '@entities/seal/model';
import { SealBadge } from '@entities/seal/ui/seal-badge';
import { type ETrustLevel } from '@entities/seller-level/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';
import { formatMoney } from '@shared/lib/format';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

type OfferCardProps = {
  document: ISearchDocument;
  reason?: string;
  href?: string;
};

export function OfferCard({ document, reason, href }: OfferCardProps) {
  const explainId = useId();
  const [openSeal, setOpenSeal] = useState<ESealType | null>(null);
  const to = href ?? `/anuncio/${document.listingId}`;
  const sealTypes = (document.sealTypes ?? []).filter((type) => type in SEAL_LABELS) as ESealType[];
  const level = document.sellerLevel as ETrustLevel | undefined;
  const productLabel =
    document.brand && document.model ? `${document.brand} ${document.model}` : document.model;

  return (
    <article className="offer-card">
      <div className="offer-card__top">
        <span className="offer-card__top-spacer" aria-hidden="true" />
        <div className="offer-card__actions">
          <button type="button" className="offer-card__icon-btn" aria-label="Favoritar (em breve)">
            ♡
          </button>
          <button type="button" className="offer-card__icon-btn" aria-label="Comparar (em breve)">
            ⇄
          </button>
        </div>
      </div>

      <Link to={to} className="offer-card__media-link" aria-label={`Oferta: ${document.title}`}>
        <div className="offer-card__media" aria-hidden="true">
          {document.thumbnailUrl ? (
            <img src={document.thumbnailUrl} alt="" />
          ) : (
            <span>{document.brand ?? 'Oferta'}</span>
          )}
        </div>
      </Link>

      <p className="offer-card__price">
        {formatMoney(document.priceCents, document.currency)}
        {document.listPriceCents ? (
          <span className="offer-card__list-price">
            {formatMoney(document.listPriceCents, document.currency)}
          </span>
        ) : null}
      </p>

      {productLabel ? (
        <p className="offer-card__product">
          <span className="visually-hidden">Modelo do catálogo: </span>
          <Link to={`/produto/${document.productId}`}>{productLabel}</Link>
        </p>
      ) : null}

      <h3 className="offer-card__title">
        <Link to={to}>{document.title}</Link>
      </h3>

      <p className="offer-card__meta">
        {CONDITION_LABELS[document.condition] ?? document.condition}
        {document.locationApprox ? ` · ${document.locationApprox}` : ''}
      </p>

      {sealTypes.length > 0 ? (
        <div className="offer-card__seals" aria-label="Selos concedidos">
          {sealTypes.slice(0, 3).map((type) => (
            <SealBadge
              key={type}
              type={type}
              interactive
              expanded={openSeal === type}
              className="offer-card__seal"
              onClick={() => setOpenSeal((current) => (current === type ? null : type))}
            />
          ))}
        </div>
      ) : null}

      {openSeal ? (
        <div className="seal-detail seal-detail--card" id={explainId} role="region" aria-live="polite">
          <strong>{SEAL_LABELS[openSeal]}</strong>
          <p>{SEAL_EXPLANATIONS[openSeal]}</p>
        </div>
      ) : null}

      {level ? (
        <TrustScoreSummary
          compact
          trust={{
            score: document.trustScore ?? 0,
            level,
            // Reasons live in GET /trust-events; a card never guesses them.
            reasons: [],
          }}
        />
      ) : null}

      {reason ? <p className="offer-card__reason">Motivo: {reason}</p> : null}
    </article>
  );
}

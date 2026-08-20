import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ISearchDocument } from '@entities/search-document/model';
import { SEAL_EXPLANATIONS, SEAL_LABELS, type ESealType } from '@entities/seal/model';
import { SealBadge } from '@entities/seal/ui/seal-badge';
import { type ETrustLevel } from '@entities/seller-level/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';
import { cn } from '@shared/lib/cn';
import { formatMoney } from '@shared/lib/format';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Como novo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  POOR: 'Com marcas',
};

const iconBtnClass = cn(
  'min-h-11 min-w-11 cursor-pointer rounded-sm border border-border bg-surface text-[0.95rem] text-ink focus-ring',
  'hover:border-accent hover:text-accent',
  'disabled:cursor-not-allowed disabled:opacity-55',
);

type OfferCardProps = {
  document: ISearchDocument;
  reason?: string;
  href?: string;
};

function isSponsored(document: ISearchDocument): boolean {
  return document.facets?.sponsored === true;
}

export function OfferCard({ document, reason, href }: OfferCardProps) {
  const titleId = useId();
  const explainId = useId();
  const [openSeal, setOpenSeal] = useState<ESealType | null>(null);
  const to = href ?? `/anuncio/${document.listingId}`;
  const sealTypes = (document.sealTypes ?? []).filter((type) => type in SEAL_LABELS) as ESealType[];
  const level = document.sellerLevel as ETrustLevel | undefined;
  const productLabel =
    document.brand && document.model ? `${document.brand} ${document.model}` : document.model;
  const sponsored = isSponsored(document);

  return (
    <article
      data-testid="offer-card"
      className={cn(
        'flex min-h-full animate-fade-up flex-col gap-2 rounded border border-border bg-surface p-3 shadow-gt',
        'transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--gt-accent)_45%,var(--gt-border))] hover:shadow-lift',
      )}
      aria-labelledby={titleId}
    >
      <div className="flex min-h-6 items-center justify-between gap-2">
        {sponsored ? (
          <span className="self-start rounded-sm bg-sponsored-bg px-2 py-[0.2rem] text-xs font-bold tracking-[0.04em] text-sponsored uppercase">
            Patrocinado
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <div data-testid="offer-card-actions" className="flex gap-1">
          <button
            type="button"
            className={iconBtnClass}
            aria-label="Favoritar (em breve)"
            disabled
            aria-disabled="true"
          >
            ♡
          </button>
          <button
            type="button"
            className={iconBtnClass}
            aria-label="Comparar (em breve)"
            disabled
            aria-disabled="true"
          >
            ⇄
          </button>
        </div>
      </div>

      <Link to={to} aria-label={`Oferta: ${document.title}`}>
        <div
          className="grid aspect-[4/3] place-items-center overflow-hidden rounded-sm bg-[linear-gradient(145deg,#e8e8e8,#f7f7f7)] bg-surface-muted text-[0.85rem] font-semibold text-muted"
          aria-hidden="true"
        >
          {document.thumbnailUrl ? (
            <img src={document.thumbnailUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{document.brand ?? 'Oferta'}</span>
          )}
        </div>
      </Link>

      <p className="m-0 font-display text-[1.25rem] font-bold tracking-[-0.02em]">
        {formatMoney(document.priceCents, document.currency)}
        {document.listPriceCents ? (
          <span className="ml-2 text-[0.875rem] font-normal text-muted line-through">
            {formatMoney(document.listPriceCents, document.currency)}
          </span>
        ) : null}
      </p>

      {productLabel ? (
        <p className="m-0 text-[0.8rem] font-semibold tracking-[0.03em] text-muted uppercase [&_a]:text-inherit [&_a:hover]:text-accent">
          <span className="visually-hidden">Modelo do catálogo: </span>
          <Link to={`/produto/${document.productId}`}>{productLabel}</Link>
        </p>
      ) : null}

      <h3
        id={titleId}
        className="m-0 font-display text-base leading-[1.3] font-bold [&_a]:text-inherit [&_a:hover]:text-accent"
      >
        <Link to={to}>{document.title}</Link>
      </h3>

      <p className="m-0 text-[0.875rem] text-muted">
        {CONDITION_LABELS[document.condition] ?? document.condition}
        {document.locationApprox ? ` · ${document.locationApprox}` : ''}
      </p>

      {sealTypes.length > 0 ? (
        <div
          data-testid="offer-card-seals"
          className="flex flex-wrap gap-2"
          aria-label="Selos concedidos"
        >
          {sealTypes.slice(0, 3).map((type) => (
            <SealBadge
              key={type}
              type={type}
              interactive
              expanded={openSeal === type}
              onClick={() => setOpenSeal((current) => (current === type ? null : type))}
            />
          ))}
        </div>
      ) : null}

      {openSeal ? (
        <div
          className="m-0 rounded-sm border-l-[3px] border-seal bg-seal-bg p-2 text-[0.85rem] [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-muted"
          id={explainId}
          role="region"
          aria-live="polite"
        >
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

      {reason ? (
        <p className="m-0 border-t border-border pt-3 text-[0.85rem] text-muted">Motivo: {reason}</p>
      ) : null}
    </article>
  );
}

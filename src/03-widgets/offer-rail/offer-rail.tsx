import { Link } from 'react-router-dom';
import type { ISearchDocument } from '@entities/search-document/model';
import { cn } from '@shared/lib/cn';
import { OfferCard } from '@widgets/offer-card/offer-card';

type OfferRailProps = {
  id: string;
  title: string;
  offers: ISearchDocument[];
  seeAllHref?: string;
  seeAllLabel?: string;
  getReason?: (doc: ISearchDocument) => string | undefined;
  accent?: boolean;
};

export function OfferRail({
  id,
  title,
  offers,
  seeAllHref,
  seeAllLabel = 'Ver todas',
  getReason,
  accent = false,
}: OfferRailProps) {
  if (offers.length === 0) return null;

  return (
    <section
      className={cn(
        'mb-12',
        accent &&
          'rounded border border-ink border-t-[3px] border-t-accent bg-surface p-4',
      )}
      aria-labelledby={id}
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id={id} className="m-0 font-display text-[1.25rem] font-bold tracking-[-0.02em]">
          {title}
        </h2>
        {seeAllHref ? (
          <Link className="font-semibold whitespace-nowrap text-accent" to={seeAllHref}>
            {seeAllLabel}
          </Link>
        ) : null}
      </div>
      <div
        className={cn(
          'grid auto-cols-[minmax(200px,240px)] grid-flow-col gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]',
          'gt-stagger',
        )}
      >
        {offers.map((doc) => (
          <div key={doc.id} className="animate-fade-up snap-start">
            <OfferCard document={doc} reason={getReason?.(doc)} />
          </div>
        ))}
      </div>
    </section>
  );
}

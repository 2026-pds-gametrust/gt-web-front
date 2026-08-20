import { Link } from 'react-router-dom';
import type { ISearchDocument } from '@entities/search-document/model';
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
      className={`section-block offer-rail${accent ? ' offer-rail--accent' : ''}`}
      aria-labelledby={id}
    >
      <div className="section-block__header">
        <h2 id={id}>{title}</h2>
        {seeAllHref ? (
          <Link className="section-block__link" to={seeAllHref}>
            {seeAllLabel}
          </Link>
        ) : null}
      </div>
      <div className="offer-rail__track">
        {offers.map((doc) => (
          <div key={doc.id} className="offer-rail__item">
            <OfferCard document={doc} reason={getReason?.(doc)} />
          </div>
        ))}
      </div>
    </section>
  );
}

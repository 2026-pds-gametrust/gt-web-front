import type { ITrustDisplay } from '../model';
import { ETrustLevel, TRUST_LEVEL_LABELS } from '@entities/seller-level/model';

type TrustScoreSummaryProps = {
  trust: ITrustDisplay;
  compact?: boolean;
};

/** TrustScore always with level label; reasons required in full mode (never score alone). */
export function TrustScoreSummary({ trust, compact = false }: TrustScoreSummaryProps) {
  const levelLabel = TRUST_LEVEL_LABELS[trust.level as ETrustLevel] ?? trust.level;

  if (compact) {
    const topReason = trust.reasons[0];
    return (
      <div className="offer-card__trust-block">
        <p className="offer-card__trust">
          Vendedor: <strong>{levelLabel}</strong>
          {trust.score > 0 ? ` (${trust.score})` : ''}
        </p>
        {topReason ? <p className="offer-card__trust-reason">{topReason}</p> : null}
      </div>
    );
  }

  return (
    <div className="trust-score-summary">
      <p className="offer-card__trust">
        TrustScore: <strong>{levelLabel}</strong> ({trust.score})
      </p>
      {trust.reasons.length > 0 ? (
        <ul className="trust-reasons">
          {trust.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <p className="trust-reasons trust-reasons--empty">Motivos ainda não disponíveis.</p>
      )}
    </div>
  );
}

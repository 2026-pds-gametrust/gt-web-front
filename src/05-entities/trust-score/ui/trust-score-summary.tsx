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
      <div className="flex flex-col gap-[0.15rem]">
        <p className="m-0 text-[0.85rem] text-ink">
          Vendedor: <strong className="font-bold text-ink">{levelLabel}</strong>
          {trust.score > 0 ? ` (${trust.score})` : ''}
        </p>
        {topReason ? <p className="m-0 text-[0.8rem] text-muted">{topReason}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-[0.85rem] text-ink">
        TrustScore: <strong className="font-bold text-ink">{levelLabel}</strong> ({trust.score})
      </p>
      {trust.reasons.length > 0 ? (
        <ul className="m-0 list-disc space-y-1 pl-5 text-[0.85rem] text-muted">
          {trust.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-[0.85rem] text-muted">Motivos ainda não disponíveis.</p>
      )}
    </div>
  );
}

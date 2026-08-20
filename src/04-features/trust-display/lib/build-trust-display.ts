import type { ISellerLevel } from '@entities/seller-level/model';
import { ETrustLevel } from '@entities/seller-level/model';
import type { ITrustEvent } from '@entities/trust-event/model';
import { TRUST_EVENT_REASON_LABELS } from '@entities/trust-event/model';
import type { ITrustDisplay, ITrustScore } from '@entities/trust-score/model';

export function buildTrustDisplay(
  score: ITrustScore | null | undefined,
  level: ISellerLevel | null | undefined,
  events: ITrustEvent[] = [],
): ITrustDisplay | null {
  if (!score && !level && events.length === 0) {
    return null;
  }

  const reasonsFromEvents = events
    .slice()
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .map((event) => {
      const fromPayload =
        typeof event.payload.reason === 'string' ? event.payload.reason : undefined;
      return fromPayload ?? TRUST_EVENT_REASON_LABELS[event.type] ?? event.type;
    });

  return {
    score: score?.score ?? 0,
    level: level?.level ?? ETrustLevel.NEW,
    reasons: reasonsFromEvents,
  };
}

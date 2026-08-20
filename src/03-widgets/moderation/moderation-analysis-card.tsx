import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import { cn } from '@shared/lib/cn';
import { ModerationScoreBadge } from './moderation-score-badge';
import { CHECKLIST_ITEM_LABEL, formatModerationDate } from './moderation-constants';
import { parseModerationAiAnalysis } from './moderation-ai-analysis';

const STATUS_LABEL: Record<string, string> = {
  PASS: 'OK',
  FAIL: 'Falha',
  UNCERTAIN: 'Incerto',
};

const MOD_CARD = 'rounded-lg border border-border bg-surface p-4';

type ModerationAnalysisCardProps = {
  selected: IModerationQueueItem | null;
};

export function ModerationAnalysisCard({ selected }: ModerationAnalysisCardProps) {
  const analysis = parseModerationAiAnalysis(selected);

  return (
    <section
      className={cn(MOD_CARD, 'mb-6 [&_h3]:m-0 [&_h3]:font-display')}
      aria-labelledby="analysis-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 id="analysis-heading">Validação IA</h3>
        <ModerationScoreBadge score={analysis?.score ?? selected?.aiAnalysisScore} />
      </div>

      {!analysis ? (
        <p className="m-0 mt-3 text-[0.9rem] text-muted">
          Ainda não há score de validação IA para este caso. A análise roda no submit do anúncio.
        </p>
      ) : (
        <>
          <p className="m-0 mt-3 text-[0.9rem] text-muted">
            Pontuação explicável — não substitui a decisão humana. Analisado em{' '}
            {analysis.analyzedAt ? formatModerationDate(analysis.analyzedAt) : '—'}
            {analysis.modelId ? (
              <>
                {' '}
                · modelo <code>{analysis.modelId}</code>
              </>
            ) : null}
          </p>

          {analysis.items.length > 0 ? (
            <ul className="m-0 mt-4 grid list-none gap-3 p-0">
              {analysis.items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'rounded border border-border bg-surface-muted p-3',
                    item.status === 'FAIL' &&
                      'border-[color-mix(in_srgb,#c0392b_35%,var(--color-border))]',
                    item.status === 'PASS' &&
                      'border-[color-mix(in_srgb,#1e8449_35%,var(--color-border))]',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <strong>{CHECKLIST_ITEM_LABEL[item.id] ?? item.id}</strong>
                    <span className="text-[0.75rem] font-bold tracking-wide text-muted uppercase">
                      {STATUS_LABEL[item.status] ?? item.status}
                    </span>
                  </div>
                  <p className="m-0 text-[0.92rem] text-ink">{item.reason}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 mt-3 text-[0.9rem] text-muted">Checklist indisponível neste snapshot.</p>
          )}
        </>
      )}
    </section>
  );
}

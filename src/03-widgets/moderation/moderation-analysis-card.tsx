import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import { ModerationScoreBadge } from './moderation-score-badge';
import { CHECKLIST_ITEM_LABEL, formatModerationDate } from './moderation-constants';

export type IModerationAiAnalysis = {
  analysisId: string;
  score: number;
  items: Array<{
    id: string;
    status: string;
    weight: number;
    reason: string;
    evidenceRef?: string;
  }>;
  modelId?: string;
  promptVersion: string;
  analyzedAt: string;
};

export function parseModerationAiAnalysis(
  item: Pick<IModerationQueueItem, 'checklist' | 'aiAnalysisScore'> | null | undefined,
): IModerationAiAnalysis | null {
  if (!item) return null;

  const raw = item.checklist?.aiAnalysis;
  if (!raw || typeof raw !== 'object') {
    if (item.aiAnalysisScore === undefined) return null;
    return {
      analysisId: 'unknown',
      score: item.aiAnalysisScore,
      items: [],
      promptVersion: 'v1',
      analyzedAt: '',
    };
  }

  const analysis = raw as Partial<IModerationAiAnalysis>;
  if (typeof analysis.score !== 'number') return null;

  return {
    analysisId: String(analysis.analysisId ?? 'unknown'),
    score: analysis.score,
    items: Array.isArray(analysis.items) ? analysis.items : [],
    modelId: analysis.modelId,
    promptVersion: String(analysis.promptVersion ?? 'v1'),
    analyzedAt: String(analysis.analyzedAt ?? ''),
  };
}

const STATUS_LABEL: Record<string, string> = {
  PASS: 'OK',
  FAIL: 'Falha',
  UNCERTAIN: 'Incerto',
};

type ModerationAnalysisCardProps = {
  selected: IModerationQueueItem | null;
};

export function ModerationAnalysisCard({ selected }: ModerationAnalysisCardProps) {
  const analysis = parseModerationAiAnalysis(selected);

  return (
    <section className="moderation-card moderation-card--analysis" aria-labelledby="analysis-heading">
      <div className="moderation-card__header">
        <h3 id="analysis-heading">Validação IA</h3>
        <ModerationScoreBadge score={analysis?.score ?? selected?.aiAnalysisScore} />
      </div>

      {!analysis ? (
        <p className="moderation-card__empty">
          Ainda não há score de validação IA para este caso. A análise roda no submit do anúncio.
        </p>
      ) : (
        <>
          <p className="moderation-card__note">
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
            <ul className="moderation-analysis-list">
              {analysis.items.map((item) => (
                <li
                  key={item.id}
                  className={`moderation-analysis-list__item moderation-analysis-list__item--${item.status.toLowerCase()}`}
                >
                  <div className="moderation-analysis-list__head">
                    <strong>{CHECKLIST_ITEM_LABEL[item.id] ?? item.id}</strong>
                    <span className="moderation-analysis-list__status">
                      {STATUS_LABEL[item.status] ?? item.status}
                    </span>
                  </div>
                  <p>{item.reason}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="moderation-card__empty">Checklist indisponível neste snapshot.</p>
          )}
        </>
      )}
    </section>
  );
}

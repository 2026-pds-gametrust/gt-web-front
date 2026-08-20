import type { IModerationQueueItem } from '@entities/moderation-queue/model';

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

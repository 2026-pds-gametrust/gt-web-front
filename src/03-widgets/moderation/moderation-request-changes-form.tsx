import { useEffect, useMemo, useState } from 'react';
import type { IListing } from '@entities/listing/model';
import {
  ERequiredChangeTargetEnum as ERequiredChangeTarget,
  type IRequiredChangeInput,
} from '@entities/verification-case/model';

export type ModerationChangeDraft = {
  key: string;
  target: IRequiredChangeInput['target'];
  assetId?: string;
  label: string;
  reason: string;
  selected: boolean;
  /** Pre-marcado por análise de IA — Camila deve confirmar, não aceitar cego. */
  suggestedByAi: boolean;
};

type BuildChangeDraftsParams = {
  listing: IListing | null;
  aiFailItemIds?: string[];
};

export function buildModerationChangeDrafts({
  listing,
  aiFailItemIds = [],
}: BuildChangeDraftsParams): ModerationChangeDraft[] {
  if (!listing) {
    return [];
  }

  const drafts: ModerationChangeDraft[] = [];
  const assetIds = listing.media.assetIds ?? [];

  assetIds.forEach((assetId, index) => {
    drafts.push({
      key: `photo:${assetId}`,
      target: ERequiredChangeTarget.PHOTO,
      assetId,
      label: `Foto ${index + 1}`,
      reason: '',
      selected: false,
      suggestedByAi: false,
    });
  });

  if (listing.media.videoAssetId) {
    drafts.push({
      key: `video:${listing.media.videoAssetId}`,
      target: ERequiredChangeTarget.VIDEO,
      assetId: listing.media.videoAssetId,
      label: 'Vídeo',
      reason: '',
      selected: false,
      suggestedByAi: false,
    });
  }

  drafts.push({
    key: 'description',
    target: ERequiredChangeTarget.DESCRIPTION,
    label: 'Descrição',
    reason: '',
    selected: false,
    suggestedByAi: false,
  });

  if (aiFailItemIds.length > 0) {
    return drafts.map((draft) => {
      const suggestedByAi = aiFailItemIds.some((id) => draft.key.includes(id));
      return {
        ...draft,
        selected: suggestedByAi,
        suggestedByAi,
      };
    });
  }

  return drafts;
}

export function draftsToRequiredChanges(
  drafts: ModerationChangeDraft[],
): IRequiredChangeInput[] | null {
  const selected = drafts.filter((draft) => draft.selected);
  if (selected.length === 0) {
    return null;
  }
  for (const draft of selected) {
    if (!draft.reason.trim()) {
      return null;
    }
  }
  return selected.map((draft) => ({
    target: draft.target,
    reason: draft.reason.trim(),
    assetId: draft.assetId,
  }));
}

type UseModerationChangeDraftsParams = {
  listing: IListing | null;
  checklist?: Record<string, unknown>;
};

export function useModerationChangeDrafts({
  listing,
  checklist,
}: UseModerationChangeDraftsParams) {
  const aiFailItemIds = useMemo(() => {
    const aiAnalysis = checklist?.aiAnalysis;
    if (!aiAnalysis || typeof aiAnalysis !== 'object') {
      return [] as string[];
    }
    const items = (aiAnalysis as { items?: unknown }).items;
    if (!Array.isArray(items)) {
      return [] as string[];
    }
    return items
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          (item as { status?: string }).status === 'FAIL',
      )
      .map((item) => String((item as { id?: string }).id ?? ''))
      .filter(Boolean);
  }, [checklist]);

  const [drafts, setDrafts] = useState<ModerationChangeDraft[]>([]);
  const listingId = listing?.id ?? '';

  useEffect(() => {
    setDrafts(buildModerationChangeDrafts({ listing, aiFailItemIds }));
  }, [listing, listingId, aiFailItemIds]);

  function toggleDraft(key: string) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.key === key ? { ...draft, selected: !draft.selected } : draft,
      ),
    );
  }

  function setDraftReason(key: string, reason: string) {
    setDrafts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, reason } : draft)),
    );
  }

  return { drafts, toggleDraft, setDraftReason };
}

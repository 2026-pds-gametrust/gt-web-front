import type { IRequiredChange } from '@entities/verification-case/model';
import { ERequiredChangeTargetEnum as ERequiredChangeTarget } from '@entities/verification-case/model';

type RevisionSnapshot = {
  photoAssetIds: string[];
  videoAssetId: string | null;
  description: string;
};

export function buildRevisionSnapshot(params: {
  photoAssetIds: string[];
  videoAssetId: string | null;
  defects: string;
  accessories: string;
}): RevisionSnapshot {
  return {
    photoAssetIds: [...params.photoAssetIds],
    videoAssetId: params.videoAssetId,
    description: `${params.defects}\n${params.accessories}`.trim(),
  };
}

export function isRevisionComplete(
  requiredChanges: IRequiredChange[],
  snapshot: RevisionSnapshot,
  baseline: RevisionSnapshot,
): boolean {
  if (requiredChanges.length === 0) {
    return true;
  }

  for (const change of requiredChanges) {
    if (change.target === ERequiredChangeTarget.PHOTO && change.assetId) {
      if (snapshot.photoAssetIds.includes(change.assetId)) {
        return false;
      }
      continue;
    }
    if (change.target === ERequiredChangeTarget.VIDEO) {
      const baselineVideo = baseline.videoAssetId?.trim();
      if (baselineVideo && snapshot.videoAssetId === baselineVideo) {
        return false;
      }
      continue;
    }
    if (change.target === ERequiredChangeTarget.DESCRIPTION) {
      if (snapshot.description === baseline.description) {
        return false;
      }
    }
  }
  return true;
}

export function firstRevisionStep(requiredChanges: IRequiredChange[]): number {
  const hasMedia = requiredChanges.some(
    (change) =>
      change.target === ERequiredChangeTarget.PHOTO ||
      change.target === ERequiredChangeTarget.VIDEO,
  );
  if (hasMedia) {
    return 3;
  }
  if (requiredChanges.some((change) => change.target === ERequiredChangeTarget.DESCRIPTION)) {
    return 2;
  }
  return 6;
}

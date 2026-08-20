export function reorderPhotos(
  ids: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= ids.length ||
    toIndex >= ids.length
  ) {
    return [...ids];
  }

  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function movePhoto(
  ids: string[],
  assetId: string,
  direction: 'up' | 'down',
): string[] {
  const fromIndex = ids.indexOf(assetId);
  if (fromIndex < 0) return [...ids];
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
  return reorderPhotos(ids, fromIndex, toIndex);
}

type ModerationQueuePaginationProps = {
  total: number;
  limit: number;
  offset: number;
  itemCount: number;
  onOffsetChange: (offset: number) => void;
};

export function ModerationQueuePagination({
  total,
  limit,
  offset,
  itemCount,
  onOffsetChange,
}: ModerationQueuePaginationProps) {
  if (total === 0) {
    return null;
  }

  const rangeStart = offset + 1;
  const rangeEnd = offset + itemCount;
  const hasPrevious = offset > 0;
  const hasNext = offset + limit < total;

  return (
    <nav
      className="moderation-queue__pagination"
      aria-label="Paginação da fila"
    >
      <p className="moderation-queue__pagination-summary">
        Mostrando {rangeStart}–{rangeEnd} de {total}
      </p>
      <div className="moderation-queue__pagination-actions">
        <button
          type="button"
          className="gt-button gt-button--ghost"
          disabled={!hasPrevious}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          Anterior
        </button>
        <button
          type="button"
          className="gt-button gt-button--ghost"
          disabled={!hasNext}
          onClick={() => onOffsetChange(offset + limit)}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}

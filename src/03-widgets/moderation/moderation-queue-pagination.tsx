import { buttonClassName } from '@shared/ui/button/button';

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
      className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
      aria-label="Paginação da fila"
    >
      <p className="m-0 text-[0.875rem] text-muted">
        Mostrando {rangeStart}–{rangeEnd} de {total}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClassName({ variant: 'ghost' })}
          disabled={!hasPrevious}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          Anterior
        </button>
        <button
          type="button"
          className={buttonClassName({ variant: 'ghost' })}
          disabled={!hasNext}
          onClick={() => onOffsetChange(offset + limit)}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}

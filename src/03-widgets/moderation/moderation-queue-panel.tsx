import { cn } from '@shared/lib/cn';
import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import { ModerationStatusBadge } from './moderation-status-badge';
import { ModerationScoreBadge } from './moderation-score-badge';
import { ModerationQueuePagination } from './moderation-queue-pagination';
import { formatModerationDate } from './moderation-constants';

const SEARCH_INPUT =
  'min-h-11 w-full rounded border border-border-strong bg-surface px-3 py-2 transition-[border-color,box-shadow] duration-150 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

type ModerationQueuePanelProps = {
  items: IModerationQueueItem[];
  total: number;
  limit: number;
  offset: number;
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (caseId: string) => void;
  onOffsetChange: (offset: number) => void;
};

export function ModerationQueuePanel({
  items,
  total,
  limit,
  offset,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onOffsetChange,
}: ModerationQueuePanelProps) {
  return (
    <aside
      className="rounded-lg border border-border bg-surface p-6"
      aria-label="Fila de casos"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="m-0 font-display text-[1.35rem]">Fila</h2>
        <span className="text-[0.85rem] font-semibold text-muted">{total} caso(s)</span>
      </div>

      <label className="mb-4 flex flex-col gap-2">
        <span className="sr-only">Buscar casos</span>
        <input
          type="search"
          className={SEARCH_INPUT}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por anúncio, título ou vendedor…"
        />
      </label>

      {items.length === 0 ? (
        <p className="text-muted">Nenhum caso corresponde aos filtros.</p>
      ) : (
        <ul className="m-0 grid max-h-[70vh] list-none gap-2 overflow-auto p-0">
          {items.map((item) => {
            const thumb = item.listingCoverPhotoUrl ?? null;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(
                    'grid w-full cursor-pointer grid-cols-[56px_minmax(0,1fr)] gap-3 rounded border border-border bg-surface p-3 text-left transition-[border-color,background] duration-150 hover:border-accent hover:bg-accent-soft focus-ring',
                    selectedId === item.id && 'border-accent bg-accent-soft',
                  )}
                  onClick={() => onSelect(item.id)}
                >
                  <div
                    className="grid h-14 w-14 place-items-center overflow-hidden rounded bg-surface-muted"
                    aria-hidden="true"
                  >
                    {thumb ? (
                      <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[0.75rem] font-bold text-muted">GT</span>
                    )}
                  </div>
                  <div className="grid content-start gap-1">
                    <span className="font-bold leading-tight">{item.listingTitle}</span>
                    <span className="text-[0.8rem] text-muted">
                      {item.sellerDisplayName} · {formatModerationDate(item.createdAt)}
                    </span>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ModerationScoreBadge score={item.aiAnalysisScore} compact />
                      <ModerationStatusBadge status={item.status} />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ModerationQueuePagination
        total={total}
        limit={limit}
        offset={offset}
        itemCount={items.length}
        onOffsetChange={onOffsetChange}
      />
    </aside>
  );
}

import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import { ModerationStatusBadge } from './moderation-status-badge';
import { ModerationScoreBadge } from './moderation-score-badge';
import { ModerationQueuePagination } from './moderation-queue-pagination';
import { formatModerationDate } from './moderation-constants';

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
    <aside className="moderation-queue" aria-label="Fila de casos">
      <div className="moderation-queue__header">
        <h2>Fila</h2>
        <span className="moderation-queue__count">{total} caso(s)</span>
      </div>

      <label className="form-field moderation-queue__search">
        <span className="visually-hidden">Buscar casos</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por anúncio, título ou vendedor…"
        />
      </label>

      {items.length === 0 ? (
        <p className="moderation-queue__empty">Nenhum caso corresponde aos filtros.</p>
      ) : (
        <ul className="moderation-queue__list">
          {items.map((item) => {
            const thumb = item.listingCoverPhotoUrl ?? null;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`moderation-queue__item${selectedId === item.id ? ' is-active' : ''}`}
                  onClick={() => onSelect(item.id)}
                >
                  <div className="moderation-queue__thumb" aria-hidden="true">
                    {thumb ? (
                      <img src={thumb} alt="" loading="lazy" />
                    ) : (
                      <span className="moderation-queue__thumb-fallback">GT</span>
                    )}
                  </div>
                  <div className="moderation-queue__body">
                    <span className="moderation-queue__title">
                      {item.listingTitle}
                    </span>
                    <span className="moderation-queue__meta">
                      {item.sellerDisplayName} · {formatModerationDate(item.createdAt)}
                    </span>
                    <div className="moderation-queue__badges">
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

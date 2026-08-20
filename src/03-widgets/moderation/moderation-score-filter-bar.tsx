import type { ModerationScoreFilter } from './moderation-constants';
import { SCORE_FILTER_OPTIONS } from './moderation-constants';
import { cn } from '@shared/lib/cn';

type ModerationScoreFilterBarProps = {
  activeFilter: ModerationScoreFilter;
  onFilterChange: (filter: ModerationScoreFilter) => void;
};

export function ModerationScoreFilterBar({
  activeFilter,
  onFilterChange,
}: ModerationScoreFilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por score IA">
      <span className="mr-1 text-[0.85rem] font-semibold text-muted">Score IA</span>
      {SCORE_FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'rounded-full border border-border bg-surface px-3 py-[0.35rem] text-sm font-semibold focus-ring',
            activeFilter === option.value && 'border-accent bg-accent-soft text-accent-hover',
          )}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

import type { ModerationScoreFilter } from './moderation-constants';
import { SCORE_FILTER_OPTIONS } from './moderation-constants';

type ModerationScoreFilterBarProps = {
  activeFilter: ModerationScoreFilter;
  onFilterChange: (filter: ModerationScoreFilter) => void;
};

export function ModerationScoreFilterBar({
  activeFilter,
  onFilterChange,
}: ModerationScoreFilterBarProps) {
  return (
    <div className="moderation-score-filters" role="group" aria-label="Filtrar por score IA">
      <span className="moderation-score-filters__label">Score IA</span>
      {SCORE_FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`moderation-score-filter${activeFilter === option.value ? ' is-active' : ''}`}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

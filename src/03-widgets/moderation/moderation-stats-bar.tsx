import type { IModerationQueueStats } from '@entities/moderation-queue/model';
import type { ModerationStatusFilter } from './moderation-constants';
import { STATUS_LABEL } from './moderation-constants';
import { EVerificationCaseStatus } from '@entities/verification-case/model';

type ModerationStatsBarProps = {
  stats: IModerationQueueStats;
  activeFilter: ModerationStatusFilter;
  onFilterChange: (filter: ModerationStatusFilter) => void;
};

export function ModerationStatsBar({
  stats,
  activeFilter,
  onFilterChange,
}: ModerationStatsBarProps) {
  const items = [
    { filter: 'ALL' as const, label: 'Total', value: stats.total },
    {
      filter: EVerificationCaseStatus.PENDING,
      label: STATUS_LABEL.PENDING,
      value: stats.pending,
    },
    {
      filter: EVerificationCaseStatus.IN_REVIEW,
      label: STATUS_LABEL.IN_REVIEW,
      value: stats.inReview,
    },
    {
      filter: EVerificationCaseStatus.APPROVED,
      label: STATUS_LABEL.APPROVED,
      value: stats.approved,
    },
    {
      filter: EVerificationCaseStatus.CHANGES_REQUESTED,
      label: STATUS_LABEL.CHANGES_REQUESTED,
      value: stats.changesRequested,
    },
    {
      filter: EVerificationCaseStatus.REJECTED,
      label: STATUS_LABEL.REJECTED,
      value: stats.rejected,
    },
  ];

  return (
    <div className="moderation-stats" role="group" aria-label="Resumo da fila">
      {items.map((item) => (
        <button
          key={item.filter}
          type="button"
          className={`moderation-stat${activeFilter === item.filter ? ' is-active' : ''}`}
          onClick={() => onFilterChange(item.filter)}
        >
          <span className="moderation-stat__value">{item.value}</span>
          <span className="moderation-stat__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

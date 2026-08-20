import type { IModerationQueueStats } from '@entities/moderation-queue/model';
import type { ModerationStatusFilter } from './moderation-constants';
import { STATUS_LABEL } from './moderation-constants';
import { EVerificationCaseStatus } from '@entities/verification-case/model';
import { cn } from '@shared/lib/cn';

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
    <div
      className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3"
      role="group"
      aria-label="Resumo da fila"
    >
      {items.map((item) => (
        <button
          key={item.filter}
          type="button"
          className={cn(
            'grid cursor-pointer gap-1 rounded-lg border border-border bg-surface p-4 text-left transition-[border-color,background] duration-150 hover:border-accent hover:bg-accent-soft focus-ring',
            activeFilter === item.filter && 'border-accent bg-accent-soft',
          )}
          onClick={() => onFilterChange(item.filter)}
        >
          <span className="font-display text-2xl font-bold leading-none">{item.value}</span>
          <span className="text-[0.85rem] font-semibold text-muted">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

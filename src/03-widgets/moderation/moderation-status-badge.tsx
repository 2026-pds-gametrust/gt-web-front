import { EVerificationCaseStatus } from '@entities/verification-case/model';
import { STATUS_LABEL } from './moderation-constants';

type ModerationStatusBadgeProps = {
  status: EVerificationCaseStatus | string;
};

export function ModerationStatusBadge({ status }: ModerationStatusBadgeProps) {
  const normalized = String(status);
  const className = `moderation-badge moderation-badge--${normalized.toLowerCase().replace('_', '-')}`;

  return (
    <span className={className}>
      {STATUS_LABEL[normalized as EVerificationCaseStatus] ?? normalized}
    </span>
  );
}

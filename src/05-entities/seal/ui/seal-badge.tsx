import type { ESealType, ISeal } from '../model';
import { ESealStatus, SEAL_EXPLANATIONS, SEAL_LABELS } from '../model';
import { cn } from '@shared/lib/cn';

type SealBadgeProps = {
  type: ESealType;
  status?: ESealStatus;
  grantedAt?: string;
  interactive?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
};

const sealChipClass =
  'min-h-8 rounded-sm border-0 bg-seal-bg px-2 py-1 text-xs font-semibold text-seal';

/** Renders a granted seal chip only — never fake verification styling for non-GRANTED. */
export function SealBadge({
  type,
  status = ESealStatus.GRANTED,
  grantedAt,
  interactive = false,
  expanded = false,
  onClick,
  className,
}: SealBadgeProps) {
  if (status !== ESealStatus.GRANTED) {
    return null;
  }

  const label = SEAL_LABELS[type];
  const classes = cn(sealChipClass, interactive && 'cursor-pointer', className);

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-expanded={expanded}
        title={grantedAt ? `Concedido em ${grantedAt}` : undefined}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={classes} title={grantedAt ? `Concedido em ${grantedAt}` : undefined}>
      {label}
    </span>
  );
}

type SealDetailProps = {
  seal: ISeal;
};

export function SealDetail({ seal }: SealDetailProps) {
  if (seal.status !== ESealStatus.GRANTED) {
    return null;
  }

  return (
    <div
      className="rounded-sm border-l-[3px] border-seal bg-seal-bg p-2 text-[0.85rem] [&_p]:mt-1 [&_p]:mb-0 [&_p]:text-muted"
      role="region"
      aria-live="polite"
    >
      <strong>{SEAL_LABELS[seal.type]}</strong>
      <p>{SEAL_EXPLANATIONS[seal.type]}</p>
      {seal.grantedAt ? (
        <p>Concedido em {new Date(seal.grantedAt).toLocaleDateString('pt-BR')}</p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';

export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info';

type FeedbackBannerProps = {
  variant: FeedbackVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
};

const bannerVariants = cva(
  'mb-4 flex animate-feedback-enter items-start gap-3 rounded border border-transparent p-4',
  {
    variants: {
      variant: {
        success: 'border-accent/25 bg-accent-soft text-ink',
        error: 'border-danger/35 bg-[color-mix(in_srgb,var(--gt-danger)_8%,var(--gt-surface))] text-ink',
        warning:
          'border-warning/35 bg-[color-mix(in_srgb,var(--gt-warning)_10%,var(--gt-surface))] text-ink',
        info: 'border-border-strong bg-surface-muted text-ink',
      },
    },
  },
);

function FeedbackIcon({ variant }: { variant: FeedbackVariant }) {
  const iconClass = cn(
    'h-6 w-6 shrink-0',
    variant === 'error' && 'text-danger',
    variant === 'warning' && 'text-warning',
  );

  if (variant === 'success') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          className="animate-check-draw [stroke-dasharray:24] [stroke-dashoffset:24]"
          d="M7 12.5l3 3 7-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'warning') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'info') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function FeedbackBanner({
  variant,
  title,
  message,
  onDismiss,
  action,
  className,
}: FeedbackBannerProps) {
  const role = variant === 'success' ? 'status' : 'alert';

  return (
    <div className={cn(bannerVariants({ variant }), className)} role={role}>
      <FeedbackIcon variant={variant} />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="mb-1 mt-0 font-display text-base font-bold">{title}</p>
        ) : null}
        <p className="m-0 leading-[1.45] text-muted">{message}</p>
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="min-h-8 min-w-8 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent p-0 text-[1.25rem] leading-none opacity-70 hover:bg-current/10 hover:opacity-100"
          aria-label="Fechar aviso"
          onClick={onDismiss}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

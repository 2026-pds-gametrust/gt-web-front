import type { ReactNode } from 'react';

export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info';

type FeedbackBannerProps = {
  variant: FeedbackVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
};

function FeedbackIcon({ variant }: { variant: FeedbackVariant }) {
  if (variant === 'success') {
    return (
      <svg className="feedback-banner__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          className="feedback-banner__check"
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
      <svg className="feedback-banner__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'info') {
    return (
      <svg className="feedback-banner__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className="feedback-banner__icon" viewBox="0 0 24 24" aria-hidden="true">
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
  className = '',
}: FeedbackBannerProps) {
  const role = variant === 'success' ? 'status' : 'alert';

  return (
    <div
      className={`feedback-banner feedback-banner--${variant} gt-feedback-enter${className ? ` ${className}` : ''}`}
      role={role}
    >
      <FeedbackIcon variant={variant} />
      <div className="feedback-banner__body">
        {title ? <p className="feedback-banner__title">{title}</p> : null}
        <p className="feedback-banner__message">{message}</p>
        {action ? <div className="feedback-banner__action">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="feedback-banner__dismiss"
          aria-label="Fechar aviso"
          onClick={onDismiss}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

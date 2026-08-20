import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="animate-feedback-enter rounded-lg border border-dashed border-border-strong bg-surface p-8 text-center">
      <h2 className="mb-2 mt-0">{title}</h2>
      {children ? <p className="mb-4 mt-0 text-muted">{children}</p> : null}
      {action}
    </div>
  );
}

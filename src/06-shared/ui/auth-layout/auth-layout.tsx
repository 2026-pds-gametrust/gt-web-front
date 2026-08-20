import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string;
  lead?: string;
  children: ReactNode;
  footer?: ReactNode;
  callout?: ReactNode;
};

export function AuthLayout({ title, lead, children, footer, callout }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-card wizard-panel">
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {callout}
        {children}
        {footer}
      </div>
    </div>
  );
}

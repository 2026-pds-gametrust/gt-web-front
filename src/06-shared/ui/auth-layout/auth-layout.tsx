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
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-[32rem] rounded-lg border border-border bg-surface p-6 shadow-[0_8px_32px_rgba(24,24,24,0.08)] [&_.auth-footer]:mt-6 [&_.auth-footer]:text-muted [&_.auth-footer_a]:font-bold [&_.auth-footer_a]:text-accent [&_.auth-footer_a]:underline [&_.auth-footer_a]:underline-offset-[0.15em] [&_.auth-footer_a:hover]:text-accent-hover">
        <h1 className="mb-2 mt-0 font-display text-2xl font-extrabold tracking-[-0.03em]">
          {title}
        </h1>
        {lead ? <p className="lead mb-6 mt-0 text-muted">{lead}</p> : null}
        {callout}
        {children}
        {footer}
      </div>
    </div>
  );
}

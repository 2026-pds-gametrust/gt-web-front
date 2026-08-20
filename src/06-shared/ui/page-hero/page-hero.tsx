import type { ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

type PageHeroProps = {
  titleId: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHero({ titleId, title, children, className }: PageHeroProps) {
  return (
    <section
      className={cn('mb-12 animate-fade-up [&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:font-display [&_h1]:text-[clamp(2rem,5vw,3rem)] [&_h1]:font-extrabold [&_h1]:italic [&_h1]:leading-[1.05] [&_h1]:tracking-[-0.04em] [&_h1]:uppercase [&_p]:mb-6 [&_p]:mt-0 [&_p]:max-w-[38rem] [&_p]:text-[1.05rem] [&_p]:text-muted', className)}
      aria-labelledby={titleId}
    >
      <h1 id={titleId}>{title}</h1>
      {children}
    </section>
  );
}

import type { ReactNode } from 'react';

type PageHeroProps = {
  titleId: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHero({ titleId, title, children, className = '' }: PageHeroProps) {
  const classes = ['page-hero', 'gt-fade-up', className].filter(Boolean).join(' ');

  return (
    <section className={classes} aria-labelledby={titleId}>
      <h1 id={titleId}>{title}</h1>
      {children}
    </section>
  );
}

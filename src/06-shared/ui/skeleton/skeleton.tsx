type SkeletonProps = {
  variant?: 'block' | 'card' | 'page';
  count?: number;
  label?: string;
};

export function Skeleton({ variant = 'page', count = 3, label = 'Carregando…' }: SkeletonProps) {
  if (variant === 'block') {
    return <div className="skeleton-shimmer skeleton-block" aria-hidden="true" />;
  }

  if (variant === 'card') {
    return (
      <div className="home-skeleton" aria-busy="true" aria-live="polite">
        <span className="visually-hidden">{label}</span>
        <div className="home-skeleton__grid" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="home-skeleton__card skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-skeleton" aria-busy="true" aria-live="polite">
      <span className="visually-hidden">{label}</span>
      <div className="home-skeleton__block skeleton-shimmer" style={{ width: '40%' }} aria-hidden="true" />
      <div className="home-skeleton__grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="home-skeleton__card skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}

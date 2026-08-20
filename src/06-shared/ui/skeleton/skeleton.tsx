type SkeletonProps = {
  variant?: 'block' | 'card' | 'page';
  count?: number;
  label?: string;
};

export function Skeleton({ variant = 'page', count = 3, label = 'Carregando…' }: SkeletonProps) {
  if (variant === 'block') {
    return <div className="skeleton-shimmer mb-3 h-5" aria-hidden="true" />;
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">{label}</span>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="skeleton-shimmer h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="skeleton-shimmer h-5 w-[40%]" aria-hidden="true" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="skeleton-shimmer h-48" />
        ))}
      </div>
    </div>
  );
}

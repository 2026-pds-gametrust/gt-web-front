import type { ReactNode } from 'react';

export type StatusSceneVariant = 'lost' | 'down';

type StatusSceneProps = {
  variant: StatusSceneVariant;
  code: string;
  title: string;
  message: string;
  meme: string;
  actions: ReactNode;
  className?: string;
};

function LostIllustration() {
  return (
    <svg className="status-scene__art" viewBox="0 0 280 180" aria-hidden="true">
      <rect className="status-scene__crt" x="48" y="18" width="184" height="118" rx="8" />
      <rect className="status-scene__screen" x="60" y="30" width="160" height="86" rx="3" />
      <text className="status-scene__screen-text" x="140" y="82" textAnchor="middle">
        NO SIGNAL
      </text>
      <rect className="status-scene__scan" x="60" y="30" width="160" height="12" />
      <rect x="118" y="136" width="44" height="10" rx="2" fill="currentColor" opacity="0.35" />
      <g className="status-scene__float">
        <rect x="198" y="128" width="54" height="28" rx="6" fill="currentColor" />
        <circle cx="214" cy="142" r="5" fill="#f83800" />
        <circle cx="232" cy="142" r="5" fill="#ececec" />
        <rect x="244" y="136" width="4" height="12" rx="1" fill="#ececec" />
      </g>
    </svg>
  );
}

function DownIllustration() {
  return (
    <svg className="status-scene__art" viewBox="0 0 280 180" aria-hidden="true">
      <rect x="78" y="36" width="124" height="88" rx="8" fill="currentColor" />
      <rect x="90" y="48" width="100" height="52" rx="3" fill="#111" />
      <g className="status-scene__heat">
        <path d="M118 44c0-10 8-16 8-24" fill="none" stroke="#f83800" strokeWidth="3" />
        <path d="M140 42c0-12 8-18 8-28" fill="none" stroke="#f83800" strokeWidth="3" />
        <path d="M162 44c0-10 8-16 8-24" fill="none" stroke="#f83800" strokeWidth="3" />
      </g>
      <g transform="translate(140 74)">
        <g className="status-scene__fan">
          <circle r="16" fill="#181818" stroke="#f83800" strokeWidth="2" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" transform="rotate(120)" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" transform="rotate(240)" />
          <circle r="4" fill="#ececec" />
        </g>
      </g>
      <g className="status-scene__cable">
        <path d="M202 92c24 8 36 28 28 48" fill="none" stroke="#f83800" strokeWidth="4" />
        <rect x="218" y="136" width="28" height="14" rx="3" fill="#f83800" />
      </g>
    </svg>
  );
}

export function StatusScene({
  variant,
  code,
  title,
  meme,
  message,
  actions,
  className = '',
}: StatusSceneProps) {
  const classes = ['status-scene', `status-scene--${variant}`, 'gt-fade-up', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes} role="alert" aria-labelledby="status-scene-title">
      <p className="status-scene__code" aria-hidden="true">
        {code}
      </p>
      {variant === 'lost' ? <LostIllustration /> : <DownIllustration />}
      <p className="status-scene__meme">{meme}</p>
      <h1 id="status-scene-title">{title}</h1>
      <p className="status-scene__message">{message}</p>
      <div className="status-scene__actions">{actions}</div>
    </section>
  );
}

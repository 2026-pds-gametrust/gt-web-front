import type { ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

export type StatusSceneVariant = 'lost' | 'down';

type StatusSceneProps = {
  variant: StatusSceneVariant;
  code: string;
  title: string;
  message: string;
  meme: string;
  actions: ReactNode;
  full?: boolean;
  className?: string;
};

function LostIllustration() {
  return (
    <svg className="h-auto w-full max-w-[22rem] text-[#ececec]" viewBox="0 0 280 180" aria-hidden="true">
      <rect className="fill-[#2a2a2a] stroke-accent stroke-[3]" x="48" y="18" width="184" height="118" rx="8" />
      <rect className="fill-[#050505]" x="60" y="30" width="160" height="86" rx="3" />
      <text
        className="fill-accent font-display text-[18px] font-extrabold tracking-[0.18em]"
        x="140"
        y="82"
        textAnchor="middle"
      >
        NO SIGNAL
      </text>
      <rect className="animate-scan fill-accent/22" x="60" y="30" width="160" height="12" />
      <rect x="118" y="136" width="44" height="10" rx="2" fill="currentColor" opacity="0.35" />
      <g className="origin-center animate-float">
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
    <svg className="h-auto w-full max-w-[22rem] text-[#ececec]" viewBox="0 0 280 180" aria-hidden="true">
      <rect x="78" y="36" width="124" height="88" rx="8" fill="currentColor" />
      <rect x="90" y="48" width="100" height="52" rx="3" fill="#111" />
      <g className="animate-heat">
        <path d="M118 44c0-10 8-16 8-24" fill="none" stroke="#f83800" strokeWidth="3" />
        <path d="M140 42c0-12 8-18 8-28" fill="none" stroke="#f83800" strokeWidth="3" />
        <path d="M162 44c0-10 8-16 8-24" fill="none" stroke="#f83800" strokeWidth="3" />
      </g>
      <g transform="translate(140 74)">
        <g className="origin-center animate-fan [transform-box:fill-box]">
          <circle r="16" fill="#181818" stroke="#f83800" strokeWidth="2" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" transform="rotate(120)" />
          <path d="M0-12 A12 12 0 0 1 10 6 L0 0 Z" fill="#f83800" transform="rotate(240)" />
          <circle r="4" fill="#ececec" />
        </g>
      </g>
      <g className="origin-[230px_140px] animate-[gt-wiggle_1.6s_ease-in-out_infinite]">
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
  full = false,
  className,
}: StatusSceneProps) {
  return (
    <section
      className={cn(
        'relative isolate grid min-h-[min(72vh,42rem)] animate-fade-up content-center items-center justify-items-center gap-3 overflow-hidden rounded border border-[color-mix(in_srgb,var(--gt-accent)_22%,var(--gt-border))] bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_srgb,var(--gt-accent)_16%,transparent),transparent_62%),linear-gradient(180deg,#111_0%,#1c1c1c_48%,#2a120c_100%)] px-5 py-12 text-center text-[#f5f5f5] shadow-lift',
        full &&
          'fixed inset-0 z-[80] m-0 min-h-dvh w-full rounded-none border-0 shadow-none',
        className,
      )}
      role="alert"
      aria-labelledby="status-scene-title"
    >
      <p
        className="m-0 animate-glitch font-display text-[clamp(4.5rem,14vw,8rem)] font-extrabold italic leading-[0.85] tracking-[-0.06em] text-white [text-shadow:4px_0_0_color-mix(in_srgb,var(--gt-accent)_70%,transparent)]"
        aria-hidden="true"
      >
        {code}
      </p>
      {variant === 'lost' ? <LostIllustration /> : <DownIllustration />}
      <p className="m-0 border border-[color-mix(in_srgb,var(--gt-accent)_55%,#fff)] px-[0.7rem] py-[0.2rem] text-[0.78rem] font-extrabold tracking-[0.16em] text-accent">
        {meme}
      </p>
      <h1
        id="status-scene-title"
        className="m-0 max-w-[22ch] font-display text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em]"
      >
        {title}
      </h1>
      <p className="m-0 max-w-[38rem] text-header-text/80">{message}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">{actions}</div>
    </section>
  );
}

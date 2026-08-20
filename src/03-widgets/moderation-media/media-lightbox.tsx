import { useEffect } from 'react';
import { Button } from '@shared/ui/button/button';

export type MediaLightboxItem = {
  id: string;
  kind: 'image' | 'video';
  url: string;
  label: string;
};

type MediaLightboxProps = {
  items: MediaLightboxItem[];
  index: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

export function MediaLightbox({
  items,
  index,
  onClose,
  onChangeIndex,
}: MediaLightboxProps) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    if (!item) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft' && hasPrev) {
        onChangeIndex(index - 1);
        return;
      }
      if (event.key === 'ArrowRight' && hasNext) {
        onChangeIndex(index + 1);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [hasNext, hasPrev, index, item, onChangeIndex, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer border-0 bg-black/72"
        onClick={onClose}
        aria-label="Fechar visualização ampliada"
      />

      <div className="relative z-[1] grid max-h-[92vh] w-[min(96vw,1200px)] gap-3 rounded-[calc(var(--radius)+4px)] bg-surface p-4 shadow-[0_24px_80px_rgb(0_0_0/35%)]">
        <header className="flex items-center gap-3">
          <p className="m-0 flex-1 font-semibold">{item.label}</p>
          {items.length > 1 ? (
            <span className="text-[0.85rem] text-muted">
              {index + 1} / {items.length}
            </span>
          ) : null}
          <Button type="button" variant="ghost" className="shrink-0" onClick={onClose}>
            Fechar
          </Button>
        </header>

        <div className="relative grid min-h-[40vh] place-items-center">
          {hasPrev ? (
            <button
              type="button"
              className="absolute top-1/2 left-2 h-11 w-11 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-black/55 text-[1.75rem] leading-none text-white hover:bg-black/75 focus-ring"
              onClick={() => onChangeIndex(index - 1)}
              aria-label="Mídia anterior"
            >
              ‹
            </button>
          ) : null}

          {item.kind === 'image' ? (
            <img
              src={item.url}
              alt={item.label}
              className="max-h-[calc(92vh-8rem)] max-w-full rounded bg-surface-muted object-contain"
            />
          ) : (
            <video
              src={item.url}
              controls
              autoPlay
              className="w-[min(96vw,1100px)] max-h-[calc(92vh-8rem)] max-w-full rounded bg-surface-muted object-contain"
            />
          )}

          {hasNext ? (
            <button
              type="button"
              className="absolute top-1/2 right-2 h-11 w-11 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-black/55 text-[1.75rem] leading-none text-white hover:bg-black/75 focus-ring"
              onClick={() => onChangeIndex(index + 1)}
              aria-label="Próxima mídia"
            >
              ›
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';

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
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
    >
      <button
        type="button"
        className="media-lightbox__backdrop"
        onClick={onClose}
        aria-label="Fechar visualização ampliada"
      />

      <div className="media-lightbox__panel">
        <header className="media-lightbox__header">
          <p className="media-lightbox__caption">{item.label}</p>
          {items.length > 1 ? (
            <span className="media-lightbox__counter">
              {index + 1} / {items.length}
            </span>
          ) : null}
          <button
            type="button"
            className="gt-button gt-button--ghost media-lightbox__close"
            onClick={onClose}
          >
            Fechar
          </button>
        </header>

        <div className="media-lightbox__stage">
          {hasPrev ? (
            <button
              type="button"
              className="media-lightbox__nav media-lightbox__nav--prev"
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
              className="media-lightbox__media"
            />
          ) : (
            <video
              src={item.url}
              controls
              autoPlay
              className="media-lightbox__media media-lightbox__media--video"
            />
          )}

          {hasNext ? (
            <button
              type="button"
              className="media-lightbox__nav media-lightbox__nav--next"
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

import { useMemo, useState } from 'react';
import type { IListingMedia } from '@entities/listing/model';
import { cn } from '@shared/lib/cn';
import { MediaLightbox, type MediaLightboxItem } from '@widgets/moderation-media/media-lightbox';

type ListingMediaGalleryProps = {
  media: IListingMedia;
  title: string;
};

type MediaSlide = MediaLightboxItem;

function collectPhotoUrls(media: IListingMedia): string[] {
  const fromList = media.photoUrls?.filter(Boolean) ?? [];
  if (fromList.length > 0) {
    return fromList;
  }
  return media.coverPhotoUrl ? [media.coverPhotoUrl] : [];
}

const STAGE =
  'relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-[linear-gradient(145deg,#ececec,#f8f8f8),var(--gt-surface-muted)]';

export function ListingMediaGallery({ media, title }: ListingMediaGalleryProps) {
  const photos = collectPhotoUrls(media);
  const videoUrl = media.videoUrl?.trim() || undefined;

  const slides = useMemo<MediaSlide[]>(() => {
    const items: MediaSlide[] = photos.map((url, index) => ({
      id: `photo-${index}-${url}`,
      kind: 'image',
      url,
      label: `Foto ${index + 1} do anúncio`,
    }));

    if (videoUrl) {
      items.push({
        id: `video-${videoUrl}`,
        kind: 'video',
        url: videoUrl,
        label: 'Vídeo do anúncio',
      });
    }

    return items;
  }, [photos, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{
    items: MediaLightboxItem[];
    index: number;
  } | null>(null);

  const activeSlide = slides[activeIndex] ?? slides[0];

  const openLightbox = () => {
    if (slides.length === 0) return;
    setLightbox({ items: slides, index: activeIndex });
  };

  if (slides.length === 0) {
    return (
      <div className="grid min-w-0 gap-3" role="img" aria-label="Sem mídia">
        <div className={cn(STAGE, 'grid place-items-center')}>
          <span className="p-4 text-center font-semibold text-muted">
            Sem fotos ou vídeo neste anúncio
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-3">
      {lightbox ? (
        <MediaLightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(index) =>
            setLightbox((current) => (current ? { ...current, index } : null))
          }
        />
      ) : null}

      <div className={STAGE}>
        {activeSlide?.kind === 'video' ? (
          <video
            key={activeSlide.url}
            src={activeSlide.url}
            controls
            preload="metadata"
            playsInline
            className="block h-full w-full animate-fade-up bg-transparent object-contain"
          />
        ) : (
          <img
            src={activeSlide?.url}
            alt={`${title} — ${activeSlide?.label ?? 'foto'}`}
            loading="eager"
            key={activeSlide?.url}
            className="block h-full w-full animate-fade-up object-contain"
          />
        )}

        <div className="absolute inset-2 bottom-auto left-auto flex items-center gap-2">
          {slides.length > 1 ? (
            <span className="rounded-sm border border-border bg-white/92 px-[0.55rem] py-[0.2rem] text-[0.75rem] font-bold tracking-[0.02em] text-muted">
              {activeIndex + 1} / {slides.length}
            </span>
          ) : null}
          <button
            type="button"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-sm border border-border-strong bg-white/92 text-base leading-none shadow-gt hover:border-accent hover:text-accent focus-ring"
            onClick={openLightbox}
            aria-label="Ampliar mídia"
          >
            ⤢
          </button>
        </div>
      </div>

      {slides.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]"
          role="tablist"
          aria-label="Mídia do anúncio"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={slide.label}
              className={cn(
                'relative h-[4.75rem] w-[4.75rem] shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 bg-surface-muted p-0 transition-[border-color] duration-[120ms]',
                index === activeIndex
                  ? 'border-accent shadow-[0_0_0_1px_var(--gt-accent)]'
                  : 'border-border hover:border-border-strong',
              )}
              onClick={() => setActiveIndex(index)}
            >
              {slide.kind === 'video' ? (
                <>
                  {photos[0] ? (
                    <img src={photos[0]} alt="" loading="lazy" className="block h-full w-full object-cover" />
                  ) : (
                    <span
                      className="block h-full w-full bg-[linear-gradient(145deg,#dedede,#f2f2f2)]"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="pointer-events-none absolute inset-0 grid place-items-center bg-black/42 text-[0.85rem] text-white"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </>
              ) : (
                <img src={slide.url} alt="" loading="lazy" className="block h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

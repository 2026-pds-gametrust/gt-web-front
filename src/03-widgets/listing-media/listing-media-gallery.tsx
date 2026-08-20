import { useMemo, useState } from 'react';
import type { IListingMedia } from '@entities/listing/model';
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
      <div className="listing-media listing-media--empty" role="img" aria-label="Sem mídia">
        <div className="listing-media__stage">
          <span className="listing-media__placeholder">Sem fotos ou vídeo neste anúncio</span>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-media">
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

      <div className="listing-media__stage">
        {activeSlide?.kind === 'video' ? (
          <video
            key={activeSlide.url}
            src={activeSlide.url}
            controls
            preload="metadata"
            playsInline
            className="listing-media__video-player"
          />
        ) : (
          <img
            src={activeSlide?.url}
            alt={`${title} — ${activeSlide?.label ?? 'foto'}`}
            loading="eager"
          />
        )}

        <div className="listing-media__toolbar">
          {slides.length > 1 ? (
            <span className="listing-media__counter">
              {activeIndex + 1} / {slides.length}
            </span>
          ) : null}
          <button
            type="button"
            className="listing-media__expand"
            onClick={openLightbox}
            aria-label="Ampliar mídia"
          >
            ⤢
          </button>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="listing-media__thumbs" role="tablist" aria-label="Mídia do anúncio">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={slide.label}
              className={`listing-media__thumb${
                index === activeIndex ? ' is-active' : ''
              }${slide.kind === 'video' ? ' listing-media__thumb--video' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {slide.kind === 'video' ? (
                <>
                  {photos[0] ? (
                    <img src={photos[0]} alt="" loading="lazy" />
                  ) : (
                    <span className="listing-media__video-fallback" aria-hidden="true" />
                  )}
                  <span className="listing-media__play-badge" aria-hidden="true">
                    ▶
                  </span>
                </>
              ) : (
                <img src={slide.url} alt="" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

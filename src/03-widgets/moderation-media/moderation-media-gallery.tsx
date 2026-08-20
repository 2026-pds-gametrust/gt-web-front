import { useEffect, useMemo, useState } from 'react';
import { mediaApi } from '@features/media/api/media-api';
import type { IEvidenceItem } from '@entities/evidence-item/model';
import type { IListing } from '@entities/listing/model';
import { MediaLightbox, type MediaLightboxItem } from './media-lightbox';

type ExpandableMediaProps = {
  item: MediaLightboxItem;
  onExpand: () => void;
};

function ExpandableMedia({ item, onExpand }: ExpandableMediaProps) {
  return (
    <figure className="moderation-media__item moderation-media__item--clickable">
      <button
        type="button"
        className="moderation-media__trigger"
        onClick={onExpand}
        aria-label={`Ampliar ${item.label}`}
      >
        {item.kind === 'image' ? (
          <img src={item.url} alt={item.label} loading="lazy" />
        ) : (
          <video src={item.url} preload="metadata" muted playsInline />
        )}
        <span className="moderation-media__zoom-hint" aria-hidden="true">
          Ampliar
        </span>
      </button>
      <figcaption>{item.label}</figcaption>
    </figure>
  );
}

function RestrictedEvidencePreview({
  assetId,
  label,
  onExpand,
}: {
  assetId: string;
  label: string;
  onExpand: (item: MediaLightboxItem) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const grant = await mediaApi.getContentGrant(assetId);
        if (!cancelled) setUrl(grant.url);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assetId]);

  if (failed) {
    return <p className="panel-list__meta">Não foi possível carregar a evidência.</p>;
  }
  if (!url) {
    return <p className="panel-list__meta">Carregando evidência…</p>;
  }

  const item: MediaLightboxItem = {
    id: `evidence-${assetId}`,
    kind: 'image',
    url,
    label,
  };

  return (
    <ExpandableMedia
      item={item}
      onExpand={() => onExpand(item)}
    />
  );
}

type ModerationMediaGalleryProps = {
  listing: IListing | null;
  evidence: IEvidenceItem[];
};

/** Listing media (public) plus restricted evidence items attached to the case. */
export function ModerationMediaGallery({ listing, evidence }: ModerationMediaGalleryProps) {
  const [lightbox, setLightbox] = useState<{
    items: MediaLightboxItem[];
    index: number;
  } | null>(null);

  const photoUrls = listing?.media.photoUrls ?? [];
  const videoUrl = listing?.media.videoUrl?.trim();

  const listingLightboxItems = useMemo<MediaLightboxItem[]>(() => {
    const items: MediaLightboxItem[] = photoUrls.map((url, index) => ({
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
  }, [photoUrls, videoUrl]);

  const openListingLightbox = (id: string) => {
    const index = listingLightboxItems.findIndex((item) => item.id === id);
    if (index >= 0) {
      setLightbox({ items: listingLightboxItems, index });
    }
  };

  const openEvidenceLightbox = (item: MediaLightboxItem) => {
    setLightbox({ items: [item], index: 0 });
  };

  return (
    <section className="moderation-card moderation-media" aria-label="Mídia e evidências">
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

      <div className="moderation-detail__block">
        <h3>Mídia do anúncio</h3>
        {photoUrls.length === 0 && !videoUrl ? (
          <p>Sem fotos ou vídeo no anúncio.</p>
        ) : (
          <div className="moderation-media__grid">
            {listingLightboxItems.map((item) => (
              <ExpandableMedia
                key={item.id}
                item={item}
                onExpand={() => openListingLightbox(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="moderation-detail__block">
        <h3>Evidências do caso</h3>
        {evidence.length === 0 ? (
          <p>Nenhuma evidência restrita anexada ao caso (só mídia do anúncio acima).</p>
        ) : (
          <div className="moderation-media__grid">
            {evidence.map((item) =>
              item.assetId ? (
                <RestrictedEvidencePreview
                  key={item.id}
                  assetId={item.assetId}
                  label={item.label ?? item.type}
                  onExpand={openEvidenceLightbox}
                />
              ) : (
                <figure key={item.id} className="moderation-media__item">
                  <p className="panel-list__meta">{item.storageKey}</p>
                  <figcaption>{item.label ?? item.type}</figcaption>
                </figure>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

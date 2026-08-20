import { useEffect, useMemo, useState } from 'react';
import { mediaApi } from '@features/media/api/media-api';
import type { IEvidenceItem } from '@entities/evidence-item/model';
import type { IListing } from '@entities/listing/model';
import { cn } from '@shared/lib/cn';
import { MediaLightbox, type MediaLightboxItem } from './media-lightbox';

const MOD_CARD = 'rounded-lg border border-border bg-surface p-4';
const DETAIL_BLOCK =
  '[&+&]:mt-6 [&+&]:border-t [&+&]:border-border [&+&]:pt-6';

type ExpandableMediaProps = {
  item: MediaLightboxItem;
  onExpand: () => void;
};

function ExpandableMedia({ item, onExpand }: ExpandableMediaProps) {
  return (
    <figure className="m-0 grid gap-2">
      <button
        type="button"
        className="relative block w-full cursor-zoom-in rounded border-0 bg-transparent p-0 focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={onExpand}
        aria-label={`Ampliar ${item.label}`}
      >
        {item.kind === 'image' ? (
          <img
            src={item.url}
            alt={item.label}
            loading="lazy"
            className="aspect-[4/3] w-full rounded border border-border bg-surface-muted object-cover"
          />
        ) : (
          <video
            src={item.url}
            preload="metadata"
            muted
            playsInline
            className="aspect-video w-full rounded border border-border bg-surface-muted object-cover"
          />
        )}
        <span
          className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-[0.2rem] text-[0.75rem] font-semibold text-white"
          aria-hidden="true"
        >
          Ampliar
        </span>
      </button>
      <figcaption className="text-[0.85rem] text-muted">{item.label}</figcaption>
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
    return <p className="m-0 mt-1 text-[0.9rem] text-muted">Não foi possível carregar a evidência.</p>;
  }
  if (!url) {
    return <p className="m-0 mt-1 text-[0.9rem] text-muted">Carregando evidência…</p>;
  }

  const item: MediaLightboxItem = {
    id: `evidence-${assetId}`,
    kind: 'image',
    url,
    label,
  };

  return <ExpandableMedia item={item} onExpand={() => onExpand(item)} />;
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
    <section
      className={cn(MOD_CARD, 'mb-6 [&_h3]:m-0 [&_h3]:font-display')}
      aria-label="Mídia e evidências"
    >
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

      <div className={DETAIL_BLOCK}>
        <h3>Mídia do anúncio</h3>
        {photoUrls.length === 0 && !videoUrl ? (
          <p>Sem fotos ou vídeo no anúncio.</p>
        ) : (
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
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

      <div className={DETAIL_BLOCK}>
        <h3>Evidências do caso</h3>
        {evidence.length === 0 ? (
          <p>Nenhuma evidência restrita anexada ao caso (só mídia do anúncio acima).</p>
        ) : (
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {evidence.map((item) =>
              item.assetId ? (
                <RestrictedEvidencePreview
                  key={item.id}
                  assetId={item.assetId}
                  label={item.label ?? item.type}
                  onExpand={openEvidenceLightbox}
                />
              ) : (
                <figure key={item.id} className="m-0 grid gap-2">
                  <p className="m-0 mt-1 text-[0.9rem] text-muted">{item.storageKey}</p>
                  <figcaption className="text-[0.85rem] text-muted">
                    {item.label ?? item.type}
                  </figcaption>
                </figure>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

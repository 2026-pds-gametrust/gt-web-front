import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Button } from '@shared/ui/button/button';
import { cn } from '@shared/lib/cn';
import { MIN_LISTING_PHOTOS } from '@entities/listing/model';

const GUIDE_CHIP_DELAYS = ['0ms', '40ms', '80ms', '120ms'] as const;

type ListingMediaEditorProps = {
  photoAssetIds: string[];
  photoPreviews: Record<string, string>;
  videoAssetId: string | null;
  videoPreview: string | null;
  uploading?: boolean;
  uploadStatus?: string | null;
  disabled?: boolean;
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (assetId: string) => void;
  onMovePhoto: (assetId: string, direction: 'up' | 'down') => void;
  onReorderPhotos: (fromIndex: number, toIndex: number) => void;
  onSetVideo: (file: File) => void;
  onClearVideo: () => void;
};

function mediaCountHint(photoCount: number, hasVideo: boolean): string {
  const missing = Math.max(0, MIN_LISTING_PHOTOS - photoCount);
  const photos =
    missing === 0
      ? `${photoCount} fotos na ordem do carrossel. A primeira é a capa.`
      : missing === 1
        ? `Falta 1 foto para o mínimo de ${MIN_LISTING_PHOTOS}.`
        : `Faltam ${missing} fotos para o mínimo de ${MIN_LISTING_PHOTOS}.`;
  const video = hasVideo
    ? ' O vídeo fica no último slide.'
    : ' Ainda falta um vídeo MP4 da unidade (até 50 MB).';
  return `${photos}${video}`;
}

function GuidePanel({
  variant,
  title,
  children,
}: {
  variant: 'do' | 'dont' | 'video';
  title: string;
  children: ReactNode;
}) {
  const borderClass =
    variant === 'do'
      ? 'border-t-accent'
      : variant === 'dont'
        ? 'border-t-danger'
        : 'border-t-header';

  const badgeClass =
    variant === 'do'
      ? 'bg-accent-soft text-accent-hover'
      : variant === 'dont'
        ? 'bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--color-surface))] text-danger'
        : 'bg-header text-white';

  const icon =
    variant === 'dont' ? (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : variant === 'video' ? (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 10l5-3v10l-5-3V10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 12.5l2.5 2.5L16 9.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <section
      className={cn(
        'relative min-w-0 rounded border border-border border-t-[3px] bg-surface p-4 shadow-gt transition-transform duration-200 hover:-translate-y-0.5 animate-fade-up',
        borderClass,
      )}
    >
      <header className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'grid h-8 w-8 shrink-0 place-items-center rounded-full',
            badgeClass,
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3 className="m-0 font-display text-[1.05rem] font-bold">{title}</h3>
      </header>
      <ul
        className={cn(
          'm-0 list-none p-0 text-muted [&_li]:relative [&_li]:pl-[1.35rem] [&_li]:leading-snug [&_li]:before:absolute [&_li]:before:top-[0.45rem] [&_li]:before:left-0 [&_li]:before:h-[0.55rem] [&_li]:before:w-[0.55rem] [&_li]:before:rounded-full [&_li+li]:mt-2',
          variant === 'do' &&
            '[&_li]:before:bg-accent [&_li]:before:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]',
          variant === 'dont' && '[&_li]:before:bg-danger',
          variant === 'video' && '[&_li]:before:bg-header',
        )}
      >
        {children}
      </ul>
    </section>
  );
}

export function ListingMediaEditor({
  photoAssetIds,
  photoPreviews,
  videoAssetId,
  videoPreview,
  uploading = false,
  uploadStatus = null,
  disabled = false,
  onAddPhotos,
  onRemovePhoto,
  onMovePhoto,
  onReorderPhotos,
  onSetVideo,
  onClearVideo,
}: ListingMediaEditorProps) {
  const photoInputId = useId();
  const videoInputId = useId();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const slides = [
    ...photoAssetIds.map((id, index) => ({
      kind: 'photo' as const,
      id,
      src: photoPreviews[id],
      label: index === 0 ? `Capa — foto ${index + 1}` : `Foto ${index + 1}`,
      index,
    })),
    ...(videoAssetId
      ? [
          {
            kind: 'video' as const,
            id: videoAssetId,
            src: videoPreview ?? undefined,
            label: 'Vídeo (último slide)',
            index: photoAssetIds.length,
          },
        ]
      : []),
  ];

  const safeIndex = Math.min(activeIndex, Math.max(0, slides.length - 1));
  const active = slides[safeIndex];

  function handlePhotos(list: FileList | File[] | null) {
    if (!list) return;
    const files = Array.from(list).filter((file) => file.type.startsWith('image/'));
    if (files.length > 0) onAddPhotos(files);
  }

  function onPhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled || uploading) return;
    handlePhotos(event.dataTransfer.files);
  }

  const guideChips = [
    `${MIN_LISTING_PHOTOS}+ fotos`,
    'MP4 ≤ 50 MB',
    'Unidade real',
    'Sem filtro',
  ];

  return (
    <div className="mb-4 grid gap-4">
      <details
        className="group relative overflow-hidden rounded border border-[color-mix(in_srgb,var(--color-accent)_22%,var(--color-border))] bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_55%),linear-gradient(160deg,var(--color-surface)_0%,var(--color-accent-soft)_100%)] p-4 shadow-gt before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-gradient-to-b before:from-accent before:to-[color-mix(in_srgb,var(--color-accent)_40%,var(--color-header))]"
        open
      >
        <summary className="grid min-h-[52px] cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 [&::-webkit-details-marker]:hidden">
          <span
            className="grid h-11 w-11 place-items-center rounded bg-header text-white shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-[transform,box-shadow] duration-200 group-open:scale-[1.04] group-open:bg-accent"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M8 6l1.2-2h5.6L16 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="grid min-w-0 gap-[0.1rem]">
            <span className="text-[0.72rem] font-bold tracking-[0.08em] text-accent-hover uppercase">
              Roteiro da unidade real
            </span>
            <span className="font-display text-[1.15rem] font-bold text-ink">
              Como fotografar e gravar a unidade
            </span>
          </span>
          <span
            className="h-[0.7rem] w-[0.7rem] justify-self-end border-r-2 border-b-2 border-ink transition-transform duration-[220ms] group-open:mt-[0.35rem] group-open:rotate-[225deg] rotate-45"
            aria-hidden="true"
          />
        </summary>

        <div className="mt-4 mb-3 flex flex-wrap gap-2" aria-label="Requisitos rápidos">
          {guideChips.map((chip, index) => (
            <span
              key={chip}
              className="inline-flex min-h-7 animate-fade-up items-center rounded-sm border border-[color-mix(in_srgb,var(--color-accent)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] px-[0.65rem] py-[0.2rem] text-[0.78rem] font-bold tracking-wide text-ink"
              style={{ animationDelay: GUIDE_CHIP_DELAYS[index] }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="grid gap-4 panel:grid-cols-3">
          <GuidePanel variant="do" title="O que fazer">
            <li>Luz natural ou branca, sem flash estourado.</li>
            <li>Fundo neutro e limpo — mesa, tecido liso ou chão visível.</li>
            <li>
              No mínimo {MIN_LISTING_PHOTOS} fotos da sua unidade: frente, costas/laterais e detalhes
              (portas, tela, desgaste).
            </li>
            <li>A primeira foto é a capa — escolha o ângulo geral mais nítido.</li>
            <li>Mostre defeitos de perto. Quem compra precisa ver a unidade real.</li>
            <li>JPEG, PNG ou WebP, até 10 MB cada.</li>
          </GuidePanel>

          <GuidePanel variant="dont" title="O que não fazer">
            <li>Não use foto de catálogo, print de site ou unidade de outra pessoa.</li>
            <li>Não aplique filtro, marca d’água ou texto promocional.</li>
            <li>Não esconda risco, amassado, pixel morto ou peça faltando.</li>
            <li>Não recorte demais: a peça inteira precisa aparecer em pelo menos uma foto.</li>
            <li>Não mostre documento, endereço ou dados pessoais nas imagens públicas.</li>
          </GuidePanel>

          <GuidePanel variant="video" title="Como enviar o vídeo">
            <li>Um arquivo MP4, até 50 MB, da sua unidade — não um unboxing de loja.</li>
            <li>Mostre a peça ligando ou funcionando, se for o caso, e passe pelos defeitos.</li>
            <li>Grave na horizontal, com foco estável. Sem música cobrindo o áudio ambiente.</li>
            <li>O vídeo entra no último slide do carrossel; as fotos vêm antes.</li>
          </GuidePanel>
        </div>
      </details>

      <p className="m-0 text-[0.85rem] text-muted">{mediaCountHint(photoAssetIds.length, Boolean(videoAssetId))}</p>

      {slides.length > 0 ? (
        <div
          className="relative grid min-h-[220px] place-items-center overflow-hidden rounded border border-border bg-[#111]"
          aria-live="polite"
        >
          {active?.kind === 'video' && active.src ? (
            <video
              src={active.src}
              controls
              playsInline
              preload="metadata"
              className="max-h-[360px] w-full object-contain"
            />
          ) : active?.src ? (
            <img src={active.src} alt={active.label} className="max-h-[360px] w-full object-contain" />
          ) : (
            <span className="p-4 text-center font-semibold text-muted">Carregando preview…</span>
          )}
          {active ? (
            <span className="absolute bottom-2 left-2 rounded-sm bg-white/92 px-[0.55rem] py-[0.2rem] text-[0.75rem] font-bold">
              {safeIndex + 1} / {slides.length} · {active.label}
            </span>
          ) : null}
        </div>
      ) : (
        <div
          className="grid min-h-[220px] place-items-center overflow-hidden rounded border border-dashed border-border-strong bg-surface-muted"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onPhotoDrop}
        >
          <p className="m-0 font-semibold text-muted">Arraste fotos da unidade ou use o botão abaixo.</p>
        </div>
      )}

      {photoAssetIds.length > 0 || videoAssetId ? (
        <ul
          className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] gap-4 p-0"
          aria-label="Ordem das fotos no carrossel"
        >
          {photoAssetIds.map((assetId, index) => {
            const src = photoPreviews[assetId];
            return (
              <li
                key={assetId}
                className={cn(
                  'isolate flex min-w-0 flex-col gap-2 overflow-hidden rounded border border-border bg-surface p-2',
                  (index === 0 || safeIndex === index) && 'border-accent',
                )}
                draggable={!disabled && !uploading}
                onDragStart={() => setDragFrom(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (dragFrom === null) return;
                  onReorderPhotos(dragFrom, index);
                  setActiveIndex(index);
                  setDragFrom(null);
                }}
              >
                <button
                  type="button"
                  className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden border-0 bg-surface-muted p-0"
                  onClick={() => setActiveIndex(index)}
                >
                  {src ? (
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>Foto {index + 1}</span>
                  )}
                  {index === 0 ? (
                    <span className="absolute top-1 left-1 z-[1] rounded-sm bg-accent px-[0.4rem] py-[0.1rem] text-[0.7rem] font-extrabold tracking-wide text-white uppercase">
                      Capa
                    </span>
                  ) : null}
                </button>
                <div className="grid w-full grid-cols-3 gap-1">
                  <button
                    type="button"
                    className="min-h-11 w-full min-w-0 cursor-pointer rounded-sm border border-border-strong bg-surface font-bold disabled:cursor-not-allowed disabled:opacity-45 focus-ring"
                    aria-label={`Mover foto ${index + 1} para a esquerda`}
                    disabled={index === 0 || disabled || uploading}
                    onClick={() => {
                      onMovePhoto(assetId, 'up');
                      setActiveIndex(Math.max(0, index - 1));
                    }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="min-h-11 w-full min-w-0 cursor-pointer rounded-sm border border-border-strong bg-surface font-bold disabled:cursor-not-allowed disabled:opacity-45 focus-ring"
                    aria-label={`Mover foto ${index + 1} para a direita`}
                    disabled={index === photoAssetIds.length - 1 || disabled || uploading}
                    onClick={() => {
                      onMovePhoto(assetId, 'down');
                      setActiveIndex(index + 1);
                    }}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className="min-h-11 w-full min-w-0 cursor-pointer rounded-sm border border-border-strong bg-surface font-bold disabled:cursor-not-allowed disabled:opacity-45 focus-ring"
                    aria-label={`Remover foto ${index + 1}`}
                    disabled={disabled || uploading}
                    onClick={() => {
                      onRemovePhoto(assetId);
                      setActiveIndex(0);
                    }}
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
          {videoAssetId ? (
            <li
              className={cn(
                'isolate flex min-w-0 flex-col gap-2 overflow-hidden rounded border border-border bg-surface p-2',
                active?.kind === 'video' && 'border-accent',
              )}
            >
              <button
                type="button"
                className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden border-0 bg-surface-muted p-0"
                onClick={() => setActiveIndex(photoAssetIds.length)}
              >
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>Vídeo</span>
                )}
                <span className="absolute top-1 left-1 z-[1] rounded-sm bg-header px-[0.4rem] py-[0.1rem] text-[0.7rem] font-extrabold tracking-wide text-white uppercase">
                  Último
                </span>
              </button>
              <div className="grid w-full grid-cols-1 gap-1">
                <button
                  type="button"
                  className="min-h-11 w-full min-w-0 cursor-pointer rounded-sm border border-border-strong bg-surface font-bold disabled:cursor-not-allowed disabled:opacity-45 focus-ring"
                  aria-label="Remover vídeo"
                  disabled={disabled || uploading}
                  onClick={onClearVideo}
                >
                  ×
                </button>
              </div>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          ref={photoInputRef}
          id={photoInputId}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled || uploading}
          onChange={(event) => {
            handlePhotos(event.target.files);
            event.target.value = '';
          }}
        />
        <Button
          type="button"
          disabled={disabled || uploading}
          onClick={() => photoInputRef.current?.click()}
        >
          Adicionar fotos
        </Button>
        <input
          ref={videoInputRef}
          id={videoInputId}
          className="sr-only"
          type="file"
          accept="video/mp4"
          disabled={disabled || uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSetVideo(file);
            event.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="ghost"
          disabled={disabled || uploading}
          onClick={() => videoInputRef.current?.click()}
        >
          {videoAssetId ? 'Trocar vídeo' : 'Adicionar vídeo'}
        </Button>
      </div>
      {uploading || uploadStatus ? (
        <p className="m-0 text-[0.875rem] text-muted">{uploadStatus ?? 'Enviando…'}</p>
      ) : null}
    </div>
  );
}

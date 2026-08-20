import { useId, useRef, useState, type DragEvent } from 'react';
import { Button } from '@shared/ui/button/button';
import { MIN_LISTING_PHOTOS } from '@entities/listing/model';

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

  return (
    <div className="media-editor">
      <details className="media-guide" open>
        <summary className="media-guide__summary">
          <span className="media-guide__summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M8 6l1.2-2h5.6L16 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="media-guide__summary-copy">
            <span className="media-guide__eyebrow">Roteiro da unidade real</span>
            <span className="media-guide__title">Como fotografar e gravar a unidade</span>
          </span>
          <span className="media-guide__chevron" aria-hidden="true" />
        </summary>

        <div className="media-guide__chips" aria-label="Requisitos rápidos">
          <span className="media-guide__chip">{MIN_LISTING_PHOTOS}+ fotos</span>
          <span className="media-guide__chip">MP4 ≤ 50 MB</span>
          <span className="media-guide__chip">Unidade real</span>
          <span className="media-guide__chip">Sem filtro</span>
        </div>

        <div className="media-guide__body gt-stagger">
          <section className="media-guide__panel media-guide__panel--do gt-hover-lift gt-fade-up">
            <header className="media-guide__panel-head">
              <span className="media-guide__badge" aria-hidden="true">
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
              </span>
              <h3>O que fazer</h3>
            </header>
            <ul>
              <li>Luz natural ou branca, sem flash estourado.</li>
              <li>Fundo neutro e limpo — mesa, tecido liso ou chão visível.</li>
              <li>
                No mínimo {MIN_LISTING_PHOTOS} fotos da sua unidade: frente, costas/laterais e
                detalhes (portas, tela, desgaste).
              </li>
              <li>A primeira foto é a capa — escolha o ângulo geral mais nítido.</li>
              <li>Mostre defeitos de perto. Quem compra precisa ver a unidade real.</li>
              <li>JPEG, PNG ou WebP, até 10 MB cada.</li>
            </ul>
          </section>

          <section className="media-guide__panel media-guide__panel--dont gt-hover-lift gt-fade-up">
            <header className="media-guide__panel-head">
              <span className="media-guide__badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <h3>O que não fazer</h3>
            </header>
            <ul>
              <li>Não use foto de catálogo, print de site ou unidade de outra pessoa.</li>
              <li>Não aplique filtro, marca d’água ou texto promocional.</li>
              <li>Não esconda risco, amassado, pixel morto ou peça faltando.</li>
              <li>Não recorte demais: a peça inteira precisa aparecer em pelo menos uma foto.</li>
              <li>Não mostre documento, endereço ou dados pessoais nas imagens públicas.</li>
            </ul>
          </section>

          <section className="media-guide__panel media-guide__panel--video gt-hover-lift gt-fade-up">
            <header className="media-guide__panel-head">
              <span className="media-guide__badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 10l5-3v10l-5-3V10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </span>
              <h3>Como enviar o vídeo</h3>
            </header>
            <ul>
              <li>Um arquivo MP4, até 50 MB, da sua unidade — não um unboxing de loja.</li>
              <li>Mostre a peça ligando ou funcionando, se for o caso, e passe pelos defeitos.</li>
              <li>Grave na horizontal, com foco estável. Sem música cobrindo o áudio ambiente.</li>
              <li>O vídeo entra no último slide do carrossel; as fotos vêm antes.</li>
            </ul>
          </section>
        </div>
      </details>

      <p className="form-hint">{mediaCountHint(photoAssetIds.length, Boolean(videoAssetId))}</p>

      {slides.length > 0 ? (
        <div className="media-editor__stage" aria-live="polite">
          {active?.kind === 'video' && active.src ? (
            <video src={active.src} controls playsInline preload="metadata" />
          ) : active?.src ? (
            <img src={active.src} alt={active.label} />
          ) : (
            <span className="listing-media__placeholder">Carregando preview…</span>
          )}
          {active ? (
            <span className="media-editor__stage-label">
              {safeIndex + 1} / {slides.length} · {active.label}
            </span>
          ) : null}
        </div>
      ) : (
        <div
          className="media-editor__dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onPhotoDrop}
        >
          <p>Arraste fotos da unidade ou use o botão abaixo.</p>
        </div>
      )}

      {photoAssetIds.length > 0 || videoAssetId ? (
        <ul className="media-editor__thumbs" aria-label="Ordem das fotos no carrossel">
          {photoAssetIds.map((assetId, index) => {
            const src = photoPreviews[assetId];
            return (
              <li
                key={assetId}
                className={`media-editor__thumb${index === 0 ? ' is-cover' : ''}${
                  safeIndex === index ? ' is-active' : ''
                }`}
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
                  className="media-editor__thumb-preview"
                  onClick={() => setActiveIndex(index)}
                >
                  {src ? <img src={src} alt="" /> : <span>Foto {index + 1}</span>}
                  {index === 0 ? <span className="media-editor__cover">Capa</span> : null}
                </button>
                <div className="media-editor__thumb-actions">
                  <button
                    type="button"
                    className="media-editor__icon-btn"
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
                    className="media-editor__icon-btn"
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
                    className="media-editor__icon-btn"
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
              className={`media-editor__thumb media-editor__thumb--video${
                active?.kind === 'video' ? ' is-active' : ''
              }`}
            >
              <button
                type="button"
                className="media-editor__thumb-preview"
                onClick={() => setActiveIndex(photoAssetIds.length)}
              >
                {videoPreview ? (
                  <video src={videoPreview} muted playsInline preload="metadata" />
                ) : (
                  <span>Vídeo</span>
                )}
                <span className="media-editor__cover">Último</span>
              </button>
              <div className="media-editor__thumb-actions">
                <button
                  type="button"
                  className="media-editor__icon-btn"
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

      <div className="wizard-actions">
        <input
          ref={photoInputRef}
          id={photoInputId}
          className="visually-hidden"
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
          className="visually-hidden"
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
        <p className="offer-card__meta">{uploadStatus ?? 'Enviando…'}</p>
      ) : null}
    </div>
  );
}

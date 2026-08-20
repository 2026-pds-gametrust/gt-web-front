import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { cn } from '@shared/lib/cn';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { ListingMediaEditor } from '@widgets/listing-media/listing-media-editor';
import { formatMoney } from '@shared/lib/format';
import {
  ESellStatus,
  ESellStep,
  useSellStore,
} from '@features/sell-listing/model/use-sell-store';
import { formatRequiredChangeItem } from '@features/listings/lib/seller-verification-copy';
import { VerificationEvidencePanel } from '@widgets/verification-evidence/verification-evidence-panel';
import { MIN_LISTING_PHOTOS } from '@entities/listing/model';
import { ListingDeliveryFields } from '@widgets/listing-shipping/listing-delivery-fields';
import {
  formatShippingSummary,
  listingDeliveryIncompleteReason,
} from '@features/listings/lib/listing-shipping';

const STEP_LABELS = [
  'Identificar',
  'Descrever',
  'Mídia',
  'Preço e entrega',
  'Evidências',
  'Revisão',
] as const;

const WIZARD_PANEL =
  'rounded-lg border border-border bg-surface p-6 [&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:tracking-[-0.03em] [&_p.lead]:mb-6 [&_p.lead]:mt-0 [&_p.lead]:text-muted';

export function ReviseListingPage() {
  const { listingId = '' } = useParams();
  const store = useSellStore();
  const { loadOptions, loadListingForRevision } = store;

  useEffect(() => {
    void loadOptions();
    if (listingId) {
      void loadListingForRevision(listingId);
    }
  }, [listingId, loadListingForRevision, loadOptions]);

  const packageDims = {
    packageWeightGrams: store.packageWeightGrams,
    packageLengthCm: store.packageLengthCm,
    packageWidthCm: store.packageWidthCm,
    packageHeightCm: store.packageHeightCm,
  };
  const deliveryIncomplete = listingDeliveryIncompleteReason(
    store.shippingModes,
    packageDims,
  );
  const canContinueMedia =
    store.photoAssetIds.length >= MIN_LISTING_PHOTOS && Boolean(store.videoAssetId);
  const canContinuePrice = store.priceCents > 0 && !deliveryIncomplete;
  const canResubmit = store.canResubmitRevision();

  if (store.status === ESellStatus.UNDER_REVIEW && store.revisionListingId) {
    return (
      <AppShell>
        <div className={WIZARD_PANEL}>
          <FeedbackBanner
            variant="success"
            title="Anúncio reenviado para revisão"
            message="A moderação vai conferir as correções. Você acompanha o status em Meus anúncios."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className={buttonClassName()} to="/meus-anuncios">
              Ver meus anúncios
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (store.loading && !store.revisionListingId) {
    return (
      <AppShell>
        <p>Carregando anúncio para correção…</p>
      </AppShell>
    );
  }

  if (store.error && !store.revisionListingId) {
    return (
      <AppShell>
        <FeedbackBanner variant="error" title="Não foi possível carregar" message={store.error} />
        <Link className={buttonClassName({ variant: 'ghost' })} to="/meus-anuncios">
          Voltar
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHero titleId="revise-heading" title="Corrigir anúncio">
        <p className="lead mb-6 mt-0 text-muted">
          Ajuste somente o que foi solicitado pela moderação antes de reenviar.
        </p>
      </PageHero>

      {store.requiredChanges.length > 0 ? (
        <section className={cn(WIZARD_PANEL, 'mb-6')} aria-labelledby="changes-heading">
          <h2 id="changes-heading">Itens a corrigir</h2>
          <ul>
            {store.requiredChanges.map((change, index) => (
              <li key={`${change.target}-${change.assetId ?? index}`}>
                {formatRequiredChangeItem(change)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Passos">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as ESellStep;
          return (
            <button
              key={label}
              type="button"
              className={cn(
                'min-h-11 rounded border border-border-strong bg-surface px-3 text-sm font-semibold focus-ring',
                store.step === stepNumber && 'border-accent bg-accent-soft font-bold text-accent-hover',
              )}
              onClick={() => store.setStep(stepNumber)}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {store.step === ESellStep.DESCRIBE ? (
        <div className={WIZARD_PANEL}>
          <label className="mb-4 flex flex-col gap-2">
            Descrição / detalhes
            <textarea
              rows={6}
              className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
              value={store.defects}
              onChange={(event) => store.setDefects(event.target.value)}
            />
          </label>
          <Button onClick={() => store.setStep(ESellStep.MEDIA)}>Continuar</Button>
        </div>
      ) : null}

      {store.step === ESellStep.MEDIA ? (
        <div className={WIZARD_PANEL}>
          <h1>Fotos e vídeo</h1>
          <p className="lead">
            A oferta precisa de pelo menos {MIN_LISTING_PHOTOS} fotos da unidade e um vídeo MP4.
          </p>
          {store.revisionListingId ? (
            <VerificationEvidencePanel
              listingId={store.revisionListingId}
              mode="capture"
            />
          ) : null}
          <ListingMediaEditor
            photoAssetIds={store.photoAssetIds}
            photoPreviews={store.photoPreviews}
            videoAssetId={store.videoAssetId}
            videoPreview={store.videoPreview}
            uploading={store.uploading}
            uploadStatus={store.uploadStatus}
            onAddPhotos={(files) => void store.addPhotos(files)}
            onRemovePhoto={store.removePhoto}
            onMovePhoto={store.movePhoto}
            onReorderPhotos={store.reorderPhotos}
            onSetVideo={(file) => void store.setVideo(file)}
            onClearVideo={store.clearVideo}
          />
          <Button
            disabled={!canContinueMedia}
            onClick={() => store.setStep(ESellStep.PRICE)}
          >
            Continuar
          </Button>
          {!canContinueMedia ? (
            <p className="m-0 text-[0.85rem] text-muted">
              {store.photoAssetIds.length < MIN_LISTING_PHOTOS
                ? `Envie pelo menos ${MIN_LISTING_PHOTOS} fotos da unidade para continuar.`
                : 'Envie um vídeo MP4 da unidade para continuar.'}
            </p>
          ) : null}
        </div>
      ) : null}

      {store.step === ESellStep.PRICE ? (
        <div className={WIZARD_PANEL}>
          <h1>Preço e entrega</h1>
          <label className="mb-4 flex flex-col gap-2">
            Preço (centavos)
            <input
              type="number"
              min={1}
              className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
              value={store.priceCents}
              onChange={(event) => store.setPriceCents(Number(event.target.value))}
            />
          </label>
          <p>{formatMoney(store.priceCents)}</p>
          <ListingDeliveryFields
            modes={store.shippingModes}
            packageDims={packageDims}
            onToggleMode={store.toggleShippingMode}
            onPackageChange={(next) => store.setShippingPackage(next)}
          />
          <Button
            disabled={!canContinuePrice}
            onClick={() => store.setStep(ESellStep.REVIEW)}
          >
            Continuar
          </Button>
          {!canContinuePrice ? (
            <p className="m-0 text-[0.85rem] text-muted">
              {store.priceCents <= 0
                ? 'Informe o preço para continuar.'
                : deliveryIncomplete}
            </p>
          ) : null}
        </div>
      ) : null}

      {store.step === ESellStep.REVIEW ? (
        <div className={WIZARD_PANEL}>
          <h2>Revisão antes do reenvio</h2>
          <p>
            {canResubmit
              ? 'Todas as correções solicitadas foram detectadas.'
              : deliveryIncomplete ?? 'Ainda faltam correções obrigatórias.'}
          </p>
          <p className="m-0 text-[0.85rem] text-muted">Entrega: {formatShippingSummary(store.shippingModes, packageDims)}</p>
          {store.error ? (
            <FeedbackBanner variant="error" title="Não foi possível reenviar" message={store.error} />
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button disabled={!canResubmit || store.loading} onClick={() => void store.resubmitRevision()}>
              Reenviar para análise
            </Button>
            <Link className={buttonClassName({ variant: 'ghost' })} to="/meus-anuncios">
              Cancelar
            </Link>
          </div>
        </div>
      ) : null}

      {store.step === ESellStep.IDENTIFY ? (
        <div className={WIZARD_PANEL}>
          <p>Produto já definido. Avance para descrever ou mídia conforme os ajustes.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => store.setStep(ESellStep.DESCRIBE)}>Descrição</Button>
            <Button variant="ghost" onClick={() => store.setStep(ESellStep.MEDIA)}>
              Mídia
            </Button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

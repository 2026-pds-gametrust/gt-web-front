import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { cn } from '@shared/lib/cn';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { FormField } from '@shared/ui/form-field/form-field';
import { ListingMediaEditor } from '@widgets/listing-media/listing-media-editor';
import { formatMoney } from '@shared/lib/format';
import {
  ESellStatus,
  ESellStep,
  useSellStore,
} from '@features/sell-listing/model/use-sell-store';
import { VerificationEvidencePanel } from '@widgets/verification-evidence/verification-evidence-panel';
import { EListingCondition, MIN_LISTING_PHOTOS } from '@entities/listing/model';
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

const CONDITION_OPTIONS = [
  { value: EListingCondition.LIKE_NEW, label: 'Como novo' },
  { value: EListingCondition.GOOD, label: 'Bom' },
  { value: EListingCondition.FAIR, label: 'Regular' },
  { value: EListingCondition.POOR, label: 'Com marcas' },
] as const;

export function SellPage() {
  const store = useSellStore();
  const [mediaDraftReady, setMediaDraftReady] = useState(false);

  useEffect(() => {
    void store.loadOptions();
  }, [store.loadOptions]);

  useEffect(() => {
    if (store.step !== ESellStep.MEDIA) {
      return;
    }
    let cancelled = false;
    setMediaDraftReady(Boolean(store.draftListingId));
    void (async () => {
      const id = await store.ensureDraftListing();
      if (!cancelled && id) {
        setMediaDraftReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [store.step, store.draftListingId, store.ensureDraftListing]);

  const product = store.products.find((p) => p.id === store.productId);
  const canContinueIdentify = Boolean(store.productId);
  const canContinueDescribe = Boolean(store.condition);
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
  const canContinueEvidence = store.evidenceIds.length > 0;

  if (store.status === ESellStatus.UNDER_REVIEW && store.submittedListingId) {
    return (
      <AppShell>
        <div className="rounded-lg border border-border bg-surface p-6">
          <FeedbackBanner
            variant="success"
            title="Anúncio enviado para revisão"
            message="A moderação vai conferir suas fotos, o vídeo e o código de posse. Você acompanha o status em Meus anúncios."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                store.reset();
                void store.loadOptions();
              }}
            >
              Criar outro anúncio
            </Button>
            <Link className={buttonClassName({ variant: 'ghost' })} to="/meus-anuncios">
              Meus anúncios
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Passos do anúncio">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as typeof ESellStep.IDENTIFY;
          const isCurrent = store.step === stepNumber;
          const isDone = store.step > stepNumber;
          return (
            <span
              key={label}
              className={cn(
                'inline-flex min-h-11 items-center rounded bg-surface-muted px-3 text-[0.8rem] font-semibold text-muted transition-[background,color] duration-150',
                isCurrent && 'bg-accent-soft text-accent-hover',
                isDone && 'bg-seal-bg text-seal',
              )}
            >
              {index + 1}. {label}
            </span>
          );
        })}
      </div>

      <div className="animate-fade-up rounded-lg border border-border bg-surface p-6 [&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:tracking-[-0.03em] [&_p.lead]:mb-6 [&_p.lead]:mt-0 [&_p.lead]:text-muted">
        {store.step === ESellStep.IDENTIFY ? (
          <>
            <h1>Identificar o produto</h1>
            <p className="lead">Escolha o modelo de catálogo (Produto ≠ Oferta).</p>
            <FormField id="sell-product" label="Produto" required>
              <select
                value={store.productId ?? ''}
                onChange={(e) => store.setProductId(e.target.value)}
              >
                <option value="">Selecione…</option>
                {store.products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.brand} {item.model}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button disabled={!canContinueIdentify} onClick={() => store.setStep(ESellStep.DESCRIBE)}>
                Continuar
              </Button>
            </div>
          </>
        ) : null}

        {store.step === ESellStep.DESCRIBE ? (
          <>
            <h1>Descrever a unidade</h1>
            <p className="lead">Condição, defeitos e acessórios da sua unidade usada.</p>
            <FormField id="sell-condition" label="Condição" required>
              <select
                value={store.condition}
                onChange={(e) => store.setCondition(e.target.value)}
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="sell-defects" label="Defeitos / conservação">
              <textarea
                value={store.defects}
                onChange={(e) => store.setDefects(e.target.value)}
                placeholder="Ex.: risco cosmético na tampa"
              />
            </FormField>
            <FormField id="sell-accessories" label="Acessórios">
              <textarea
                value={store.accessories}
                onChange={(e) => store.setAccessories(e.target.value)}
                placeholder="Ex.: caixa, cabo, carregador"
              />
            </FormField>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => store.setStep(ESellStep.IDENTIFY)}>
                Voltar
              </Button>
              <Button disabled={!canContinueDescribe} onClick={() => store.setStep(ESellStep.MEDIA)}>
                Continuar
              </Button>
            </div>
          </>
        ) : null}

        {store.step === ESellStep.MEDIA ? (
          <>
            <h1>Fotos e vídeo</h1>
            <p className="lead">
              A oferta precisa de pelo menos {MIN_LISTING_PHOTOS} fotos da unidade e um vídeo MP4.
            </p>

            {store.draftListingId && mediaDraftReady ? (
              <VerificationEvidencePanel
                listingId={store.draftListingId}
                mode="capture"
              />
            ) : (
              <FeedbackBanner
                variant="info"
                title="Preparando código de posse…"
                message="Em instantes você verá o código para anotar junto ao produto nas fotos e no vídeo."
              />
            )}

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

            {store.error ? (
              <FeedbackBanner variant="error" title="Não foi possível enviar" message={store.error} />
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => store.setStep(ESellStep.DESCRIBE)}>
                Voltar
              </Button>
              <Button
                disabled={!canContinueMedia || store.uploading}
                onClick={() => store.setStep(ESellStep.PRICE)}
              >
                Continuar
              </Button>
            </div>
            {!canContinueMedia && !store.uploading ? (
              <p className="m-0 text-[0.85rem] text-muted">
                {store.photoAssetIds.length < MIN_LISTING_PHOTOS
                  ? `Envie pelo menos ${MIN_LISTING_PHOTOS} fotos da unidade para continuar.`
                  : 'Envie um vídeo MP4 da unidade para continuar.'}
              </p>
            ) : null}
          </>
        ) : null}

        {store.step === ESellStep.PRICE ? (
          <>
            <h1>Preço e entrega</h1>
            <p className="lead">
              Informe o valor pedido e como o comprador recebe. Não sugerimos preço “certo”.
            </p>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="sell-price">Preço (R$)</label>
              <input
                id="sell-price"
                type="number"
                min={1}
                step={1}
                value={store.priceCents > 0 ? store.priceCents / 100 : ''}
                onChange={(e) => {
                  const reais = Number(e.target.value);
                  store.setPriceCents(Number.isFinite(reais) ? Math.round(reais * 100) : 0);
                }}
              />
            </div>
            {store.priceCents > 0 ? (
              <p className="m-0 text-[0.875rem] text-muted">Você informou {formatMoney(store.priceCents)}</p>
            ) : null}

            <ListingDeliveryFields
              modes={store.shippingModes}
              packageDims={packageDims}
              onToggleMode={store.toggleShippingMode}
              onPackageChange={(next) => store.setShippingPackage(next)}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => store.setStep(ESellStep.MEDIA)}>
                Voltar
              </Button>
              <Button disabled={!canContinuePrice} onClick={() => store.setStep(ESellStep.EVIDENCE)}>
                Continuar
              </Button>
            </div>
            {!canContinuePrice ? (
              <p className="m-0 text-[0.85rem] text-muted">
                {store.priceCents <= 0
                  ? 'Informe o preço para continuar.'
                  : deliveryIncomplete}
              </p>
            ) : null}
          </>
        ) : null}

        {store.step === ESellStep.EVIDENCE ? (
          <>
            <h1>Checklist de evidências</h1>
            <p className="lead">
              Marque o que você consegue mostrar nas fotos e no vídeo. Selos só após revisão
              aprovada. O código de posse será exibido logo após o envio.
            </p>
            <div className="flex flex-col gap-3">
              {store.evidenceOptions.map((item) => (
                <label key={item.id} className="flex min-h-11 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={store.evidenceIds.includes(item.id)}
                    onChange={() => store.toggleEvidence(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => store.setStep(ESellStep.PRICE)}>
                Voltar
              </Button>
              <Button
                disabled={!canContinueEvidence}
                onClick={() => store.setStep(ESellStep.REVIEW)}
              >
                Continuar
              </Button>
            </div>
          </>
        ) : null}

        {store.step === ESellStep.REVIEW ? (
          <>
            <h1>Revisar e enviar</h1>
            <p className="lead">Confira os dados. Ao enviar, o status será under_review — sem selos.</p>
            <ul className="m-0 pl-[1.1rem] [&_li]:mb-1">
              <li>
                Produto: {product ? `${product.brand} ${product.model}` : '—'}
              </li>
              <li>Condição: {store.condition}</li>
              <li>Defeitos: {store.defects || '—'}</li>
              <li>Acessórios: {store.accessories || '—'}</li>
              <li>Preço: {formatMoney(store.priceCents)}</li>
              <li>Entrega: {formatShippingSummary(store.shippingModes, packageDims)}</li>
              <li>Evidências: {store.evidenceIds.length} item(ns)</li>
              <li>Selos agora: nenhum</li>
            </ul>
            {deliveryIncomplete ? (
              <FeedbackBanner
                variant="warning"
                title="Entrega incompleta"
                message={deliveryIncomplete}
              />
            ) : null}
            {store.error ? (
              <FeedbackBanner variant="error" title="Não foi possível enviar" message={store.error} />
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => store.setStep(ESellStep.EVIDENCE)}>
                Voltar
              </Button>
              <Button
                disabled={store.loading || Boolean(deliveryIncomplete)}
                onClick={() => void store.submit()}
              >
                {store.loading ? 'Enviando…' : 'Enviar para revisão'}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
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
import { EListingCondition, EShippingMode, MIN_LISTING_PHOTOS } from '@entities/listing/model';

const STEP_LABELS = [
  'Identificar',
  'Descrever',
  'Mídia',
  'Preço',
  'Evidências',
  'Revisão',
] as const;

const SHIPPING_OPTIONS = [
  { value: EShippingMode.PICKUP, label: 'Retirada em mãos' },
  { value: EShippingMode.SHIPPING, label: 'Envio por transportadora' },
] as const;

const CONDITION_OPTIONS = [
  { value: EListingCondition.LIKE_NEW, label: 'Como novo' },
  { value: EListingCondition.GOOD, label: 'Bom' },
  { value: EListingCondition.FAIR, label: 'Regular' },
  { value: EListingCondition.POOR, label: 'Com marcas' },
] as const;

export function SellPage() {
  const store = useSellStore();

  useEffect(() => {
    void store.loadOptions();
  }, [store.loadOptions]);

  const product = store.products.find((p) => p.id === store.productId);
  const canContinueIdentify = Boolean(store.productId);
  const canContinueDescribe = Boolean(store.condition);
  const canContinuePrice = store.priceCents > 0;
  const canContinueEvidence = store.evidenceIds.length > 0;
  const canContinueMedia =
    store.photoAssetIds.length >= MIN_LISTING_PHOTOS &&
    Boolean(store.videoAssetId) &&
    store.shippingModes.length > 0;

  if (store.status === ESellStatus.UNDER_REVIEW && store.submittedListingId) {
    return (
      <AppShell>
        <div className="wizard-panel">
          <FeedbackBanner
            variant="success"
            title="Anúncio enviado para revisão"
            message="Suas fotos e vídeo já foram enviados. Anote o código abaixo e confira se ele aparece legível junto ao produto na mídia do anúncio."
          />
          <VerificationEvidencePanel listingId={store.submittedListingId} compact />
          <div className="wizard-actions">
            <Button
              onClick={() => {
                store.reset();
                void store.loadOptions();
              }}
            >
              Criar outro anúncio
            </Button>
            <Link className="gt-button gt-button--ghost" to="/meus-anuncios" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Meus anúncios
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="wizard-steps" aria-label="Passos do anúncio">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as typeof ESellStep.IDENTIFY;
          const isCurrent = store.step === stepNumber;
          const isDone = store.step > stepNumber;
          return (
            <span
              key={label}
              className={`wizard-step-indicator${isCurrent ? ' is-current' : ''}${isDone ? ' is-done' : ''}`}
            >
              {index + 1}. {label}
            </span>
          );
        })}
      </div>

      <div className="wizard-panel gt-fade-up">
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
            <div className="wizard-actions">
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
            <div className="wizard-actions">
              <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.IDENTIFY)}>
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

            <FeedbackBanner
              variant="info"
              title="Código de posse nas fotos e no vídeo"
              message="Anote o código (exibido após enviar) em um papel legível e deixe-o visível junto ao produto no mesmo quadro das fotos e do vídeo. Use letra clara — o código usa caracteres fáceis de ler (sem 0/O ou 1/I)."
            />

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

            <fieldset className="form-field">
              <legend>Formas de entrega</legend>
              <div className="checkbox-list">
                {SHIPPING_OPTIONS.map((option) => (
                  <label key={option.value} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={store.shippingModes.includes(option.value)}
                      onChange={() => store.toggleShippingMode(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {store.error ? (
              <FeedbackBanner variant="error" title="Não foi possível enviar" message={store.error} />
            ) : null}

            <div className="wizard-actions">
              <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.DESCRIBE)}>
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
              <p className="form-hint">
                {store.photoAssetIds.length < MIN_LISTING_PHOTOS
                  ? `Envie pelo menos ${MIN_LISTING_PHOTOS} fotos da unidade para continuar.`
                  : !store.videoAssetId
                    ? 'Envie um vídeo MP4 da unidade para continuar.'
                    : 'Escolha ao menos uma forma de entrega.'}
              </p>
            ) : null}
          </>
        ) : null}

        {store.step === ESellStep.PRICE ? (
          <>
            <h1>Definir preço</h1>
            <p className="lead">Informe o valor pedido em reais. Não sugerimos preço “certo”.</p>
            <div className="form-field">
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
              <p className="offer-card__meta">Você informou {formatMoney(store.priceCents)}</p>
            ) : null}
            <div className="wizard-actions">
              <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.MEDIA)}>
                Voltar
              </Button>
              <Button disabled={!canContinuePrice} onClick={() => store.setStep(ESellStep.EVIDENCE)}>
                Continuar
              </Button>
            </div>
          </>
        ) : null}

        {store.step === ESellStep.EVIDENCE ? (
          <>
            <h1>Checklist de evidências</h1>
            <p className="lead">
              Marque o que você consegue mostrar nas fotos e no vídeo. Selos só após revisão
              aprovada. O código de posse será exibido logo após o envio.
            </p>
            <div className="checkbox-list">
              {store.evidenceOptions.map((item) => (
                <label key={item.id} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={store.evidenceIds.includes(item.id)}
                    onChange={() => store.toggleEvidence(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="wizard-actions">
              <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.PRICE)}>
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
            <ul className="bullet-list">
              <li>
                Produto: {product ? `${product.brand} ${product.model}` : '—'}
              </li>
              <li>Condição: {store.condition}</li>
              <li>Defeitos: {store.defects || '—'}</li>
              <li>Acessórios: {store.accessories || '—'}</li>
              <li>Preço: {formatMoney(store.priceCents)}</li>
              <li>Evidências: {store.evidenceIds.length} item(ns)</li>
              <li>Selos agora: nenhum</li>
            </ul>
            {store.error ? (
              <FeedbackBanner variant="error" title="Não foi possível enviar" message={store.error} />
            ) : null}
            <div className="wizard-actions">
              <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.EVIDENCE)}>
                Voltar
              </Button>
              <Button disabled={store.loading} onClick={() => void store.submit()}>
                {store.loading ? 'Enviando…' : 'Enviar para revisão'}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

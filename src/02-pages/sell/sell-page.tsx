import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { formatMoney } from '@shared/lib/format';
import {
  ESellStatus,
  ESellStep,
  useSellStore,
} from '@features/sell-listing/model/use-sell-store';
import { EListingCondition, EShippingMode } from '@entities/listing/model';

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
  // Mirrors what the backend demands to create: >=1 photo, a video and a shipping mode.
  const canContinueMedia =
    store.photoAssetIds.length > 0 &&
    Boolean(store.videoAssetId) &&
    store.shippingModes.length > 0;

  if (store.status === ESellStatus.UNDER_REVIEW && store.submittedListingId) {
    return (
      <AppShell>
        <div className="wizard-panel">
          <FeedbackBanner
            variant="success"
            title="Anúncio enviado para revisão"
            message="Nenhum selo é exibido até a verificação ser concluída e aprovada. Acompanhe o status em Meus anúncios."
          />
          <div className="wizard-actions">
            <Button
              onClick={() => {
                store.reset();
                void store.loadOptions();
              }}
            >
              Criar outro anúncio
            </Button>
            <Link className="gt-button gt-button--ghost" to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Voltar ao início
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

      <div className="wizard-panel">
        {store.step === ESellStep.IDENTIFY ? (
          <>
            <h1>Identificar o produto</h1>
            <p className="lead">Escolha o modelo de catálogo (Produto ≠ Oferta).</p>
            <div className="form-field">
              <label htmlFor="sell-product">Produto</label>
              <select
                id="sell-product"
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
            </div>
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
            <div className="form-field">
              <label htmlFor="sell-condition">Condição</label>
              <select
                id="sell-condition"
                value={store.condition}
                onChange={(e) => store.setCondition(e.target.value)}
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="sell-defects">Defeitos / conservação</label>
              <textarea
                id="sell-defects"
                value={store.defects}
                onChange={(e) => store.setDefects(e.target.value)}
                placeholder="Ex.: risco cosmético na tampa"
              />
            </div>
            <div className="form-field">
              <label htmlFor="sell-accessories">Acessórios</label>
              <textarea
                id="sell-accessories"
                value={store.accessories}
                onChange={(e) => store.setAccessories(e.target.value)}
                placeholder="Ex.: caixa, cabo, carregador"
              />
            </div>
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
              A oferta só pode ser criada com pelo menos uma foto e um vídeo da sua unidade.
            </p>

            <div className="form-field">
              <label htmlFor="sell-photo">Fotos da unidade</label>
              <input
                id="sell-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={store.uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void store.addPhoto(file);
                  e.target.value = '';
                }}
              />
              {store.photoAssetIds.length > 0 ? (
                <ul className="bullet-list" aria-label="Fotos enviadas">
                  {store.photoAssetIds.map((assetId, index) => (
                    <li key={assetId}>
                      Foto {index + 1} pronta
                      <button
                        type="button"
                        className="gt-button gt-button--ghost"
                        onClick={() => store.removePhoto(assetId)}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="sell-video">Vídeo da unidade (MP4)</label>
              <input
                id="sell-video"
                type="file"
                accept="video/mp4"
                disabled={store.uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void store.setVideo(file);
                  e.target.value = '';
                }}
              />
              {store.videoAssetId ? <p className="offer-card__meta">Vídeo pronto</p> : null}
            </div>

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

            {store.uploadStatus ? <p className="offer-card__meta">{store.uploadStatus}</p> : null}
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
            <p className="lead">Marque o que você consegue enviar. Selos só após revisão aprovada.</p>
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

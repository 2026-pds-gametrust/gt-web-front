import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { formatMoney } from '@shared/lib/format';
import {
  ESellStatus,
  ESellStep,
  useSellStore,
} from '@features/sell-listing/model/use-sell-store';
import { formatRequiredChangeItem } from '@features/listings/lib/seller-verification-copy';
import { EShippingMode } from '@entities/listing/model';

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

  const canContinueMedia =
    store.photoAssetIds.length > 0 &&
    Boolean(store.videoAssetId) &&
    store.shippingModes.length > 0;
  const canResubmit = store.canResubmitRevision();

  if (store.status === ESellStatus.UNDER_REVIEW && store.revisionListingId) {
    return (
      <AppShell>
        <div className="wizard-panel">
          <FeedbackBanner
            variant="success"
            title="Anúncio reenviado para revisão"
            message="Um novo caso de verificação foi aberto. Acompanhe em Meus anúncios."
          />
          <div className="wizard-actions">
            <Link className="gt-button" to="/meus-anuncios">
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
        <Link className="gt-button gt-button--ghost" to="/meus-anuncios">
          Voltar
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="revise-heading">
        <h1 id="revise-heading">Corrigir anúncio</h1>
        <p className="lead">
          Ajuste somente o que foi solicitado pela moderação antes de reenviar.
        </p>
      </section>

      {store.requiredChanges.length > 0 ? (
        <section className="wizard-panel" aria-labelledby="changes-heading">
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

      <nav className="wizard-steps" aria-label="Passos">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as ESellStep;
          return (
            <button
              key={label}
              type="button"
              className={`wizard-step${store.step === stepNumber ? ' is-active' : ''}`}
              onClick={() => store.setStep(stepNumber)}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {store.step === ESellStep.DESCRIBE ? (
        <div className="wizard-panel">
          <label className="form-field">
            Descrição / detalhes
            <textarea
              rows={6}
              value={store.defects}
              onChange={(event) => store.setDefects(event.target.value)}
            />
          </label>
          <Button onClick={() => store.setStep(ESellStep.MEDIA)}>Continuar</Button>
        </div>
      ) : null}

      {store.step === ESellStep.MEDIA ? (
        <div className="wizard-panel">
          <p>Fotos enviadas: {store.photoAssetIds.length}</p>
          <label className="form-field">
            Adicionar foto
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void store.addPhoto(file);
                }
              }}
            />
          </label>
          {store.photoAssetIds.length > 0 ? (
            <ul>
              {store.photoAssetIds.map((assetId) => (
                <li key={assetId}>
                  {assetId.slice(0, 12)}…{' '}
                  <Button
                    className="gt-button--ghost"
                    onClick={() => store.removePhoto(assetId)}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          <label className="form-field">
            Substituir vídeo
            <input
              type="file"
              accept="video/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void store.setVideo(file);
                }
              }}
            />
          </label>
          {store.videoAssetId ? <p>Vídeo: {store.videoAssetId.slice(0, 12)}…</p> : null}
          <fieldset>
            <legend>Entrega</legend>
            {SHIPPING_OPTIONS.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  checked={store.shippingModes.includes(option.value)}
                  onChange={() => store.toggleShippingMode(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <Button disabled={!canContinueMedia} onClick={() => store.setStep(ESellStep.REVIEW)}>
            Continuar
          </Button>
        </div>
      ) : null}

      {store.step === ESellStep.PRICE ? (
        <div className="wizard-panel">
          <label className="form-field">
            Preço (centavos)
            <input
              type="number"
              min={1}
              value={store.priceCents}
              onChange={(event) => store.setPriceCents(Number(event.target.value))}
            />
          </label>
          <p>{formatMoney(store.priceCents)}</p>
          <Button onClick={() => store.setStep(ESellStep.REVIEW)}>Continuar</Button>
        </div>
      ) : null}

      {store.step === ESellStep.REVIEW ? (
        <div className="wizard-panel">
          <h2>Revisão antes do reenvio</h2>
          <p>
            {canResubmit
              ? 'Todas as correções solicitadas foram detectadas.'
              : 'Ainda faltam correções obrigatórias.'}
          </p>
          {store.error ? (
            <FeedbackBanner variant="error" title="Não foi possível reenviar" message={store.error} />
          ) : null}
          <div className="wizard-actions">
            <Button disabled={!canResubmit || store.loading} onClick={() => void store.resubmitRevision()}>
              Reenviar para análise
            </Button>
            <Link className="gt-button gt-button--ghost" to="/meus-anuncios">
              Cancelar
            </Link>
          </div>
        </div>
      ) : null}

      {store.step === ESellStep.IDENTIFY ? (
        <div className="wizard-panel">
          <p>Produto já definido. Avance para descrever ou mídia conforme os ajustes.</p>
          <div className="wizard-actions">
            <Button onClick={() => store.setStep(ESellStep.DESCRIBE)}>Descrição</Button>
            <Button className="gt-button--ghost" onClick={() => store.setStep(ESellStep.MEDIA)}>
              Mídia
            </Button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

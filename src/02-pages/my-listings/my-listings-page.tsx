import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { formatMoney } from '@shared/lib/format';
import { listingsApi } from '@features/listings/api/listings-api';
import {
  formatRequiredChangeItem,
  isTerminalRejection,
  needsRevision,
  sellerVerificationLabel,
} from '@features/listings/lib/seller-verification-copy';
import {
  EListingStatus,
  type ISellerListing,
  type EListingStatus as ListingStatus,
} from '@entities/listing/model';

const STATUS_LABEL: Record<string, string> = {
  [EListingStatus.DRAFT]: 'Rascunho',
  [EListingStatus.SUBMITTED]: 'Em revisão',
  [EListingStatus.PUBLISHED]: 'Publicado',
  [EListingStatus.PAUSED]: 'Pausado',
  [EListingStatus.EXPIRED]: 'Expirado',
  [EListingStatus.RESERVED]: 'Reservado',
  [EListingStatus.SOLD]: 'Vendido',
  [EListingStatus.REJECTED]: 'Rejeitado (definitivo)',
};

const STATUS_FILTERS: Array<{ value: '' | ListingStatus; label: string }> = [
  { value: '', label: 'Todos' },
  { value: EListingStatus.DRAFT, label: 'Rascunho' },
  { value: EListingStatus.SUBMITTED, label: 'Em revisão' },
  { value: EListingStatus.PUBLISHED, label: 'Publicado' },
  { value: EListingStatus.PAUSED, label: 'Pausado' },
  { value: EListingStatus.REJECTED, label: 'Rejeitado' },
];

function canEditPrice(listing: ISellerListing): boolean {
  if (isTerminalRejection(listing.status, listing.verificationCase)) {
    return false;
  }
  return (
    listing.status === EListingStatus.DRAFT ||
    listing.status === EListingStatus.SUBMITTED
  );
}

export function MyListingsPage() {
  const [listings, setListings] = useState<ISellerListing[]>([]);
  const [statusFilter, setStatusFilter] = useState<'' | ListingStatus>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await listingsApi.listMyListings({
        status: statusFilter || undefined,
      });
      setListings(page.items);
    } catch {
      setError('Não foi possível carregar seus anúncios.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(id: string, action: () => Promise<unknown>) {
    setBusyId(id);
    setError(null);
    try {
      await action();
      await load();
    } catch (actionError) {
      setError(
        actionError instanceof Error && actionError.message
          ? actionError.message
          : 'A ação falhou. Tente de novo.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="my-listings-heading">
        <h1 id="my-listings-heading">Meus anúncios</h1>
        <p className="lead">Acompanhe o status e ajuste suas ofertas.</p>
      </section>

      <div
        className="wizard-actions"
        role="tablist"
        aria-label="Filtrar por status"
      >
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.value || 'all'}
            type="button"
            role="tab"
            aria-selected={statusFilter === filter.value}
            className={
              statusFilter === filter.value
                ? 'gt-button'
                : 'gt-button gt-button--ghost'
            }
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {error ? (
        <FeedbackBanner
          variant="error"
          title="Não foi possível concluir"
          message={error}
          action={
            <Button type="button" variant="ghost" onClick={() => void load()}>
              Tentar de novo
            </Button>
          }
        />
      ) : null}
      {loading ? <p className="home-status">Carregando anúncios…</p> : null}

      {!loading && listings.length === 0 ? (
        <div className="empty-state">
          <h2>
            {statusFilter
              ? 'Nenhum anúncio neste status'
              : 'Você ainda não tem anúncios'}
          </h2>
          <p>
            {statusFilter
              ? 'Tente outro filtro ou crie uma nova oferta.'
              : 'Crie sua primeira oferta para começar a vender.'}
          </p>
          <Link className="gt-button" to="/vender">
            Anunciar
          </Link>
        </div>
      ) : null}

      {!loading && listings.length > 0 ? (
        <ul className="offer-grid" aria-label="Seus anúncios">
          {listings.map((listing) => {
            const verificationLabel = sellerVerificationLabel(
              listing.verificationCase,
            );
            const revisionNeeded = needsRevision(
              listing.status,
              listing.verificationCase,
            );
            const terminalRejected = isTerminalRejection(
              listing.status,
              listing.verificationCase,
            );
            return (
              <li key={listing.id} className="offer-card">
                <h3 className="offer-card__title">
                  <Link to={`/anuncio/${listing.id}`}>{listing.title}</Link>
                </h3>
                <p className="offer-card__meta">
                  {STATUS_LABEL[listing.status] ?? listing.status} ·{' '}
                  {formatMoney(listing.priceCents)}
                </p>
                {verificationLabel ? (
                  <p className="offer-card__meta">{verificationLabel}</p>
                ) : null}
                {revisionNeeded && listing.verificationCase?.requiredChanges ? (
                  <ul className="offer-card__meta">
                    {listing.verificationCase.requiredChanges.map((change, index) => (
                      <li key={`${change.target}-${change.assetId ?? index}`}>
                        {formatRequiredChangeItem(change)}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {editingId === listing.id ? (
                  <div className="form-field">
                    <label htmlFor={`price-${listing.id}`}>Novo preço (R$)</label>
                    <input
                      id={`price-${listing.id}`}
                      type="number"
                      min={1}
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                    />
                    <Button
                      disabled={busyId === listing.id}
                      onClick={() =>
                        void runAction(listing.id, async () => {
                          const reais = Number(priceInput);
                          if (!Number.isFinite(reais) || reais <= 0) {
                            throw new Error('Informe um preço válido.');
                          }
                          await listingsApi.updateListing(listing.id, {
                            priceCents: Math.round(reais * 100),
                          });
                          setEditingId(null);
                        })
                      }
                    >
                      Salvar
                    </Button>
                    <Button
                      className="gt-button--ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="wizard-actions">
                    {canEditPrice(listing) ? (
                      <Button
                        className="gt-button--ghost"
                        onClick={() => {
                          setEditingId(listing.id);
                          setPriceInput(String(listing.priceCents / 100));
                        }}
                      >
                        Alterar preço
                      </Button>
                    ) : null}

                    {revisionNeeded ? (
                      <Link
                        className="gt-button"
                        to={`/meus-anuncios/${listing.id}/corrigir`}
                      >
                        Corrigir anúncio
                      </Link>
                    ) : null}

                    {listing.status === EListingStatus.DRAFT && !revisionNeeded ? (
                      <Button
                        disabled={busyId === listing.id}
                        onClick={() =>
                          void runAction(listing.id, () =>
                            listingsApi.submitListing(listing.id),
                          )
                        }
                      >
                        Enviar para revisão
                      </Button>
                    ) : null}

                    {listing.status === EListingStatus.PUBLISHED ? (
                      <Button
                        disabled={busyId === listing.id}
                        onClick={() =>
                          void runAction(listing.id, () =>
                            listingsApi.pauseListing(listing.id),
                          )
                        }
                      >
                        Pausar
                      </Button>
                    ) : null}

                    {terminalRejected ? (
                      <p className="offer-card__meta" role="status">
                        Este anúncio foi encerrado e não pode ser reenviado.
                      </p>
                    ) : null}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </AppShell>
  );
}

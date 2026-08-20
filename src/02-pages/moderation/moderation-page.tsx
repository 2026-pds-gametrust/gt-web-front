import { AppShell } from '@widgets/app-shell/app-shell';
import { searchApi } from '@features/search/api/search-api';
import { trustApi } from '@features/trust-display/api/trust-api';
import { ModerationMediaGallery } from '@widgets/moderation-media/moderation-media-gallery';
import { ModerationStatsBar } from '@widgets/moderation/moderation-stats-bar';
import { ModerationQueuePanel } from '@widgets/moderation/moderation-queue-panel';
import { ModerationSellerCard } from '@widgets/moderation/moderation-seller-card';
import { ModerationListingCard } from '@widgets/moderation/moderation-listing-card';
import { ModerationCaseActions } from '@widgets/moderation/moderation-case-actions';
import { ModerationAnalysisCard } from '@widgets/moderation/moderation-analysis-card';
import { ModerationScoreFilterBar } from '@widgets/moderation/moderation-score-filter-bar';
import { ModerationScoreBadge } from '@widgets/moderation/moderation-score-badge';
import { ModerationStatusBadge } from '@widgets/moderation/moderation-status-badge';
import { useModerationPage } from '@widgets/moderation/use-moderation-page';
import { formatModerationDate, shortId } from '@widgets/moderation/moderation-constants';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { buttonClassName } from '@shared/ui/button/button';

export function ModerationPage() {
  const sessionUser = useAuthStore((s) => s.user);
  const canOperate = useAuthStore((s) => s.canOperate());
  const moderatorId = sessionUser?.id ?? 'moderator-1';

  const {
    selected,
    selectedId,
    setSelectedId,
    queueItems,
    stats,
    total,
    limit,
    offset,
    setOffset,
    evidence,
    proofCode,
    listing,
    seller,
    profile,
    trust,
    product,
    seals,
    reason,
    setReason,
    loading,
    detailLoading,
    busy,
    opsFeedback,
    setOpsFeedback,
    statusFilter,
    setStatusFilter,
    scoreFilter,
    setScoreFilter,
    searchQuery,
    setSearchQuery,
    runAction,
    ensureInReview,
  } = useModerationPage({ moderatorId });

  return (
    <AppShell>
      <PageHero titleId="moderation-heading" title="Moderação">
        <p className="lead mb-6 mt-0 max-w-[52rem] text-muted">
          Fila de verificação — analise mídia, vendedor e anúncio antes de conceder selo.
          Aprovar exige evidência; rejeitar exige motivo.
        </p>
      </PageHero>

      {!loading ? (
        <ModerationStatsBar
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      ) : null}

      {!loading ? (
        <ModerationScoreFilterBar
          activeFilter={scoreFilter}
          onFilterChange={setScoreFilter}
        />
      ) : null}

      {loading ? <Skeleton label="Carregando casos…" /> : null}

      <div className="grid gap-8 wide:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.35fr)] wide:items-start">
        {!loading ? (
          <ModerationQueuePanel
            items={queueItems}
            total={total}
            limit={limit}
            offset={offset}
            selectedId={selectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={setSelectedId}
            onOffsetChange={setOffset}
          />
        ) : null}

        <section className="rounded-lg border border-border bg-surface p-6" aria-live="polite">
          {!selected ? <p className="text-muted">Selecione um caso na fila.</p> : null}

          {selected ? (
            <>
              <header className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 mt-0 text-[0.85rem] font-semibold uppercase tracking-[0.04em] text-muted">Caso {shortId(selected.id)}</p>
                  <h2 className="m-0 font-display text-[1.35rem]">{listing?.title ?? selected.listingTitle}</h2>
                </div>
                <ModerationStatusBadge status={selected.status} />
              </header>

              <div className="mb-4">
                <ModerationScoreBadge score={selected.aiAnalysisScore} />
              </div>

              <dl className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 rounded border border-border bg-surface-muted p-4 m-0 [&_dd]:mb-0 [&_dd]:mt-1 [&_dd]:font-semibold [&_dt]:text-[0.75rem] [&_dt]:uppercase [&_dt]:tracking-[0.04em] [&_dt]:text-muted">
                <div>
                  <dt>Aberto em</dt>
                  <dd>{formatModerationDate(selected.createdAt)}</dd>
                </div>
                {selected.updatedAt ? (
                  <div>
                    <dt>Atualizado</dt>
                    <dd>{formatModerationDate(selected.updatedAt)}</dd>
                  </div>
                ) : null}
                {selected.moderatorId ? (
                  <div>
                    <dt>Moderador</dt>
                    <dd>
                      <code>{shortId(selected.moderatorId)}</code>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mb-6 grid gap-4">
                <ModerationListingCard
                  listing={listing}
                  product={product}
                  seals={seals}
                  loading={detailLoading}
                  listingId={selected.listingId}
                />
                <ModerationSellerCard
                  seller={seller}
                  profile={profile}
                  trust={trust}
                  loading={detailLoading}
                />
              </div>

              <ModerationAnalysisCard selected={selected} />

              {proofCode ? (
                <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mod-proof-code">
                  <h3 id="mod-proof-code" className="m-0 font-display">Código de posse esperado</h3>
                  <p className="my-3 font-display text-2xl font-extrabold tracking-[0.12em] text-accent" aria-label="Código esperado">
                    {proofCode.code}
                  </p>
                  <p className="mt-3 mb-0 text-[0.9rem] text-muted">
                    Confirme que este código aparece legível nas evidências, junto ao produto.
                  </p>
                </section>
              ) : null}

              <ModerationMediaGallery listing={listing} evidence={evidence} />

              <ModerationCaseActions
                selected={selected}
                listing={listing}
                reason={reason}
                onReasonChange={setReason}
                busy={busy}
                canOperate={canOperate}
                moderatorId={moderatorId}
                opsFeedback={opsFeedback}
                hasPhotoEvidence={evidence.some((item) => item.type === 'PHOTO')}
                onRunAction={runAction}
                ensureInReview={ensureInReview}
              />

              <section className="mt-6 rounded-lg border border-border bg-surface p-4" aria-labelledby="ops-heading">
                <h3 id="ops-heading" className="m-0 font-display">Ferramentas de backoffice</h3>
                <p className="mt-3 mb-0 text-[0.9rem] text-muted">
                  Reindexação de busca e recomputação de TrustScore. Ator:{' '}
                  <code>{shortId(moderatorId)}</code>.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={buttonClassName({ variant: 'ghost' })}
                    disabled={busy || !canOperate}
                    onClick={() =>
                      void runAction(async () => {
                        const result = await searchApi.reconcile();
                        setOpsFeedback({
                          variant: 'success',
                          message: `Reindex: ${result.listingsReindexed} anúncios, ${result.synonymsUpserted} sinônimos`,
                        });
                        return result;
                      })
                    }
                  >
                    Rebuild busca
                  </button>
                  {listing ? (
                    <button
                      type="button"
                      className={buttonClassName({ variant: 'ghost' })}
                      disabled={busy || !canOperate}
                      onClick={() =>
                        void runAction(async () => {
                          const score = await trustApi.recomputeTrustScore(listing.sellerId);
                          setOpsFeedback({
                            variant: 'success',
                            message: `TrustScore recomputado: ${score.score}`,
                          });
                          return score;
                        })
                      }
                    >
                      Recomputar TrustScore do vendedor
                    </button>
                  ) : null}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

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
    opsMessage,
    setOpsMessage,
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
      <PageHero titleId="moderation-heading" title="Moderação" className="moderation-hero">
        <p className="lead">
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

      <div className="moderation-layout">
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

        <section className="moderation-detail" aria-live="polite">
          {!selected ? <p className="moderation-detail__empty">Selecione um caso na fila.</p> : null}

          {selected ? (
            <>
              <header className="moderation-detail__header">
                <div>
                  <p className="moderation-detail__eyebrow">Caso {shortId(selected.id)}</p>
                  <h2>{listing?.title ?? selected.listingTitle}</h2>
                </div>
                <ModerationStatusBadge status={selected.status} />
              </header>

              <div className="moderation-detail__score">
                <ModerationScoreBadge score={selected.aiAnalysisScore} />
              </div>

              <dl className="moderation-detail__facts">
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

              <div className="moderation-detail__grid">
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
                <section className="moderation-card proof-code-card moderation-proof-code" aria-labelledby="mod-proof-code">
                  <h3 id="mod-proof-code">Código de posse esperado</h3>
                  <p className="proof-code-card__value" aria-label="Código esperado">
                    {proofCode.code}
                  </p>
                  <p className="moderation-card__note">
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
                opsMessage={opsMessage}
                onRunAction={runAction}
                ensureInReview={ensureInReview}
              />

              <section className="moderation-card moderation-card--ops" aria-labelledby="ops-heading">
                <h3 id="ops-heading">Ferramentas de backoffice</h3>
                <p className="moderation-card__note">
                  Reindexação de busca e recomputação de TrustScore. Ator:{' '}
                  <code>{shortId(moderatorId)}</code>.
                </p>
                <div className="moderation-actions">
                  <button
                    type="button"
                    className="gt-button gt-button--ghost"
                    disabled={busy || !canOperate}
                    onClick={() =>
                      void runAction(async () => {
                        const result = await searchApi.reconcile();
                        setOpsMessage(
                          `Reindex: ${result.listingsReindexed} anúncios, ${result.synonymsUpserted} sinônimos`,
                        );
                        return result;
                      })
                    }
                  >
                    Rebuild busca
                  </button>
                  {listing ? (
                    <button
                      type="button"
                      className="gt-button gt-button--ghost"
                      disabled={busy || !canOperate}
                      onClick={() =>
                        void runAction(async () => {
                          const score = await trustApi.recomputeTrustScore(listing.sellerId);
                          setOpsMessage(`TrustScore recomputado: ${score.score}`);
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

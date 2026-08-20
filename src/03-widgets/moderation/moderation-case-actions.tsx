import { useState } from 'react';
import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import type { IListing } from '@entities/listing/model';
import { EListingStatus } from '@entities/listing/model';
import { EVerificationCaseStatus } from '@entities/verification-case/model';
import { ESealType } from '@entities/seal/model';
import { verificationApi } from '@features/verification/api/verification-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Button } from '@shared/ui/button/button';
import { cn } from '@shared/lib/cn';
import { listingIsBlockedFromPublish } from '@features/listings/lib/listing-shipping';
import type { IOpsFeedback } from './use-moderation-page';
import {
  draftsToRequiredChanges,
  useModerationChangeDrafts,
} from './moderation-request-changes-form';

type ModerationCaseActionsProps = {
  selected: IModerationQueueItem;
  listing: IListing | null;
  reason: string;
  onReasonChange: (value: string) => void;
  busy: boolean;
  canOperate: boolean;
  moderatorId: string;
  hasPhotoEvidence: boolean;
  opsFeedback: IOpsFeedback | null;
  onRunAction: (action: () => Promise<unknown>) => Promise<void>;
  ensureInReview: (caseId: string, status: string) => Promise<void>;
};

export function ModerationCaseActions({
  selected,
  listing,
  reason,
  onReasonChange,
  busy,
  canOperate,
  moderatorId,
  hasPhotoEvidence,
  opsFeedback,
  onRunAction,
  ensureInReview,
}: ModerationCaseActionsProps) {
  const [confirmReject, setConfirmReject] = useState(false);
  const { drafts, toggleDraft, setDraftReason } = useModerationChangeDrafts({
    listing,
    checklist: selected.checklist,
  });
  const requiredChanges = draftsToRequiredChanges(drafts);
  const canRequestChanges =
    Boolean(reason.trim()) && requiredChanges !== null && canOperate;
  const isTerminalListing = listing?.status === EListingStatus.REJECTED;
  const isClosedCase =
    selected.status === EVerificationCaseStatus.APPROVED ||
    selected.status === EVerificationCaseStatus.REJECTED ||
    selected.status === EVerificationCaseStatus.CHANGES_REQUESTED;
  const publishBlockedByPackage = listingIsBlockedFromPublish(listing);
  const canAssign = canOperate && selected.status !== EVerificationCaseStatus.IN_REVIEW && hasPhotoEvidence;
  const canApprove =
    canOperate && selected.status !== EVerificationCaseStatus.APPROVED && hasPhotoEvidence;
  const canPublish =
    canOperate &&
    !isTerminalListing &&
    !publishBlockedByPackage &&
    (listing?.status === EListingStatus.SUBMITTED ||
      selected.status === EVerificationCaseStatus.APPROVED);

  return (
    <section className="mt-6 rounded-lg border border-border bg-surface p-4 [&_h3]:m-0 [&_h3]:font-display" aria-labelledby="actions-heading">
      <h3 id="actions-heading">Decisão</h3>

      {!canOperate ? (
        <p className="mb-4 rounded bg-[#fff4e5] p-3 font-semibold text-warning" role="status">
          Sua conta não está no grupo backoffice — estas ações voltam 403 no servidor.
        </p>
      ) : null}

      <label className="mb-4 flex flex-col gap-2">
        Resumo da decisão
        <textarea
          className="min-h-24 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          rows={3}
          placeholder="Resumo para o vendedor. Obrigatório para solicitar ajustes ou rejeitar."
        />
      </label>

      {!isClosedCase ? (
        <fieldset className="mb-4 border-0 p-0 m-0">
          <legend className="mb-2 font-semibold">Solicitar ajustes por item</legend>
          <p className="mb-3 text-[0.9rem] text-muted">
            Marque fotos, vídeo ou descrição e escreva o motivo de cada um. Sugestões da IA podem
            vir pré-marcadas — confirme antes de enviar.
          </p>
          {drafts.length === 0 ? (
            <p className="text-muted">Sem itens do anúncio para solicitar ajuste.</p>
          ) : (
            <div className="grid gap-3" role="group" aria-label="Itens do anúncio">
              {drafts.map((draft) => {
                const reasonId = `change-reason-${draft.key.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
                return (
                  <div
                    key={draft.key}
                    className={cn(
                      'rounded border border-border p-3',
                      draft.selected && 'border-accent bg-accent-soft',
                    )}
                  >
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={draft.selected}
                        onChange={() => toggleDraft(draft.key)}
                        disabled={busy || !canOperate}
                      />
                      <span className="font-semibold">{draft.label}</span>
                      {draft.suggestedByAi ? (
                        <span className="rounded bg-surface-muted px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-muted">
                          Sugestão da IA
                        </span>
                      ) : null}
                    </label>
                    {draft.selected ? (
                      <div className="mt-3 grid gap-2">
                        <label className="text-[0.85rem] font-semibold" htmlFor={reasonId}>
                          Motivo para {draft.label}
                        </label>
                        <textarea
                          id={reasonId}
                          className="min-h-16 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
                          rows={2}
                          value={draft.reason}
                          placeholder="Explique o que o vendedor precisa corrigir neste item"
                          onChange={(event) => setDraftReason(draft.key, event.target.value)}
                          disabled={busy || !canOperate}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          {requiredChanges ? (
            <p className="text-sm font-semibold" role="status">
              {requiredChanges.length}{' '}
              {requiredChanges.length === 1 ? 'item pronto' : 'itens prontos'} para solicitar
              alteração
            </p>
          ) : drafts.some((draft) => draft.selected) ? (
            <p className="text-sm font-semibold text-warning" role="status">
              Informe o motivo de cada item marcado
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={busy || !canAssign}
          onClick={() =>
            void onRunAction(() =>
              verificationApi.assignVerificationCase(selected.id, moderatorId),
            )
          }
        >
          Atribuir a mim
        </Button>
        <Button
          type="button"
          disabled={busy || !canApprove}
          onClick={() =>
            void onRunAction(async () => {
              await ensureInReview(selected.id, selected.status);
              return verificationApi.approveVerificationCase(selected.id, {
                decisionReason: reason || 'Evidências suficientes',
                sealType: ESealType.POSSESSION,
              });
            })
          }
        >
          Aprovar e conceder selo
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={busy || !canOperate || !canRequestChanges || isClosedCase}
          onClick={() =>
            void onRunAction(async () => {
              await ensureInReview(selected.id, selected.status);
              if (!requiredChanges) {
                throw new Error('Selecione itens e informe o motivo de cada um.');
              }
              return verificationApi.requestVerificationChanges(selected.id, {
                summary: reason.trim(),
                requiredChanges,
              });
            })
          }
        >
          Solicitar alterações
        </Button>
        {!confirmReject ? (
          <Button
            type="button"
            variant="ghost"
            disabled={busy || !canOperate || !reason.trim() || isClosedCase}
            onClick={() => setConfirmReject(true)}
          >
            Rejeitar definitivamente
          </Button>
        ) : (
          <Button
            type="button"
            disabled={busy || !canOperate || !reason.trim()}
            onClick={() =>
              void onRunAction(async () => {
                await ensureInReview(selected.id, selected.status);
                setConfirmReject(false);
                return verificationApi.rejectVerificationCase(selected.id, reason.trim());
              })
            }
          >
            Confirmar rejeição definitiva
          </Button>
        )}
        {(listing?.status === EListingStatus.SUBMITTED ||
          selected.status === EVerificationCaseStatus.APPROVED) &&
        !isTerminalListing ? (
          <Button
            type="button"
            variant="ghost"
            disabled={busy || !canPublish}
            onClick={() =>
              void onRunAction(() => listingsApi.publishListing(selected.listingId))
            }
          >
            Publicar anúncio
          </Button>
        ) : null}
        {listing?.status === EListingStatus.PUBLISHED ? (
          <Button
            type="button"
            variant="ghost"
            disabled={busy || !canOperate}
            onClick={() =>
              void onRunAction(() => listingsApi.pauseListing(selected.listingId))
            }
          >
            Pausar anúncio
          </Button>
        ) : null}
      </div>

      {confirmReject ? (
        <p className="mb-4 rounded bg-[#fff4e5] p-3 font-semibold text-warning" role="status">
          Rejeição definitiva encerra o anúncio — o vendedor não poderá reenviar.
        </p>
      ) : null}

      {!hasPhotoEvidence ? (
        <p className="mb-4 rounded bg-[#fff4e5] p-3 font-semibold text-warning" role="status">
          Atribuir e aprovar exigem evidência PHOTO no caso. As fotos públicas do anúncio
          não substituem o registro de evidência com o código de posse visível.
        </p>
      ) : null}

      {publishBlockedByPackage ? (
        <p className="mb-4 rounded bg-[#fff4e5] p-3 font-semibold text-warning" role="status">
          Não dá para publicar: o vendedor marcou envio por transportadora sem peso e
          medidas da embalagem. Peça esse ajuste — publicar agora é recusado pelo servidor.
        </p>
      ) : null}

      {opsFeedback ? (
        <FeedbackBanner
          variant={opsFeedback.variant}
          title={
            opsFeedback.variant === 'error' ? 'Não foi possível concluir' : 'Ação concluída'
          }
          message={opsFeedback.message}
        />
      ) : null}

      {selected.decisionReason ? (
        <p className="mt-3 mb-0 text-[0.9rem] text-muted">
          Último motivo registrado: {selected.decisionReason}
        </p>
      ) : null}
    </section>
  );
}

import { useState } from 'react';
import type { IModerationQueueItem } from '@entities/moderation-queue/model';
import type { IListing } from '@entities/listing/model';
import { EListingStatus } from '@entities/listing/model';
import { EVerificationCaseStatus } from '@entities/verification-case/model';
import { ESealType } from '@entities/seal/model';
import { verificationApi } from '@features/verification/api/verification-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
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
  opsMessage: string | null;
  onRunAction: (action: () => Promise<unknown>) => Promise<void>;
  ensureInReview: (caseId: string, status: EVerificationCaseStatus) => Promise<void>;
};

export function ModerationCaseActions({
  selected,
  listing,
  reason,
  onReasonChange,
  busy,
  canOperate,
  moderatorId,
  opsMessage,
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

  return (
    <section className="moderation-card moderation-card--actions" aria-labelledby="actions-heading">
      <h3 id="actions-heading">Decisão</h3>

      {!canOperate ? (
        <p className="moderation-card__warn" role="status">
          Sua conta não está no grupo backoffice — estas ações voltam 403 no servidor.
        </p>
      ) : null}

      <label className="form-field">
        Resumo da decisão
        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          rows={3}
          placeholder="Resumo para o vendedor. Obrigatório para solicitar ajustes ou rejeitar."
        />
      </label>

      {!isClosedCase ? (
        <fieldset className="moderation-changes">
          <legend className="moderation-changes__legend">Solicitar ajustes por item</legend>
          <p className="moderation-changes__lead">
            Marque fotos, vídeo ou descrição e escreva o motivo de cada um. Sugestões da IA podem
            vir pré-marcadas — confirme antes de enviar.
          </p>
          {drafts.length === 0 ? (
            <p className="moderation-changes__empty">Sem itens do anúncio para solicitar ajuste.</p>
          ) : (
            <div className="moderation-changes__list" role="group" aria-label="Itens do anúncio">
              {drafts.map((draft) => {
                const reasonId = `change-reason-${draft.key.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
                return (
                  <div
                    key={draft.key}
                    className={`moderation-changes__row${draft.selected ? ' is-selected' : ''}`}
                  >
                    <label className="moderation-changes__check">
                      <input
                        type="checkbox"
                        checked={draft.selected}
                        onChange={() => toggleDraft(draft.key)}
                        disabled={busy || !canOperate}
                      />
                      <span className="moderation-changes__label">{draft.label}</span>
                      {draft.suggestedByAi ? (
                        <span className="moderation-changes__ai">Sugestão da IA</span>
                      ) : null}
                    </label>
                    {draft.selected ? (
                      <div className="moderation-changes__reason-wrap">
                        <label className="moderation-changes__reason-label" htmlFor={reasonId}>
                          Motivo para {draft.label}
                        </label>
                        <textarea
                          id={reasonId}
                          className="moderation-changes__reason"
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
            <p className="moderation-changes__count" role="status">
              {requiredChanges.length}{' '}
              {requiredChanges.length === 1 ? 'item pronto' : 'itens prontos'} para solicitar
              alteração
            </p>
          ) : drafts.some((draft) => draft.selected) ? (
            <p className="moderation-changes__count moderation-changes__count--warn" role="status">
              Informe o motivo de cada item marcado
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="moderation-actions">
        <button
          type="button"
          className="gt-button gt-button--ghost"
          disabled={
            busy || !canOperate || selected.status === EVerificationCaseStatus.IN_REVIEW
          }
          onClick={() =>
            void onRunAction(() =>
              verificationApi.assignVerificationCase(selected.id, moderatorId),
            )
          }
        >
          Atribuir a mim
        </button>
        <button
          type="button"
          className="gt-button"
          disabled={
            busy || !canOperate || selected.status === EVerificationCaseStatus.APPROVED
          }
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
        </button>
        <button
          type="button"
          className="gt-button gt-button--ghost"
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
        </button>
        {!confirmReject ? (
          <button
            type="button"
            className="gt-button gt-button--ghost"
            disabled={busy || !canOperate || !reason.trim() || isClosedCase}
            onClick={() => setConfirmReject(true)}
          >
            Rejeitar definitivamente
          </button>
        ) : (
          <button
            type="button"
            className="gt-button"
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
          </button>
        )}
        {(listing?.status === EListingStatus.SUBMITTED ||
          selected.status === EVerificationCaseStatus.APPROVED) &&
        !isTerminalListing ? (
          <button
            type="button"
            className="gt-button gt-button--ghost"
            disabled={busy || !canOperate}
            onClick={() =>
              void onRunAction(() => listingsApi.publishListing(selected.listingId))
            }
          >
            Publicar anúncio
          </button>
        ) : null}
        {listing?.status === EListingStatus.PUBLISHED ? (
          <button
            type="button"
            className="gt-button gt-button--ghost"
            disabled={busy || !canOperate}
            onClick={() =>
              void onRunAction(() => listingsApi.pauseListing(selected.listingId))
            }
          >
            Pausar anúncio
          </button>
        ) : null}
      </div>

      {confirmReject ? (
        <p className="moderation-card__warn" role="status">
          Rejeição definitiva encerra o anúncio — o vendedor não poderá reenviar.
        </p>
      ) : null}

      {opsMessage ? (
        <FeedbackBanner
          variant={opsMessage.toLowerCase().includes('falh') ? 'error' : 'success'}
          title={opsMessage.toLowerCase().includes('falh') ? 'Não foi possível concluir' : 'Ação concluída'}
          message={opsMessage}
        />
      ) : null}

      {selected.decisionReason ? (
        <p className="moderation-card__note">
          Último motivo registrado: {selected.decisionReason}
        </p>
      ) : null}
    </section>
  );
}

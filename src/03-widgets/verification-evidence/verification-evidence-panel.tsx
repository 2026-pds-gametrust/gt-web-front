import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { useProofCode } from '@features/verification/model/use-proof-code';

type VerificationEvidencePanelProps = {
  listingId: string;
  /** When true, hides the outer title (e.g. inside a success banner). */
  compact?: boolean;
};

export function VerificationEvidencePanel({
  listingId,
  compact = false,
}: VerificationEvidencePanelProps) {
  const { proofCode, loading, error, bootstrap } = useProofCode(listingId);

  if (loading) {
    return <p className="form-hint">Gerando código de posse…</p>;
  }

  if (error && !proofCode) {
    return (
      <FeedbackBanner
        variant="error"
        title="Código de posse indisponível"
        message={error}
        action={
          <Button type="button" variant="ghost" onClick={() => void bootstrap()}>
            Tentar de novo
          </Button>
        }
      />
    );
  }

  return (
    <section
      className="verification-evidence-panel"
      aria-labelledby={compact ? undefined : 'proof-code-heading'}
    >
      {!compact ? (
        <>
          <h2 id="proof-code-heading">Código de posse</h2>
          <p className="lead">
            Anote este código em um papel legível. Se ainda não estiver visível junto ao produto nas
            fotos e no vídeo, atualize a mídia em Meus anúncios → Corrigir anúncio.
          </p>
        </>
      ) : null}

      {proofCode ? (
        <div className="proof-code-card" aria-live="polite">
          <p className="proof-code-card__label">Seu código</p>
          <p className="proof-code-card__value" aria-label="Código de posse">
            {proofCode.code}
          </p>
          <p className="proof-code-card__hint">
            Escreva com letra clara, sem ambiguidade (evite confundir 0/O ou 1/I). Não publique
            este código fora do processo de verificação.
          </p>
        </div>
      ) : null}

      <FeedbackBanner
        variant="info"
        title="Fotos e vídeo já enviados"
        message="Não é necessário enviar mídia de novo aqui. Se o código ainda não aparece nas imagens, a moderação pode pedir para você atualizar a mídia em Meus anúncios → Corrigir anúncio."
      />
    </section>
  );
}

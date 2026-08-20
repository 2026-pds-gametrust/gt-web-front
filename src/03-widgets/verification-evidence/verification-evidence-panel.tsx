import { Button } from '@shared/ui/button/button';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { useProofCode } from '@features/verification/model/use-proof-code';

type VerificationEvidencePanelProps = {
  listingId: string;
  /** When true, hides the outer title (e.g. inside a success banner). */
  compact?: boolean;
  /**
   * `capture` — seller is still taking photos (Media step).
   * `post-submit` — listing already sent; no re-upload here.
   */
  mode?: 'capture' | 'post-submit';
};

export function VerificationEvidencePanel({
  listingId,
  compact = false,
  mode = 'post-submit',
}: VerificationEvidencePanelProps) {
  const { proofCode, loading, error, bootstrap } = useProofCode(listingId);

  if (loading) {
    return <p className="m-0 text-[0.85rem] text-muted">Gerando código de posse…</p>;
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
      className="grid gap-4"
      aria-labelledby={compact ? undefined : 'proof-code-heading'}
    >
      {!compact ? (
        <>
          <h2 id="proof-code-heading" className="mb-2 mt-0 font-display text-2xl font-extrabold tracking-[-0.03em]">
            Código de posse
          </h2>
          <p className="lead mb-6 mt-0 text-muted">
            {mode === 'capture'
              ? 'Anote este código em um papel legível e deixe-o visível junto ao produto nas fotos e no vídeo.'
              : 'Anote este código em um papel legível. Se ainda não estiver visível junto ao produto nas fotos e no vídeo, atualize a mídia em Meus anúncios → Corrigir anúncio.'}
          </p>
        </>
      ) : null}

      {proofCode ? (
        <div
          className="rounded-lg border border-border bg-surface p-4"
          aria-live="polite"
        >
          <p className="mb-2 mt-0 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-muted">
            Seu código
          </p>
          <p
            className="my-3 font-display text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold tracking-[0.12em] text-accent"
            aria-label="Código de posse"
          >
            {proofCode.code}
          </p>
          <p className="mb-0 mt-3 text-[0.85rem] text-muted">
            Escreva com letra clara, sem ambiguidade (evite confundir 0/O ou 1/I). Não publique
            este código fora do processo de verificação.
          </p>
        </div>
      ) : null}

      {mode === 'capture' ? (
        <FeedbackBanner
          variant="info"
          title="Código nas fotos e no vídeo"
          message="O código e o produto devem aparecer no mesmo quadro. Use letra clara — o código evita caracteres confusos (sem 0/O ou 1/I)."
        />
      ) : (
        <FeedbackBanner
          variant="info"
          title="Fotos e vídeo já enviados"
          message="Não é necessário enviar mídia de novo aqui. Se o código ainda não aparece nas imagens, a moderação pode pedir para você atualizar a mídia em Meus anúncios → Corrigir anúncio."
        />
      )}
    </section>
  );
}

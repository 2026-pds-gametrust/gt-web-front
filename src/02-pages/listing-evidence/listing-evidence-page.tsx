import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { VerificationEvidencePanel } from '@widgets/verification-evidence/verification-evidence-panel';

export function ListingEvidencePage() {
  const { listingId = '' } = useParams();

  if (!listingId) {
    return (
      <AppShell>
        <p>Anúncio inválido.</p>
        <Link className={buttonClassName({ variant: 'ghost' })} to="/meus-anuncios">
          Voltar
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHero titleId="evidence-heading" title="Código de posse">
        <p className="lead mb-6 mt-0 text-muted">
          Consulte o código gerado para este anúncio. Suas fotos e vídeo continuam as mesmas do
          fluxo de venda — use Corrigir anúncio se precisar atualizar a mídia.
        </p>
      </PageHero>

      <div className="rounded-lg border border-border bg-surface p-6">
        <VerificationEvidencePanel listingId={listingId} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className={buttonClassName({ variant: 'ghost' })} to="/meus-anuncios">
          Meus anúncios
        </Link>
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </div>
    </AppShell>
  );
}

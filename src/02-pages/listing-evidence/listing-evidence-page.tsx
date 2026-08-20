import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { VerificationEvidencePanel } from '@widgets/verification-evidence/verification-evidence-panel';

export function ListingEvidencePage() {
  const { listingId = '' } = useParams();

  if (!listingId) {
    return (
      <AppShell>
        <p>Anúncio inválido.</p>
        <Link className="gt-button gt-button--ghost" to="/meus-anuncios">
          Voltar
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHero titleId="evidence-heading" title="Código de posse">
        <p className="lead">
          Consulte o código gerado para este anúncio. Suas fotos e vídeo continuam as mesmas do
          fluxo de venda — use Corrigir anúncio se precisar atualizar a mídia.
        </p>
      </PageHero>

      <div className="wizard-panel">
        <VerificationEvidencePanel listingId={listingId} />
      </div>

      <div className="wizard-actions">
        <Link className="gt-button gt-button--ghost" to="/meus-anuncios">
          Meus anúncios
        </Link>
        <Button type="button" className="gt-button--ghost" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </div>
    </AppShell>
  );
}

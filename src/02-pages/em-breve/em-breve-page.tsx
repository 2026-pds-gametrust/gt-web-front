import { Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@shared/ui/button/button';

const LABELS: Record<string, string> = {
  categorias: 'Categorias',
  favoritos: 'Favoritos',
  notificacoes: 'Notificações',
  perfil: 'Perfil',
};

export function EmBrevePage() {
  const { section = '' } = useParams();

  if (section === 'compras') {
    return <Navigate to="/compras" replace />;
  }

  const label = LABELS[section] ?? 'Esta área';

  return (
    <AppShell>
      <PageHero titleId="em-breve-heading" title={label}>
        <p>
          Em breve nesta versão web. Por enquanto você pode buscar ofertas, comparar produtos e
          publicar um anúncio.
        </p>
        <Link className={buttonClassName()} to="/">
          Voltar ao início
        </Link>
      </PageHero>
    </AppShell>
  );
}

import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';

const LABELS: Record<string, string> = {
  categorias: 'Categorias',
  favoritos: 'Favoritos',
  compras: 'Compras e vendas',
  notificacoes: 'Notificações',
  perfil: 'Perfil',
};

export function EmBrevePage() {
  const { section = '' } = useParams();
  const label = LABELS[section] ?? 'Esta área';

  return (
    <AppShell>
      <PageHero titleId="em-breve-heading" title={label}>
        <p>
          Em breve nesta versão web. Por enquanto você pode buscar ofertas, comparar produtos e
          publicar um anúncio.
        </p>
        <Link className="gt-button" to="/">
          Voltar ao início
        </Link>
      </PageHero>
    </AppShell>
  );
}

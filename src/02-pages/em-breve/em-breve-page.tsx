import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';

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
      <section className="page-hero" aria-labelledby="em-breve-heading">
        <h1 id="em-breve-heading">{label}</h1>
        <p>
          Em breve nesta versão web. Por enquanto você pode buscar ofertas, comparar produtos e
          publicar um anúncio mockado.
        </p>
        <Link className="gt-button" to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          Voltar ao início
        </Link>
      </section>
    </AppShell>
  );
}

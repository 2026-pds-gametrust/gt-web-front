import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SearchBar } from '@widgets/search-bar/search-bar';
import { useAuthStore } from '@features/auth/model/use-auth-store';

type AppShellProps = {
  children: ReactNode;
  showHeaderSearch?: boolean;
};

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/buscar', label: 'Buscar' },
  { to: '/em-breve/categorias', label: 'Categorias' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/meus-anuncios', label: 'Meus anúncios' },
  { to: '/em-breve/compras', label: 'Compras e vendas' },
  { to: '/em-breve/notificacoes', label: 'Notificações' },
  { to: '/perfil', label: 'Perfil' },
  { to: '/moderacao', label: 'Moderação', operatorOnly: true },
  { to: '/admin/catalogo', label: 'Catálogo', operatorOnly: true },
  { to: '/admin/usuarios', label: 'Usuários', operatorOnly: true },
] as const;

export function AppShell({ children, showHeaderSearch = true }: AppShellProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const canOperate = useAuthStore((s) => s.canOperate());

  const navItems = NAV_ITEMS.filter(
    (item) => !('operatorOnly' in item && item.operatorOnly) || canOperate,
  );

  async function onLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header app-shell__header--brand">
        <div className="app-shell__header-inner">
          <Link to="/" className="app-shell__brand" aria-label="GamerTrust — início">
            <img
              src="/brand/gametrust-mark.png"
              alt=""
              className="app-shell__brand-logo"
              width={120}
              height={66}
              decoding="async"
            />
            <span className="app-shell__brand-wordmark" aria-hidden="true">
              <span className="app-shell__brand-game">Game</span>
              <span className="app-shell__brand-trust">Trust</span>
            </span>
            <span className="visually-hidden">GamerTrust</span>
          </Link>

          {showHeaderSearch ? (
            <div className="app-shell__search">
              <SearchBar size="compact" />
            </div>
          ) : null}

          <div className="app-shell__actions">
            <Link className="gt-button app-shell__sell-cta" to="/vender">
              Vender
            </Link>
            {user ? (
              <>
                <span className="app-shell__session">{user.fullName}</span>
                <button
                  type="button"
                  className="gt-button gt-button--ghost"
                  onClick={() => void onLogout()}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link className="gt-button gt-button--ghost-on-dark" to="/criar-conta">
                  Criar conta
                </Link>
                <Link className="gt-button gt-button--ghost-on-dark" to="/entrar">
                  Entrar
                </Link>
              </>
            )}
          </div>

          <nav className="app-shell__nav" aria-label="Principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  `app-shell__nav-link${isActive ? ' is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
    </div>
  );
}

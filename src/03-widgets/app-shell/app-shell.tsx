import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AccountMenu } from '@widgets/account-menu/account-menu';
import { SearchBar } from '@widgets/search-bar/search-bar';

type AppShellProps = {
  children: ReactNode;
  showHeaderSearch?: boolean;
};

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/buscar', label: 'Buscar' },
  { to: '/em-breve/categorias', label: 'Categorias' },
  { to: '/favoritos', label: 'Favoritos' },
] as const;

export function AppShell({ children, showHeaderSearch = true }: AppShellProps) {
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
            <Link className="app-shell__action-link" to="/vender">
              Vender
            </Link>
            <AccountMenu />
          </div>

          <nav className="app-shell__nav" aria-label="Principal">
            {NAV_ITEMS.map((item) => (
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

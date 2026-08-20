import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { useChatUnreadStore } from '@features/listing-chat/model/use-chat-unread-store';
import { cn } from '@shared/lib/cn';
import { AccountMenu } from '@widgets/account-menu/account-menu';
import { SearchBar } from '@widgets/search-bar/search-bar';

type AppShellProps = {
  children: ReactNode;
  showHeaderSearch?: boolean;
  /** Drop main padding so a screen can fill the viewport under the header. */
  flushMain?: boolean;
};

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/buscar', label: 'Buscar' },
  { to: '/em-breve/categorias', label: 'Categorias' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/mensagens', label: 'Mensagens' },
] as const;

const navLinkClass = cn(
  'inline-flex min-h-10 items-center rounded px-3 text-[0.95rem] font-semibold tracking-[0.01em] text-header-text/72 transition-[color,background] duration-150 focus-ring',
  'hover:bg-white/8 hover:text-white',
);

export function AppShell({ children, showHeaderSearch = true, flushMain = false }: AppShellProps) {
  const location = useLocation();
  const authStatus = useAuthStore((s) => s.status);
  const totalUnread = useChatUnreadStore((s) => s.totalUnread);
  const refreshUnread = useChatUnreadStore((s) => s.refresh);
  const clearUnread = useChatUnreadStore((s) => s.clear);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      void refreshUnread();
      return;
    }
    if (authStatus === 'anonymous') {
      clearUnread();
    }
  }, [authStatus, refreshUnread, clearUnread]);

  return (
    <div
      data-flush={flushMain ? '' : undefined}
      className={cn('flex min-h-screen flex-col', flushMain && 'h-dvh max-h-dvh overflow-hidden')}
    >
      <header className="sticky top-0 z-20 border-b-[3px] border-b-accent bg-header px-5 py-3 text-header max-panel:px-4">
        <div
          className={cn(
            'mx-auto grid w-full max-w-[var(--gt-max)] items-center gap-x-4 gap-y-3',
            'grid-cols-[auto_minmax(0,1fr)_auto] [grid-template-areas:"brand_search_actions"_"nav_nav_nav"]',
            'max-nav:grid-cols-[1fr_auto] max-nav:[grid-template-areas:"brand_actions"_"search_search"_"nav_nav"]',
          )}
        >
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-3 text-header [grid-area:brand]"
            aria-label="GamerTrust — início"
          >
            <img
              src="/brand/gametrust-mark.png"
              alt=""
              className="h-11 w-auto max-w-[7.5rem] object-contain object-left max-nav:h-[2.35rem]"
              width={120}
              height={66}
              decoding="async"
            />
            <span
              className="inline-flex font-display text-[1.35rem] leading-none font-extrabold tracking-[-0.04em] uppercase italic max-nav:text-[1.1rem]"
              aria-hidden="true"
            >
              <span className="text-white">Game</span>
              <span className="text-accent">Trust</span>
            </span>
            <span className="visually-hidden">GamerTrust</span>
          </Link>

          {showHeaderSearch ? (
            <div className="min-w-0 [grid-area:search] [&_input]:border-transparent [&_input]:bg-white [&_input]:text-ink">
              <SearchBar size="compact" />
            </div>
          ) : null}

          <div className="flex items-center gap-1 [grid-area:actions]">
            <Link
              className="inline-flex min-h-11 items-center rounded px-3 font-bold whitespace-nowrap text-header focus-ring hover:bg-white/8 hover:text-white"
              to="/vender"
            >
              Vender
            </Link>
            <AccountMenu />
          </div>

          <nav className="flex flex-wrap gap-1 [grid-area:nav]" aria-label="Principal">
            {NAV_ITEMS.map((item) => {
              const isMessages = item.to === '/mensagens';
              const messagesActive = isMessages && location.pathname.startsWith('/mensagens');
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    cn(
                      navLinkClass,
                      (isActive || messagesActive) &&
                        'bg-[color-mix(in_srgb,var(--gt-accent)_28%,transparent)] font-bold text-white',
                    )
                  }
                >
                  {item.label}
                  {isMessages && totalUnread > 0 ? (
                    <span
                      className="ml-1.5 inline-flex min-w-7 animate-badge-pulse items-center justify-center self-center rounded-full bg-accent px-[0.45rem] py-[0.15rem] text-center text-xs font-extrabold text-white"
                      aria-label={`${totalUnread} mensagens não lidas`}
                    >
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>
      <main
        className={cn(
          flushMain
            ? 'flex min-h-0 w-full max-w-none flex-1 flex-col p-0'
            : 'mx-auto w-full max-w-[var(--gt-max)] flex-1 px-5 pt-6 pb-8 max-panel:px-4 max-panel:pt-5 max-panel:pb-6',
        )}
      >
        {children}
      </main>
    </div>
  );
}

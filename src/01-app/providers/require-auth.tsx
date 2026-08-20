import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { useAuthStore } from '@features/auth/model/use-auth-store';

type RequireAuthProps = {
  children: ReactNode;
  /** Route needs the backoffice/admin group, not just a valid session. */
  requireOperator?: boolean;
};

/**
 * Route guard mirroring the authorization matrix. It is a courtesy, not a
 * security boundary — the server still answers 401/403 on its own.
 */
export function RequireAuth({ children, requireOperator = false }: RequireAuthProps) {
  const location = useLocation();
  const status = useAuthStore((s) => s.status);
  const canOperate = useAuthStore((s) => s.canOperate());

  // Session hydration is in flight: redirecting now would bounce a valid session.
  if (status === 'idle' || status === 'loading') {
    return (
      <AppShell>
        <p className="home-status">Carregando sessão…</p>
      </AppShell>
    );
  }

  if (status !== 'authenticated') {
    return (
      <Navigate
        to="/entrar"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  // 403, not 401: the session is fine, the group is not. Nobody gets logged out.
  if (requireOperator && !canOperate) {
    return (
      <AppShell>
        <section className="page-hero">
          <h1>Sem permissão</h1>
          <p>
            Esta área é do time de backoffice. Sua conta continua ativa — apenas não está no
            grupo necessário.
          </p>
          <Link className="gt-button gt-button--ghost" to="/">
            Voltar ao início
          </Link>
        </section>
      </AppShell>
    );
  }

  return <>{children}</>;
}

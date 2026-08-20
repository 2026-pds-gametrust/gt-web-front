import { Link, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { AuthLayout } from '@shared/ui/auth-layout/auth-layout';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { useAuthStore } from '@features/auth/model/use-auth-store';

type SuccessState = { name?: string } | null;

export function RegisterSuccessPage() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  const state = location.state as SuccessState;
  const firstName = (state?.name ?? user?.fullName ?? 'você').split(/\s+/)[0];

  if (!isAuthenticated) {
    return <Navigate to="/criar-conta" replace />;
  }

  return (
    <AppShell showHeaderSearch={false}>
      <AuthLayout title={`Conta criada, ${firstName}!`}>
        <div className="register-success gt-feedback-enter">
          <svg className="register-success__icon" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
            <path
              className="feedback-banner__check"
              d="M20 33l8 8 16-18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <FeedbackBanner
            variant="success"
            title="Bem-vindo ao GamerTrust"
            message="Sua conta está pronta. Verificação de identidade e selos de anúncio são etapas separadas — nada aparece como verificado até o processo ser concluído."
          />

          <div className="register-success__actions">
            <Link className="gt-button" to="/perfil">
              Completar perfil
            </Link>
            <Link className="gt-button gt-button--ghost" to="/vender">
              Anunciar agora
            </Link>
          </div>
        </div>
      </AuthLayout>
    </AppShell>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { AuthLayout } from '@shared/ui/auth-layout/auth-layout';
import { FormField } from '@shared/ui/form-field/form-field';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Button } from '@shared/ui/button/button';
import { presentAuthError } from '@features/auth/lib/auth-feedback-presenter';
import { useAuthStore } from '@features/auth/model/use-auth-store';

type LocationState = { from?: string } | null;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const status = useAuthStore((s) => s.status);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const from = (location.state as LocationState)?.from ?? '/';
  const busy = status === 'loading';

  useEffect(() => {
    clearError();
  }, [clearError]);

  const emailError =
    emailTouched && !email.trim() ? 'Informe seu e-mail.' : null;
  const passwordError =
    passwordTouched && !password ? 'Informe sua senha.' : null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!email.trim() || !password) return;

    if (await login({ email, password })) {
      navigate(from, { replace: true });
    }
  }

  const serverFeedback = error ? presentAuthError(error, 'login') : null;

  return (
    <AppShell showHeaderSearch={false}>
      <AuthLayout
        title="Entrar"
        lead="Acesse sua conta para favoritar, anunciar e acompanhar vendas."
        footer={
          <p className="auth-footer">
            Ainda não tem conta? <Link to="/criar-conta">Criar conta</Link>
          </p>
        }
      >
        <form onSubmit={(event) => void onSubmit(event)} noValidate>
          <FormField id="login-email" label="E-mail" required error={emailError}>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) clearError();
              }}
              onBlur={() => setEmailTouched(true)}
            />
          </FormField>

          <FormField id="login-password" label="Senha" required error={passwordError}>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) clearError();
              }}
              onBlur={() => setPasswordTouched(true)}
            />
          </FormField>

          {/*
            One copy for every rejection — wrong password, unknown e-mail or a
            blocked account all look identical on purpose.
          */}
          {serverFeedback ? (
            <FeedbackBanner
              variant={serverFeedback.variant}
              title={serverFeedback.title}
              message={serverFeedback.message}
            />
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={busy || !email || !password}
              loading={busy}
            >
              {busy ? 'Entrando…' : 'Entrar'}
            </Button>
          </div>
        </form>
      </AuthLayout>
    </AppShell>
  );
}

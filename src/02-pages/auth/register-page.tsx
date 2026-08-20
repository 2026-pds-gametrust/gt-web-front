import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '@widgets/app-shell/app-shell';
import { AuthLayout } from '@shared/ui/auth-layout/auth-layout';
import { FormField } from '@shared/ui/form-field/form-field';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { digitsOnly, maskCpf, maskPhone } from '@shared/lib/format';
import {
  validateRegisterField,
  validateRegisterForm,
  type RegisterField,
} from '@shared/lib/validation/register-validation';
import { Button } from '@shared/ui/button/button';
import { presentAuthError } from '@features/auth/lib/auth-feedback-presenter';
import { useAuthStore } from '@features/auth/model/use-auth-store';

/** The contract asks the client for the id; the server owns everything else. */
function newUserId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `user-${uuid ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}`;
}

const EMPTY: Record<RegisterField, string> = {
  fullName: '',
  email: '',
  phone: '',
  cpf: '',
  birthDate: '',
  password: '',
};

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const status = useAuthStore((s) => s.status);

  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({});
  const [shakeForm, setShakeForm] = useState(false);

  const busy = status === 'loading';
  const phoneDigits = digitsOnly(form.phone);
  const cpfDigits = digitsOnly(form.cpf);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      setShakeForm(true);
      const timer = window.setTimeout(() => setShakeForm(false), 500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [error]);

  function set<K extends RegisterField>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
    if (error) clearError();
  }

  function onBlur(field: RegisterField) {
    setTouched((current) => ({ ...current, [field]: true }));
    const message = validateRegisterField(field, form[field]);
    setFieldErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function fieldError(field: RegisterField): string | null {
    if (fieldErrors[field]) return fieldErrors[field] ?? null;
    if (touched[field]) return validateRegisterField(field, form[field]);
    return null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validateRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        cpf: true,
        birthDate: true,
        password: true,
      });
      setShakeForm(true);
      window.setTimeout(() => setShakeForm(false), 500);
      return;
    }

    const created = await register({
      id: newUserId(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: phoneDigits,
      cpf: cpfDigits,
      birthDate: form.birthDate,
      password: form.password,
    });
    if (created) {
      navigate('/criar-conta/sucesso', {
        replace: true,
        state: { name: form.fullName.trim() },
      });
    }
  }

  const serverFeedback = error ? presentAuthError(error, 'register') : null;

  return (
    <AppShell showHeaderSearch={false}>
      <AuthLayout
        title="Criar conta"
        lead="Entre no marketplace para favoritar, anunciar e acompanhar vendas."
        callout={
          <FeedbackBanner
            variant="info"
            title="Conta ≠ verificação"
            message="Sua conta é a identidade no marketplace. Verificação de identidade e selos de anúncio são etapas separadas — nada é exibido como verificado agora."
          />
        }
        footer={
          <p className="auth-footer">
            Já tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        }
      >
        <form
          className={shakeForm ? 'gt-shake' : ''}
          onSubmit={(event) => void onSubmit(event)}
          noValidate
        >
          <FormField
            id="register-name"
            label="Nome completo"
            required
            error={fieldError('fullName')}
          >
            <input
              autoComplete="name"
              value={form.fullName}
              onChange={(event) => set('fullName', event.target.value)}
              onBlur={() => onBlur('fullName')}
            />
          </FormField>

          <FormField id="register-email" label="E-mail" required error={fieldError('email')}>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => set('email', event.target.value)}
              onBlur={() => onBlur('email')}
            />
          </FormField>

          <FormField
            id="register-phone"
            label="Telefone"
            hint="DDD + número, com ou sem o nono dígito."
            required
            error={fieldError('phone')}
          >
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(11) 99999-9999"
              maxLength={15}
              value={form.phone}
              onChange={(event) => set('phone', maskPhone(event.target.value))}
              onBlur={() => onBlur('phone')}
            />
          </FormField>

          <FormField
            id="register-cpf"
            label="CPF"
            hint="11 dígitos. A pontuação é preenchida automaticamente."
            required
            error={fieldError('cpf')}
          >
            <input
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              maxLength={14}
              value={form.cpf}
              onChange={(event) => set('cpf', maskCpf(event.target.value))}
              onBlur={() => onBlur('cpf')}
            />
          </FormField>

          <FormField
            id="register-birth"
            label="Data de nascimento"
            required
            error={fieldError('birthDate')}
          >
            <input
              type="date"
              autoComplete="bday"
              value={form.birthDate}
              onChange={(event) => set('birthDate', event.target.value)}
              onBlur={() => onBlur('birthDate')}
            />
          </FormField>

          <FormField
            id="register-password"
            label="Senha"
            hint="Mínimo de 8 caracteres."
            required
            error={fieldError('password')}
          >
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => set('password', event.target.value)}
              onBlur={() => onBlur('password')}
            />
          </FormField>

          {serverFeedback ? (
            <FeedbackBanner
              variant={serverFeedback.variant}
              title={serverFeedback.title}
              message={serverFeedback.message}
            />
          ) : null}

          <div className="wizard-actions">
            <Button type="submit" disabled={busy} loading={busy}>
              {busy ? 'Criando…' : 'Criar conta'}
            </Button>
          </div>
        </form>
      </AuthLayout>
    </AppShell>
  );
}

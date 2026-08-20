import { useEffect, useState } from 'react';
import { AppShell } from '@widgets/app-shell/app-shell';
import { FormField } from '@shared/ui/form-field/form-field';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Button } from '@shared/ui/button/button';
import { identityApi } from '@features/identity/api/identity-api';
import { trustApi } from '@features/trust-display/api/trust-api';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import type { IProfile } from '@entities/profile/model';
import type { IUser } from '@entities/user/model';
import type { ITrustDisplay } from '@entities/trust-score/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';

export function ProfilePage() {
  // Identity comes from the session (JWT `sub`). The route guard guarantees it.
  const sessionUser = useAuthStore((s) => s.user);
  const userId = sessionUser?.id ?? '';
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [trust, setTrust] = useState<ITrustDisplay | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [locationApprox, setLocationApprox] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: 'success' | 'error' } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [cep, setCep] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  /** Fills "local aproximado" from the postal code — the profile has no address form. */
  async function onLookupCep() {
    setCepLoading(true);
    setMessage(null);
    try {
      const result = await identityApi.lookupCep(cep);
      if (!result) {
        setMessage({ text: 'Informe um CEP com 8 dígitos.', variant: 'error' });
        return;
      }
      setLocationApprox(`${result.city}, ${result.state}`);
      setMessage({ text: 'Local preenchido pelo CEP.', variant: 'success' });
    } catch {
      setMessage({ text: 'Não foi possível consultar o CEP.', variant: 'error' });
    } finally {
      setCepLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [u, p, t] = await Promise.all([
        identityApi.getUser(userId),
        identityApi.getMyProfile(),
        trustApi.getTrustDisplay(userId),
      ]);
      if (cancelled) return;
      setUser(u);
      setProfile(p);
      setTrust(t);
      setDisplayName(p?.displayName ?? u?.fullName ?? '');
      setBio(p?.bio ?? '');
      setLocationApprox(p?.locationApprox ?? '');
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    const updated = await identityApi.updateProfile(profile.id, {
      displayName,
      bio,
      locationApprox,
    });
    setProfile(updated);
    setSaving(false);
    setMessage({ text: 'Perfil atualizado.', variant: 'success' });
  }

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="profile-heading">
        <h1 id="profile-heading">Perfil</h1>
        <p>Dados públicos e confiança do vendedor — sem selos inventados.</p>
      </section>

      {loading ? <p className="home-status">Carregando perfil…</p> : null}

      {!loading && !profile ? (
        <p role="alert">Perfil não encontrado para o usuário de desenvolvimento.</p>
      ) : null}

      {profile ? (
        <div className="profile-layout">
          <form className="profile-form" onSubmit={onSave}>
            <FormField id="profile-display-name" label="Nome de exibição">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="nickname"
              />
            </FormField>
            <FormField id="profile-bio" label="Bio">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </FormField>
            <FormField id="profile-cep" label="CEP">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000000"
              />
            </FormField>
            <div className="wizard-actions">
              <Button
                type="button"
                variant="ghost"
                disabled={cepLoading}
                onClick={() => void onLookupCep()}
              >
                {cepLoading ? 'Consultando…' : 'Preencher pelo CEP'}
              </Button>
            </div>
            <FormField id="profile-location" label="Local aproximado">
              <input
                value={locationApprox}
                onChange={(e) => setLocationApprox(e.target.value)}
                autoComplete="address-level2"
              />
            </FormField>
            <Button type="submit" loading={saving} disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
            {message ? (
              <FeedbackBanner
                variant={message.variant}
                title={message.variant === 'success' ? 'Salvo' : 'Não foi possível'}
                message={message.text}
                onDismiss={() => setMessage(null)}
              />
            ) : null}
          </form>

          <aside className="profile-aside" aria-label="Conta e confiança">
            {user ? (
              <dl className="profile-meta">
                <div>
                  <dt>Nome</dt>
                  <dd>{user.fullName}</dd>
                </div>
                <div>
                  <dt>E-mail</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>Identidade</dt>
                  <dd>{user.verified ? 'Verificada' : 'Não verificada'}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{user.status}</dd>
                </div>
              </dl>
            ) : null}

            {trust ? (
              <TrustScoreSummary trust={trust} />
            ) : (
              <p className="trust-reasons trust-reasons--empty">
                Ainda sem TrustScore como vendedor.
              </p>
            )}
          </aside>
        </div>
      ) : null}
    </AppShell>
  );
}

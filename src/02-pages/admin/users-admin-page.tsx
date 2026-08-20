import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@widgets/app-shell/app-shell';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Button } from '@shared/ui/button/button';
import { UsersAdminPanel } from '@widgets/users-admin/users-admin-panel';
import { identityApi } from '@features/identity/api/identity-api';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { isAdmin, type IUser } from '@entities/user/model';

export function UsersAdminPage() {
  const sessionUser = useAuthStore((s) => s.user);
  const canAssignGroups = isAdmin(sessionUser);

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      setUsers(await identityApi.listUsers());
    } catch {
      setError('Não foi possível carregar os usuários.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(id: string, action: () => Promise<unknown>, successMessage: string) {
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load(true);
      setMessage(successMessage);
      return true;
    } catch (actionError) {
      setError(
        actionError instanceof Error && actionError.message
          ? actionError.message
          : 'A operação falhou.',
      );
      return false;
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <PageHero titleId="users-admin-heading" title="Usuários">
        <p className="lead mb-6 mt-0 max-w-[52rem] text-muted">
          Diretório operacional: filtre por grupo, identidade e status. Verificar identidade não
          concede selo de anúncio. Alterar grupos exige a conta estar em <code>admin</code>.
        </p>
      </PageHero>

      {!canAssignGroups ? (
        <FeedbackBanner
          variant="info"
          title="Consulta e verificação"
          message="Sua conta não está no grupo admin — você consulta e verifica identidade, mas não altera grupos."
        />
      ) : null}

      {error ? (
        <FeedbackBanner
          variant="error"
          title="Não foi possível concluir"
          message={error}
          action={
            <Button type="button" variant="ghost" onClick={() => void load()}>
              Tentar de novo
            </Button>
          }
        />
      ) : null}
      {message ? (
        <FeedbackBanner variant="success" title="Salvo" message={message} />
      ) : null}
      {loading ? <Skeleton label="Carregando usuários…" /> : null}

      {!loading ? (
        <UsersAdminPanel
          users={users}
          canAssignGroups={canAssignGroups}
          sessionUserId={sessionUser?.id ?? null}
          busyId={busyId}
          onVerify={(id) =>
            void run(id, () => identityApi.verifyUser(id), 'Identidade verificada.')
          }
          onSaveGroups={(id, groups) =>
            run(id, () => identityApi.updateUserGroups(id, { groups }), 'Grupos atualizados.')
          }
        />
      ) : null}
    </AppShell>
  );
}

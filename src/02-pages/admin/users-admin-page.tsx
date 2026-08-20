import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
import { identityApi } from '@features/identity/api/identity-api';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { EUserGroup, isAdmin, type IUser } from '@entities/user/model';

const ASSIGNABLE_GROUPS: { value: EUserGroup; label: string }[] = [
  { value: EUserGroup.APP_USER, label: 'app-user' },
  { value: EUserGroup.PARTNER, label: 'partner' },
  { value: EUserGroup.BACKOFFICE, label: 'backoffice' },
  { value: EUserGroup.ADMIN, label: 'admin' },
];

export function UsersAdminPage() {
  const sessionUser = useAuthStore((s) => s.user);
  // Only ADMIN may change groups; backoffice can read the list and verify.
  const canAssignGroups = isAdmin(sessionUser);

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftGroups, setDraftGroups] = useState<EUserGroup[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await identityApi.listUsers());
    } catch {
      setError('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
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
      await load();
      setEditingId(null);
      setMessage(successMessage);
    } catch (actionError) {
      setError(
        actionError instanceof Error && actionError.message
          ? actionError.message
          : 'A operação falhou.',
      );
    } finally {
      setBusyId(null);
    }
  }

  function toggleDraftGroup(group: EUserGroup) {
    setDraftGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group],
    );
  }

  return (
    <AppShell>
      <section className="page-hero" aria-labelledby="users-admin-heading">
        <h1 id="users-admin-heading">Usuários</h1>
        <p className="lead">
          Grupos, verificação e remoção. Alterar grupos exige a conta estar em <code>admin</code>.
        </p>
      </section>

      {!canAssignGroups ? (
        <p className="offer-card__meta">
          Sua conta não está no grupo admin — alterar grupos volta 403 no servidor.
        </p>
      ) : null}

      {error ? <p role="alert">{error}</p> : null}
      {message ? <p className="offer-card__meta">{message}</p> : null}
      {loading ? <p>Carregando…</p> : null}

      {!loading ? (
        <ul className="bullet-list" aria-label="Usuários">
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.fullName}</strong> · {user.email} ·{' '}
              {user.verified ? 'verificado' : 'não verificado'} ·{' '}
              {(user.groups ?? []).join(', ') || 'sem grupo'}

              {editingId === user.id ? (
                <div className="checkbox-list">
                  {ASSIGNABLE_GROUPS.map((group) => (
                    <label key={group.value} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={draftGroups.includes(group.value)}
                        onChange={() => toggleDraftGroup(group.value)}
                      />
                      <span>{group.label}</span>
                    </label>
                  ))}
                  <Button
                    disabled={busyId === user.id}
                    onClick={() =>
                      void run(
                        user.id,
                        () => identityApi.updateUserGroups(user.id, { groups: draftGroups }),
                        'Grupos atualizados.',
                      )
                    }
                  >
                    Salvar grupos
                  </Button>
                  <Button className="gt-button--ghost" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="wizard-actions">
                  {canAssignGroups ? (
                    <button
                      type="button"
                      className="gt-button gt-button--ghost"
                      onClick={() => {
                        setEditingId(user.id);
                        setDraftGroups([...(user.groups ?? [])] as EUserGroup[]);
                      }}
                    >
                      Alterar grupos
                    </button>
                  ) : null}

                  {!user.verified ? (
                    <button
                      type="button"
                      className="gt-button gt-button--ghost"
                      disabled={busyId === user.id}
                      onClick={() =>
                        void run(
                          user.id,
                          () => identityApi.verifyUser(user.id),
                          'Usuário verificado.',
                        )
                      }
                    >
                      Verificar
                    </button>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </AppShell>
  );
}

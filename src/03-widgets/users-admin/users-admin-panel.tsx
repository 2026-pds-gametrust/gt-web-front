import { useMemo, useState } from 'react';
import { Button } from '@shared/ui/button/button';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { EUserGroup, type IUser } from '@entities/user/model';
import { cn } from '@shared/lib/cn';
import {
  EMPTY_USER_DIRECTORY_FILTERS,
  USER_GROUP_FILTER_OPTIONS,
  USER_GROUP_OPTIONS,
  USER_STATUS_OPTIONS,
  USER_VERIFIED_OPTIONS,
  filterUsers,
  formatUserCreatedAt,
  hasActiveUserFilters,
  summarizeUsers,
  userAvatarTone,
  userGroupLabel,
  userInitials,
  userStatusLabel,
  type UserDirectoryFilters,
  type UserGroupFilter,
  type UserStatusFilter,
  type UserVerifiedFilter,
} from '@features/identity/lib/user-directory';

const CHIP =
  'min-h-11 rounded border border-border-strong bg-surface px-3 text-sm font-semibold focus-ring transition-[border-color,background,color] duration-150';
const CHIP_ACTIVE = 'border-accent bg-accent-soft font-bold text-accent-hover';

const AVATAR_TONES = [
  'bg-[#181818] text-[#f5f5f5]',
  'bg-[#3a140c] text-[#ffd8cc]',
  'bg-[#2a2a2a] text-[#fff1ec]',
  'bg-[#5a2414] text-white',
] as const;

const SEARCH_INPUT =
  'min-h-11 rounded border border-border-strong bg-surface px-3 py-2 transition-[border-color,box-shadow] duration-150 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

type UsersAdminPanelProps = {
  users: IUser[];
  canAssignGroups: boolean;
  sessionUserId: string | null;
  busyId: string | null;
  onVerify: (userId: string) => void;
  onSaveGroups: (userId: string, groups: EUserGroup[]) => boolean | Promise<boolean>;
};

type StatKey = 'total' | 'unverified' | 'blocked' | 'pendingAccount' | 'operators';

function Chip({
  pressed,
  children,
  onClick,
}: {
  pressed: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(CHIP, pressed && CHIP_ACTIVE)}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function applyStatFilter(key: StatKey, current: UserDirectoryFilters): UserDirectoryFilters {
  const reset = { ...current, status: 'all' as const, verified: 'all' as const, group: 'all' as const };

  if (key === 'total') return reset;

  if (key === 'unverified') {
    return {
      ...reset,
      verified: current.verified === 'unverified' ? 'all' : 'unverified',
    };
  }

  if (key === 'blocked') {
    return {
      ...reset,
      status: current.status === 'BLOCKED' ? 'all' : 'BLOCKED',
    };
  }

  if (key === 'pendingAccount') {
    return {
      ...reset,
      status: current.status === 'PENDING_VERIFICATION' ? 'all' : 'PENDING_VERIFICATION',
    };
  }

  return {
    ...reset,
    group: current.group === 'ops' ? 'all' : 'ops',
  };
}

function statIsActive(key: StatKey, filters: UserDirectoryFilters): boolean {
  if (key === 'total') {
    return filters.status === 'all' && filters.verified === 'all' && filters.group === 'all';
  }
  if (key === 'unverified') return filters.verified === 'unverified';
  if (key === 'blocked') return filters.status === 'BLOCKED';
  if (key === 'pendingAccount') return filters.status === 'PENDING_VERIFICATION';
  return filters.group === 'ops';
}

function statusPillClass(status: IUser['status']): string {
  if (status === 'BLOCKED') return 'bg-[#fdecec] text-danger';
  if (status === 'PENDING_VERIFICATION') return 'bg-[#fff4e5] text-warning';
  return 'bg-surface-muted';
}

export function UsersAdminPanel({
  users,
  canAssignGroups,
  sessionUserId,
  busyId,
  onVerify,
  onSaveGroups,
}: UsersAdminPanelProps) {
  const [filters, setFilters] = useState<UserDirectoryFilters>(EMPTY_USER_DIRECTORY_FILTERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftGroups, setDraftGroups] = useState<EUserGroup[]>([]);

  const stats = useMemo(() => summarizeUsers(users), [users]);
  const visible = useMemo(() => filterUsers(users, filters), [users, filters]);
  const filtersActive = hasActiveUserFilters(filters);

  function startEdit(user: IUser) {
    setEditingId(user.id);
    setDraftGroups([...(user.groups ?? [])]);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftGroups([]);
  }

  function toggleDraftGroup(group: EUserGroup) {
    setDraftGroups((current) =>
      current.includes(group) ? current.filter((item) => item !== group) : [...current, group],
    );
  }

  const statItems: { key: StatKey; label: string; value: number }[] = [
    { key: 'total', label: 'Total', value: stats.total },
    { key: 'unverified', label: 'Identidade pendente', value: stats.unverified },
    { key: 'blocked', label: 'Bloqueadas', value: stats.blocked },
    { key: 'pendingAccount', label: 'Cadastro pendente', value: stats.pendingAccount },
    { key: 'operators', label: 'Equipe interna', value: stats.operators },
  ];

  return (
    <div className="grid gap-4">
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3"
        role="group"
        aria-label="Resumo das contas"
      >
        {statItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cn(
              'grid min-h-11 cursor-pointer gap-1 rounded-lg border border-border bg-surface p-6 text-left transition-[border-color,background] duration-150 hover:border-accent hover:bg-accent-soft focus-ring',
              statIsActive(item.key, filters) && 'border-accent bg-accent-soft',
            )}
            onClick={() => setFilters((current) => applyStatFilter(item.key, current))}
          >
            <span className="font-display text-2xl leading-none font-bold">{item.value}</span>
            <span className="text-[0.85rem] font-semibold text-muted">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-lg border border-border bg-surface p-6">
        <label className="mb-0 flex flex-col gap-2">
          <span className="text-[0.925rem] font-semibold">Buscar conta</span>
          <input
            type="search"
            className={SEARCH_INPUT}
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder="Nome ou e-mail"
            autoComplete="off"
          />
        </label>

        <div className="mb-0 flex flex-wrap items-center gap-3" role="group" aria-label="Filtrar por status">
          {USER_STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              pressed={filters.status === option.value}
              onClick={() =>
                setFilters((current) => ({ ...current, status: option.value as UserStatusFilter }))
              }
            >
              {option.label}
            </Chip>
          ))}
        </div>

        <div className="mb-0 flex flex-wrap items-center gap-3" role="group" aria-label="Filtrar por identidade">
          {USER_VERIFIED_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              pressed={filters.verified === option.value}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  verified: option.value as UserVerifiedFilter,
                }))
              }
            >
              {option.label}
            </Chip>
          ))}
        </div>

        <div className="mb-0 flex flex-wrap items-center gap-3" role="group" aria-label="Filtrar por grupo">
          {USER_GROUP_FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              pressed={filters.group === option.value}
              onClick={() =>
                setFilters((current) => ({ ...current, group: option.value as UserGroupFilter }))
              }
            >
              {option.label}
            </Chip>
          ))}
        </div>

        {filtersActive ? (
          <Button
            variant="ghost"
            onClick={() => {
              setFilters(EMPTY_USER_DIRECTORY_FILTERS);
            }}
          >
            Limpar filtros
          </Button>
        ) : null}
      </div>

      <p className="m-0 text-[0.9rem] font-semibold text-muted" role="status">
        {visible.length === users.length
          ? `${visible.length} conta(s)`
          : `${visible.length} de ${users.length} conta(s)`}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title={filtersActive ? 'Nenhuma conta corresponde aos filtros' : 'Nenhuma conta nesta lista'}
        >
          {filtersActive
            ? 'Ajuste a busca, o status, a identidade ou o grupo.'
            : 'Quando houver contas, elas aparecem aqui para consulta e verificação.'}
        </EmptyState>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0" aria-label="Usuários">
          {visible.map((user) => (
            <UserAdminCard
              key={user.id}
              user={user}
              canAssignGroups={canAssignGroups}
              isSelf={user.id === sessionUserId}
              busy={busyId === user.id}
              editing={editingId === user.id}
              draftGroups={draftGroups}
              onStartEdit={() => startEdit(user)}
              onCancelEdit={cancelEdit}
              onToggleGroup={toggleDraftGroup}
              onSaveGroups={async () => {
                const saved = await onSaveGroups(user.id, draftGroups);
                if (saved) cancelEdit();
              }}
              onVerify={() => onVerify(user.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

type UserAdminCardProps = {
  user: IUser;
  canAssignGroups: boolean;
  isSelf: boolean;
  busy: boolean;
  editing: boolean;
  draftGroups: EUserGroup[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onToggleGroup: (group: EUserGroup) => void;
  onSaveGroups: () => void | Promise<boolean | void>;
  onVerify: () => void;
};

function UserAdminCard({
  user,
  canAssignGroups,
  isSelf,
  busy,
  editing,
  draftGroups,
  onStartEdit,
  onCancelEdit,
  onToggleGroup,
  onSaveGroups,
  onVerify,
}: UserAdminCardProps) {
  const groups = user.groups ?? [];
  const createdAt = formatUserCreatedAt(user.createdAt);
  const blocked = user.status === 'BLOCKED';
  const tone = userAvatarTone(user.id);

  return (
    <li
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-lg border border-border bg-surface p-6 max-[640px]:grid-cols-1',
        blocked &&
          'border-[color-mix(in_srgb,var(--color-danger)_35%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-danger)_5%,var(--color-surface))]',
      )}
    >
      <span
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded font-display text-[0.9rem] font-extrabold tracking-wide',
          AVATAR_TONES[tone],
        )}
        aria-hidden="true"
      >
        {userInitials(user.fullName)}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="m-0 font-display text-[1.15rem] font-bold tracking-[-0.02em]">
            {user.fullName}
          </h2>
          {isSelf ? (
            <span className="inline-flex min-h-7 items-center rounded-sm bg-accent-soft px-[0.55rem] py-[0.15rem] text-[0.75rem] font-bold tracking-wide text-accent-hover">
              Sua conta
            </span>
          ) : null}
        </div>
        <p className="my-[0.15rem] mb-3 text-[0.95rem] text-muted">{user.email}</p>

        <ul className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
          <li>
            <span
              className={cn(
                'inline-flex min-h-7 items-center rounded-sm px-[0.55rem] py-[0.15rem] text-[0.75rem] font-bold tracking-wide',
                statusPillClass(user.status),
              )}
            >
              {userStatusLabel(user.status)}
            </span>
          </li>
          <li>
            <span
              className={cn(
                'inline-flex min-h-7 items-center rounded-sm px-[0.55rem] py-[0.15rem] text-[0.75rem] font-bold tracking-wide',
                user.verified
                  ? 'bg-[#eef4ff] text-[#245bdb]'
                  : 'bg-surface-muted text-muted',
              )}
            >
              {user.verified ? 'Identidade verificada' : 'Identidade pendente'}
            </span>
          </li>
          {groups.length === 0 ? (
            <li>
              <span className="inline-flex min-h-7 items-center rounded-sm bg-surface-muted px-[0.55rem] py-[0.15rem] text-[0.75rem] font-bold tracking-wide text-muted">
                Sem grupo
              </span>
            </li>
          ) : (
            groups.map((group) => (
              <li key={group}>
                <span
                  className="inline-flex min-h-7 items-center rounded-sm bg-surface-muted px-[0.55rem] py-[0.15rem] text-[0.75rem] font-bold tracking-wide"
                  title={group}
                >
                  {userGroupLabel(group)}
                </span>
              </li>
            ))
          )}
        </ul>

        <p className="m-0 text-[0.85rem] text-muted">
          {user.phoneVerified ? 'Telefone verificado' : 'Telefone não verificado'}
          {createdAt ? ` · desde ${createdAt}` : null}
        </p>

        {blocked ? (
          <p className="mt-3 mb-0 text-[0.875rem] text-muted">
            Conta bloqueada: o login recusa a autenticação. Não há reativação neste contrato HTTP.
          </p>
        ) : null}

        {editing ? (
          <fieldset className="mt-4 min-w-0 rounded border border-border p-4">
            <legend className="px-2 font-bold">Grupos HTTP</legend>
            <p className="m-0 text-[0.85rem] text-muted">
              SYSTEM não é atribuível. Auto-escalada da própria conta é recusada.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {USER_GROUP_OPTIONS.map((group) => (
                <label key={group.value} className="flex min-h-11 items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-[0.2rem] h-[1.15rem] w-[1.15rem]"
                    checked={draftGroups.includes(group.value)}
                    onChange={() => onToggleGroup(group.value)}
                  />
                  <span>
                    {group.label}{' '}
                    <span className="text-[0.85rem] text-muted">({group.hint})</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button loading={busy} onClick={() => void onSaveGroups()}>
                Salvar grupos
              </Button>
              <Button variant="ghost" onClick={onCancelEdit}>
                Cancelar
              </Button>
            </div>
          </fieldset>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {canAssignGroups && !isSelf ? (
              <Button variant="ghost" onClick={onStartEdit}>
                Alterar grupos
              </Button>
            ) : null}
            {canAssignGroups && isSelf ? (
              <p className="mt-3 mb-0 text-[0.875rem] text-muted">
                Grupos da própria conta não são auto-escaláveis.
              </p>
            ) : null}
            {!user.verified ? (
              <Button variant="ghost" loading={busy} onClick={onVerify}>
                Verificar identidade
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </li>
  );
}

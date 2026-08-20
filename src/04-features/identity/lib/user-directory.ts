import { EUserGroup, EUserStatus, type IUser } from '@entities/user/model';

export type UserStatusFilter = 'all' | EUserStatus;
export type UserVerifiedFilter = 'all' | 'verified' | 'unverified';
export type UserGroupFilter = 'all' | EUserGroup | 'ops';

export type UserDirectoryFilters = {
  query: string;
  status: UserStatusFilter;
  verified: UserVerifiedFilter;
  group: UserGroupFilter;
};

export const EMPTY_USER_DIRECTORY_FILTERS: UserDirectoryFilters = {
  query: '',
  status: 'all',
  verified: 'all',
  group: 'all',
};

export const USER_GROUP_OPTIONS: { value: EUserGroup; label: string; hint: string }[] = [
  { value: EUserGroup.APP_USER, label: 'Membro', hint: 'app-user' },
  { value: EUserGroup.PARTNER, label: 'Parceiro', hint: 'partner' },
  { value: EUserGroup.BACKOFFICE, label: 'Backoffice', hint: 'backoffice' },
  { value: EUserGroup.ADMIN, label: 'Admin', hint: 'admin' },
];

export const USER_STATUS_OPTIONS: { value: UserStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos os status' },
  { value: EUserStatus.ACTIVE, label: 'Ativas' },
  { value: EUserStatus.BLOCKED, label: 'Bloqueadas' },
  { value: EUserStatus.PENDING_VERIFICATION, label: 'Cadastro pendente' },
];

export const USER_VERIFIED_OPTIONS: { value: UserVerifiedFilter; label: string }[] = [
  { value: 'all', label: 'Toda identidade' },
  { value: 'verified', label: 'Identidade verificada' },
  { value: 'unverified', label: 'Identidade pendente' },
];

export const USER_GROUP_FILTER_OPTIONS: { value: UserGroupFilter; label: string }[] = [
  { value: 'all', label: 'Todos os grupos' },
  ...USER_GROUP_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
];

const GROUP_LABEL: Record<EUserGroup, string> = {
  [EUserGroup.APP_USER]: 'Membro',
  [EUserGroup.PARTNER]: 'Parceiro',
  [EUserGroup.BACKOFFICE]: 'Backoffice',
  [EUserGroup.ADMIN]: 'Admin',
};

const STATUS_LABEL: Record<EUserStatus, string> = {
  [EUserStatus.ACTIVE]: 'Ativa',
  [EUserStatus.BLOCKED]: 'Bloqueada',
  [EUserStatus.PENDING_VERIFICATION]: 'Cadastro pendente',
};

export type UserDirectoryStats = {
  total: number;
  unverified: number;
  blocked: number;
  pendingAccount: number;
  operators: number;
};

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function userGroupLabel(group: string): string {
  return GROUP_LABEL[group as EUserGroup] ?? group;
}

export function userStatusLabel(status: string): string {
  return STATUS_LABEL[status as EUserStatus] ?? status;
}

export function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export function userAvatarTone(seed: string, modulo = 4): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo > 0 ? hash % modulo : 0;
}

export function formatUserCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function summarizeUsers(users: IUser[]): UserDirectoryStats {
  return users.reduce<UserDirectoryStats>(
    (stats, user) => {
      stats.total += 1;
      if (!user.verified) stats.unverified += 1;
      if (user.status === EUserStatus.BLOCKED) stats.blocked += 1;
      if (user.status === EUserStatus.PENDING_VERIFICATION) stats.pendingAccount += 1;
      if (
        user.groups?.includes(EUserGroup.BACKOFFICE) ||
        user.groups?.includes(EUserGroup.ADMIN)
      ) {
        stats.operators += 1;
      }
      return stats;
    },
    { total: 0, unverified: 0, blocked: 0, pendingAccount: 0, operators: 0 },
  );
}

export function hasActiveUserFilters(filters: UserDirectoryFilters): boolean {
  return (
    fold(filters.query) !== '' ||
    filters.status !== 'all' ||
    filters.verified !== 'all' ||
    filters.group !== 'all'
  );
}

function matchesQuery(user: IUser, query: string): boolean {
  const needle = fold(query);
  if (!needle) return true;
  return fold(`${user.fullName} ${user.email}`).includes(needle);
}

function matchesGroup(user: IUser, group: UserGroupFilter): boolean {
  if (group === 'all') return true;
  if (group === 'ops') {
    return Boolean(
      user.groups?.includes(EUserGroup.BACKOFFICE) || user.groups?.includes(EUserGroup.ADMIN),
    );
  }
  return Boolean(user.groups?.includes(group));
}

function attentionRank(user: IUser): number {
  if (user.status === EUserStatus.BLOCKED) return 0;
  if (user.status === EUserStatus.PENDING_VERIFICATION) return 1;
  if (!user.verified) return 2;
  return 3;
}

export function filterUsers(users: IUser[], filters: UserDirectoryFilters): IUser[] {
  return users
    .filter((user) => {
      if (!matchesQuery(user, filters.query)) return false;
      if (filters.status !== 'all' && user.status !== filters.status) return false;
      if (filters.verified === 'verified' && !user.verified) return false;
      if (filters.verified === 'unverified' && user.verified) return false;
      if (!matchesGroup(user, filters.group)) return false;
      return true;
    })
    .sort((left, right) => {
      const rank = attentionRank(left) - attentionRank(right);
      if (rank !== 0) return rank;
      return left.fullName.localeCompare(right.fullName, 'pt-BR');
    });
}

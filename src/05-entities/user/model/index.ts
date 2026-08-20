export const EUserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const;

export type EUserStatus = (typeof EUserStatus)[keyof typeof EUserStatus];

/**
 * HTTP-assignable groups carried in the JWT. `SYSTEM` is never assignable over
 * HTTP and never appears in a public User.
 */
export const EUserGroup = {
  APP_USER: 'app-user',
  PARTNER: 'partner',
  BACKOFFICE: 'backoffice',
  ADMIN: 'admin',
} as const;

export type EUserGroup = (typeof EUserGroup)[keyof typeof EUserGroup];

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  verified: boolean;
  phoneVerified: boolean;
  status: EUserStatus;
  createdAt: string;
  updatedAt?: string;
  /** Empty when unset. Never includes SYSTEM. */
  groups?: EUserGroup[];
}

/** `POST /users` — ADMIN only, has no password (public sign-up is POST /auth/register). */
export type INewUser = Omit<
  IUser,
  'createdAt' | 'updatedAt' | 'verified' | 'phoneVerified' | 'status' | 'groups'
> & {
  verified?: boolean;
  phoneVerified?: boolean;
  status?: EUserStatus;
};

/**
 * `PUT /users/{id}` — owner identity fields only. `verified`, `phoneVerified`,
 * `status` and `groups` are deliberately absent: the server ignores them even
 * if the client sends them (see POST /users/{id}/verify and PUT /users/{id}/groups).
 */
export interface IUpdateUser {
  fullName?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
}

/** `PUT /users/{id}/groups` — ADMIN only. */
export interface IUpdateUserGroups {
  groups: EUserGroup[];
}

export function hasGroup(user: IUser | null | undefined, group: EUserGroup): boolean {
  return Boolean(user?.groups?.includes(group));
}

/** Backoffice or admin — the operational gate (publish, approve, revoke, taxonomy). */
export function isBackoffice(user: IUser | null | undefined): boolean {
  return hasGroup(user, EUserGroup.BACKOFFICE) || hasGroup(user, EUserGroup.ADMIN);
}

export function isAdmin(user: IUser | null | undefined): boolean {
  return hasGroup(user, EUserGroup.ADMIN);
}

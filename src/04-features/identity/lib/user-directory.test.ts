import { aUser } from '@shared/lib/testing/fixtures';
import { EUserGroup, EUserStatus } from '@entities/user/model';
import {
  EMPTY_USER_DIRECTORY_FILTERS,
  filterUsers,
  hasActiveUserFilters,
  summarizeUsers,
  userGroupLabel,
  userInitials,
  userStatusLabel,
} from './user-directory';

const carlos = aUser({
  id: 'user-carlos',
  fullName: 'Carlos Silva',
  email: 'carlos@example.com',
  verified: false,
  status: EUserStatus.ACTIVE,
  groups: [EUserGroup.APP_USER],
});

const camila = aUser({
  id: 'user-camila',
  fullName: 'Camila Rocha',
  email: 'camila@example.com',
  verified: true,
  status: EUserStatus.ACTIVE,
  groups: [EUserGroup.BACKOFFICE, EUserGroup.ADMIN],
});

const rafael = aUser({
  id: 'user-rafael',
  fullName: 'Rafael Gomes',
  email: 'rafael@example.com',
  verified: true,
  status: EUserStatus.BLOCKED,
  groups: [EUserGroup.APP_USER],
});

const mariana = aUser({
  id: 'user-mariana',
  fullName: 'Mariana Costa',
  email: 'mariana@example.com',
  verified: false,
  status: EUserStatus.PENDING_VERIFICATION,
  groups: [EUserGroup.APP_USER],
});

const users = [carlos, camila, rafael, mariana];

describe('user-directory', () => {
  it('labels groups and status without exposing listing seals', () => {
    expect(userGroupLabel(EUserGroup.APP_USER)).toBe('Membro');
    expect(userGroupLabel(EUserGroup.BACKOFFICE)).toBe('Backoffice');
    expect(userStatusLabel(EUserStatus.BLOCKED)).toBe('Bloqueada');
    expect(userInitials('Camila Rocha')).toBe('CR');
  });

  it('summarizes operational counts from the full list', () => {
    expect(summarizeUsers(users)).toEqual({
      total: 4,
      unverified: 2,
      blocked: 1,
      pendingAccount: 1,
      operators: 1,
    });
  });

  it('filters by name or email ignoring accents', () => {
    const found = filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, query: 'CAMILA' });
    expect(found.map((user) => user.id)).toEqual(['user-camila']);

    const byEmail = filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, query: 'rafael@' });
    expect(byEmail.map((user) => user.id)).toEqual(['user-rafael']);
  });

  it('filters by status, identity and group', () => {
    expect(
      filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, status: EUserStatus.BLOCKED }).map(
        (user) => user.id,
      ),
    ).toEqual(['user-rafael']);

    expect(
      filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, verified: 'verified' }).map(
        (user) => user.id,
      ),
    ).toEqual(['user-rafael', 'user-camila']);

    expect(
      filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, group: EUserGroup.ADMIN }).map(
        (user) => user.id,
      ),
    ).toEqual(['user-camila']);

    expect(
      filterUsers(users, { ...EMPTY_USER_DIRECTORY_FILTERS, group: 'ops' }).map((user) => user.id),
    ).toEqual(['user-camila']);
  });

  it('puts blocked and pending accounts ahead of verified active members', () => {
    const ordered = filterUsers(users, EMPTY_USER_DIRECTORY_FILTERS).map((user) => user.id);
    expect(ordered[0]).toBe('user-rafael');
    expect(ordered[1]).toBe('user-mariana');
    expect(ordered).toContain('user-carlos');
    expect(ordered).toContain('user-camila');
  });

  it('detects active filters including a search query', () => {
    expect(hasActiveUserFilters(EMPTY_USER_DIRECTORY_FILTERS)).toBe(false);
    expect(
      hasActiveUserFilters({ ...EMPTY_USER_DIRECTORY_FILTERS, query: '  ana  ' }),
    ).toBe(true);
    expect(
      hasActiveUserFilters({ ...EMPTY_USER_DIRECTORY_FILTERS, group: EUserGroup.PARTNER }),
    ).toBe(true);
  });
});

import { ApiError } from '@shared/lib/http';
import { describeAuthError, isForbidden, isSessionExpired } from './auth-error-copy';

function apiError(status: number, code?: string, message = 'qualquer texto') {
  return new ApiError({ message, kind: 'translated', status, code });
}

describe('describeAuthError', () => {
  it('gives register duplicates and invalid payloads the same copy', () => {
    const duplicate = describeAuthError(apiError(400, 'FIELD_INVALID'), 'register');
    const invalid = describeAuthError(apiError(400), 'register');

    expect(duplicate).toBe(invalid);
    expect(duplicate).not.toMatch(/e-?mail já/i);
  });

  it('uses one copy for every login rejection', () => {
    expect(describeAuthError(apiError(401, 'AUTH_INVALID_CREDENTIALS'), 'login')).toBe(
      'E-mail ou senha inválidos.',
    );
    expect(describeAuthError(apiError(401), 'login')).toBe('E-mail ou senha inválidos.');
  });

  it('branches on the stable code, not on the server message', () => {
    expect(describeAuthError(apiError(400, 'USER_UNDERAGE', 'whatever'), 'register')).toContain(
      'idade mínima',
    );
  });

  it('keeps the throttle copy free of any identifier', () => {
    const copy = describeAuthError(
      new ApiError({ message: 'Too many requests', kind: 'error', status: 429 }),
      'login',
    );

    expect(copy).toMatch(/aguarde/i);
    expect(copy).not.toContain('@');
  });

  it('separates 403 from 401 so a permission error never reads as a dead session', () => {
    expect(describeAuthError(apiError(403), 'session')).toBe(
      'Você não tem permissão para esta ação.',
    );
    expect(isForbidden(apiError(403))).toBe(true);
    expect(isSessionExpired(apiError(403))).toBe(false);
    expect(isSessionExpired(apiError(401))).toBe(true);
  });

  it('falls back to a network copy when the API is unreachable', () => {
    const copy = describeAuthError(
      new ApiError({ message: 'Falha de rede', kind: 'network' }),
      'login',
    );

    expect(copy).toMatch(/conexão/i);
  });
});

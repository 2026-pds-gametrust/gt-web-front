import { clearSession, getSession } from '@shared/lib/http';
import { installHttpStub, type IHttpStub } from '@shared/lib/testing/http-stub';
import { aSession, aUser } from '@shared/lib/testing/fixtures';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../model/use-auth-store';

const CREDENTIALS = { email: 'carlos@example.com', password: 'uma-senha-forte' };

let stub: IHttpStub;

function resetStore(): void {
  clearSession();
  useAuthStore.setState({ user: null, status: 'idle', error: null });
}

describe('auth flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetStore();
    stub = installHttpStub();
  });

  afterEach(() => {
    stub.restore();
  });

  it('logs in and persists both tokens plus the actor id', async () => {
    stub.setRoutes({ 'POST /auth/login': [200, aSession()] });

    const ok = await useAuthStore.getState().login(CREDENTIALS);

    expect(ok).toBe(true);
    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(getSession()).toEqual({
      accessToken: 'jwt-access-1',
      refreshToken: 'rt-1',
      userId: 'user-carlos-1',
    });
    // Credentials travel in the body; login carries no Bearer header.
    expect(stub.calls[0]?.authorization).toBeUndefined();
    expect(stub.calls[0]?.body).toEqual(CREDENTIALS);
  });

  it('answers a wrong password with the same generic copy as an unknown e-mail', async () => {
    const rejection: [number, unknown] = [
      401,
      { error: 'Invalid credentials', code: 'AUTH_INVALID_CREDENTIALS' },
    ];
    stub.setRoutes({ 'POST /auth/login': rejection });

    const wrongPassword = await useAuthStore.getState().login(CREDENTIALS);
    const wrongPasswordCopy = useAuthStore.getState().error;

    resetStore();

    const unknownEmail = await useAuthStore
      .getState()
      .login({ email: 'ninguem@example.com', password: 'errada' });

    expect(wrongPassword).toBe(false);
    expect(unknownEmail).toBe(false);
    expect(wrongPasswordCopy).toBe('E-mail ou senha inválidos.');
    expect(useAuthStore.getState().error).toBe(wrongPasswordCopy);
    expect(getSession()).toBeNull();
  });

  it('does not reveal that an e-mail is already taken', async () => {
    stub.setRoutes({
      'POST /auth/register': [
        400,
        { error: 'Invalid field', code: 'FIELD_INVALID' },
      ],
    });

    const ok = await useAuthStore.getState().register({
      id: 'user-duplicate-1',
      fullName: 'Outro Carlos',
      email: 'carlos@example.com',
      phone: '11988888888',
      cpf: '98765432100',
      birthDate: '1991-02-02',
      password: 'outra-senha',
    });

    expect(ok).toBe(false);
    expect(useAuthStore.getState().error).toBe(
      'Não foi possível criar a conta com esses dados. Revise os campos e tente de novo.',
    );
  });

  it('blocks an underage sign-up with its own copy', async () => {
    stub.setRoutes({
      'POST /auth/register': [400, { error: 'Underage', code: 'USER_UNDERAGE' }],
    });

    const ok = await useAuthStore.getState().register({
      id: 'user-teen-1',
      fullName: 'Menor de Idade',
      email: 'teen@example.com',
      phone: '11977777777',
      cpf: '11122233344',
      birthDate: '2015-01-01',
      password: 'senha-teen',
    });

    expect(ok).toBe(false);
    expect(useAuthStore.getState().error).toContain('idade mínima');
  });

  it('keeps the throttle copy free of identifiers', async () => {
    stub.setRoutes({
      'POST /auth/login': [429, { message: 'Too many requests, please try again later.' }],
    });

    await useAuthStore.getState().login(CREDENTIALS);

    const copy = useAuthStore.getState().error ?? '';
    expect(copy).toMatch(/aguarde/i);
    expect(copy).not.toContain(CREDENTIALS.email);
  });

  it('clears the local session on logout even though 204 has no body', async () => {
    stub.setRoutes({
      'POST /auth/login': [200, aSession()],
      'POST /auth/logout': [204],
    });

    await useAuthStore.getState().login(CREDENTIALS);
    await useAuthStore.getState().logout();

    expect(getSession()).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().status).toBe('anonymous');
  });

  it('sends the opaque refresh token in the body, never as a header', async () => {
    stub.setRoutes({
      'POST /auth/login': [200, aSession()],
      'POST /auth/refresh': [
        200,
        aSession({ accessToken: 'jwt-access-2', refreshToken: 'rt-2' }),
      ],
    });

    await useAuthStore.getState().login(CREDENTIALS);
    const rotated = await authApi.refresh();

    const refreshCall = stub.callsFor('POST /auth/refresh')[0];
    expect(refreshCall?.body).toEqual({ refreshToken: 'rt-1' });
    expect(refreshCall?.authorization).toBeUndefined();
    expect(rotated.refreshToken).toBe('rt-2');
  });

  it('hydrates from persisted tokens at boot', async () => {
    stub.setRoutes({
      'POST /auth/login': [200, aSession()],
      'GET /auth/me': [200, aUser()],
    });

    await useAuthStore.getState().login(CREDENTIALS);
    useAuthStore.setState({ user: null, status: 'idle' });

    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().user?.id).toBe('user-carlos-1');
    expect(stub.callsFor('GET /auth/me')[0]?.authorization).toBe('Bearer jwt-access-1');
  });

  it('drops the session at boot when the stored token is dead', async () => {
    stub.setRoutes({
      'POST /auth/login': [200, aSession()],
      'GET /auth/me': [404, { error: 'Not found', code: 'RESOURCE_NOT_FOUND' }],
    });

    await useAuthStore.getState().login(CREDENTIALS);
    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(getSession()).toBeNull();
  });

  it('stays anonymous at boot when there is no session', async () => {
    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(useAuthStore.getState().user).toBeNull();
  });
});

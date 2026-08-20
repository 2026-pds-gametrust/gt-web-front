import {
  SESSION_STORAGE_KEY,
  clearSession,
  getActorId,
  getSession,
  getSessionAccessToken,
  getSessionRefreshToken,
  hasSession,
  resetSessionCache,
  setSession,
  subscribeSession,
} from './session-store';

const session = {
  accessToken: 'jwt-access',
  refreshToken: 'rt-opaque',
  userId: 'user-carlos-1',
};

describe('session-store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetSessionCache();
  });

  it('persists both tokens and the actor id', () => {
    setSession(session);

    expect(getSessionAccessToken()).toBe('jwt-access');
    expect(getSessionRefreshToken()).toBe('rt-opaque');
    expect(getActorId()).toBe('user-carlos-1');
    expect(hasSession()).toBe(true);
  });

  it('rehydrates from storage in a fresh tab', () => {
    setSession(session);
    resetSessionCache();

    expect(getSession()).toEqual(session);
  });

  it('clears tokens from memory and storage on logout', () => {
    setSession(session);
    clearSession();

    expect(getSession()).toBeNull();
    expect(hasSession()).toBe(false);
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('ignores a malformed persisted payload instead of trusting it', () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, '{"accessToken":"only-half"}');
    resetSessionCache();

    expect(getSession()).toBeNull();
  });

  it('notifies subscribers on set and clear', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);

    setSession(session);
    clearSession();
    unsubscribe();
    setSession(session);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, session);
    expect(listener).toHaveBeenNthCalledWith(2, null);
  });
});

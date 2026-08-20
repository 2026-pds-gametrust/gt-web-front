import { create } from 'zustand';
import {
  clearSession,
  getDevAccessToken,
  getSession,
  setSession,
  setUnauthorizedHandler,
} from '@shared/lib/http';
import type { IAuthSession, IAuthLogin, INewAuthRegistration } from '@entities/auth-session/model';
import type { IUser } from '@entities/user/model';
import { isBackoffice } from '@entities/user/model';
import { authApi } from '../api/auth-api';
import { describeAuthError } from '../lib/auth-error-copy';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

type AuthState = {
  user: IUser | null;
  status: AuthStatus;
  error: string | null;
  /** Hydrates from the persisted tokens — call once at app boot. */
  bootstrap: () => Promise<void>;
  register: (input: INewAuthRegistration) => Promise<boolean>;
  login: (input: IAuthLogin) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: () => boolean;
  /** Group gate for operational screens (publish, moderation queue). */
  canOperate: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => {
  function persist(session: IAuthSession): void {
    setSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.user.id,
    });
    set({ user: session.user, status: 'authenticated', error: null });
  }

  function drop(): void {
    clearSession();
    set({ user: null, status: 'anonymous' });
  }

  // The interceptor calls this when a refresh could not save the session.
  setUnauthorizedHandler(() => {
    set({ user: null, status: 'anonymous' });
  });

  return {
    user: null,
    status: 'idle',
    error: null,

    async bootstrap() {
      // VITE_DEV_ACCESS_TOKEN is a hand-pasted JWT for local work: it can
      // hydrate a session but never rotate one, having no refresh token.
      if (!getSession() && !getDevAccessToken()) {
        set({ status: 'anonymous', user: null });
        return;
      }

      set({ status: 'loading' });
      try {
        const user = await authApi.me();
        set({ user, status: 'authenticated', error: null });
      } catch (err) {
        // 401 (expired/revoked) and 404 (user removed) both end in local logout.
        drop();
        set({ error: describeAuthError(err, 'session') });
      }
    },

    async register(input) {
      set({ status: 'loading', error: null });
      try {
        persist(await authApi.register(input));
        return true;
      } catch (err) {
        set({ status: 'anonymous', error: describeAuthError(err, 'register') });
        return false;
      }
    },

    async login(input) {
      set({ status: 'loading', error: null });
      try {
        persist(await authApi.login(input));
        return true;
      } catch (err) {
        set({ status: 'anonymous', error: describeAuthError(err, 'login') });
        return false;
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } finally {
        // Even a failed call must not strand tokens in this browser.
        drop();
      }
    },

    clearError() {
      set({ error: null });
    },

    isAuthenticated() {
      return get().status === 'authenticated' && get().user !== null;
    },

    canOperate() {
      return isBackoffice(get().user);
    },
  };
});

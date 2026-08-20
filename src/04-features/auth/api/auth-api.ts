import { getSessionRefreshToken, httpClient } from '@shared/lib/http';
import type {
  IAuthLogin,
  IAuthSession,
  INewAuthRegistration,
} from '@entities/auth-session/model';
import type { IUser } from '@entities/user/model';

/**
 * The five session endpoints. Persistence is the store's job — this slice only
 * speaks HTTP so the token rules stay in one place:
 * `refreshToken` never leaves the body, `accessToken` never leaves the header.
 */
export const authApi = {
  /** `POST /auth/register` → 201. Public sign-up (not ADMIN `POST /users`). */
  async register(input: INewAuthRegistration): Promise<IAuthSession> {
    const { data } = await httpClient.post<IAuthSession>('/auth/register', input);
    return data;
  },

  /** `POST /auth/login` → 200. */
  async login(input: IAuthLogin): Promise<IAuthSession> {
    const { data } = await httpClient.post<IAuthSession>('/auth/login', input);
    return data;
  },

  /**
   * `POST /auth/refresh` → 200 with a rotated pair. The old refresh token is
   * dead on arrival of this response: reusing it tears down the session family.
   */
  async refresh(refreshToken = getSessionRefreshToken()): Promise<IAuthSession> {
    if (!refreshToken) {
      throw new Error('Sem refresh token nesta sessão');
    }
    const { data } = await httpClient.post<IAuthSession>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  /** `POST /auth/logout` → 204 with no body. */
  async logout(): Promise<void> {
    // 204: nothing to parse, so the response body is deliberately ignored.
    await httpClient.post('/auth/logout');
  },

  /** `GET /auth/me` → 200 public User. Used to hydrate the session at boot. */
  async me(): Promise<IUser> {
    const { data } = await httpClient.get<IUser>('/auth/me');
    return data;
  },
};

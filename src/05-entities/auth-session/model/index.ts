import type { IUser } from '@entities/user/model';

/**
 * Session issued by POST /auth/register (201), POST /auth/login (200) and
 * POST /auth/refresh (200).
 *
 * - `accessToken` is a JWT → header `Authorization: Bearer <accessToken>`.
 * - `refreshToken` is opaque → only ever travels in the POST /auth/refresh body.
 */
export interface IAuthSession {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

/** `POST /auth/register` — public sign-up. Not to be confused with ADMIN `POST /users`. */
export interface INewAuthRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  /** 11 digits, no punctuation. */
  cpf: string;
  /** YYYY-MM-DD */
  birthDate: string;
  password: string;
}

/** `POST /auth/login` */
export interface IAuthLogin {
  email: string;
  password: string;
}

/** `POST /auth/refresh` — the opaque refresh token, never the access JWT. */
export interface IAuthRefresh {
  refreshToken: string;
}

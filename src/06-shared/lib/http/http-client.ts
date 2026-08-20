import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { mapAxiosErrorToApiError } from './api-error';
import { getDevAccessToken } from './dev-session';
import {
  clearSession,
  getSession,
  getSessionAccessToken,
  setSession,
} from './session-store';

function resolveApiBaseUrl(): string {
  try {
    const fromEnv = import.meta.env?.VITE_API_BASE_URL;
    if (typeof fromEnv === 'string' && fromEnv.length > 0) {
      return fromEnv;
    }
  } catch {
    // Jest / non-Vite runtimes may not expose import.meta.env
  }
  return 'http://localhost:3000';
}

export const API_BASE_URL = resolveApiBaseUrl();

/** Encodes query values with `%20` — OpenAPI validation rejects literal `+` in `q`. */
export function serializeQueryParams(params: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.join('&');
}

/**
 * `security: []` in the OpenAPI contract: these carry credentials in the body,
 * never a Bearer header — and a 401 from them is an answer, not a stale token.
 */
export const AUTH_PUBLIC_PATHS = ['/auth/register', '/auth/login', '/auth/refresh'];

export const REFRESH_PATH = '/auth/refresh';

type RetriableConfig = InternalAxiosRequestConfig & { gtRetried?: boolean };

/** Minimal structural view of AuthSession — shared must stay free of domain models. */
interface IRefreshedSession {
  user: { id: string };
  accessToken: string;
  refreshToken: string;
}

function pathOf(url: string | undefined): string {
  if (!url) return '';
  const withoutOrigin = url.startsWith('http')
    ? url.replace(/^https?:\/\/[^/]+/, '')
    : url;
  return withoutOrigin.split('?')[0] ?? '';
}

function isAuthPublicPath(url: string | undefined): boolean {
  const path = pathOf(url);
  return AUTH_PUBLIC_PATHS.some((publicPath) => path.endsWith(publicPath));
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
  paramsSerializer: serializeQueryParams,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isAuthPublicPath(config.url)) {
    // Refresh must not carry the access JWT; login/register have no actor yet.
    config.headers.delete('Authorization');
    return config;
  }

  const token = getSessionAccessToken() ?? getDevAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let onUnauthorized: (() => void) | undefined;

/**
 * Called once the session is unrecoverable (refresh missing, expired, revoked
 * or reused). The app layer wires this to "clear state and go to login".
 */
export function setUnauthorizedHandler(handler: (() => void) | undefined): void {
  onUnauthorized = handler;
}

let inFlightRefresh: Promise<string | null> | null = null;

/**
 * Rotates the refresh token exactly once per burst: concurrent 401s share the
 * same promise so the family is not torn down by a self-inflicted reuse.
 */
async function refreshSession(): Promise<string | null> {
  const session = getSession();
  if (!session?.refreshToken) return null;

  try {
    const { data } = await axios.post<IRefreshedSession>(
      `${API_BASE_URL}${REFRESH_PATH}`,
      { refreshToken: session.refreshToken },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
    );

    if (!data?.accessToken || !data?.refreshToken) return null;

    setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.user?.id ?? session.userId,
    });
    return data.accessToken;
  } catch {
    // 401 (unknown/expired/revoked/reuse/BLOCKED) or 429 — both end the session.
    return null;
  }
}

function ensureRefresh(): Promise<string | null> {
  inFlightRefresh ??= refreshSession().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // 403 is "logged in, not allowed" and 400/429 are answers — never retried.
    const isRetriable401 =
      status === 401 &&
      config !== undefined &&
      config.gtRetried !== true &&
      !isAuthPublicPath(config.url) &&
      getSession() !== null;

    if (!isRetriable401) {
      return Promise.reject(mapAxiosErrorToApiError(error));
    }

    const accessToken = await ensureRefresh();

    if (!accessToken) {
      clearSession();
      onUnauthorized?.();
      return Promise.reject(mapAxiosErrorToApiError(error));
    }

    config.gtRetried = true;
    return httpClient.request(config);
  },
);

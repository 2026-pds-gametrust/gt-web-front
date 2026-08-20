/**
 * Token holder for the web channel.
 *
 * Two tokens, two very different lifecycles:
 * - `accessToken` (JWT) goes in the `Authorization: Bearer` header.
 * - `refreshToken` is opaque, rotates on every use and only ever travels in the
 *   body of POST /auth/refresh — never in a header.
 *
 * Infrastructure only: no business rules live here, so `http-client` can read
 * tokens without importing a feature.
 */

export const SESSION_STORAGE_KEY = 'gametrust.session';

export interface IStoredSession {
  accessToken: string;
  refreshToken: string;
  /** JWT `sub` — the actor. Mirrored here so callers never re-derive identity. */
  userId: string;
}

type SessionListener = (session: IStoredSession | null) => void;

let currentSession: IStoredSession | null = null;
let hydrated = false;
const listeners = new Set<SessionListener>();

function safeStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : null;
  } catch {
    // Private mode / blocked storage — session stays in memory only.
    return null;
  }
}

function isStoredSession(value: unknown): value is IStoredSession {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.userId === 'string'
  );
}

function readPersisted(): IStoredSession | null {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persist(session: IStoredSession | null): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    if (session) {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      storage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Quota or blocked storage: memory copy still serves this tab.
  }
}

function emit(session: IStoredSession | null): void {
  listeners.forEach((listener) => listener(session));
}

export function getSession(): IStoredSession | null {
  if (!hydrated) {
    currentSession = readPersisted();
    hydrated = true;
  }
  return currentSession;
}

export function setSession(session: IStoredSession): void {
  currentSession = session;
  hydrated = true;
  persist(session);
  emit(session);
}

export function clearSession(): void {
  currentSession = null;
  hydrated = true;
  persist(null);
  emit(null);
}

export function getSessionAccessToken(): string | undefined {
  return getSession()?.accessToken;
}

export function getSessionRefreshToken(): string | undefined {
  return getSession()?.refreshToken;
}

/** The authenticated actor id, or undefined when there is no session. */
export function getActorId(): string | undefined {
  return getSession()?.userId;
}

export function hasSession(): boolean {
  return getSession() !== null;
}

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test seam — drops the in-memory copy so the next read re-hydrates. */
export function resetSessionCache(): void {
  currentSession = null;
  hydrated = false;
}

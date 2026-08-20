function readEnv(key: string): string | undefined {
  try {
    const value = import.meta.env?.[key];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * A JWT pasted into `.env` for local work against a running backend. It has no
 * refresh token, so it can open a session but never rotate one — and it is
 * never a substitute for identity: the server still reads the actor from the
 * token it verifies.
 */
export function getDevAccessToken(): string | undefined {
  return readEnv('VITE_DEV_ACCESS_TOKEN');
}

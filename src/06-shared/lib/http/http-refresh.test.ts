import type { AxiosRequestConfig, AxiosStatic } from 'axios';

jest.mock('./dev-session', () => ({
  getDevAccessToken: jest.fn(() => undefined),
}));

type Loaded = typeof import('./http-client') &
  typeof import('./session-store') & {
    /** The isolated axios copy http-client itself uses for POST /auth/refresh. */
    axios: AxiosStatic;
  };

/**
 * Each test gets a fresh module registry so the interceptor's in-flight refresh
 * state never leaks between cases.
 */
async function loadHttp(): Promise<Loaded> {
  let loaded: Loaded | undefined;
  await jest.isolateModulesAsync(async () => {
    const axiosModule = await import('axios');
    const httpClientModule = await import('./http-client');
    const sessionModule = await import('./session-store');
    loaded = {
      ...httpClientModule,
      ...sessionModule,
      axios: axiosModule.default,
    };
  });
  return loaded as Loaded;
}

function unauthorized(config: AxiosRequestConfig) {
  return {
    isAxiosError: true,
    config,
    response: { status: 401, data: { error: 'Unauthorized', code: 'AUTH_UNAUTHORIZED' } },
    toJSON: () => ({}),
  };
}

function ok(config: AxiosRequestConfig) {
  return {
    data: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

describe('httpClient 401 handling', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('refreshes once and replays the original request with the new token', async () => {
    const http = await loadHttp();
    http.setSession({
      accessToken: 'stale-access',
      refreshToken: 'rt-1',
      userId: 'user-carlos-1',
    });

    const post = jest.spyOn(http.axios, 'post').mockResolvedValue({
      data: {
        user: { id: 'user-carlos-1' },
        accessToken: 'fresh-access',
        refreshToken: 'rt-2',
      },
    });

    const seen: string[] = [];
    http.httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
      const auth = String(
        (config.headers as { get?: (k: string) => unknown })?.get?.('Authorization') ?? '',
      );
      seen.push(auth);
      if (seen.length === 1) throw unauthorized(config);
      return ok(config);
    }) as never;

    await expect(http.httpClient.get('/favorites')).resolves.toMatchObject({
      data: { ok: true },
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0]?.[1]).toEqual({ refreshToken: 'rt-1' });
    expect(seen).toEqual(['Bearer stale-access', 'Bearer fresh-access']);
    // The rotated pair replaces the old one; the used refresh token is dropped.
    expect(http.getSession()).toEqual({
      accessToken: 'fresh-access',
      refreshToken: 'rt-2',
      userId: 'user-carlos-1',
    });
  });

  it('clears the session and calls the handler when the refresh is rejected', async () => {
    const http = await loadHttp();
    http.setSession({
      accessToken: 'stale-access',
      refreshToken: 'rt-dead',
      userId: 'user-carlos-1',
    });

    jest.spyOn(http.axios, 'post').mockRejectedValue(new Error('401'));
    const onUnauthorized = jest.fn();
    http.setUnauthorizedHandler(onUnauthorized);

    http.httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
      throw unauthorized(config);
    }) as never;

    await expect(http.httpClient.get('/favorites')).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
    });

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(http.getSession()).toBeNull();
  });

  it('does not retry a 403 — the user is logged in, just not allowed', async () => {
    const http = await loadHttp();
    http.setSession({ accessToken: 'a', refreshToken: 'r', userId: 'u' });

    const post = jest.spyOn(http.axios, 'post');
    let calls = 0;
    http.httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
      calls += 1;
      throw {
        isAxiosError: true,
        config,
        response: { status: 403, data: { error: 'Access denied' } },
        toJSON: () => ({}),
      };
    }) as never;

    await expect(http.httpClient.post('/listings/l-1/publish')).rejects.toMatchObject({
      status: 403,
    });

    expect(calls).toBe(1);
    expect(post).not.toHaveBeenCalled();
  });

  it('never attaches the access token to the public auth routes', async () => {
    const http = await loadHttp();
    http.setSession({ accessToken: 'a', refreshToken: 'r', userId: 'u' });

    const headers: unknown[] = [];
    http.httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
      headers.push(
        (config.headers as { get?: (k: string) => unknown })?.get?.('Authorization'),
      );
      return ok(config);
    }) as never;

    await http.httpClient.post('/auth/refresh', { refreshToken: 'r' });
    await http.httpClient.post('/auth/login', { email: 'a@b.c', password: 'x' });

    expect(headers).toEqual([undefined, undefined]);
  });

  it('shares one refresh across concurrent 401s', async () => {
    const http = await loadHttp();
    http.setSession({ accessToken: 'stale', refreshToken: 'rt-1', userId: 'u' });

    const post = jest.spyOn(http.axios, 'post').mockResolvedValue({
      data: { user: { id: 'u' }, accessToken: 'fresh', refreshToken: 'rt-2' },
    });

    const failed = new Set<string>();
    http.httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
      const url = config.url ?? '';
      if (!failed.has(url)) {
        failed.add(url);
        throw unauthorized(config);
      }
      return ok(config);
    }) as never;

    await Promise.all([
      http.httpClient.get('/favorites'),
      http.httpClient.get('/auth/me'),
      http.httpClient.get('/listings/l-1/events'),
    ]);

    // One rotation for the burst: rotating three times would look like reuse.
    expect(post).toHaveBeenCalledTimes(1);
  });
});

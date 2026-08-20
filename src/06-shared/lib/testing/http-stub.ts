import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { httpClient } from '../http/http-client';

/**
 * Test seam that answers at the axios adapter, not above it.
 *
 * Requests still go through the real interceptors, so tests exercise what
 * production exercises: the Bearer header, the 401 → refresh → replay path,
 * error mapping into ApiError, and 204s with no body.
 *
 * Routes are keyed `"<METHOD> <path>"` and may use `:param` segments:
 *   { 'GET /users/:id': [200, user] }
 */

export type StubReply = [status: number, body?: unknown];

export interface IStubCall {
  method: string;
  url: string;
  body: unknown;
  authorization?: string;
}

export type StubHandler = StubReply | ((call: IStubCall) => StubReply);

export type StubRoutes = Record<string, StubHandler>;

export interface IHttpStub {
  calls: IStubCall[];
  /** Calls recorded for a route key, e.g. `stub.callsFor('POST /favorites')`. */
  callsFor(route: string): IStubCall[];
  setRoutes(routes: StubRoutes): void;
  restore(): void;
}

function pathOf(url: string): string {
  const withoutOrigin = url.startsWith('http')
    ? url.replace(/^https?:\/\/[^/]+/, '')
    : url;
  return (withoutOrigin.split('?')[0] ?? '').replace(/\/+$/, '') || '/';
}

function matches(pattern: string, path: string): boolean {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every(
    (part, index) => part.startsWith(':') || part === pathParts[index],
  );
}

function parseBody(data: unknown): unknown {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

export function installHttpStub(initialRoutes: StubRoutes = {}): IHttpStub {
  const previousAdapter = httpClient.defaults.adapter;
  let routes = initialRoutes;
  const calls: IStubCall[] = [];
  const matchedRoute = new WeakMap<IStubCall, string>();

  httpClient.defaults.adapter = (async (config: AxiosRequestConfig) => {
    const method = (config.method ?? 'get').toUpperCase();
    const path = pathOf(config.url ?? '');
    const headers = config.headers as { get?: (key: string) => unknown } | undefined;
    const authorization = headers?.get?.('Authorization');

    const call: IStubCall = {
      method,
      url: path,
      body: parseBody(config.data),
      authorization: typeof authorization === 'string' ? authorization : undefined,
    };
    calls.push(call);

    const key = Object.keys(routes).find((route) => {
      const [routeMethod, routePath = ''] = route.split(' ');
      return routeMethod === method && matches(routePath, path);
    });

    if (!key) {
      throw Object.assign(new Error(`Unstubbed request: ${method} ${path}`), {
        isAxiosError: true,
        config,
        response: { status: 501, data: { error: `Unstubbed ${method} ${path}` } },
        toJSON: () => ({}),
      });
    }

    matchedRoute.set(call, key);
    const handler = routes[key] as StubHandler;
    const [status, body] = typeof handler === 'function' ? handler(call) : handler;

    if (status >= 200 && status < 300) {
      return {
        data: body,
        status,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    throw Object.assign(new Error(`HTTP ${status}`), {
      isAxiosError: true,
      config,
      response: { status, data: body },
      toJSON: () => ({}),
    });
  }) as never;

  return {
    calls,
    callsFor(route) {
      return calls.filter((call) => matchedRoute.get(call) === route);
    },
    setRoutes(next) {
      routes = next;
    },
    restore() {
      httpClient.defaults.adapter = previousAdapter;
    },
  };
}

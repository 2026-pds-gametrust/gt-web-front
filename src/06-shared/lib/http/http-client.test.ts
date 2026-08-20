import axios from 'axios';
import { API_BASE_URL, httpClient, serializeQueryParams } from './http-client';

jest.mock('./dev-session', () => ({
  getDevAccessToken: jest.fn(() => 'dev-token-123'),
}));

describe('httpClient', () => {
  it('exposes a configured axios instance', () => {
    expect(httpClient.defaults.baseURL).toBe(API_BASE_URL);
    expect(httpClient.defaults.timeout).toBe(15_000);
  });

  it('serializes query params with percent-encoded spaces', () => {
    expect(serializeQueryParams({ q: 'NVIDIA RTX 4090' })).toBe(
      'q=NVIDIA%20RTX%204090',
    );
  });

  it('attaches Bearer token on requests when env token is set', async () => {
    const adapter = jest.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }));

    httpClient.defaults.adapter = adapter as never;

    await httpClient.get('/health');

    expect(adapter).toHaveBeenCalled();
    const config = adapter.mock.calls[0][0];
    expect(config.headers.Authorization ?? config.headers.get?.('Authorization')).toBe(
      'Bearer dev-token-123',
    );
  });

  it('maps failed responses to ApiError', async () => {
    httpClient.defaults.adapter = (async () => {
      throw {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Not found', status: 404 },
        },
        config: {},
        toJSON: () => ({}),
      };
    }) as never;

    await expect(httpClient.get('/missing')).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'error',
      status: 404,
    });
  });
});

// Keep axios imported so adapter typing stays aligned in IDE
void axios;

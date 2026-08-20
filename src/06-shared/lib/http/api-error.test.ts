import { ApiError, mapAxiosErrorToApiError } from './api-error';

describe('mapAxiosErrorToApiError', () => {
  it('maps ValidationError payload', () => {
    const mapped = mapAxiosErrorToApiError({
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          status: 400,
          path: '/users',
          errors: [{ field: 'email', message: 'Email is required', value: '' }],
        },
      },
    });

    expect(mapped).toBeInstanceOf(ApiError);
    expect(mapped.kind).toBe('validation');
    expect(mapped.fieldErrors?.[0]?.field).toBe('email');
  });

  it('maps Error payload', () => {
    const mapped = mapAxiosErrorToApiError({
      response: {
        status: 404,
        data: {
          message: 'User not found',
          status: 404,
          path: '/users/123',
        },
      },
    });

    expect(mapped.kind).toBe('error');
    expect(mapped.status).toBe(404);
  });

  it('maps AuthMiddlewareError payload', () => {
    const mapped = mapAxiosErrorToApiError({
      response: {
        status: 403,
        data: { error: 'Missing x-user-groups header' },
      },
    });

    expect(mapped.kind).toBe('auth');
    expect(mapped.message).toBe('Missing x-user-groups header');
  });

  it('maps TranslatedApiError payload', () => {
    const mapped = mapAxiosErrorToApiError({
      response: {
        status: 404,
        data: { error: 'Não encontrado', code: 'RESOURCE_NOT_FOUND' },
      },
    });

    expect(mapped.kind).toBe('translated');
    expect(mapped.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('returns same ApiError instance', () => {
    const original = new ApiError({ message: 'x', kind: 'error', status: 500 });
    expect(mapAxiosErrorToApiError(original)).toBe(original);
  });
});

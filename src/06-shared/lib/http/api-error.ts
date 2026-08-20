export type ApiErrorKind =
  | 'error'
  | 'validation'
  | 'auth'
  | 'translated'
  | 'unknown'
  | 'network';

export interface IApiFieldError {
  field?: string;
  message: string;
  value?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly path?: string;
  readonly timestamp?: string;
  readonly fieldErrors?: IApiFieldError[];
  readonly contextInfo?: Record<string, unknown>;
  readonly raw?: unknown;

  constructor(params: {
    message: string;
    kind: ApiErrorKind;
    status?: number;
    code?: string;
    path?: string;
    timestamp?: string;
    fieldErrors?: IApiFieldError[];
    contextInfo?: Record<string, unknown>;
    raw?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.kind = params.kind;
    this.status = params.status;
    this.code = params.code;
    this.path = params.path;
    this.timestamp = params.timestamp;
    this.fieldErrors = params.fieldErrors;
    this.contextInfo = params.contextInfo;
    this.raw = params.raw;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function mapAxiosErrorToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!isRecord(error)) {
    return new ApiError({
      message: 'Erro desconhecido na API',
      kind: 'unknown',
      raw: error,
    });
  }

  const response = isRecord(error.response) ? error.response : undefined;
  const status =
    typeof response?.status === 'number'
      ? response.status
      : typeof error.status === 'number'
        ? error.status
        : undefined;
  const data = response?.data ?? error.data;

  if (!response && error.message === 'Network Error') {
    return new ApiError({
      message: 'Falha de rede ao falar com a API',
      kind: 'network',
      raw: error,
    });
  }

  if (!isRecord(data)) {
    const message =
      typeof error.message === 'string' ? error.message : 'Erro na requisição à API';
    return new ApiError({
      message,
      kind: 'unknown',
      status,
      raw: error,
    });
  }

  if (typeof data.message === 'string' && Array.isArray(data.errors)) {
    const fieldErrors: IApiFieldError[] = data.errors
      .filter(isRecord)
      .map((item) => ({
        field: typeof item.field === 'string' ? item.field : undefined,
        message: typeof item.message === 'string' ? item.message : 'Campo inválido',
        value: item.value,
      }));

    return new ApiError({
      message: data.message,
      kind: 'validation',
      status: typeof data.status === 'number' ? data.status : status,
      path: typeof data.path === 'string' ? data.path : undefined,
      timestamp: typeof data.timestamp === 'string' ? data.timestamp : undefined,
      fieldErrors,
      raw: data,
    });
  }

  if (typeof data.message === 'string' && typeof data.status === 'number') {
    return new ApiError({
      message: data.message,
      kind: 'error',
      status: data.status,
      path: typeof data.path === 'string' ? data.path : undefined,
      timestamp: typeof data.timestamp === 'string' ? data.timestamp : undefined,
      raw: data,
    });
  }

  if (typeof data.error === 'string' && typeof data.code === 'string') {
    return new ApiError({
      message: data.error,
      kind: 'translated',
      status,
      code: data.code,
      contextInfo: isRecord(data.contextInfo) ? data.contextInfo : undefined,
      raw: data,
    });
  }

  if (typeof data.error === 'string') {
    return new ApiError({
      message: data.error,
      kind: 'auth',
      status,
      raw: data,
    });
  }

  return new ApiError({
    message: typeof error.message === 'string' ? error.message : 'Erro na requisição à API',
    kind: 'unknown',
    status,
    raw: data,
  });
}

import { ApiError } from '@shared/lib/http';

export type AuthAction = 'register' | 'login' | 'refresh' | 'session';

const GENERIC = 'Não foi possível concluir agora. Tente novamente.';

/**
 * Copy is chosen by the stable `code` (or HTTP status), never by the message
 * text the API happened to return.
 *
 * Two rules the backend deliberately enforces and the UI must not undo:
 * a duplicate e-mail/CPF on register answers the very same generic 400 as a
 * malformed payload, and every login failure — unknown e-mail, wrong password,
 * BLOCKED user — answers the very same 401. Saying more would turn either
 * endpoint into an account oracle.
 */
export function describeAuthError(error: unknown, action: AuthAction): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error && error.message ? error.message : GENERIC;
  }

  if (error.kind === 'network') {
    return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.';
  }

  if (error.status === 429) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
  }

  switch (error.code) {
    case 'USER_UNDERAGE':
      return 'É preciso ter a idade mínima para criar uma conta no GamerTrust.';
    case 'AUTH_INVALID_CREDENTIALS':
      return 'E-mail ou senha inválidos.';
    case 'AUTH_UNAUTHORIZED':
      return 'Sua sessão expirou. Entre novamente.';
    case 'RESOURCE_NOT_FOUND':
      return 'Conta não encontrada.';
    default:
      break;
  }

  if (error.status === 400) {
    return action === 'register'
      ? 'Não foi possível criar a conta com esses dados. Revise os campos e tente de novo.'
      : 'Dados inválidos. Revise os campos e tente de novo.';
  }

  if (error.status === 401) {
    return action === 'login'
      ? 'E-mail ou senha inválidos.'
      : 'Sua sessão expirou. Entre novamente.';
  }

  if (error.status === 403) {
    return 'Você não tem permissão para esta ação.';
  }

  return GENERIC;
}

/** 401 ends the session. 403 does not — the user is logged in, just not allowed. */
export function isSessionExpired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isForbidden(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

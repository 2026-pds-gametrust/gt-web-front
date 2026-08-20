import { ApiError } from '@shared/lib/http';

/** Maps buy-now API failures to honest Portuguese copy for Lucas. */
export function describeOrderError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Não foi possível concluir a compra agora. Tente de novo em instantes.';
  }

  if (error.status === 401) {
    return 'Faça login para comprar com proteção da plataforma.';
  }

  if (error.status === 403 || error.code === 'FIELD_INVALID') {
    return 'Você não pode comprar o próprio anúncio.';
  }

  if (
    error.status === 409 ||
    error.code === 'LISTING_ALREADY_RESERVED' ||
    error.code === 'LISTING_NOT_AVAILABLE_FOR_PURCHASE'
  ) {
    return 'Esta oferta acabou de ser reservada ou vendida. Veja outras ofertas do mesmo modelo.';
  }

  if (error.status === 404) {
    return 'Anúncio ou pedido não encontrado.';
  }

  if (error.status === 400) {
    return error.message || 'Dados da compra inválidos. Revise o modo de entrega.';
  }

  if (error.kind === 'network') {
    return 'Falha de rede. Verifique a conexão e tente de novo.';
  }

  return error.message || 'Não foi possível concluir a compra agora. Tente de novo em instantes.';
}

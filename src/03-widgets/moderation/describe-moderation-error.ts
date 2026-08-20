import { ApiError } from '@shared/lib/http';
import { describeAuthError } from '@features/auth/lib/auth-error-copy';
import type { IListing } from '@entities/listing/model';
import { listingIsBlockedFromPublish } from '@features/listings/lib/listing-shipping';

export function describeModerationError(error: unknown, listing: IListing | null): string {
  if (error instanceof ApiError && error.status === 409) {
    return 'Não foi possível atualizar este caso no estado atual. Se o anúncio já tiver selo ativo, revogue-o antes de aprovar de novo.';
  }

  if (error instanceof ApiError && error.code === 'STATUS_REQUIRES_FIELDS') {
    return 'Falta evidência PHOTO no caso. As fotos públicas do anúncio não substituem a evidência com o código de posse visível junto ao produto.';
  }

  if (error instanceof ApiError && error.code === 'FIELD_INVALID') {
    if (listingIsBlockedFromPublish(listing)) {
      return 'Não dá para publicar: o anúncio está como envio por transportadora, mas falta peso e medidas da embalagem. Peça isso ao vendedor.';
    }
    return 'O anúncio ainda não está completo para publicar. Confira mídia e dados de envio.';
  }

  return describeAuthError(error, 'session');
}

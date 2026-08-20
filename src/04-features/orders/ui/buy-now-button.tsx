import { Link } from 'react-router-dom';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { EListingStatus } from '@entities/listing/model';
import type { IListing } from '@entities/listing/model';

type BuyNowButtonProps = {
  listing: IListing;
};

export function buyNowEligibility(listing: IListing, actorId: string | undefined) {
  if (listing.status === EListingStatus.SOLD) {
    return { eligible: false as const, reason: 'Este anúncio já foi vendido.' };
  }
  if (listing.status === EListingStatus.RESERVED) {
    return {
      eligible: false as const,
      reason: 'Este anúncio está reservado para outra compra em andamento.',
    };
  }
  if (listing.status !== EListingStatus.PUBLISHED) {
    return {
      eligible: false as const,
      reason: 'Só anúncios publicados aceitam compra protegida.',
    };
  }
  if (!listing.buyNowEnabled) {
    return {
      eligible: false as const,
      reason: 'Comprar agora não está disponível nesta oferta.',
    };
  }
  if (actorId && actorId === listing.sellerId) {
    return {
      eligible: false as const,
      reason: 'Você não pode comprar o próprio anúncio.',
      hideCta: true as const,
    };
  }
  return { eligible: true as const };
}

export function BuyNowButton({ listing }: BuyNowButtonProps) {
  const user = useAuthStore((s) => s.user);
  const eligibility = buyNowEligibility(listing, user?.id);

  if ('hideCta' in eligibility && eligibility.hideCta) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          className={buttonClassName()}
          to="/entrar"
          state={{ from: `/checkout/${listing.id}` }}
        >
          Entrar para comprar
        </Link>
        <p className="mt-3 mb-0 text-[0.9rem] text-muted">
          Compra protegida pela plataforma — uma unidade por transação, sem carrinho.
        </p>
      </div>
    );
  }

  if (!eligibility.eligible) {
    return (
      <div className="flex flex-col gap-2">
        <Button type="button" disabled>
          Comprar agora
        </Button>
        <p className="mt-3 mb-0 text-[0.9rem] text-muted">{eligibility.reason}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Link className={buttonClassName()} to={`/checkout/${listing.id}`}>
        Comprar agora
      </Link>
      <p className="mt-3 mb-0 text-[0.9rem] text-muted">
        Pagamento protegido (escrow da plataforma). Sem adquirente externo neste fluxo.
      </p>
    </div>
  );
}

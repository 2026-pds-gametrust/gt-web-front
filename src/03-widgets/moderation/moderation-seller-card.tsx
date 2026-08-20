import { Link } from 'react-router-dom';
import type { IUser } from '@entities/user/model';
import type { IProfile } from '@entities/profile/model';
import type { ITrustDisplay } from '@entities/trust-score/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';
import { cn } from '@shared/lib/cn';
import { formatModerationDate } from './moderation-constants';

const MOD_CARD = 'rounded-lg border border-border bg-surface p-4';

type ModerationSellerCardProps = {
  seller: IUser | null;
  profile: IProfile | null;
  trust: ITrustDisplay | null;
  loading: boolean;
};

export function ModerationSellerCard({
  seller,
  profile,
  trust,
  loading,
}: ModerationSellerCardProps) {
  if (loading) {
    return (
      <section
        className={cn(MOD_CARD, '[&_h3]:m-0 [&_h3]:font-display')}
        aria-labelledby="seller-heading"
      >
        <h3 id="seller-heading">Vendedor</h3>
        <p className="text-muted">Carregando vendedor…</p>
      </section>
    );
  }

  if (!seller) {
    return (
      <section
        className={cn(MOD_CARD, '[&_h3]:m-0 [&_h3]:font-display')}
        aria-labelledby="seller-heading"
      >
        <h3 id="seller-heading">Vendedor</h3>
        <p className="m-0 mt-3 text-[0.9rem] text-muted">Dados do vendedor indisponíveis.</p>
      </section>
    );
  }

  const displayName = profile?.displayName?.trim() || seller.fullName;

  return (
    <section
      className={cn(MOD_CARD, '[&_h3]:m-0 [&_h3]:font-display')}
      aria-labelledby="seller-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 id="seller-heading">Vendedor</h3>
        <Link className="text-[0.875rem] font-semibold" to="/admin/usuarios">
          Ver usuários
        </Link>
      </div>

      <dl className="m-0 grid gap-3">
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Nome</dt>
          <dd className="m-0 font-semibold">{displayName}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">E-mail</dt>
          <dd className="m-0 font-semibold">{seller.email}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Telefone</dt>
          <dd className="m-0 font-semibold">{seller.phone || '—'}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Identidade</dt>
          <dd className="m-0 font-semibold">
            {seller.verified ? (
              <span className="mr-2 inline-block rounded-sm bg-seal-bg px-[0.45rem] py-[0.1rem] text-[0.75rem] font-bold uppercase">
                Verificada
              </span>
            ) : (
              <span className="mr-2 inline-block rounded-sm bg-[#fff4e5] px-[0.45rem] py-[0.1rem] text-[0.75rem] font-bold text-warning uppercase">
                Não verificada
              </span>
            )}
            {seller.phoneVerified ? (
              <span className="mr-2 inline-block rounded-sm bg-seal-bg px-[0.45rem] py-[0.1rem] text-[0.75rem] font-bold text-seal uppercase">
                Tel. confirmado
              </span>
            ) : null}
          </dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Status da conta</dt>
          <dd className="m-0 font-semibold">{seller.status}</dd>
        </div>
        {profile?.locationApprox ? (
          <div className="grid gap-[0.15rem]">
            <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Local aproximado</dt>
            <dd className="m-0 font-semibold">{profile.locationApprox}</dd>
          </div>
        ) : null}
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">Membro desde</dt>
          <dd className="m-0 font-semibold">{formatModerationDate(seller.createdAt)}</dd>
        </div>
        <div className="grid gap-[0.15rem]">
          <dt className="text-[0.75rem] tracking-wide text-muted uppercase">ID interno</dt>
          <dd className="m-0 font-semibold">
            <code>{seller.id}</code>
          </dd>
        </div>
      </dl>

      {profile?.bio ? <p className="m-0 mt-4 text-muted">{profile.bio}</p> : null}

      {trust ? (
        <div className="mt-4 border-t border-border pt-4">
          <TrustScoreSummary trust={trust} compact />
        </div>
      ) : (
        <p className="m-0 mt-3 text-[0.9rem] text-muted">TrustScore ainda não calculado.</p>
      )}
    </section>
  );
}

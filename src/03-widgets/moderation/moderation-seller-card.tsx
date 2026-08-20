import { Link } from 'react-router-dom';
import type { IUser } from '@entities/user/model';
import type { IProfile } from '@entities/profile/model';
import type { ITrustDisplay } from '@entities/trust-score/model';
import { TrustScoreSummary } from '@entities/trust-score/ui/trust-score-summary';
import { formatModerationDate } from './moderation-constants';

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
      <section className="moderation-card moderation-card--seller" aria-labelledby="seller-heading">
        <h3 id="seller-heading">Vendedor</h3>
        <p className="home-status">Carregando vendedor…</p>
      </section>
    );
  }

  if (!seller) {
    return (
      <section className="moderation-card moderation-card--seller" aria-labelledby="seller-heading">
        <h3 id="seller-heading">Vendedor</h3>
        <p className="moderation-card__empty">Dados do vendedor indisponíveis.</p>
      </section>
    );
  }

  const displayName = profile?.displayName?.trim() || seller.fullName;

  return (
    <section className="moderation-card moderation-card--seller" aria-labelledby="seller-heading">
      <div className="moderation-card__header">
        <h3 id="seller-heading">Vendedor</h3>
        <Link className="moderation-card__link" to="/admin/usuarios">
          Ver usuários
        </Link>
      </div>

      <dl className="moderation-meta">
        <div>
          <dt>Nome</dt>
          <dd>{displayName}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{seller.email}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{seller.phone || '—'}</dd>
        </div>
        <div>
          <dt>Identidade</dt>
          <dd>
            {seller.verified ? (
              <span className="moderation-tag moderation-tag--ok">Verificada</span>
            ) : (
              <span className="moderation-tag moderation-tag--warn">Não verificada</span>
            )}
            {seller.phoneVerified ? (
              <span className="moderation-tag moderation-tag--ok">Tel. confirmado</span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt>Status da conta</dt>
          <dd>{seller.status}</dd>
        </div>
        {profile?.locationApprox ? (
          <div>
            <dt>Local aproximado</dt>
            <dd>{profile.locationApprox}</dd>
          </div>
        ) : null}
        <div>
          <dt>Membro desde</dt>
          <dd>{formatModerationDate(seller.createdAt)}</dd>
        </div>
        <div>
          <dt>ID interno</dt>
          <dd>
            <code>{seller.id}</code>
          </dd>
        </div>
      </dl>

      {profile?.bio ? <p className="moderation-card__bio">{profile.bio}</p> : null}

      {trust ? (
        <div className="moderation-card__trust">
          <TrustScoreSummary trust={trust} compact />
        </div>
      ) : (
        <p className="moderation-card__empty">TrustScore ainda não calculado.</p>
      )}
    </section>
  );
}

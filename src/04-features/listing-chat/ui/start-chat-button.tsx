import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/button/button';
import { useAuthStore } from '@features/auth/model/use-auth-store';
import { listingChatApi } from '@features/listing-chat/api/listing-chat-api';
import { EListingStatus } from '@entities/listing/model';
import type { IListing } from '@entities/listing/model';
import { ApiError } from '@shared/lib/http';

type StartChatButtonProps = {
  listing: IListing;
};

export function StartChatButton({ listing }: StartChatButtonProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart =
    user &&
    listing.status === EListingStatus.PUBLISHED &&
    user.id !== listing.sellerId;

  if (!canStart) return null;

  async function onStart() {
    setLoading(true);
    setError(null);
    try {
      const conversation = await listingChatApi.openConversation(listing.id);
      navigate(`/mensagens/${conversation.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/entrar', { state: { from: `/anuncio/${listing.id}` } });
        return;
      }
      setError('Não foi possível abrir a conversa agora. Tente de novo em instantes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" disabled={loading} onClick={() => void onStart()}>
        {loading ? 'Abrindo…' : 'Enviar mensagem'}
      </Button>
      {error ? (
        <p className="m-0 text-[0.875rem] font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

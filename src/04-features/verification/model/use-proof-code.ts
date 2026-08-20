import { useCallback, useEffect, useState } from 'react';
import { verificationApi } from '@features/verification/api/verification-api';
import type { IProofCode } from '@entities/verification-case/model';

/** Loads possession proof code for a listing (opens case if needed). */
export function useProofCode(listingId: string | null) {
  const [proofCode, setProofCode] = useState<IProofCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    if (!listingId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const code = await verificationApi.getProofCodeForListing(listingId);
      setProofCode(code);
    } catch (bootstrapError) {
      setError(
        bootstrapError instanceof Error && bootstrapError.message
          ? bootstrapError.message
          : 'Não foi possível carregar o código de posse.',
      );
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return {
    proofCode,
    loading,
    error,
    bootstrap,
  };
}

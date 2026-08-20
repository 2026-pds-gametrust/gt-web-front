import { useCallback, useEffect, useState } from 'react';
import { verificationApi } from '@features/verification/api/verification-api';
import { waitForVerificationCaseId } from '@features/verification/lib/wait-for-verification-case';
import type { IProofCode } from '@entities/verification-case/model';

/** Loads possession proof code for a listing — no extra media upload. */
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
      const caseId = await waitForVerificationCaseId(listingId);
      const code = await verificationApi.getProofCode(caseId);
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

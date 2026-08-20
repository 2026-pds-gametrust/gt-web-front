import { listingsApi } from '@features/listings/api/listings-api';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function waitForVerificationCaseId(
  listingId: string,
  options: { maxAttempts?: number; intervalMs?: number } = {},
): Promise<string> {
  const maxAttempts = options.maxAttempts ?? 20;
  const intervalMs = options.intervalMs ?? 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const page = await listingsApi.listMyListings();
    const listing = page.items.find((item) => item.id === listingId);
    const caseId = listing?.verificationCase?.id;
    if (caseId) {
      return caseId;
    }
    if (attempt < maxAttempts - 1) {
      await delay(intervalMs);
    }
  }

  throw new Error(
    'O caso de verificação ainda não está disponível. Aguarde alguns segundos e abra de novo em Meus anúncios.',
  );
}

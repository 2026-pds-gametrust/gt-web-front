import { useCallback, useEffect, useState } from 'react';
import { verificationApi } from '@features/verification/api/verification-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { identityApi } from '@features/identity/api/identity-api';
import { catalogApi } from '@features/catalog/api/catalog-api';
import { trustApi } from '@features/trust-display/api/trust-api';
import { describeAuthError } from '@features/auth/lib/auth-error-copy';
import { ApiError } from '@shared/lib/http';
import type { IEvidenceItem } from '@entities/evidence-item/model';
import type { IListing } from '@entities/listing/model';
import type {
  IModerationQueueItem,
  IModerationQueuePage,
  IModerationQueueStats,
} from '@entities/moderation-queue/model';
import { EVerificationCaseStatus } from '@entities/verification-case/model';
import type { IUser } from '@entities/user/model';
import type { IProfile } from '@entities/profile/model';
import type { ITrustDisplay } from '@entities/trust-score/model';
import type { IProduct } from '@entities/product/model';
import type { ISeal } from '@entities/seal/model';
import { ESealStatus } from '@entities/seal/model';
import type { ModerationStatusFilter, ModerationScoreFilter } from './moderation-constants';
import { MODERATION_QUEUE_PAGE_SIZE, scoreFilterToQuery } from './moderation-constants';

type UseModerationPageParams = {
  moderatorId: string;
};

const EMPTY_STATS: IModerationQueueStats = {
  total: 0,
  pending: 0,
  inReview: 0,
  approved: 0,
  changesRequested: 0,
  rejected: 0,
};

function buildQueueQuery(
  statusFilter: ModerationStatusFilter,
  scoreFilter: ModerationScoreFilter,
  searchQuery: string,
  offset: number,
): {
  status?: string;
  q?: string;
  minScore?: number;
  maxScore?: number;
  hasAiScore?: boolean;
  limit: number;
  offset: number;
} {
  const q = searchQuery.trim();
  return {
    ...scoreFilterToQuery(scoreFilter),
    status:
      statusFilter === 'ALL'
        ? undefined
        : statusFilter,
    q: q || undefined,
    limit: MODERATION_QUEUE_PAGE_SIZE,
    offset,
  };
}

export function useModerationPage({ moderatorId }: UseModerationPageParams) {
  const [queuePage, setQueuePage] = useState<IModerationQueuePage>({
    items: [],
    total: 0,
    limit: 20,
    offset: 0,
    stats: EMPTY_STATS,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<IEvidenceItem[]>([]);
  const [listing, setListing] = useState<IListing | null>(null);
  const [seller, setSeller] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [trust, setTrust] = useState<ITrustDisplay | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [seals, setSeals] = useState<ISeal[]>([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [opsMessage, setOpsMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilterState] = useState<ModerationStatusFilter>('ALL');
  const [scoreFilter, setScoreFilterState] = useState<ModerationScoreFilter>('ALL');
  const [searchQuery, setSearchQueryState] = useState('');
  const [offset, setOffset] = useState(0);

  const setStatusFilter = useCallback((filter: ModerationStatusFilter) => {
    setStatusFilterState(filter);
    setOffset(0);
  }, []);

  const setScoreFilter = useCallback((filter: ModerationScoreFilter) => {
    setScoreFilterState(filter);
    setOffset(0);
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
    setOffset(0);
  }, []);

  const selected = queuePage.items.find((item) => item.id === selectedId) ?? null;

  const refreshCases = useCallback(
    async (preferId?: string | null) => {
      const page = await verificationApi.listVerificationCases(
        buildQueueQuery(statusFilter, scoreFilter, searchQuery, offset),
      );
      setQueuePage(page);

      const nextId =
        preferId && page.items.some((item) => item.id === preferId)
          ? preferId
          : (page.items.find(
              (item) =>
                item.status === EVerificationCaseStatus.PENDING ||
                item.status === EVerificationCaseStatus.IN_REVIEW,
            )?.id ??
            page.items[0]?.id ??
            null);

      setSelectedId(nextId);
      return page;
    },
    [offset, searchQuery, scoreFilter, statusFilter],
  );

  useEffect(() => {
    let cancelled = false;
    const delay = searchQuery.trim() ? 300 : 0;
    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          await refreshCases();
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [offset, searchQuery, scoreFilter, statusFilter, refreshCases]);

  useEffect(() => {
    if (!selected) {
      setEvidence([]);
      setListing(null);
      setSeller(null);
      setProfile(null);
      setTrust(null);
      setProduct(null);
      setSeals([]);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    setOpsMessage(null);

    void (async () => {
      try {
        const [ev, lst] = await Promise.all([
          verificationApi.listEvidence(selected.id),
          listingsApi.getListing(selected.listingId),
        ]);
        if (cancelled) return;

        setEvidence(ev);
        setListing(lst);
        setReason(selected.decisionReason ?? '');

        if (lst) {
          const [sellerUser, sellerProfile, grantedSeals, prod, trustDisplay] =
            await Promise.all([
              identityApi.getUser(lst.sellerId).catch(() => null),
              identityApi.getProfileByUser(lst.sellerId).catch(() => null),
              verificationApi.listSeals(lst.id).catch(() => []),
              catalogApi.getProduct(lst.productId).catch(() => null),
              trustApi.getTrustDisplay(lst.sellerId).catch(() => null),
            ]);

          if (cancelled) return;
          setSeller(sellerUser);
          setProfile(sellerProfile);
          setSeals(grantedSeals.filter((seal) => seal.status === ESealStatus.GRANTED));
          setProduct(prod);
          setTrust(trustDisplay);
        } else {
          setSeller(null);
          setProfile(null);
          setSeals([]);
          setProduct(null);
          setTrust(null);
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selected]);

  async function ensureInReview(caseId: string, status: string) {
    if (status === EVerificationCaseStatus.PENDING) {
      await verificationApi.assignVerificationCase(caseId, moderatorId);
    }
  }

  async function runAction(action: () => Promise<unknown>) {
    setBusy(true);
    setOpsMessage(null);
    try {
      await action();
      await refreshCases(selectedId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setOpsMessage(
          'Não foi possível atualizar este caso no estado atual. Se o anúncio já tiver selo ativo, revogue-o antes de aprovar de novo.',
        );
      } else {
        setOpsMessage(describeAuthError(err, 'session'));
      }
    } finally {
      setBusy(false);
    }
  }

  return {
    queueItems: queuePage.items,
    stats: queuePage.stats,
    total: queuePage.total,
    limit: queuePage.limit,
    offset: queuePage.offset,
    setOffset,
    selected: selected as IModerationQueueItem | null,
    selectedId,
    setSelectedId,
    evidence,
    listing,
    seller,
    profile,
    trust,
    product,
    seals,
    reason,
    setReason,
    loading,
    detailLoading,
    busy,
    opsMessage,
    setOpsMessage,
    statusFilter,
    setStatusFilter,
    scoreFilter,
    setScoreFilter,
    searchQuery,
    setSearchQuery,
    refreshCases,
    runAction,
    ensureInReview,
  };
}

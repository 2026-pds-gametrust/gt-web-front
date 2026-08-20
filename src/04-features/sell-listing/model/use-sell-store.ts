import { create } from 'zustand';
import { catalogApi } from '@features/catalog/api/catalog-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { mediaApi } from '@features/media/api/media-api';
import type { IProduct } from '@entities/product/model';
import { EMediaPurpose } from '@entities/media-asset/model';
import { EListingCondition } from '@entities/listing/model';
import { EVIDENCE_CHECKLIST, type IEvidenceChecklistItem } from './evidence-checklist';
import type { IRequiredChange } from '@entities/verification-case/model';
import {
  buildRevisionSnapshot,
  firstRevisionStep,
  isRevisionComplete,
} from '../lib/revision-validation';
import { movePhoto as movePhotoIds, reorderPhotos as reorderPhotoIds } from '../lib/reorder-photos';

export const ESellStep = {
  IDENTIFY: 1,
  DESCRIBE: 2,
  MEDIA: 3,
  PRICE: 4,
  EVIDENCE: 5,
  REVIEW: 6,
} as const;

export type ESellStep = (typeof ESellStep)[keyof typeof ESellStep];

export const ESellStatus = {
  DRAFT: 'draft',
  UNDER_REVIEW: 'under_review',
  CHANGES_REQUESTED: 'changes_requested',
  APPROVED: 'approved',
} as const;

export type ESellStatus = (typeof ESellStatus)[keyof typeof ESellStatus];

function isBlobUrl(url: string): boolean {
  return url.startsWith('blob:');
}

function revokePreviewUrl(url: string | null | undefined): void {
  if (url && isBlobUrl(url)) {
    URL.revokeObjectURL(url);
  }
}

function revokePreviewMap(previews: Record<string, string>): void {
  Object.values(previews).forEach(revokePreviewUrl);
}

async function previewUrlForAsset(assetId: string, localUrl?: string): Promise<string> {
  if (localUrl) return localUrl;
  try {
    const grant = await mediaApi.getContentGrant(assetId);
    return grant.url;
  } catch {
    return '';
  }
}

type SellState = {
  step: ESellStep;
  status: ESellStatus;
  products: IProduct[];
  evidenceOptions: IEvidenceChecklistItem[];
  productId: string | null;
  condition: string;
  defects: string;
  accessories: string;
  priceCents: number;
  evidenceIds: string[];
  photoAssetIds: string[];
  photoPreviews: Record<string, string>;
  videoAssetId: string | null;
  videoPreview: string | null;
  shippingModes: string[];
  uploading: boolean;
  uploadStatus: string | null;
  submittedListingId: string | null;
  revisionListingId: string | null;
  requiredChanges: IRequiredChange[];
  revisionBaseline: ReturnType<typeof buildRevisionSnapshot> | null;
  loading: boolean;
  error: string | null;
  loadOptions: () => Promise<void>;
  loadListingForRevision: (listingId: string) => Promise<void>;
  setStep: (step: ESellStep) => void;
  setProductId: (id: string) => void;
  setCondition: (value: string) => void;
  setDefects: (value: string) => void;
  setAccessories: (value: string) => void;
  setPriceCents: (value: number) => void;
  toggleEvidence: (id: string) => void;
  addPhotos: (files: File[]) => Promise<void>;
  addPhoto: (file: File) => Promise<void>;
  removePhoto: (assetId: string) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  movePhoto: (assetId: string, direction: 'up' | 'down') => void;
  setVideo: (file: File) => Promise<void>;
  clearVideo: () => void;
  toggleShippingMode: (mode: string) => void;
  submit: () => Promise<void>;
  resubmitRevision: () => Promise<void>;
  canResubmitRevision: () => boolean;
  reset: () => void;
};

const initialDraft = {
  step: ESellStep.IDENTIFY as ESellStep,
  status: ESellStatus.DRAFT as ESellStatus,
  productId: null as string | null,
  condition: EListingCondition.GOOD,
  defects: '',
  accessories: '',
  priceCents: 0,
  evidenceIds: [] as string[],
  photoAssetIds: [] as string[],
  photoPreviews: {} as Record<string, string>,
  videoAssetId: null as string | null,
  videoPreview: null as string | null,
  shippingModes: [] as string[],
  uploading: false,
  uploadStatus: null as string | null,
  submittedListingId: null as string | null,
  revisionListingId: null as string | null,
  requiredChanges: [] as IRequiredChange[],
  revisionBaseline: null as ReturnType<typeof buildRevisionSnapshot> | null,
  loading: false,
  error: null as string | null,
};

export const useSellStore = create<SellState>((set, get) => ({
  ...initialDraft,
  products: [],
  evidenceOptions: EVIDENCE_CHECKLIST,

  loadOptions: async () => {
    const products = await catalogApi.listProducts();
    set({ products });
  },

  loadListingForRevision: async (listingId) => {
    set({ loading: true, error: null });
    try {
      const page = await listingsApi.listMyListings();
      const sellerListing = page.items.find((item) => item.id === listingId);
      if (!sellerListing) {
        throw new Error('Anúncio não encontrado.');
      }
      const verification = sellerListing.verificationCase;
      if (
        sellerListing.status !== 'DRAFT' ||
        verification?.status !== 'CHANGES_REQUESTED' ||
        !verification.requiredChanges?.length
      ) {
        throw new Error('Este anúncio não está aguardando correção.');
      }

      const defects = sellerListing.description?.trim() ?? '';
      const baseline = buildRevisionSnapshot({
        photoAssetIds: sellerListing.media.assetIds ?? [],
        videoAssetId: sellerListing.media.videoAssetId ?? null,
        defects,
        accessories: '',
      });

      const photoAssetIds = sellerListing.media.assetIds ?? [];
      const videoAssetId = sellerListing.media.videoAssetId ?? null;
      const photoPreviews: Record<string, string> = {};
      await Promise.all(
        photoAssetIds.map(async (id) => {
          const url = await previewUrlForAsset(id);
          if (url) photoPreviews[id] = url;
        }),
      );
      const videoPreview = videoAssetId ? await previewUrlForAsset(videoAssetId) : null;

      set({
        loading: false,
        revisionListingId: listingId,
        submittedListingId: listingId,
        requiredChanges: verification.requiredChanges,
        revisionBaseline: baseline,
        status: ESellStatus.CHANGES_REQUESTED,
        productId: sellerListing.productId,
        condition: sellerListing.condition,
        defects,
        accessories: '',
        priceCents: sellerListing.priceCents,
        photoAssetIds,
        photoPreviews,
        videoAssetId,
        videoPreview: videoPreview || null,
        shippingModes: sellerListing.shipping.modes,
        step: firstRevisionStep(verification.requiredChanges) as ESellStep,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Não foi possível carregar o anúncio para correção.',
      });
    }
  },

  canResubmitRevision: () => {
    const state = get();
    if (!state.revisionListingId || !state.revisionBaseline) {
      return false;
    }
    const snapshot = buildRevisionSnapshot({
      photoAssetIds: state.photoAssetIds,
      videoAssetId: state.videoAssetId,
      defects: state.defects,
      accessories: state.accessories,
    });
    return isRevisionComplete(
      state.requiredChanges,
      snapshot,
      state.revisionBaseline,
    );
  },

  resubmitRevision: async () => {
    const state = get();
    if (!state.revisionListingId) {
      set({ error: 'Nenhum anúncio em correção.' });
      return;
    }
    if (!get().canResubmitRevision()) {
      set({ error: 'Corrija todos os itens solicitados antes de reenviar.' });
      return;
    }
    set({ loading: true, error: null });
    try {
      await listingsApi.updateListing(state.revisionListingId, {
        description: `${state.defects}\n${state.accessories}`.trim(),
        media: {
          photoUrls: [],
          assetIds: state.photoAssetIds,
          videoAssetId: state.videoAssetId ?? undefined,
        },
        priceCents: state.priceCents,
        shipping: { modes: state.shippingModes as never },
      });
      await listingsApi.submitListing(state.revisionListingId);
      set({
        loading: false,
        status: ESellStatus.UNDER_REVIEW,
        step: ESellStep.REVIEW,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Falha ao reenviar o anúncio.',
      });
    }
  },

  setStep: (step) => set({ step }),
  setProductId: (productId) => set({ productId }),
  setCondition: (condition) => set({ condition }),
  setDefects: (defects) => set({ defects }),
  setAccessories: (accessories) => set({ accessories }),
  setPriceCents: (priceCents) => set({ priceCents }),

  toggleEvidence: (id) => {
    const current = get().evidenceIds;
    set({
      evidenceIds: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  },

  addPhotos: async (files) => {
    for (const file of files) {
      await get().addPhoto(file);
      if (get().error) break;
    }
  },

  addPhoto: async (file) => {
    const localPreview = URL.createObjectURL(file);
    set({ uploading: true, error: null, uploadStatus: 'Enviando foto…' });
    try {
      const asset = await mediaApi.uploadAsset({
        file,
        purpose: EMediaPurpose.LISTING,
        onStatusChange: (current) =>
          set({ uploadStatus: `Foto: ${current.status.toLowerCase()}` }),
      });
      set({
        photoAssetIds: [...get().photoAssetIds, asset.id],
        photoPreviews: { ...get().photoPreviews, [asset.id]: localPreview },
        uploading: false,
        uploadStatus: null,
      });
    } catch (error) {
      revokePreviewUrl(localPreview);
      set({
        uploading: false,
        uploadStatus: null,
        error: error instanceof Error ? error.message : 'Falha ao enviar a foto.',
      });
    }
  },

  removePhoto: (assetId) => {
    revokePreviewUrl(get().photoPreviews[assetId]);
    const photoPreviews = { ...get().photoPreviews };
    delete photoPreviews[assetId];
    set({
      photoAssetIds: get().photoAssetIds.filter((id) => id !== assetId),
      photoPreviews,
    });
  },

  reorderPhotos: (fromIndex, toIndex) => {
    set({ photoAssetIds: reorderPhotoIds(get().photoAssetIds, fromIndex, toIndex) });
  },

  movePhoto: (assetId, direction) => {
    set({ photoAssetIds: movePhotoIds(get().photoAssetIds, assetId, direction) });
  },

  setVideo: async (file) => {
    const localPreview = URL.createObjectURL(file);
    set({ uploading: true, error: null, uploadStatus: 'Enviando vídeo…' });
    try {
      const asset = await mediaApi.uploadAsset({
        file,
        purpose: EMediaPurpose.LISTING,
        onStatusChange: (current) =>
          set({ uploadStatus: `Vídeo: ${current.status.toLowerCase()}` }),
      });
      revokePreviewUrl(get().videoPreview);
      set({
        videoAssetId: asset.id,
        videoPreview: localPreview,
        uploading: false,
        uploadStatus: null,
      });
    } catch (error) {
      revokePreviewUrl(localPreview);
      set({
        uploading: false,
        uploadStatus: null,
        error: error instanceof Error ? error.message : 'Falha ao enviar o vídeo.',
      });
    }
  },

  clearVideo: () => {
    revokePreviewUrl(get().videoPreview);
    set({ videoAssetId: null, videoPreview: null });
  },

  toggleShippingMode: (mode) => {
    const current = get().shippingModes;
    set({
      shippingModes: current.includes(mode)
        ? current.filter((item) => item !== mode)
        : [...current, mode],
    });
  },

  submit: async () => {
    const state = get();
    if (!state.productId) {
      set({ error: 'Selecione um produto.' });
      return;
    }
    set({ loading: true, error: null });
    try {
      const product = state.products.find((p) => p.id === state.productId);
      const result = await listingsApi.submitListingDraft({
        productId: state.productId,
        title: `${product?.brand ?? ''} ${product?.model ?? ''}`.trim(),
        condition: state.condition,
        defects: state.defects,
        accessories: state.accessories,
        priceCents: state.priceCents,
        evidenceIds: state.evidenceIds,
        photoAssetIds: state.photoAssetIds,
        videoAssetId: state.videoAssetId,
        shippingModes: state.shippingModes,
      });
      set({
        loading: false,
        // UI still shows "under review"; API status is SUBMITTED.
        status: ESellStatus.UNDER_REVIEW,
        submittedListingId: result.id,
        step: ESellStep.REVIEW,
      });
    } catch (error) {
      // Show what actually failed: a bare "falha ao enviar" leaves the seller with
      // no idea which requirement the listing is missing.
      set({
        loading: false,
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Falha ao enviar o anúncio.',
      });
    }
  },

  reset: () => {
    revokePreviewMap(get().photoPreviews);
    revokePreviewUrl(get().videoPreview);
    set({ ...initialDraft });
  },
}));

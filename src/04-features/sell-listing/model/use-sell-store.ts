import { create } from 'zustand';
import { catalogApi } from '@features/catalog/api/catalog-api';
import { listingsApi } from '@features/listings/api/listings-api';
import { mediaApi } from '@features/media/api/media-api';
import { getActorId } from '@shared/lib/http';
import type { IProduct } from '@entities/product/model';
import { EMediaPurpose } from '@entities/media-asset/model';
import { EListingCondition, EShippingMode } from '@entities/listing/model';
import { EVIDENCE_CHECKLIST, type IEvidenceChecklistItem } from './evidence-checklist';
import type { IRequiredChange } from '@entities/verification-case/model';
import { buildListingShipping, listingDeliveryIncompleteReason } from '@features/listings/lib/listing-shipping';
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

function packageDimsFromState(state: {
  packageWeightGrams: number;
  packageLengthCm: number;
  packageWidthCm: number;
  packageHeightCm: number;
}) {
  return {
    packageWeightGrams: state.packageWeightGrams,
    packageLengthCm: state.packageLengthCm,
    packageWidthCm: state.packageWidthCm,
    packageHeightCm: state.packageHeightCm,
  };
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
  packageWeightGrams: number;
  packageLengthCm: number;
  packageWidthCm: number;
  packageHeightCm: number;
  uploading: boolean;
  uploadStatus: string | null;
  submittedListingId: string | null;
  draftListingId: string | null;
  revisionListingId: string | null;
  requiredChanges: IRequiredChange[];
  revisionBaseline: ReturnType<typeof buildRevisionSnapshot> | null;
  loading: boolean;
  error: string | null;
  loadOptions: () => Promise<void>;
  loadListingForRevision: (listingId: string) => Promise<void>;
  ensureDraftListing: () => Promise<string | null>;
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
  setShippingPackage: (next: {
    packageWeightGrams?: number;
    packageLengthCm?: number;
    packageWidthCm?: number;
    packageHeightCm?: number;
  }) => void;
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
  packageWeightGrams: 0,
  packageLengthCm: 0,
  packageWidthCm: 0,
  packageHeightCm: 0,
  uploading: false,
  uploadStatus: null as string | null,
  submittedListingId: null as string | null,
  draftListingId: null as string | null,
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
        draftListingId: listingId,
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
        packageWeightGrams: sellerListing.shipping.packageWeightGrams ?? 0,
        packageLengthCm: sellerListing.shipping.packageLengthCm ?? 0,
        packageWidthCm: sellerListing.shipping.packageWidthCm ?? 0,
        packageHeightCm: sellerListing.shipping.packageHeightCm ?? 0,
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
    return (
      isRevisionComplete(
        state.requiredChanges,
        snapshot,
        state.revisionBaseline,
      ) &&
      !listingDeliveryIncompleteReason(
        state.shippingModes,
        packageDimsFromState(state),
      )
    );
  },

  resubmitRevision: async () => {
    const state = get();
    if (!state.revisionListingId) {
      set({ error: 'Nenhum anúncio em correção.' });
      return;
    }
    if (!get().canResubmitRevision()) {
      set({
        error:
          listingDeliveryIncompleteReason(
            state.shippingModes,
            packageDimsFromState(state),
          ) ?? 'Corrija todos os itens solicitados antes de reenviar.',
      });
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
        shipping: buildListingShipping(state.shippingModes, {
          packageWeightGrams: state.packageWeightGrams,
          packageLengthCm: state.packageLengthCm,
          packageWidthCm: state.packageWidthCm,
          packageHeightCm: state.packageHeightCm,
        }),
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

  ensureDraftListing: async () => {
    const state = get();
    if (state.draftListingId) {
      return state.draftListingId;
    }
    if (!state.productId) {
      set({ error: 'Selecione um produto antes de enviar mídia.' });
      return null;
    }
    set({ loading: true, error: null });
    try {
      const product = state.products.find((p) => p.id === state.productId);
      const sellerId = getActorId();
      if (!sellerId) {
        throw new Error('Entre na sua conta para anunciar.');
      }
      const created = await listingsApi.createListing({
        id: `lst-${Date.now()}`,
        sellerId,
        productId: state.productId,
        title: `${product?.brand ?? ''} ${product?.model ?? ''}`.trim() || 'Anúncio',
        description: `${state.defects}\n${state.accessories}`.trim(),
        condition: state.condition as never,
        priceCents: state.priceCents > 0 ? state.priceCents : 0,
        media: {
          photoUrls: [],
          assetIds: state.photoAssetIds.length ? state.photoAssetIds : undefined,
          videoAssetId: state.videoAssetId ?? undefined,
        },
        shipping: buildListingShipping(
          state.shippingModes.length ? state.shippingModes : [EShippingMode.PICKUP],
          {
            packageWeightGrams: state.packageWeightGrams,
            packageLengthCm: state.packageLengthCm,
            packageWidthCm: state.packageWidthCm,
            packageHeightCm: state.packageHeightCm,
          },
        ),
      });
      set({
        loading: false,
        draftListingId: created.id,
      });
      return created.id;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Não foi possível preparar o anúncio para o código de posse.',
      });
      return null;
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

  setShippingPackage: (next) => {
    set(next);
  },

  submit: async () => {
    const state = get();
    if (!state.productId) {
      set({ error: 'Selecione um produto.' });
      return;
    }
    const deliveryError = listingDeliveryIncompleteReason(
      state.shippingModes,
      packageDimsFromState(state),
    );
    if (deliveryError) {
      set({ error: deliveryError });
      return;
    }
    set({ loading: true, error: null });
    try {
      const product = state.products.find((p) => p.id === state.productId);
      const title = `${product?.brand ?? ''} ${product?.model ?? ''}`.trim();
      const description = `${state.defects}\n${state.accessories}`.trim();
      let listingId = state.draftListingId;

      if (listingId) {
        await listingsApi.updateListing(listingId, {
          title,
          description,
          condition: state.condition as never,
          priceCents: state.priceCents,
          media: {
            photoUrls: [],
            assetIds: state.photoAssetIds,
            videoAssetId: state.videoAssetId ?? undefined,
          },
          shipping: buildListingShipping(state.shippingModes, {
            packageWeightGrams: state.packageWeightGrams,
            packageLengthCm: state.packageLengthCm,
            packageWidthCm: state.packageWidthCm,
            packageHeightCm: state.packageHeightCm,
          }),
          attributes: {
            defects: state.defects ? [state.defects] : [],
            accessories: state.accessories ? [state.accessories] : [],
          },
        });
        await listingsApi.submitListing(listingId);
      } else {
        const result = await listingsApi.submitListingDraft({
          productId: state.productId,
          title,
          condition: state.condition,
          defects: state.defects,
          accessories: state.accessories,
          priceCents: state.priceCents,
          evidenceIds: state.evidenceIds,
          photoAssetIds: state.photoAssetIds,
          videoAssetId: state.videoAssetId,
          shippingModes: state.shippingModes,
          packageWeightGrams: state.packageWeightGrams,
          packageLengthCm: state.packageLengthCm,
          packageWidthCm: state.packageWidthCm,
          packageHeightCm: state.packageHeightCm,
        });
        listingId = result.id;
      }

      set({
        loading: false,
        status: ESellStatus.UNDER_REVIEW,
        submittedListingId: listingId,
        draftListingId: listingId,
        step: ESellStep.REVIEW,
      });
    } catch (error) {
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

import { getActorId, httpClient, ApiError } from '@shared/lib/http';
import type {
  IListing,
  IListingPage,
  INewListing,
  ISellerListingPage,
  IUpdateListing,
  EListingStatus,
} from '@entities/listing/model';
import { EListingStatus as ListingStatusEnum } from '@entities/listing/model';
import type { IListingEvent } from '@entities/listing-event/model';
import type { ISearchDocument } from '@entities/search-document/model';
import { searchApi } from '@features/search/api/search-api';
import type { IListingDraftInput, IListingSubmitResult } from '../model/draft-types';

const SIMILAR_LIMIT = 6;

export const listingsApi = {
  async listListings(): Promise<IListing[]> {
    const { data } = await httpClient.get<IListingPage>('/listings');
    return data.items;
  },

  async listMyListings(params?: {
    status?: EListingStatus;
    limit?: number;
    offset?: number;
  }): Promise<ISellerListingPage> {
    const { data } = await httpClient.get<ISellerListingPage>('/listings/mine', {
      params,
    });
    return data;
  },

  async createListing(input: INewListing): Promise<IListing> {
    const { data } = await httpClient.post<IListing>('/listings', input);
    return data;
  },

  async getListing(id: string): Promise<IListing | null> {
    try {
      const { data } = await httpClient.get<IListing>(`/listings/${id}`);
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async updateListing(id: string, patch: IUpdateListing): Promise<IListing | null> {
    const { data } = await httpClient.put<IListing>(`/listings/${id}`, patch);
    return data;
  },

  async getListingEvents(id: string): Promise<IListingEvent[]> {
    const { data } = await httpClient.get<IListingEvent[]>(`/listings/${id}/events`);
    return data;
  },

  async pauseListing(id: string): Promise<IListing | null> {
    const { data } = await httpClient.post<IListing>(`/listings/${id}/pause`);
    return data;
  },

  /** Backoffice gate — a seller calling this gets a 403, by design. */
  async publishListing(id: string): Promise<IListing | null> {
    const { data } = await httpClient.post<IListing>(`/listings/${id}/publish`);
    return data;
  },

  async submitListing(id: string): Promise<IListing> {
    const { data } = await httpClient.post<IListing>(`/listings/${id}/submit`);
    return data;
  },

  async getListingsByProduct(productId: string): Promise<IListing[]> {
    const listings = await this.listListings();
    return listings.filter(
      (listing) =>
        listing.productId === productId &&
        listing.status === ListingStatusEnum.PUBLISHED,
    );
  },

  /**
   * "Other offers like this one" — the search index is the only place that
   * knows what is published, so similarity is the listing's own category minus
   * itself. No recommendation endpoint exists; nothing is scored or invented.
   */
  async getSimilarListings(listingId: string): Promise<ISearchDocument[]> {
    try {
      const listing = await this.getListing(listingId);
      if (!listing) return [];

      const { documents } = await searchApi.search({ q: listing.title });
      return documents
        .filter((doc) => doc.listingId !== listingId)
        .slice(0, SIMILAR_LIMIT);
    } catch {
      return [];
    }
  },

  /**
   * Wizard shortcut: create the draft and submit it for verification in one go.
   * The offer comes back SUBMITTED — never PUBLISHED, and never with a seal.
   */
  async submitListingDraft(draft: IListingDraftInput): Promise<IListingSubmitResult> {
    // `sellerId` must be the JWT actor: the service answers 403 for anyone else.
    const sellerId = getActorId();
    if (!sellerId) {
      throw new Error('Entre na sua conta para anunciar.');
    }

    const photoAssetIds = draft.photoAssetIds ?? [];
    const shippingModes = draft.shippingModes ?? [];

    // Fail here, with a reason the wizard can show, instead of letting the backend
    // answer a generic 400: create needs at least one photo, a video and a shipping mode.
    if (photoAssetIds.length === 0) {
      throw new Error('Envie ao menos uma foto da unidade.');
    }
    if (!draft.videoAssetId) {
      throw new Error('Envie um vídeo da unidade.');
    }
    if (shippingModes.length === 0) {
      throw new Error('Escolha ao menos uma forma de entrega.');
    }

    const created = await this.createListing({
      id: `lst-${Date.now()}`,
      sellerId,
      productId: draft.productId,
      title: draft.title,
      description: `${draft.defects}\n${draft.accessories}`.trim(),
      condition: draft.condition as IListing['condition'],
      priceCents: draft.priceCents,
      // `assetIds` carries the READY assets; `photoUrls` stays empty but present
      // because ListingMedia still marks it required.
      media: {
        photoUrls: [],
        assetIds: photoAssetIds,
        videoAssetId: draft.videoAssetId,
      },
      shipping: { modes: shippingModes as IListing['shipping']['modes'] },
      attributes: {
        defects: draft.defects ? [draft.defects] : [],
        accessories: draft.accessories ? [draft.accessories] : [],
      },
    });

    const submitted = await this.submitListing(created.id);
    return {
      id: submitted.id,
      status: submitted.status as IListingSubmitResult['status'],
      seals: [],
    };
  },
};

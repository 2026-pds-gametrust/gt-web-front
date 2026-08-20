import type { ISeal } from '@entities/seal/model';
import type { EListingStatus } from '@entities/listing/model';

/** What the sell wizard collects before it becomes a `NewListing`. */
export interface IListingDraftInput {
  productId: string;
  title: string;
  condition: string;
  defects: string;
  accessories: string;
  priceCents: number;
  evidenceIds: string[];
  /** Ids of READY LISTING image assets. The backend needs at least one. */
  photoAssetIds?: string[];
  /** Id of a READY LISTING video/mp4 asset. The backend requires it to create. */
  videoAssetId?: string | null;
  /** At least one mode is required — the entity rejects an empty list. */
  shippingModes?: string[];
}

export interface IListingSubmitResult {
  id: string;
  status: typeof EListingStatus.SUBMITTED;
  /** Always empty on submit: a seal only exists after an approved case. */
  seals: ISeal[];
}

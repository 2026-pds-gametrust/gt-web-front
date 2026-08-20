import type { EListingStatus } from '@entities/listing/model';

export interface IListingEvent {
  id: string;
  listingId: string;
  fromStatus?: EListingStatus | '';
  toStatus: EListingStatus;
  reason?: string;
  actorId?: string;
  occurredAt: string;
}

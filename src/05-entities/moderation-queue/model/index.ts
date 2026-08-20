export interface IModerationQueueStats {
  total: number;
  pending: number;
  inReview: number;
  approved: number;
  changesRequested: number;
  rejected: number;
}

export interface IModerationQueueItem {
  id: string;
  listingId: string;
  status: string;
  checklist?: Record<string, unknown>;
  aiAnalysisScore?: number;
  decisionReason?: string;
  moderatorId?: string;
  createdAt: string;
  updatedAt?: string;
  listingTitle: string;
  listingStatus?: string;
  listingCoverPhotoUrl?: string;
  sellerId: string;
  sellerDisplayName: string;
}

export interface IModerationQueuePage {
  items: IModerationQueueItem[];
  total: number;
  limit: number;
  offset: number;
  stats: IModerationQueueStats;
}

export type IModerationQueueQuery = {
  status?: string;
  q?: string;
  moderatorId?: string;
  minScore?: number;
  maxScore?: number;
  hasAiScore?: boolean;
  limit?: number;
  offset?: number;
};

import { httpClient } from '@shared/lib/http';
import type { ISellerLevel } from '@entities/seller-level/model';
import type { ITrustEvent, INewTrustEvent } from '@entities/trust-event/model';
import type { ITrustDisplay, ITrustScore } from '@entities/trust-score/model';
import { buildTrustDisplay } from '../lib/build-trust-display';

export const trustApi = {
  async getSellerLevel(sellerId: string): Promise<ISellerLevel> {
    const { data } = await httpClient.get<ISellerLevel>(`/seller-levels/${sellerId}`);
    return data;
  },

  async listTrustEvents(sellerId?: string): Promise<ITrustEvent[]> {
    const { data } = await httpClient.get<ITrustEvent[]>('/trust-events', {
      params: sellerId ? { sellerId } : undefined,
    });
    return data;
  },

  async createTrustEvent(input: INewTrustEvent): Promise<ITrustEvent> {
    const { data } = await httpClient.post<ITrustEvent>('/trust-events', input);
    return data;
  },

  async getTrustScore(sellerId: string): Promise<ITrustScore> {
    const { data } = await httpClient.get<ITrustScore>(`/trust-scores/${sellerId}`);
    return data;
  },

  async recomputeTrustScore(sellerId: string): Promise<ITrustScore> {
    const { data } = await httpClient.post<ITrustScore>(
      `/trust-scores/${sellerId}/recompute`,
    );
    return data;
  },

  async getTrustDisplay(sellerId: string): Promise<ITrustDisplay | null> {
    try {
      const [score, level, events] = await Promise.all([
        this.getTrustScore(sellerId).catch(() => null),
        this.getSellerLevel(sellerId).catch(() => null),
        this.listTrustEvents(sellerId).catch(() => [] as ITrustEvent[]),
      ]);
      if (!score && !level && events.length === 0) {
        return null;
      }
      return buildTrustDisplay(score, level, events);
    } catch {
      return null;
    }
  },
};

import { httpClient } from '@shared/lib/http';
import type { ISeal } from '@entities/seal/model';
import type { ESealType } from '@entities/seal/model';
import type {
  IVerificationCase,
  INewVerificationCase,
  IRequestVerificationChanges,
  IProofCode,
} from '@entities/verification-case/model';
import type {
  IModerationQueuePage,
  IModerationQueueQuery,
} from '@entities/moderation-queue/model';
import type { IEvidenceItem, INewEvidenceItem } from '@entities/evidence-item/model';

export const verificationApi = {
  async listSeals(listingId?: string): Promise<ISeal[]> {
    const { data } = await httpClient.get<ISeal[]>('/seals', {
      params: listingId ? { listingId } : undefined,
    });
    return data;
  },

  async getSeal(id: string): Promise<ISeal | null> {
    const { data } = await httpClient.get<ISeal>(`/seals/${id}`);
    return data;
  },

  async revokeSeal(id: string): Promise<ISeal | null> {
    const { data } = await httpClient.post<ISeal>(`/seals/${id}/revoke`);
    return data;
  },

  /** Granted-only seals for UI (never invent verification). */
  async getGrantedSeals(listingId: string): Promise<ISeal[]> {
    const seals = await this.listSeals(listingId);
    return seals.filter((s) => s.status === 'GRANTED');
  },

  async listVerificationCases(
    query?: IModerationQueueQuery,
  ): Promise<IModerationQueuePage> {
    const { data } = await httpClient.get<IModerationQueuePage>(
      '/verification-cases',
      { params: query },
    );
    return data;
  },

  /** @deprecated Use listVerificationCases with query params — returns the moderation page. */
  async listVerificationCasesLegacy(): Promise<IVerificationCase[]> {
    const page = await this.listVerificationCases();
    return page.items;
  },

  async createVerificationCase(input: INewVerificationCase): Promise<IVerificationCase> {
    const { data } = await httpClient.post<IVerificationCase>('/verification-cases', input);
    return data;
  },

  async getVerificationCase(id: string): Promise<IVerificationCase | null> {
    const { data } = await httpClient.get<IVerificationCase>(`/verification-cases/${id}`);
    return data;
  },

  async getProofCode(caseId: string): Promise<IProofCode> {
    const { data } = await httpClient.get<IProofCode>(
      `/verification-cases/${caseId}/proof-code`,
    );
    return data;
  },

  async assignVerificationCase(
    id: string,
    moderatorId: string,
  ): Promise<IVerificationCase | null> {
    const { data } = await httpClient.post<IVerificationCase>(
      `/verification-cases/${id}/assign`,
      { moderatorId },
    );
    return data;
  },

  async approveVerificationCase(
    id: string,
    body?: { decisionReason?: string; sealType?: ESealType },
  ): Promise<IVerificationCase | null> {
    const { data } = await httpClient.post<IVerificationCase>(
      `/verification-cases/${id}/approve`,
      body ?? {},
    );
    return data;
  },

  async rejectVerificationCase(id: string, reason: string): Promise<IVerificationCase | null> {
    const { data } = await httpClient.post<IVerificationCase>(
      `/verification-cases/${id}/reject`,
      { reason },
    );
    return data;
  },

  async requestVerificationChanges(
    id: string,
    body: IRequestVerificationChanges,
  ): Promise<IVerificationCase | null> {
    const { data } = await httpClient.post<IVerificationCase>(
      `/verification-cases/${id}/request-changes`,
      body,
    );
    return data;
  },

  async listEvidence(caseId: string): Promise<IEvidenceItem[]> {
    const { data } = await httpClient.get<IEvidenceItem[]>(
      `/verification-cases/${caseId}/evidence`,
    );
    return data;
  },

  async addEvidence(caseId: string, input: INewEvidenceItem): Promise<IEvidenceItem> {
    const { data } = await httpClient.post<IEvidenceItem>(
      `/verification-cases/${caseId}/evidence`,
      input,
    );
    return data;
  },
};

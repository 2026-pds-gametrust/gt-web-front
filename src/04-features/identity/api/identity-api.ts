import { httpClient } from '@shared/lib/http';
import type {
  IUser,
  INewUser,
  IUpdateUser,
  IUpdateUserGroups,
} from '@entities/user/model';
import type {
  IProfile,
  INewProfile,
  IUpdateProfile,
  ICepLookupResult,
  IProfileNear,
} from '@entities/profile/model';

export const identityApi = {
  async listUsers(): Promise<IUser[]> {
    const { data } = await httpClient.get<IUser[]>('/users');
    return data;
  },

  async createUser(input: INewUser): Promise<IUser> {
    const { data } = await httpClient.post<IUser>('/users', input);
    return data;
  },

  async getUser(id: string): Promise<IUser | null> {
    const { data } = await httpClient.get<IUser>(`/users/${id}`);
    return data;
  },

  async updateUser(id: string, patch: IUpdateUser): Promise<IUser | null> {
    const { data } = await httpClient.put<IUser>(`/users/${id}`, patch);
    return data;
  },

  async deleteUser(id: string): Promise<boolean> {
    await httpClient.delete(`/users/${id}`);
    return true;
  },

  /** `PUT /users/{id}/groups` — ADMIN only; SYSTEM and self-escalation are 400. */
  async updateUserGroups(id: string, input: IUpdateUserGroups): Promise<IUser | null> {
    const { data } = await httpClient.put<IUser>(`/users/${id}/groups`, input);
    return data;
  },

  async verifyUser(id: string): Promise<IUser | null> {
    const { data } = await httpClient.post<IUser>(`/users/${id}/verify`);
    return data;
  },

  async listProfiles(): Promise<IProfile[]> {
    const { data } = await httpClient.get<IProfile[]>('/profiles');
    return data;
  },

  async createProfile(input: INewProfile): Promise<IProfile> {
    const { data } = await httpClient.post<IProfile>('/profiles', input);
    return data;
  },

  async getProfile(id: string): Promise<IProfile | null> {
    const { data } = await httpClient.get<IProfile>(`/profiles/${id}`);
    return data;
  },

  async updateProfile(id: string, patch: IUpdateProfile): Promise<IProfile | null> {
    const { data } = await httpClient.put<IProfile>(`/profiles/${id}`, patch);
    return data;
  },

  async getProfileByUser(userId: string): Promise<IProfile | null> {
    const { data } = await httpClient.get<IProfile>(`/profiles/by-user/${userId}`);
    return data;
  },

  async getMyProfile(): Promise<IProfile | null> {
    const { data } = await httpClient.get<IProfile>('/profiles/me');
    return data;
  },

  /** `GET /cep/{cep}` — fills an address from the postal code. */
  async lookupCep(cep: string): Promise<ICepLookupResult | null> {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    const { data } = await httpClient.get<ICepLookupResult>(`/cep/${digits}`);
    return data;
  },

  /** `GET /profiles/near` — sellers around a point, nearest first. */
  async listProfilesNear(params: {
    lat: number;
    lng: number;
    radiusMeters?: number;
    limit?: number;
  }): Promise<IProfileNear[]> {
    const query = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
    });
    if (params.radiusMeters !== undefined) {
      query.set('radiusMeters', String(params.radiusMeters));
    }
    if (params.limit !== undefined) query.set('limit', String(params.limit));

    const { data } = await httpClient.get<IProfileNear[]>(
      `/profiles/near?${query.toString()}`,
    );
    return data;
  },
};

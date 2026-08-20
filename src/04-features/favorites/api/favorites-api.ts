import { httpClient } from '@shared/lib/http';
import type { IFavorite, INewFavorite } from '@entities/favorite/model';

export const favoritesApi = {
  /** `GET /favorites` — the server scopes the list to the bearer's actor. */
  async listFavorites(): Promise<IFavorite[]> {
    const { data } = await httpClient.get<IFavorite[]>('/favorites');
    return data;
  },

  /** `POST /favorites` — ownership comes from the JWT, not from the body. */
  async createFavorite(input: INewFavorite): Promise<IFavorite> {
    const { data } = await httpClient.post<IFavorite>('/favorites', {
      id: input.id,
      targetType: input.targetType,
      targetId: input.targetId,
    });
    return data;
  },

  async deleteFavorite(id: string): Promise<boolean> {
    await httpClient.delete(`/favorites/${id}`);
    return true;
  },
};

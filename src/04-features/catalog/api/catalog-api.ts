import { httpClient } from '@shared/lib/http';
import type {
  ICategory,
  INewCategory,
  IUpdateCategory,
} from '@entities/category/model';
import type { IProduct, INewProduct, IUpdateProduct } from '@entities/product/model';
import type { IListing } from '@entities/listing/model';
import { EListingStatus } from '@entities/listing/model';
import type {
  ICategoryAttributeSchema,
  IUpsertCategoryAttributeSchema,
} from '@entities/category-attribute-schema/model';
import type { IPriceHistory } from '@entities/price-history/model';
import type {
  IServiceTaxonomy,
  INewServiceTaxonomy,
  IUpdateServiceTaxonomy,
} from '@entities/service/model';

export const catalogApi = {
  // categories
  async listCategories() {
    const { data } = await httpClient.get<ICategory[]>('/categories');
    return data;
  },

  async getCategory(id: string) {
    const { data } = await httpClient.get<ICategory>(`/categories/${id}`);
    return data;
  },

  async createCategory(input: INewCategory) {
    const { data } = await httpClient.post<ICategory>('/categories', input);
    return data;
  },

  async updateCategory(id: string, patch: IUpdateCategory) {
    const { data } = await httpClient.put<ICategory>(`/categories/${id}`, patch);
    return data;
  },

  async getAttributeSchema(categoryId: string) {
    const { data } = await httpClient.get<ICategoryAttributeSchema>(
      `/categories/${categoryId}/attribute-schema`,
    );
    return data;
  },

  async putAttributeSchema(categoryId: string, input: IUpsertCategoryAttributeSchema) {
    const { data } = await httpClient.put<ICategoryAttributeSchema>(
      `/categories/${categoryId}/attribute-schema`,
      input,
    );
    return data;
  },

  // products
  async listProducts() {
    const { data } = await httpClient.get<IProduct[]>('/products');
    return data;
  },

  async getProduct(id: string) {
    const { data } = await httpClient.get<IProduct>(`/products/${id}`);
    return data;
  },

  async createProduct(input: INewProduct) {
    const { data } = await httpClient.post<IProduct>('/products', input);
    return data;
  },

  async updateProduct(id: string, patch: IUpdateProduct) {
    const { data } = await httpClient.put<IProduct>(`/products/${id}`, patch);
    return data;
  },

  async getPriceHistory(productId: string) {
    const { data } = await httpClient.get<IPriceHistory[]>(
      `/products/${productId}/price-history`,
    );
    return data;
  },

  // services
  async listServices() {
    const { data } = await httpClient.get<IServiceTaxonomy[]>('/services');
    return data;
  },

  async getService(id: string) {
    const { data } = await httpClient.get<IServiceTaxonomy>(`/services/${id}`);
    return data;
  },

  async createService(input: INewServiceTaxonomy) {
    const { data } = await httpClient.post<IServiceTaxonomy>('/services', input);
    return data;
  },

  async updateService(id: string, patch: IUpdateServiceTaxonomy) {
    const { data } = await httpClient.put<IServiceTaxonomy>(`/services/${id}`, patch);
    return data;
  },

  /**
   * Offers of a catalog model. `GET /listings` has no productId filter, so the
   * narrowing happens here — and only PUBLISHED offers may be promoted.
   */
  async getListingsByProduct(productId: string): Promise<IListing[]> {
    const { data } = await httpClient.get<IListing[]>('/listings');
    return data.filter(
      (listing) =>
        listing.productId === productId && listing.status === EListingStatus.PUBLISHED,
    );
  },
};

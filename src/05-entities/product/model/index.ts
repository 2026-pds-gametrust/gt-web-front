export const EProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EProductStatus = (typeof EProductStatus)[keyof typeof EProductStatus];

export interface IProduct {
  id: string;
  categoryId: string;
  brand: string;
  model: string;
  series?: string;
  slug: string;
  mpn?: string;
  ean?: string;
  sku?: string;
  specs?: Record<string, string | number | boolean>;
  imageUrls?: string[];
  referencePriceCents?: number;
  currency?: string;
  status: EProductStatus;
  createdAt: string;
  updatedAt: string;
}

/** `POST /products` — backoffice/admin. A product is the catalog model, not an offer. */
export interface INewProduct {
  id: string;
  categoryId: string;
  brand: string;
  model: string;
  series?: string;
  slug: string;
  mpn?: string;
  ean?: string;
  sku?: string;
  specs?: Record<string, string | number | boolean>;
  imageUrls?: string[];
  referencePriceCents?: number;
  currency?: string;
  status?: EProductStatus;
}

/** `PUT /products/{id}` */
export type IUpdateProduct = Partial<Omit<INewProduct, 'id'>>;

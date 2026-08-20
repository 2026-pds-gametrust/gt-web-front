export const EAttributeValueType = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  ENUM: 'ENUM',
} as const;

export type EAttributeValueType =
  (typeof EAttributeValueType)[keyof typeof EAttributeValueType];

export const EAttributeFacetOn = {
  PRODUCT: 'PRODUCT',
  LISTING: 'LISTING',
  BOTH: 'BOTH',
} as const;

export type EAttributeFacetOn = (typeof EAttributeFacetOn)[keyof typeof EAttributeFacetOn];

export interface IAttributeDef {
  key: string;
  name: string;
  valueType: EAttributeValueType;
  required: boolean;
  filterable: boolean;
  facetOn: EAttributeFacetOn;
  enumValues?: string[];
  unit?: string;
  maxLength?: number;
  allowVariations?: boolean;
  group?: string;
}

export interface ICategoryAttributeSchema {
  id: string;
  categoryId: string;
  attributes: IAttributeDef[];
  version: number;
  createdAt: string;
  updatedAt?: string;
}

export type IUpsertCategoryAttributeSchema = {
  id: string;
  attributes: IAttributeDef[];
  version?: number;
};

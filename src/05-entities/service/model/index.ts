export const EServiceStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EServiceStatus = (typeof EServiceStatus)[keyof typeof EServiceStatus];

export interface IServiceTaxonomy {
  id: string;
  slug: string;
  name: string;
  synonyms: string[];
  status: EServiceStatus;
  createdAt: string;
  updatedAt?: string;
}

export type INewServiceTaxonomy = {
  id: string;
  slug: string;
  name: string;
  synonyms?: string[];
  status?: EServiceStatus;
};

export type IUpdateServiceTaxonomy = Partial<Omit<INewServiceTaxonomy, 'id'>>;

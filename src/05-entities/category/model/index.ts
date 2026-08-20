export const ECategoryStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ECategoryStatus = (typeof ECategoryStatus)[keyof typeof ECategoryStatus];

export interface ICategory {
  id: string;
  slug: string;
  name: string;
  synonyms?: string[];
  parentId?: string | null;
  status: ECategoryStatus;
  createdAt: string;
  updatedAt: string;
}

/** `POST /categories` — backoffice/admin. */
export interface INewCategory {
  id: string;
  slug: string;
  name: string;
  synonyms?: string[];
  parentId?: string | null;
  status?: ECategoryStatus;
}

/** `PUT /categories/{id}` */
export type IUpdateCategory = Partial<Omit<INewCategory, 'id'>>;

export interface IAddress {
  id: string;
  label?: string;
  recipientName: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  isBilling?: boolean;
  isShipping?: boolean;
}

export interface IGeoPoint {
  lat: number;
  lng: number;
}

/** `GET /cep/{cep}` — postal code lookup used to prefill an address. */
export interface ICepLookupResult {
  postalCode: string;
  street?: string;
  district?: string;
  city: string;
  state: string;
  geo?: IGeoPoint;
}

/** `GET /profiles/near` — a public profile plus its distance from the query point. */
export interface IProfileNear {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  locationApprox?: string;
  distanceMeters: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  locationApprox?: string;
  addresses: IAddress[];
  defaultShippingAddressId?: string;
  setupItems?: Record<string, unknown>[];
  createdAt: string;
  updatedAt?: string;
}

export type INewProfile = {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  locationApprox?: string;
  addresses?: IAddress[];
  defaultShippingAddressId?: string;
  setupItems?: Record<string, unknown>[];
};

export type IUpdateProfile = Partial<Omit<INewProfile, 'id' | 'userId'>>;

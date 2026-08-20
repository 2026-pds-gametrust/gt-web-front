export interface ITrustScoreComponents {
  salesCount?: number;
  problemFreeRate?: number;
  responseRate?: number;
  verificationBonus?: number;
  [key: string]: number | undefined;
}

/** API TrustScore schema — level/reasons are composed in features from seller-level + trust-events. */
export interface ITrustScore {
  id: string;
  sellerId: string;
  score: number;
  components: ITrustScoreComponents;
  computedAt: string;
  updatedAt?: string;
}

/** UI view-model: score + seller level + human reasons (never invent). */
export interface ITrustDisplay {
  score: number;
  level: string;
  reasons: string[];
}

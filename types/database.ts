// Database and Configuration Type Definitions

export interface StoreConfig {
  discounts: Record<string, number>;
  vat: number;
  descriptions: Record<string, string>;
  currency: string;
  storeName: string;
  storeDescription: string;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  active: boolean;
  expiresAt?: number;
}

export interface ProductDescription {
  productId: number;
  description: string;
  features?: string[];
  materials?: string[];
}

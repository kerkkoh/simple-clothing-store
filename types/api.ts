// API Response Type Definitions

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export interface OrderCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  cart: {
    items: Array<{
      id: number;
      quantity: number;
      retail_price: string;
    }>;
    discountCode?: string;
  };
}

export interface OrderCreationResponse {
  orderId: string | number;
  total: string;
  currency: string;
}

export interface DiscountValidationResponse {
  valid: boolean;
  percentage?: number;
  message?: string;
}

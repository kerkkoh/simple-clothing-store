// Shopping Cart Type Definitions

export interface CartItem {
  id: number;
  name: string;
  variantName: string;
  retail_price: string;
  price: number;
  currency: string;
  image: string;
  quantity?: number;
  product?: {
    variant_id: number;
    product_id: number;
  };
}

export interface Cart {
  items: CartItem[];
  discountCode?: string;
  discountAmount?: number;
  currency: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  vat: number;
  total: number;
  currency: string;
}

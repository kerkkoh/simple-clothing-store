// Printful API v2 Type Definitions

export interface PrintfulProduct {
  id: number;
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    thumbnail_url: string;
    is_ignored?: boolean;
  };
  sync_variants: PrintfulVariant[];
  description?: string;
}

export interface PrintfulVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  is_ignored: boolean;
  sku: string | null;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: PrintfulFile[];
}

export interface PrintfulFile {
  id: number;
  type: string;
  hash: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
}

export interface PrintfulStoreInfo {
  id: number;
  name: string;
  type: string;
  website: string;
  currency: string;
  created: number;
}

export interface PrintfulOrder {
  id: string | number;
  external_id?: string;
  status: 'draft' | 'pending' | 'failed' | 'canceled' | 'inprocess' | 'onhold' | 'partial' | 'fulfilled';
  shipping?: string;
  shipping_service_name?: string;
  created: number;
  updated: number;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  retail_costs: PrintfulCosts;
  costs?: PrintfulCosts;
  shipments?: PrintfulShipment[];
}

export interface PrintfulRecipient {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  state_name?: string;
  country_code: string;
  country_name?: string;
  zip: string;
  phone?: string;
  email: string;
  tax_number?: string;
}

export interface PrintfulOrderItem {
  id?: number;
  external_id?: string;
  variant_id?: number;
  sync_variant_id?: number;
  external_variant_id?: string;
  quantity: number;
  price?: string;
  retail_price?: string;
  name?: string;
  product?: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files?: PrintfulFile[];
  options?: PrintfulItemOption[];
}

export interface PrintfulItemOption {
  id: string;
  value: string;
}

export interface PrintfulCosts {
  currency: string;
  subtotal: string;
  discount: string;
  shipping: string;
  digitization?: string;
  additional_fee?: string;
  fulfillment_fee?: string;
  tax: string;
  vat?: string;
  total: string;
}

export interface PrintfulShipment {
  id: number;
  carrier: string;
  service: string;
  tracking_number: string;
  tracking_url: string;
  created: number;
  ship_date: string;
  shipped_at: number;
  reshipment: boolean;
  items: PrintfulShipmentItem[];
}

export interface PrintfulShipmentItem {
  item_id: number;
  quantity: number;
  picked?: number;
  printed?: number;
}

export interface PrintfulCountry {
  code: string;
  name: string;
  states?: PrintfulState[];
}

export interface PrintfulState {
  code: string;
  name: string;
}

export interface CreateOrderRequest {
  external_id?: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  retail_costs?: Partial<PrintfulCosts>;
  confirm?: boolean;
}

export interface EstimateCostsRequest {
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  currency?: string;
  locale?: string;
}

export interface PrintfulError extends Error {
  code?: number;
  result?: string;
  error?: {
    reason: string;
    message: string;
  };
}

export interface PrintfulRateLimit {
  limit: string | null;
  remaining: string | null;
  reset: string | null;
}

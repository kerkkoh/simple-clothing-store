// PayPal Type Definitions

export interface PayPalOrderRequest {
  intent: 'CAPTURE';
  purchase_units: PayPalPurchaseUnit[];
  application_context?: {
    brand_name?: string;
    locale?: string;
    landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
    shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
    user_action?: 'CONTINUE' | 'PAY_NOW';
    return_url?: string;
    cancel_url?: string;
  };
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  amount: {
    currency_code: string;
    value: string;
    breakdown?: {
      item_total?: MoneyValue;
      shipping?: MoneyValue;
      handling?: MoneyValue;
      tax_total?: MoneyValue;
      insurance?: MoneyValue;
      shipping_discount?: MoneyValue;
      discount?: MoneyValue;
    };
  };
  items?: PayPalItem[];
  shipping?: {
    name?: {
      full_name?: string;
    };
    address?: {
      address_line_1?: string;
      address_line_2?: string;
      admin_area_2?: string;
      admin_area_1?: string;
      postal_code?: string;
      country_code: string;
    };
  };
}

export interface PayPalItem {
  name: string;
  unit_amount: MoneyValue;
  tax?: MoneyValue;
  quantity: string;
  description?: string;
  sku?: string;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
}

export interface MoneyValue {
  currency_code: string;
  value: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  purchase_units: PayPalPurchaseUnit[];
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  purchase_units: PayPalPurchaseUnit[];
  payer: {
    email_address?: string;
    payer_id?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
    address?: {
      country_code?: string;
    };
  };
}

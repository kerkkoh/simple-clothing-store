// Printful API v2 Client

import type {
  PrintfulProduct,
  PrintfulOrder,
  PrintfulCountry,
  PrintfulStoreInfo,
  CreateOrderRequest,
  EstimateCostsRequest,
  PrintfulError,
  PrintfulRateLimit,
} from '@/types/printful';

interface PrintfulConfig {
  apiKey: string;
  storeId?: string;
}

class PrintfulAPIError extends Error implements PrintfulError {
  code?: number;
  result?: string;
  error?: { reason: string; message: string };
  rateLimit?: PrintfulRateLimit;

  constructor(message: string, code?: number, rateLimit?: PrintfulRateLimit) {
    super(message);
    this.name = 'PrintfulAPIError';
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

export class PrintfulClient {
  private baseUrl = 'https://api.printful.com';
  private apiKey: string;
  private storeId?: string;

  constructor(config: PrintfulConfig) {
    this.apiKey = config.apiKey;
    this.storeId = config.storeId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.storeId) {
      headers['X-PF-Store-Id'] = this.storeId;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Capture rate limit headers
    const rateLimit: PrintfulRateLimit = {
      limit: response.headers.get('X-Ratelimit-Limit'),
      remaining: response.headers.get('X-Ratelimit-Remaining'),
      reset: response.headers.get('X-Ratelimit-Reset'),
    };

    if (!response.ok) {
      let errorMessage = `Printful API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.result || errorMessage;
      } catch {
        // If we can't parse error response, use default message
      }
      throw new PrintfulAPIError(errorMessage, response.status, rateLimit);
    }

    const data = await response.json();
    return data.result || data;
  }

  // Store endpoints
  async getStoreInfo(): Promise<PrintfulStoreInfo> {
    return this.request<PrintfulStoreInfo>('store');
  }

  // Product endpoints
  async getProducts(): Promise<PrintfulProduct[]> {
    return this.request<PrintfulProduct[]>('store/products');
  }

  async getProduct(id: string | number): Promise<PrintfulProduct> {
    return this.request<PrintfulProduct>(`store/products/${id}`);
  }

  // Order endpoints
  async createOrder(orderData: CreateOrderRequest): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string | number): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>(`orders/${id}`);
  }

  async getOrders(params?: {
    status?: string;
    offset?: number;
    limit?: number;
  }): Promise<PrintfulOrder[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.offset) query.append('offset', params.offset.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const endpoint = `orders${query.toString() ? `?${query.toString()}` : ''}`;
    return this.request<PrintfulOrder[]>(endpoint);
  }

  async confirmOrder(id: string | number): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>(`orders/${id}/confirm`, {
      method: 'POST',
    });
  }

  async cancelOrder(id: string | number): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>(`orders/${id}`, {
      method: 'DELETE',
    });
  }

  async estimateCosts(orderData: EstimateCostsRequest): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>('orders/estimate-costs', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Country endpoints
  async getCountries(): Promise<PrintfulCountry[]> {
    return this.request<PrintfulCountry[]>('countries');
  }
}

// Create singleton instance
export const printful = new PrintfulClient({
  apiKey: process.env.PRINTFUL_SECRET || '',
  storeId: process.env.PRINTFUL_STORE_ID,
});

// Export for testing or custom instances
export default PrintfulClient;

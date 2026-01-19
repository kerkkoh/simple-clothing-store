// PayPal SDK v2 Integration
// Note: This uses the PayPal REST API directly instead of the SDK
// The SDK has compatibility issues - we'll use fetch for API calls

const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Get PayPal order details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getOrder(orderId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get PayPal order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal getOrder error:', error);
    throw error;
  }
}

/**
 * Capture payment for an order
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function captureOrder(orderId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to capture PayPal order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal captureOrder error:', error);
    throw error;
  }
}

/**
 * Verify order capture is completed
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOrderCaptured(order: any): boolean {
  return order?.status === 'COMPLETED';
}

/**
 * Get order total amount
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOrderAmount(order: any): { value: string; currency: string } | null {
  const purchaseUnit = order?.purchase_units?.[0];
  if (!purchaseUnit?.amount) return null;

  return {
    value: purchaseUnit.amount.value,
    currency: purchaseUnit.amount.currency_code || 'USD',
  };
}

/**
 * Get custom order ID from PayPal order
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCustomOrderId(order: any): string | null {
  return order?.purchase_units?.[0]?.custom_id || null;
}

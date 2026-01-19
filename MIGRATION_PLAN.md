# Simple Clothing Store v2.0.0 - Migration Plan

## Executive Summary

The Simple Clothing Store currently runs on an outdated stack (CRA + Express with Node 13.14) and uses deprecated APIs. This plan outlines a complete modernization to Next.js 15 with TypeScript, updated API integrations, serverless architecture, and Vercel deployment.

**Current Architecture:**
- **Backend:** Express server (server.js) with in-memory product cache
- **Frontend:** Create React App with React 17, React Router, Bootstrap 5
- **APIs:** Printful API v1 (broken), PayPal Checkout Server SDK v1 (deprecated)
- **Data Storage:** In-memory (products), localStorage (cart), lib/datab.js (config)
- **Deployment:** Docker-based, designed for Heroku

**Target Architecture:**
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript throughout
- **APIs:** Printful API v2, PayPal Server SDK v2
- **Database:** Upstash Redis for configuration and caching
- **Deployment:** Vercel serverless with free tier

---

## 1. MIGRATION TO NEXT.JS

### Current Implementation
- **Build System:** Create React App (React 17)
- **Routing:** React Router v5 with routes: `/`, `/product/:id`, `/cart`, `/order/:id`
- **State Management:** React hooks with props drilling
- **Server:** Separate Express server serving built React app
- **Development:** Two separate dev servers (frontend:3000, backend:3001)

### What Needs to Change

1. **Unified Architecture:** Merge Express backend routes into Next.js API routes
2. **Routing System:** Replace React Router with Next.js App Router
3. **SSR/SSG:** Leverage server-side rendering for product pages (SEO)
4. **Build Process:** Single build command instead of build-then-serve
5. **Development:** Single dev server with hot reload

### Implementation Approach: App Router (Recommended)

**Rationale:** App Router provides better performance, improved SEO with Metadata API, Server Components for reduced JavaScript bundle, and is the future-proof choice for Next.js as of 2026.

**Directory Structure:**
```
/app
├── layout.tsx                 # Root layout (replaces App.js)
├── page.tsx                   # Home/Store listing (/)
├── product/[id]/page.tsx      # Product detail (/product/:id)
├── cart/page.tsx              # Shopping cart (/cart)
├── order/[id]/page.tsx        # Order detail (/order/:id)
├── api/                       # API routes (replaces server.js routes)
│   ├── products/route.ts
│   ├── store/route.ts
│   ├── orders/route.ts
│   ├── discount/[code]/route.ts
│   └── confirm/[orderId]/route.ts
├── components/                # React components
│   ├── Navigation.tsx
│   ├── Product.tsx
│   ├── Store.tsx
│   ├── cart/
│   ├── order/
│   └── utils/
└── lib/                       # Utilities (move from root/lib)
    ├── printful.ts
    ├── paypal.ts
    └── db.ts
```

### Step-by-Step Migration Strategy

**Phase 1: Setup Next.js Project (1-2 days)**
1. Create new Next.js 15 project with App Router and TypeScript: `npx create-next-app@latest --typescript --app --tailwind`
2. Install dependencies: Bootstrap, currency.js, axios (or use native fetch)
3. Configure next.config.js for environment variables
4. Set up TypeScript configs (tsconfig.json)

**Phase 2: Migrate Components (3-4 days)**
1. Convert React components to TypeScript (.js → .tsx)
   - Start with leaf components (Loader, Notification)
   - Move to complex components (Product, Store, Cart)
   - Define TypeScript interfaces for props
2. Replace React Router navigation with Next.js Link components
3. Replace useHistory/withRouter with useRouter from next/navigation
4. Convert class-based styles to CSS modules or Tailwind (optional)

**Phase 3: Migrate Routes (2-3 days)**
1. Create App Router pages from React Router routes:
   - `/` → `app/page.tsx` (Store component)
   - `/product/:id` → `app/product/[id]/page.tsx`
   - `/cart` → `app/cart/page.tsx`
   - `/order/:id` → `app/order/[id]/page.tsx`
2. Implement layouts (app/layout.tsx with Navigation)
3. Add loading.tsx and error.tsx for each route
4. Configure metadata for SEO

**Phase 4: Migrate Backend API (3-4 days)**
1. Convert Express routes to Next.js API routes:
   - `GET /api/products` → `app/api/products/route.ts`
   - `POST /api/orders` → `app/api/orders/route.ts`
   - `GET /api/discount/:code` → `app/api/discount/[code]/route.ts`
   - etc.
2. Move lib/ utilities to Next.js lib/ directory
3. Implement proper error handling and response types
4. Add middleware for CORS, rate limiting if needed

### Architectural Trade-offs

**Pros:**
- Single codebase, easier maintenance
- Better SEO with SSR/SSG for product pages
- Faster page loads with Server Components
- Built-in API routes eliminate need for Express
- Hot reload for entire stack

**Cons:**
- Learning curve for team unfamiliar with Next.js
- Migration effort significant (~2-3 weeks)
- Some React patterns require adjustment (useEffect in Server Components)

### Potential Challenges & Solutions

**Challenge 1:** Client-side state (cart, orders) in Server Components
- **Solution:** Use "use client" directive for interactive components
- Keep Server Components for static/data-fetching parts
- Create client boundary at minimal level (e.g., CartClient component)

**Challenge 2:** localStorage access in SSR
- **Solution:** Create hooks that safely check typeof window !== 'undefined'
- Use React.useEffect to hydrate client-side state
- Consider moving cart to database or session storage

**Challenge 3:** Routing transitions animations
- **Solution:** React Router Transition won't work; use Framer Motion or similar
- Alternative: Keep transitions minimal for now

---

## 2. MIGRATION TO TYPESCRIPT

### Current Implementation
- **Language:** Pure JavaScript throughout
- **Type Safety:** PropTypes for React components
- **Validation:** None on backend

### What Needs to Change

1. **File Extensions:** .js → .ts (Node), .js → .tsx (React)
2. **Type Definitions:** PropTypes → TypeScript interfaces/types
3. **API Contracts:** Define request/response types
4. **External Libraries:** Add @types packages where needed

### Implementation Approach

**Phase 1: Type Definitions (1-2 days)**

Create comprehensive types in `/types` directory:

```typescript
// types/printful.ts
export interface PrintfulProduct {
  id: number;
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    thumbnail_url: string;
  };
  sync_variants: PrintfulVariant[];
  description?: string;
}

export interface PrintfulVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  retail_price: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
}

// types/cart.ts
export interface CartItem {
  id: number;
  name: string;
  retail_price: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  discountCode?: string;
  discountAmount?: number;
}

// types/order.ts
export interface Order {
  id: string;
  status: 'draft' | 'pending' | 'fulfilled' | 'canceled';
  created: number;
  recipient: Address;
  items: OrderItem[];
  retail_costs: Costs;
  costs: Costs;
  shipments: Shipment[];
  shipping_service_name: string;
}

// types/api.ts
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

**Phase 2: Convert Backend (2-3 days)**

1. Convert lib files to TypeScript:
   - `lib/printfulclient.js` → `lib/printful.ts`
   - `lib/paypal.js` → `lib/paypal.ts`
   - `lib/datab.js` → `lib/db.ts`

2. Type API routes with request/response types:
```typescript
// app/api/products/route.ts
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PrintfulProduct[]>>> {
  try {
    const products = await getProducts();
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

**Phase 3: Convert Frontend (3-4 days)**

1. Convert components in dependency order (leaf → root)
2. Replace PropTypes with TypeScript interfaces
3. Type hooks and event handlers
4. Enable strict mode gradually

Example conversion:
```typescript
// Before (JS with PropTypes)
const Product = ({product, addToCart}) => {
  // ...
}
Product.propTypes = {
  product: PropTypes.object,
  addToCart: PropTypes.func,
}

// After (TypeScript)
interface ProductProps {
  product: PrintfulProduct;
  addToCart: (item: CartItem) => void;
}

const Product: React.FC<ProductProps> = ({product, addToCart}) => {
  // ...
}
```

**Phase 4: Strict Type Checking (1 day)**

1. Enable strict mode in tsconfig.json incrementally:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

2. Fix all type errors
3. Add ESLint rules for TypeScript

### Migration Strategy to Minimize Breaking Changes

1. **Incremental Adoption:** Use `.ts` and `.js` side-by-side during migration
2. **Type Assertions:** Use `as` sparingly for quick fixes, refactor later
3. **Any Type:** Allow `any` temporarily, mark with `// TODO: type properly`
4. **Testing:** Verify each converted file still works

### Potential Challenges & Solutions

**Challenge 1:** Printful API types not documented
- **Solution:** Capture actual API responses and generate types
- Use tools like quicktype.io or json2ts.com

**Challenge 2:** Currency.js typing issues
- **Solution:** Already has @types/currency.js, but may need custom type guards

**Challenge 3:** localStorage typing
- **Solution:** Create typed wrapper functions with JSON parsing

---

## 3. PRINTFUL API V2 MIGRATION

### Current Implementation

**File:** `lib/printfulclient.js`
- Custom HTTP client using Node's https module
- Endpoints: `store/products`, `store`, `orders`, `orders/estimate-costs`, `countries`
- Authentication: Basic auth with API key
- Callback-based API with .success() and .error() methods

**Current Usage Patterns:**
```javascript
pf.get('store/products')
  .success((data, info) => { /* ... */ })
  .error((err, info) => console.error(info))

pf.post('orders', body)
  .success((data, info) => res.send(`${data.id}`))
  .error((error, info) => res.sendStatus(400))
```

### What Needs to Change

Based on Printful API v2 Documentation, key changes include:

1. **Endpoint URLs:** Add `/v2` prefix: `https://api.printful.com/v2/orders`
2. **Authentication:** Same token-based auth (compatible)
3. **Response Format:** Standardized with ISO 8601 timestamps, consistent price formats
4. **Rate Limiting:** New leaky bucket algorithm with `X-Ratelimit-*` headers
5. **Order Creation:** New flexible itemized approach
6. **Webhooks:** New events for stock changes, price updates
7. **Pagination:** Uniform parameters across endpoints

### Implementation Approach

**Step 1: Create Modern API Client (2-3 days)**

Replace custom client with modern fetch-based implementation:

```typescript
// lib/printful.ts
import type { PrintfulProduct, PrintfulOrder, PrintfulCountry } from '@/types/printful';

interface PrintfulConfig {
  apiKey: string;
  apiVersion: 'v2';
}

class PrintfulClient {
  private baseUrl = 'https://api.printful.com';
  private apiKey: string;
  private version: string;

  constructor(config: PrintfulConfig) {
    this.apiKey = config.apiKey;
    this.version = config.apiVersion;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${this.version}/${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID,
        ...options.headers,
      },
    });

    // Handle rate limiting
    const rateLimit = {
      limit: response.headers.get('X-Ratelimit-Limit'),
      remaining: response.headers.get('X-Ratelimit-Remaining'),
      reset: response.headers.get('X-Ratelimit-Reset'),
    };

    if (!response.ok) {
      const error = await response.json();
      throw new PrintfulError(error.message, response.status, rateLimit);
    }

    const data = await response.json();
    return data.result;
  }

  async getProducts(): Promise<PrintfulProduct[]> {
    return this.request<PrintfulProduct[]>('catalog/products');
  }

  async getProduct(id: string): Promise<PrintfulProduct> {
    return this.request<PrintfulProduct>(`catalog/products/${id}`);
  }

  async getStoreInfo() {
    return this.request('store');
  }

  async createOrder(orderData: CreateOrderRequest): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>(`orders/${id}`);
  }

  async confirmOrder(id: string): Promise<PrintfulOrder> {
    return this.request<PrintfulOrder>(`orders/${id}/confirm`, {
      method: 'POST',
    });
  }

  async estimateCosts(orderData: EstimateCostsRequest) {
    return this.request('orders/estimate-costs', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getCountries(): Promise<PrintfulCountry[]> {
    return this.request<PrintfulCountry[]>('countries');
  }
}

export const printful = new PrintfulClient({
  apiKey: process.env.PRINTFUL_SECRET!,
  apiVersion: 'v2',
});
```

**Step 2: Update API Endpoints (1-2 days)**

Migrate server.js routes to Next.js API routes with v2 calls:

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await printful.getProducts();

    // Merge with database descriptions
    const enrichedProducts = products.map(product => ({
      ...product,
      description: db.getProductDescription(product.id) ||
        `Add description in database for product ${product.id}`,
    }));

    return NextResponse.json(enrichedProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

**Step 3: Update Order Creation Flow (2-3 days)**

The v2 API supports flexible order creation. Update the order creation logic:

```typescript
// app/api/orders/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, phone, address, city, state, country, zip, cart } = body;

  const recipient = {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    address1: address,
    city,
    state_code: state,
    country_code: country,
    zip,
  };

  const items = cart.items.map((item: CartItem) => ({
    sync_variant_id: item.id,
    quantity: 1,
    retail_price: item.retail_price,
  }));

  // Step 1: Estimate costs (including shipping)
  const estimate = await printful.estimateCosts({
    recipient,
    items,
  });

  // Step 2: Calculate discount and VAT
  const discount = db.getDiscount(cart.discountCode);
  const subtotal = calculateSubtotal(items);
  const discountAmount = discount ? subtotal * (1 - discount / 100) : 0;
  const vat = (subtotal + estimate.costs.shipping - discountAmount) * (db.vat / 100);

  // Step 3: Create order with all costs
  const order = await printful.createOrder({
    recipient,
    items,
    retail_costs: {
      discount: discountAmount.toFixed(2),
      tax: vat.toFixed(2),
    },
  });

  return NextResponse.json({ orderId: order.id });
}
```

**Step 4: Implement Webhooks (Optional, 1-2 days)**

Printful v2 supports webhooks for real-time updates:

```typescript
// app/api/webhooks/printful/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const signature = headersList.get('X-Printful-Signature');

  // Verify webhook signature
  if (!verifySignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = await request.json();

  switch (event.type) {
    case 'order_updated':
      // Update order status in database
      await db.updateOrderStatus(event.data.id, event.data.status);
      break;
    case 'stock_updated':
      // Invalidate product cache
      await revalidateTag('products');
      break;
  }

  return NextResponse.json({ received: true });
}
```

### Migration Strategy

1. **Parallel Testing:** Keep v1 code, test v2 in development
2. **Feature Flags:** Use environment variable to toggle between v1/v2
3. **Gradual Rollout:** Migrate read endpoints first (products, store), then writes (orders)
4. **Monitoring:** Log all API calls, track error rates

### Potential Challenges & Solutions

**Challenge 1:** API v2 endpoints may have different response schemas
- **Solution:** Capture real responses, update TypeScript types accordingly
- Create adapter layer if needed to maintain compatibility

**Challenge 2:** Rate limiting is stricter in v2
- **Solution:** Implement caching for product data (Next.js cache, or Redis)
- Add retry logic with exponential backoff

**Challenge 3:** Orders created in v1 may not be accessible in v2
- **Solution:** API should be backward compatible, but test thoroughly
- Keep v1 client as fallback for order retrieval if needed

---

## 4. PAYPAL INTEGRATION UPDATE

### Current Implementation

**Files:**
- `lib/paypal.js` - Server-side SDK client
- `frontend/src/components/order/Payment.js` - Client-side button

**Current Stack:**
- Server: `@paypal/checkout-server-sdk` v1.0.2 (DEPRECATED)
- Client: `react-paypal-button-v2` v2.6.1
- Environment: Sandbox mode

**Flow:**
1. Client creates PayPal order with order details
2. User approves payment in PayPal popup
3. Client captures payment
4. Server confirms with Printful

### What Needs to Change

The `@paypal/checkout-server-sdk` is deprecated. PayPal now recommends `@paypal/paypal-server-sdk` (latest v2.1.0). Client-side should use PayPal JavaScript SDK v6.

### Implementation Approach

**Step 1: Update Server-Side SDK (1 day)**

```typescript
// lib/paypal.ts
import { PayPalClient, OrdersController, Environment } from '@paypal/paypal-server-sdk';

const environment = process.env.NODE_ENV === 'production'
  ? Environment.Production
  : Environment.Sandbox;

const client = new PayPalClient({
  clientCredentialsAuth: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment,
});

const ordersController = new OrdersController(client);

export async function getOrder(orderId: string) {
  const response = await ordersController.ordersGet({
    id: orderId,
  });
  return response.result;
}

export async function captureOrder(orderId: string) {
  const response = await ordersController.ordersCapture({
    id: orderId,
  });
  return response.result;
}
```

**Step 2: Update Payment Confirmation Endpoint (1 day)**

```typescript
// app/api/confirm/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/paypal';
import { printful } from '@/lib/printful';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    // Get PayPal order details
    const paypalOrder = await getOrder(orderId);

    // Extract Printful order ID from custom_id
    const printfulOrderId = paypalOrder.purchase_units[0].custom_id;

    // Get Printful order
    const printfulOrder = await printful.getOrder(printfulOrderId);

    // Verify order status and amount match
    if (
      printfulOrder.status === 'draft' &&
      printfulOrder.retail_costs.total === paypalOrder.purchase_units[0].amount.value
    ) {
      if (process.env.DEMO !== 'true') {
        // Confirm with Printful (not in demo mode)
        await printful.confirmOrder(printfulOrderId);
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Order validation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}
```

**Step 3: Update Client-Side Integration (1-2 days)**

Replace `react-paypal-button-v2` with PayPal JavaScript SDK v6:

```typescript
// components/order/Payment.tsx
'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

interface PaymentProps {
  order: Order;
  costs: Costs;
  clientID: string;
  onSuccess: () => void;
}

export default function Payment({ order, costs, clientID, onSuccess }: PaymentProps) {
  const [loading, setLoading] = useState(false);

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientID,
        currency: costs.currency || 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical' }}
        disabled={loading}
        createOrder={async (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: costs.currency,
                value: costs.total,
                breakdown: {
                  item_total: {
                    currency_code: costs.currency,
                    value: costs.subtotal,
                  },
                  shipping: {
                    currency_code: costs.currency,
                    value: costs.shipping,
                  },
                  tax_total: {
                    currency_code: costs.currency,
                    value: (parseFloat(costs.tax) + parseFloat(costs.vat)).toFixed(2),
                  },
                  discount: {
                    currency_code: costs.currency,
                    value: costs.discount,
                  },
                },
              },
              custom_id: order.id.toString(),
              description: `Order #${order.id}`,
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              brand_name: 'CLOTHING STORE',
            },
          });
        }}
        onApprove={async (data, actions) => {
          setLoading(true);
          try {
            await actions.order?.capture();

            // Confirm with backend
            const response = await fetch(`/api/confirm/${data.orderID}`, {
              method: 'POST',
            });

            if (response.ok) {
              onSuccess();
            } else {
              throw new Error('Confirmation failed');
            }
          } catch (error) {
            console.error('Payment approval failed:', error);
            alert('Payment failed. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        onError={(error) => {
          console.error('PayPal error:', error);
          alert('Payment error. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
}
```

**Step 4: Verify Sandbox/Production Toggle (0.5 day)**

Ensure environment switching works:

```typescript
// lib/paypal.ts (update)
const environment = process.env.PAYPAL_ENVIRONMENT === 'production'
  ? Environment.Production
  : Environment.Sandbox;
```

### Migration Strategy

1. **Parallel Implementation:** Build new SDK integration alongside old one
2. **Feature Flag:** Toggle between implementations via environment variable
3. **Sandbox Testing:** Thoroughly test all payment flows in sandbox
4. **Gradual Rollout:** Deploy to production with monitoring

### Verification Checklist

- [ ] PayPal sandbox payments work end-to-end
- [ ] Order amounts match between PayPal and Printful
- [ ] Failed payments don't create Printful orders
- [ ] Confirmation endpoint validates properly
- [ ] Production environment configured (when ready)

### Potential Challenges & Solutions

**Challenge 1:** Breaking changes between SDK versions
- **Solution:** New SDK has better documentation and examples
- Refer to official migration guide

**Challenge 2:** Client-side SDK script loading in Next.js
- **Solution:** Use `@paypal/react-paypal-js` which handles script loading
- Or use Next.js Script component with strategy="lazyOnload"

**Challenge 3:** Currency handling differences
- **Solution:** Ensure currency.js formatting matches PayPal's expected format
- Use `.format()` method consistently: `currency(10.50).format()` → "10.50"

---

## 5. DATABASE SOLUTION FOR SERVERLESS

### Current Implementation

**State Management:**
- **Products:** In-memory cache loaded on server startup
- **Cart:** Client-side localStorage
- **Orders:** Client-side localStorage for tracking user's orders
- **Config:** Hardcoded in lib/datab.js (discounts, VAT, descriptions)
- **Demo Confirmed Orders:** In-memory array

**Problems with Serverless:**
1. In-memory cache (products, confirmed) won't persist across function invocations
2. Each API route invocation may have cold start without cached data
3. Global state doesn't work in serverless/edge environments

### What Needs to Change

**Stateless Requirements:**
1. Products must be fetched from Printful or cached in persistent storage
2. Demo confirmed orders need persistent storage
3. Configuration (discounts, VAT, descriptions) needs database or file-based storage
4. Sessions/cart could optionally be server-side

**Data to Store:**
- Product descriptions
- Discount codes and percentages
- VAT rate
- Store configuration
- Optional: User sessions, cart data, order tracking

### Implementation Approach

**Recommendation: Upstash Redis**

**Rationale:**
- Simple key-value needs fit Redis perfectly
- Faster than Postgres for cache operations
- Easier setup and lower latency at edge
- Current data structure is already key-value oriented

### Step-by-Step Implementation

**Step 1: Set Up Upstash Redis (0.5 day)**

1. Install Upstash Redis SDK:
```bash
npm install @upstash/redis
```

2. Create Upstash database via Vercel Marketplace or Upstash.com
3. Add environment variables:
```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

4. Create Redis client:
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

**Step 2: Migrate Configuration Data (1 day)**

Replace lib/datab.js with database-backed storage:

```typescript
// lib/db.ts
import { redis } from './redis';

interface StoreConfig {
  discounts: Record<string, number>;
  vat: number;
  descriptions: Record<string, string>;
}

const DEFAULT_CONFIG: StoreConfig = {
  discounts: {
    'TEST': 80,
  },
  vat: 24,
  descriptions: {},
};

export class Database {
  private configKey = 'store:config';

  async getConfig(): Promise<StoreConfig> {
    const config = await redis.get<StoreConfig>(this.configKey);
    return config || DEFAULT_CONFIG;
  }

  async updateConfig(config: Partial<StoreConfig>): Promise<void> {
    const current = await this.getConfig();
    await redis.set(this.configKey, { ...current, ...config });
  }

  async getDiscount(code: string): Promise<number | null> {
    const config = await this.getConfig();
    return config.discounts[code] || null;
  }

  async getProductDescription(productId: number): Promise<string | null> {
    const config = await this.getConfig();
    return config.descriptions[productId.toString()] || null;
  }

  async getVAT(): Promise<number> {
    const config = await this.getConfig();
    return config.vat;
  }

  // For demo mode: confirmed orders
  async addConfirmedOrder(orderId: string): Promise<void> {
    await redis.sadd('demo:confirmed', orderId);
  }

  async isOrderConfirmed(orderId: string): Promise<boolean> {
    return (await redis.sismember('demo:confirmed', orderId)) === 1;
  }
}

export const db = new Database();
```

**Step 3: Initialize Database (0.5 day)**

Create initialization script or API endpoint:

```typescript
// scripts/init-db.ts
import { db } from '../lib/db';

async function initializeDatabase() {
  await db.updateConfig({
    discounts: {
      'TEST': 80,
      'WELCOME10': 90, // 10% off
    },
    vat: 24,
    descriptions: {
      '5632658632': 'High-quality cotton t-shirt with premium print...',
    },
  });

  console.log('Database initialized');
}

initializeDatabase();
```

**Step 4: Implement Product Caching (1 day)**

Cache Printful products in Redis to avoid rate limits:

```typescript
// lib/products.ts
import { redis } from './redis';
import { printful } from './printful';
import type { PrintfulProduct } from '@/types/printful';

const PRODUCTS_CACHE_KEY = 'products:all';
const CACHE_TTL = 3600; // 1 hour

export async function getProducts(): Promise<PrintfulProduct[]> {
  // Try cache first
  const cached = await redis.get<PrintfulProduct[]>(PRODUCTS_CACHE_KEY);
  if (cached) {
    return cached;
  }

  // Fetch from Printful
  const products = await printful.getProducts();

  // Cache for 1 hour
  await redis.setex(PRODUCTS_CACHE_KEY, CACHE_TTL, products);

  return products;
}

export async function invalidateProductsCache(): Promise<void> {
  await redis.del(PRODUCTS_CACHE_KEY);
}
```

### Migration Strategy

1. **Keep localStorage for cart** initially (low risk)
2. **Migrate config first** (lib/datab.js → Redis)
3. **Add product caching** incrementally
4. **Test serverless locally** with `vercel dev`
5. **Monitor cold start times** and cache hit rates

### Architectural Trade-offs

**Redis (Upstash) Pros:**
- Fast, simple key-value operations
- Perfect for caching
- Edge-compatible (low latency)
- Free tier generous (10k commands/day)

**Redis Cons:**
- Not ideal for complex queries
- Need to serialize/deserialize JSON
- No built-in relationships

### Potential Challenges & Solutions

**Challenge 1:** Cold starts without cached data
- **Solution:** Implement stale-while-revalidate pattern
- Use Next.js caching: `{ next: { revalidate: 3600 } }`

**Challenge 2:** Cart data migration from localStorage
- **Solution:** Keep localStorage as primary, offer "sync to account" feature later
- Import cart from localStorage on first server interaction

**Challenge 3:** Database initialization
- **Solution:** Seed script or admin API to initialize config
- Version control with migration system if needed

---

## 6. DOCKER CONFIGURATION

### Current Implementation

**Current Dockerfile Problems:**
1. Uses `node:latest` (will break as Node versions change)
2. Builds frontend at runtime, bloating image size
3. No multi-stage build (includes dev dependencies)
4. Doesn't leverage layer caching effectively
5. No CMD specified

### Implementation Approach

**Step 1: Create Production-Ready Dockerfile (1 day)**

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on lock file
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Step 2: Update next.config.js for Docker (0.5 day)**

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone build for Docker
  experimental: {
    outputFileTracingRoot: undefined,
  },
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
};

module.exports = nextConfig;
```

**Step 3: Update docker-compose.yml (0.5 day)**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PRINTFUL_SECRET=${PRINTFUL_SECRET}
      - PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
      - PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
      - NEXT_PUBLIC_PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
      - UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}
      - UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}
      - DEMO=${DEMO:-false}
    volumes:
      - ./.env:/app/.env:ro
    healthcheck:
      test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis-data:
```

**Step 4: Add Health Check Endpoint (0.5 day)**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    await redis.ping();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        redis: 'ok',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### Usage

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Production:**
```bash
docker-compose up --build
```

---

## 7. VERCEL DEPLOYMENT STRATEGY

### Implementation Approach

**Step 1: Vercel Configuration (0.5 day)**

```json
// vercel.json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "PRINTFUL_SECRET": "@printful-secret",
    "PAYPAL_CLIENT_ID": "@paypal-client-id",
    "PAYPAL_CLIENT_SECRET": "@paypal-client-secret",
    "UPSTASH_REDIS_REST_URL": "@upstash-redis-url",
    "UPSTASH_REDIS_REST_TOKEN": "@upstash-redis-token"
  }
}
```

**Step 2: Environment Variables Setup (0.5 day)**

In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add all required secrets for Production, Preview, and Development environments

**Step 3: Deploy from GitHub (0.5 day)**

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Or via GitHub integration - automatic deployment on push.

**Step 4: Configure Domains (0.5 day)**

In Vercel Dashboard:
1. Domains → Add Domain
2. Point DNS to Vercel
3. Enable automatic HTTPS

**Step 5: Set Up Vercel Storage (1 day)**

Use Upstash Redis via Vercel Marketplace or external Upstash.

**Step 6: Implement Caching Strategy (1 day)**

```typescript
// app/page.tsx
export const revalidate = 3600; // Revalidate every hour

// app/api/products/route.ts
export const runtime = 'edge'; // Optional: use edge runtime
export const revalidate = 3600;

export async function GET() {
  const products = await getProducts();

  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**Step 7: Monitoring & Analytics (0.5 day)**

Enable Vercel Analytics and Speed Insights.

### Free Tier Limits

Vercel Hobby (Free):
- 100 GB bandwidth/month
- 6,000 build minutes/month
- 1,000 serverless function invocations/day
- Should be sufficient for small to medium traffic stores

### Performance Optimization

1. Static Generation for product pages
2. ISR (Incremental Static Regeneration) every hour
3. Edge Runtime for faster response
4. Next.js Image component with Vercel CDN
5. Automatic code splitting

---

## IMPLEMENTATION TIMELINE

### Phase 1: Foundation (Week 1-2)
- [ ] Create Next.js 15 project with TypeScript
- [ ] Set up project structure and dependencies
- [ ] Configure TypeScript and ESLint
- [ ] Create type definitions for all data models
- [ ] Set up Docker for local development
- [ ] Verify local development environment works

### Phase 2: Component Migration (Week 2-3)
- [ ] Convert components to TypeScript
- [ ] Migrate routing to App Router
- [ ] Implement layouts and navigation
- [ ] Replace React Router with Next.js navigation
- [ ] Test all pages render correctly
- [ ] Migrate CSS/SASS styles

### Phase 3: API Migration (Week 3-4)
- [ ] Convert Express routes to Next.js API routes
- [ ] Implement Printful API v2 client
- [ ] Update PayPal SDK to latest version
- [ ] Test all API endpoints
- [ ] Implement error handling

### Phase 4: Database Setup (Week 4)
- [ ] Set up Upstash Redis
- [ ] Migrate lib/datab.js to database
- [ ] Implement product caching
- [ ] Test serverless state management
- [ ] Create database initialization scripts

### Phase 5: Integration Testing (Week 5)
- [ ] Test product browsing flow
- [ ] Test cart functionality
- [ ] Test order creation with Printful
- [ ] Test PayPal payment flow (sandbox)
- [ ] Test discount codes
- [ ] Fix bugs and edge cases

### Phase 6: Deployment (Week 6)
- [ ] Configure Vercel project
- [ ] Set up environment variables
- [ ] Deploy to preview environment
- [ ] Test preview deployment
- [ ] Deploy to production
- [ ] Set up custom domain
- [ ] Configure monitoring

### Phase 7: Documentation & Cleanup (Week 6-7)
- [ ] Update README.md
- [ ] Write migration guide
- [ ] Document API endpoints
- [ ] Clean up old files
- [ ] Tag v2.0.0 release

---

## CRITICAL FILES

These are the most important files to focus on during migration:

1. **server.js** - Core backend logic to migrate to Next.js API routes
2. **frontend/src/App.js** - Main React application structure
3. **lib/printfulclient.js** - Printful API integration to rewrite for v2
4. **frontend/src/components/cart/Cart.js** - Shopping cart and checkout flow
5. **frontend/src/components/order/Payment.js** - PayPal integration to upgrade

---

## RISK MITIGATION

### High-Risk Areas

1. **Printful API v2 Compatibility**
   - Risk: Undocumented breaking changes
   - Mitigation: Thorough sandbox testing; keep v1 as fallback

2. **PayPal Integration**
   - Risk: Payment flow breaks during SDK migration
   - Mitigation: Extensive sandbox testing; gradual rollout

3. **Serverless State Management**
   - Risk: Missed state dependencies causing bugs
   - Mitigation: Thorough testing; monitor cold starts

4. **Migration Scope Creep**
   - Risk: 6-7 week timeline extends significantly
   - Mitigation: Strict scope control; MVP-first approach

---

## POST-MIGRATION

### Future Enhancements

1. Admin panel for store management
2. User accounts with order history
3. Enhanced cart with quantity support
4. Webhooks for real-time updates
5. SEO improvements with structured data
6. Performance optimization

### Monitoring Plan

Track:
- API response times
- Error rates
- Conversion rate
- Page load times
- Serverless function cold starts
- Cache hit rates

---

## Resources

- [Printful API v2 Documentation](https://developers.printful.com/docs/v2-beta/)
- [PayPal Server SDK](https://www.npmjs.com/package/@paypal/paypal-server-sdk)
- [Next.js Documentation](https://nextjs.org/docs)
- [Upstash Redis](https://upstash.com/)
- [Vercel Documentation](https://vercel.com/docs)

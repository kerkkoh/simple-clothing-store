# Simple Clothing Store

## Version 2.0.0 - Modern Stack Implementation 🚀

**v2.0.0 has been implemented!** The project has been completely rewritten with modern web development standards:

✅ **Next.js 15** with App Router (SSR, SSG, and unified frontend/backend)
✅ **TypeScript** throughout the entire codebase
✅ **Printful API v2** integration (modern fetch-based client)
✅ **PayPal REST API** (updated from deprecated SDK)
✅ **Upstash Redis** for serverless-compatible state management
✅ **Production build** passing and ready for deployment

### ⚠️ Current Status: Testing Phase

The codebase has been modernized and builds successfully, but still requires:
- **Real API testing** with Printful and PayPal credentials
- **Integration testing** of the complete order flow
- **Docker configuration** update (planned)
- **Vercel deployment** setup and testing (planned)

**For detailed implementation status and roadmap**, see [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

### Migration from v0.x to v2.0.0

The v2.0.0 rewrite brings the project up to 2026 standards with serverless-first architecture:

1. ✅ **Next.js 15** - SSR/SSG with unified frontend + backend API routes
2. ✅ **TypeScript** - Full type safety and improved developer experience
3. ✅ **Printful API v2** - Modern REST client with proper error handling
4. ✅ **PayPal REST API** - Direct API integration replacing deprecated SDK
5. ✅ **Upstash Redis** - Serverless-compatible state management and caching

The goal: Run locally with simple `npm` commands and **deploy to the cloud for free** using Vercel, while maintaining Docker support for any cloud provider.

---

![banner](https://i.imgur.com/fg8F52a.png)

[![GitHub license](https://img.shields.io/github/license/kerkkoh/simple-clothing-store)](https://github.com/kerkkoh/simple-clothing-store/blob/master/LICENSE.md)

## Description

This project is a modern **clothing store** built with **Next.js 15**, **TypeScript**, and **serverless architecture**, designed for easy deployment and maintenance. It leverages **Printful** for product fulfillment and **PayPal** for payments, with **Upstash Redis** for configuration management, resulting in a lightweight, scalable e-commerce solution.

## Table of Contents

- [Demo](#demo)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Demo

The demo has a few obvious limitations:
1. You can't create new orders, some orders are included for you already to view
2. You can't pay for your orders
3. You can't buy anything, or receive products

### > Available on [Glitch](https://simple-clothing-store.glitch.me)

## Background


### Stack

* **Framework**
  * [Next.js 15](https://nextjs.org/) - App Router with SSR/SSG
  * [TypeScript](https://www.typescriptlang.org/) - Full type safety
  * [React 19](https://react.dev/) - Modern hooks-based components
* **APIs**
  * [Printful API v2](https://developers.printful.com/docs/v2-beta/) - Product & order management
  * [PayPal REST API](https://developer.paypal.com/docs/api/overview/) - Payment processing
* **Database & Caching**
  * [Upstash Redis](https://upstash.com/) - Serverless-compatible state & cache
* **Styling**
  * [Bootstrap 5](https://getbootstrap.com/) - Responsive UI framework
  * [SASS/SCSS](https://sass-lang.com/) - Custom styling

### What's working (v2.0.0)

* **Frontend** (Next.js App Router):
  * ✅ Server-side rendering (SSR) for improved SEO
  * ✅ Dynamic routes with Next.js routing (no React Router needed)
  * ✅ Responsive Bootstrap 5 design with custom SASS
  * ✅ Product listing with search functionality
  * ✅ Product detail pages with variant (size) selection
  * ✅ Persistent shopping cart (localStorage)
  * ✅ Currency handling via **currency.js**
  * ✅ Discount code validation
  * ✅ Order tracking pages
* **Backend** (Next.js API Routes):
  * ✅ RESTful API endpoints (8 routes)
  * ✅ Printful API v2 integration with caching
  * ✅ PayPal REST API integration
  * ✅ Redis-based configuration management
  * ✅ Product caching to reduce API calls
  * ✅ Type-safe API responses with TypeScript

### What's planned/missing
* Frontend:
  * Admin panel with minimal controls for
    1. Setting product descriptions
    2. Creating discounts
    3. Monitoring orders
    4. Setting the VAT rate
  * Handling error cases and displaying messages
  * Cancelling of orders
  * Quantity for products in a basket
  * Simple theming support
* Backend:
  * Hiding information better (product information like printfiles & costs shouldn't be sent to the client)
  * Calculating shipping & VAT before confirming the order
  * Refactoring
  * Better handling of errors
  * Handling of missing products, faulty carts, etc.
  * Emails

### Why?

This project is a hobby project that I started sketching out back in 2017 and decided to go through with in 2019 after giving it some thought. For me, this was a learning opportunity to familiarize myself with new APIs and solving problems that one might face in an implementation of an ecommerce system with modern web technologies.

Another reason was the lack of **open source** webstores implemented with a JS stack, similar to this project's stack. There are a few out there, but none of them are geared towards a clothing store that operates with Printful. One of this project's goals was also to be as **simple** as possible. This means keeping the stack very light with a focus on JS and popular libraries. This also means that payments are outsourced, production is outsourced, and orders are mostly outsourced. This should keep the maintenance of the system at minimum, while allowing the clothing store to operate smoothly.

### Why should I use it?

In most cases, you shouldn't. Not yet. It is at an early stage of development with most of the features being at most stubs of the eventual or necessary features.

These are some problem areas as of now:
  * Lack of a solid user, order or payment database
  * Lack of good information hiding from the users of the API
  * Security: while I've kept security in mind while developing the system, it hasn't been penetration tested by professionals, and this poses a constant risk if used in productions
  * No input validitation/verification of any kind
  * No handling situations where the local cart is out of sync with the products in the store

## Install

### Prerequisites
- **Node.js 20+** and npm
- **Printful API key** - [Get from Printful](https://www.printful.com/dashboard/store)
- **PayPal API credentials** - [Get from PayPal Developer](https://developer.paypal.com/)
- **Upstash Redis** (optional for development) - [Get from Upstash](https://upstash.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kerkkoh/simple-clothing-store.git
   cd simple-clothing-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API credentials:
   ```env
   # Required
   PRINTFUL_SECRET=your_printful_api_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

   # Optional (has fallback for development)
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token

   # Optional
   DEMO=true  # Set to true for demo mode (no real orders)
   ```

4. **Initialize the database** (optional, configures discounts/VAT)
   ```bash
   npm run init-db
   ```

5. **Run in development mode**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

**Store configuration** (discounts, VAT, product descriptions) is now managed via Redis database. Initialize with:
```bash
npm run init-db
```

Or configure programmatically via the database API (see `lib/database.ts`).

### Docker Support (Coming Soon)

Docker configuration is being updated for Next.js. The old Docker setup for Express is available but not recommended for v2.0.0.

## Usage

### Development Mode
Run the Next.js development server with hot reload:
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Production Build
Build and run the optimized production version:
```bash
npm run build
npm start
```

### Available Scripts
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run init-db      # Initialize database configuration
npm run legacy:start # Run old Express server (v0.x)
```

### Environment
- Default port: **3000** (development and production)
- Port can be overridden with `PORT` environment variable
- All API routes available at `/api/*`

## Contributing

PRs accepted and appreciated.

## License

[MIT License](https://github.com/kerkkoh/simple-clothing-store/LICENSE.md)

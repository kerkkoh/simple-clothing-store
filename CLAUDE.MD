# Simple Clothing Store - Project Guide for Claude

## Project Overview

Simple Clothing Store is an e-commerce clothing store implementation built with React and Node.js. The project aims for an almost databaseless design by leveraging the Printful API for product management and fulfillment, and PayPal for payment processing.

**Current Status:** The project is currently broken due to Printful API updates. A major v2.0.0 rewrite is planned to migrate to Next.js, TypeScript, and serverless architecture.

**Version:** 0.0.2
**License:** MIT
**Repository:** https://github.com/kerkkoh/simple-clothing-store

## Architecture

### Stack

**Backend:**
- Node.js (v13.14.x)
- Express server
- API Integrations:
  - Printful REST API (for product management and fulfillment)
  - PayPal REST API (for payment processing)

**Frontend:**
- React 17 (with hooks, no classes)
- React Router (for routing)
- Bootstrap 5 (responsive design)
- SASS/SCSS (styling)
- Create React App (build tooling)

**Key Dependencies:**
- `@paypal/checkout-server-sdk` - PayPal integration
- `currency.js` - Currency handling
- `axios` - HTTP client
- `dotenv` - Environment configuration

## Project Structure

```
simple-clothing-store/
├── server.js              # Main Express server
├── lib/                   # Backend utilities
│   ├── datab.js          # "Database" - product descriptions, discounts, VAT
│   ├── paypal.js         # PayPal API client
│   └── printfulclient.js # Printful API client
├── frontend/              # React frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── App.js        # Main React component
│       ├── config.js     # Frontend configuration
│       ├── components/   # React components
│       │   ├── Store.js  # Store/product listing
│       │   ├── Product.js # Product detail view
│       │   ├── cart/     # Shopping cart components
│       │   ├── order/    # Order management components
│       │   └── utils/    # Utility components
│       ├── services/     # API and storage services
│       └── sass/         # Custom styles
├── .env.template         # Environment variables template
├── docker-compose.yml    # Docker composition
└── Dockerfile           # Docker configuration
```

## Key Files

### Backend

**server.js** (Main entry point)
- Express server setup
- API routes for products, store info, discounts, orders
- Integrates Printful and PayPal clients
- Serves built React frontend

**lib/datab.js**
- Acts as a lightweight "database"
- Contains:
  - Product descriptions (keyed by Printful product ID)
  - Discount codes and their percentages
  - VAT (Value Added Tax) rate

**lib/printfulclient.js**
- Custom Printful API client
- Handles authentication and API requests

**lib/paypal.js**
- PayPal SDK configuration
- Creates PayPal client for sandbox/production

### Frontend

**frontend/src/App.js**
- Main React component
- Sets up routing with React Router
- Manages global state (cart, products)

**frontend/src/config.js**
- Frontend configuration
- Store information (name, description, currency)
- PayPal client ID

**frontend/src/components/Store.js**
- Product listing page
- Displays all products from Printful

**frontend/src/components/cart/Cart.js**
- Shopping cart functionality
- Persistent cart using localStorage

**frontend/src/services/**
- `products.js` - API calls to backend
- `localstorage.js` - Cart persistence

## Configuration

### Environment Variables (.env)

Required environment variables (see `.env.template`):

```
PRINTFUL_SECRET=          # Printful API secret key
PAYPAL_CLIENT_ID=         # PayPal client ID
PAYPAL_CLIENT_SECRET=     # PayPal client secret
PORT=                     # Optional: Server port (defaults to 3001)
```

### Frontend Configuration (frontend/src/config.js)

Set store information and PayPal client ID.

### Database Configuration (lib/datab.js)

Configure:
1. **Product Descriptions:** Add entries in `items` array with product ID and description
2. **Discount Codes:** Add discount codes and percentages in `discounts` object
3. **VAT Rate:** Set VAT percentage as integer in `vat` property

## Development Workflow

### Installation

1. Clone repository
2. Set up configuration files (`.env` and `config.js`)
3. Install dependencies:
   ```bash
   npm install              # Root dependencies
   cd frontend && npm install  # Frontend dependencies
   ```

### Running the Application

**With Docker (Recommended):**
```bash
docker-compose up
```

**Manual Build:**
```bash
# Linux
npm run build-tux        # First build
npm run build-tux-clean  # Subsequent builds

# Windows
npm run build-win        # First build
npm run build-win-clean  # Subsequent builds
```

**Development:**
```bash
npm start               # Start server on port 3001
cd frontend && npm start  # Development server with hot reload
```

### Build Process

The build scripts:
1. Build React frontend (`npm run build` in frontend/)
2. Move build folder to root
3. Start Express server to serve built frontend

## API Endpoints

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product

**Store:**
- `GET /api/store` - Get store information

**Discounts:**
- `POST /api/discounts` - Validate discount code

**Orders:**
- `GET /api/orders` - Get orders (demo only)
- `POST /api/orders` - Create order (payment integration)

## Current Limitations & Known Issues

1. **Printful API Broken:** The project is incompatible with current Printful API
2. **No Persistent Database:** Using in-memory storage and local files
3. **Security:** Not production-ready, no penetration testing
4. **No Input Validation:** Missing validation and verification
5. **No Error Handling:** Limited error handling throughout
6. **Information Hiding:** Backend exposes too much product data to frontend
7. **Cart Sync Issues:** No handling for out-of-sync cart vs. store products

## Planned v2.0.0 Changes

Major rewrite planned with:
1. Migration to Next.js (SSR + unified frontend/backend)
2. Migration to TypeScript
3. Update to Printful API v2
4. Serverless/edge function architecture
5. Lightweight persistent database (Vercel KV or PostgreSQL)
6. Docker-based deployment
7. Free deployment on Vercel

## Working Features

**Frontend:**
- Responsive design with Bootstrap
- Product browsing with multiple variants (sizes)
- Persistent shopping cart (localStorage)
- Currency handling via currency.js
- Discount code validation
- Order status viewing with Printful data
- React Router for seamless navigation

**Backend:**
- Product loading from Printful API
- Store configuration via lib/datab.js
- Discount code system

## Missing/Planned Features

**Frontend:**
- Admin panel for store management
- Error handling and user messages
- Order cancellation
- Product quantity in basket
- Theming support

**Backend:**
- Better information hiding
- Shipping and VAT calculation before order confirmation
- Error handling
- Email notifications
- Order management
- Input validation

## Development Notes

- Server runs on port 3001 by default (configurable via .env)
- Frontend development proxy points to `http://localhost:3001`
- Built frontend is served by Express from `/build` directory
- Cart persists in browser localStorage
- Products are cached in memory on server startup
- Node.js version locked to 13.14.x (may need updating)

## Docker

The project includes Docker support:
- `Dockerfile` - Builds Node.js container
- `docker-compose.yml` - Orchestrates the service
- `.dockerignore` - Excludes unnecessary files from build

## Deployment

Currently supports:
- Heroku (with automatic PORT configuration)
- Docker containers
- Traditional Node.js hosting

Future: Vercel serverless deployment (v2.0.0)

## Testing

No automated tests currently implemented.

## Contributing

PRs are accepted and appreciated. The project follows Google's ESLint configuration.

## Additional Resources

- [Printful API Docs](https://developers.printful.com/docs/)
- [PayPal REST API Docs](https://developer.paypal.com/docs/api/overview/)
- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)

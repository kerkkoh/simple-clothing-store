# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Simple Clothing Store — React (CRA) frontend + Express backend e-commerce app using Printful and PayPal APIs. No database; product data comes from Printful API. See `README.md` and `CLAUDE.MD` for details.

### Environment setup

- **Package manager:** npm. Two install locations: root (`/workspace`) and frontend (`/workspace/frontend`).
- **`.env` file:** Copy `.env.template` to `.env`. Set `DEMO=true` to run without real API keys. Without `PRINTFUL_SECRET`, the products list will be empty and store info blank — this is expected.
- **Node version:** `package.json` specifies `engines.node: "13.14.x"` but the app runs fine on Node 22.x.
- **Sass compatibility:** The frontend pins `node-sass` as an alias for `sass@1.32.13`. If `npm install` resolves a newer sass version, the CRA build will fail with `ParserError`. Reinstall with `npm install --legacy-peer-deps node-sass@npm:sass@1.32.13` in `frontend/` if this happens.
- **OpenSSL legacy provider:** react-scripts 4 requires `NODE_OPTIONS=--openssl-legacy-provider` on Node 17+ for both `npm run build` and `npm start` in the frontend.

### Running services

| Service | Command | Port | Notes |
|---|---|---|---|
| Backend (Express) | `npm start` (root) | 3001 | Serves built frontend from `./build/` and API at `/api/*` |
| Backend (dev) | `npm run watch` (root) | 3001 | Uses nodemon for auto-reload |
| Frontend (dev) | `NODE_OPTIONS=--openssl-legacy-provider npm start` (frontend/) | 3000 | CRA dev server, proxies API to localhost:3001 |

To run both in dev mode, start the backend first (`npm run watch` in root), then the frontend dev server.

### Linting

- **Backend:** `npx eslint server.js lib/` (root) — uses `eslint-config-google`. Pre-existing lint errors in `lib/`.
- **Frontend:** `npx eslint src/` (frontend/) — uses `eslint-plugin-react`.

### Testing

No automated test suite exists. Manual testing only. The frontend `package.json` has `react-scripts test` but no test files are present.

### Building

```
cd frontend && NODE_OPTIONS=--openssl-legacy-provider npm run build
cp -r build ../build
```

Or use the npm script: `npm run build-tux` (Linux) / `npm run build-win` (Windows) from root. Note these scripts also start the server after building.

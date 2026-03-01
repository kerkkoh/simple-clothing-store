# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Next.js 15 + TypeScript e-commerce clothing store (v2.0.0). Uses Printful API for products, PayPal for payments, Upstash Redis for config/cache. See `README.md` for full details.

### Running the app
- `npm run dev` — starts Next.js dev server on port 3000
- The app works without external API keys: Redis falls back to in-memory `MockRedis` (see `lib/redis.ts`), and Printful/PayPal errors are handled gracefully in the UI
- To populate products, a real `PRINTFUL_SECRET` is needed in `.env`
- Copy `.env.example` to `.env` for development defaults

### Available commands
Defined in `package.json`:
- `npm run lint` — ESLint via `next lint`
- `npm run type-check` — `tsc --noEmit`
- `npm run build` — production build (also runs lint + type-check)
- `npm run init-db` — seeds Redis/MockRedis with default config via `scripts/init-db.ts`

### Caveats
- Build emits Upstash Redis warnings (`url`/`token` missing) when Redis env vars are unset — this is harmless; the MockRedis fallback handles it
- Build also logs Printful API 401 errors during static page generation when no real API key is configured — pages still generate correctly with error states
- No automated test suite exists; validation is lint + type-check + manual testing
- The `frontend/` directory and `server.js` are legacy v0.x code (Express + CRA) — not used in v2.0.0

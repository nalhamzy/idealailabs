# IdealAI Labs

Bilingual business website and live demo platform for IdealAI Labs.

The app now includes the core website, five full interactive demos, contact/request capture, and an admin dashboard.

## What Is Included

- Core bilingual website at `/en` and `/ar`.
- Demo hub at `/en/demos` and `/ar/demos`.
- Omani accessories store demo with catalog, cart, checkout, order data, and Thawani-ready adapter.
- Spa appointment demo with booking, schedule board, and web WhatsApp automation preview.
- WhatsApp chatbot lab with restaurant, retail, and services bot simulations.
- Business landing page builder with template editor, preview, analytics, and lead capture.
- Document/spreadsheet intelligence suite with upload, profiling, query modes, charts, and evidence mapping.
- Admin dashboard at `/admin`.
- Durable storage via libSQL/Drizzle (local SQLite file → Turso in production).

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Resend for optional email notifications
- File-backed local persistence for repeatable live demos

## Local Dev

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit:

- Website: `http://localhost:3000/en`
- Arabic: `http://localhost:3000/ar`
- Demos: `http://localhost:3000/en/demos`
- Admin: `http://localhost:3000/admin`

The local admin key defaults to `demo-admin`. Set `ADMIN_ACCESS_KEY` in production.

## Environment Variables

See `.env.example`.

Important variables:

- `RESEND_API_KEY`: sends contact email notifications.
- `ADMIN_ACCESS_KEY`: protects `/admin` APIs.
- `THAWANI_API_KEY` and `THAWANI_PUBLISHABLE_KEY`: enables real Thawani checkout sessions.
- `THAWANI_SECRET_KEY` and `THAWANI_PUBLIC_KEY`: accepted aliases for older env files.

If Thawani keys are not present, the store demo creates a simulated checkout and still records the order/lead.

WhatsApp is intentionally simulated in the browser for these demos. No WhatsApp API key is required.

## Demo Subdomains

The middleware rewrites these subdomains to the matching demo route:

- `store.idealailabs.com` -> `/en/demos/store`
- `spa.idealailabs.com` -> `/en/demos/spa`
- `bots.idealailabs.com` -> `/en/demos/whatsapp`
- `pages.idealailabs.com` -> `/en/demos/landing-pages`
- `docs.idealailabs.com` -> `/en/demos/documents`

Point each subdomain in Route 53 to the deployed app target.

## Admin

The admin dashboard lets you:

- View all contact and demo-generated leads.
- Filter by status/source/demo.
- Change status and priority.
- Add follow-up notes.
- Export CSV.
- See demo events, store orders, and spa appointments.
- Change order and appointment statuses.
- Seed or clear demo data for repeatable presentations.

Lead statuses:

```txt
new, qualified, contacted, proposal_sent, won, lost, spam
```

## Persistence

Durable storage via **Drizzle + libSQL**. Leads, demo events, store orders and spa appointments live
in a real database, so inquiries survive serverless/Vercel deploys.

- **Local dev:** a SQLite file at `.data/idealailabs.db` (no config needed).
- **Production:** set `DATABASE_URL=libsql://<db>.turso.io` + `DATABASE_AUTH_TOKEN` (Turso). No code change.

```bash
npm run db:generate   # generate migrations from lib/server/db/schema.ts
npm run db:migrate    # apply them (creates the SQLite file locally)
npm run db:import     # one-time: import legacy .data/idealailabs-store.json
npm run db:studio     # browse the data
```

The data model is `lib/server/db/schema.ts`; the public API is unchanged in `lib/server/persistent-store.ts`.
For a fuller production schema, see:

```txt
docs/idealailabs-demo-platform-roadmap.md
```

Operational demo walkthrough:

```txt
docs/demo-operator-runbook.md
```

## Build

```bash
npm run build
```

## Deploy

The current live site uses Route 53 DNS and Vercel hosting. Recommended deploy path:

1. Deploy this repo as the main Vercel project.
2. Add env vars from `.env.example`.
3. Add the custom domains/subdomains in Vercel.
4. Create Route 53 CNAME/A records as instructed by Vercel.
5. Set a strong `ADMIN_ACCESS_KEY`.

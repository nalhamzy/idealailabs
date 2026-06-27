# IdealAI Labs Demo Operator Runbook

## Local Demo Flow

1. Start the app with `npm run dev`.
2. Open `http://localhost:3000/admin`.
3. Login with `ADMIN_ACCESS_KEY`; local default is `demo-admin`.
4. Click `Seed demo data` before a sales call.
5. Open `http://localhost:3000/en/demos`.
6. After testing demos, return to admin and review leads, events, orders, and appointments.
7. Click `Clear data` when you want a clean state.

## Store Demo

URL: `/en/demos/store`

Show:

- Product catalog and filters.
- OMR pricing.
- Cart and customer checkout.
- Thawani-ready checkout handoff.
- Order table preview.
- Admin order status manipulation.

Production keys:

```txt
THAWANI_API_KEY=
THAWANI_PUBLISHABLE_KEY=
THAWANI_BASE_URL=https://uatcheckout.thawani.om/api/v1
THAWANI_CHECKOUT_URL=https://uatcheckout.thawani.om/pay
```

Older aliases also work:

```txt
THAWANI_SECRET_KEY=
THAWANI_PUBLIC_KEY=
```

## Spa Demo

URL: `/en/demos/spa`

Show:

- Service and staff selection.
- Date/time booking.
- Schedule board.
- Web WhatsApp confirmation and reminder timeline.
- Admin appointment status manipulation.

WhatsApp is web-only in this demo. The production integration boundary is the appointment event and message template queue.

## WhatsApp Bot Demo

URL: `/en/demos/whatsapp`

Show:

- Restaurant bot: menu, reservation, pickup, allergy handling.
- Retail bot: product recommendation, stock, exchange.
- Services bot: quote qualification, maintenance request, booking.
- Trace panel: intent, slots, tool, confidence, next action.

No WhatsApp API is required. This is intentionally a web simulator.

## Landing Page Demo

URL: `/en/demos/landing-pages`

Show:

- Template selection.
- Live copy/city/offer/phone/color editing.
- First-viewport landing page preview.
- Analytics preview.
- Lead capture into admin.

## Document Suite Demo

URL: `/en/demos/documents`

Show:

- CSV/TXT upload.
- Sample revenue sheet.
- Query modes: ask, analyze, compare, simulate, brief.
- Auto profile.
- Generated chart.
- Evidence graph and answer workspace.

Production upgrade path:

- Move parsing to a background worker.
- Store files in S3.
- Store structured facts in Postgres.
- Add embeddings/vector retrieval for source-grounded document answers.

## Subdomain Mapping

Configure Route 53 and the hosting platform so these hostnames point to the same deployment:

```txt
store.idealailabs.com -> /en/demos/store
spa.idealailabs.com -> /en/demos/spa
bots.idealailabs.com -> /en/demos/whatsapp
pages.idealailabs.com -> /en/demos/landing-pages
docs.idealailabs.com -> /en/demos/documents
```

The app middleware handles the route rewrite automatically.

## Admin Operations

Admin can:

- Filter leads by status/source/demo.
- Change lead status and priority.
- Add notes.
- Export CSV.
- Change order status.
- Change appointment status.
- Seed or clear demo data.

For production, set a strong `ADMIN_ACCESS_KEY` before deploy.

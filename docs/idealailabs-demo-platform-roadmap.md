# IdealAI Labs Website And Demo Platform Roadmap

Last updated: 2026-06-17

## Objective

Turn idealailabs.com from a compact bilingual studio website into a conversion-focused product showcase with five full live demo systems:

1. Omani accessories store with Thawani payments.
2. Spa appointment and WhatsApp automation system.
3. WhatsApp chatbot showcase for restaurant, retail, and services.
4. Business landing page showcase and lead generator.
5. Advanced document and spreadsheet intelligence suite.

Every demo should be realistic enough for prospects to test properly, easy to deploy under an `idealailabs.com` subdomain, and structured so it can become a production client system with minimal cleanup.

## Current Baseline

The current repo is a small Next.js 15 App Router site:

- Bilingual routing: `/en`, `/ar`.
- Styling: Tailwind CSS, dark mode tokens, IBM Plex Sans Arabic.
- Sections: hero, services, products, approach, contact, footer.
- Contact flow: `POST /api/contact` validates fields and sends email through Resend.
- Persistence: none.
- Admin: none.
- Demo routes: none.
- Deployment note: README says Vercel. DNS is hosted through AWS Route 53, while the live apex/www currently resolve through Vercel.

Baseline build passed on 2026-06-17 with one warning: Next inferred `C:\Users\PC\package-lock.json` as the workspace root because there is another lockfile above the project. Add `outputFileTracingRoot` in `next.config.mjs` or remove the unrelated parent lockfile when deployment traces matter.

## Recommended Architecture

Use one monorepo with shared packages and deployable apps:

```txt
idealailabs/
  apps/
    web/                  # main idealailabs.com website
    demo-store/           # store.idealailabs.com
    demo-spa/             # spa.idealailabs.com
    demo-whatsapp/        # bots.idealailabs.com
    demo-landing-pages/   # pages.idealailabs.com
    demo-docs/            # docs.idealailabs.com
    admin/                # admin.idealailabs.com, or /admin on main site
  packages/
    ui/                   # design system, bilingual layout helpers
    db/                   # Prisma schema, migrations, seed data
    auth/                 # admin auth helpers
    integrations/         # Thawani, WhatsApp, Resend adapters
    analytics/            # event tracking and lead attribution
    demo-data/            # reusable seeded demo catalogs and fixtures
```

Short-term option: keep the existing root app and add `/[locale]/demos/...` pages first. Long-term, the monorepo is cleaner because each demo can be deployed, maintained, and sold independently.

## Deployment Model

Recommended first production model:

- DNS: Route 53 remains source of truth for `idealailabs.com`.
- Web hosting: Vercel projects for the website and demos, matching the current parent deployment style.
- Subdomains:
  - `store.idealailabs.com`
  - `spa.idealailabs.com`
  - `bots.idealailabs.com`
  - `pages.idealailabs.com`
  - `docs.idealailabs.com`
  - `admin.idealailabs.com`
- Database: Postgres with Prisma. Use Neon/Supabase for fastest start, or AWS Aurora/RDS if AWS-only hosting is required.
- File storage: S3-compatible bucket for uploaded documents and generated assets.
- Background jobs: Trigger.dev, Inngest, or a lightweight worker for document parsing, WhatsApp retries, and payment reconciliation.
- Observability: Sentry, Vercel Analytics, structured request events in Postgres.

Each app should include:

- `README.md` with setup and deployment steps.
- `.env.example`.
- Seed command.
- Smoke tests.
- Dockerfile or documented Vercel settings.
- Demo reset script.

## Shared Data Layer

Core tables used across the main website, demos, and admin:

```txt
Lead
  id, source, locale, name, email, phone, company, projectType, budget,
  message, status, priority, assignedTo, createdAt, updatedAt

LeadEvent
  id, leadId, type, payloadJson, createdAt

DemoSession
  id, demoKey, visitorId, locale, utmJson, startedAt, lastSeenAt

DemoRequest
  id, demoSessionId, demoKey, intent, payloadJson, status, createdAt

AdminNote
  id, leadId, author, body, createdAt

ContactMessage
  id, leadId, channel, direction, subject, body, status, createdAt
```

Demo-specific apps can have their own tables while still writing lead/demo events into the shared layer.

## Core Website Update

The main website should become the hub that explains the business clearly:

- Positioning: software, websites, online stores, WhatsApp automation, AI systems, and ongoing services for Oman/Gulf businesses.
- Navigation:
  - Services
  - Demos
  - Industries
  - Work
  - Contact
- Add a demos section with five strong cards, screenshots, Arabic/English copy, and clear "Open demo" and "Request this system" CTAs.
- Add service pages or deep sections:
  - Online stores and payments.
  - WhatsApp automation.
  - Appointment systems.
  - Business websites and landing pages.
  - AI document and data systems.
- Enhance contact:
  - Phone/WhatsApp field.
  - Business type.
  - Urgency/timeline.
  - Preferred contact channel.
  - Demo interest source.
  - Consent checkbox for WhatsApp follow-up.
- Replace email-only contact storage with Postgres persistence plus Resend notification.
- Add admin CTA links to relevant leads and demo sessions.
- Add SEO pages for Oman-focused keywords such as "WhatsApp chatbot Oman", "online store Oman", "Thawani ecommerce integration", and "business website Muscat".

## Admin Dashboard

Admin should be operational, not decorative:

- Secure login.
- Lead inbox with filters by status, demo, source, service, budget, language, urgency.
- Lead detail page with timeline, notes, status, quote amount, follow-up date, and contact actions.
- Request manipulation:
  - assign owner
  - change status
  - add note
  - tag service
  - archive/spam
  - export CSV
- Demo analytics:
  - demo opens
  - chat conversations
  - cart checkouts
  - appointment bookings
  - document uploads
  - conversion from demo to lead
- Optional next stage: send email/WhatsApp follow-ups from admin.

Suggested statuses:

```txt
new, qualified, contacted, proposal_sent, won, lost, spam
```

## Demo 1: Omani Accessories Store

Subdomain: `store.idealailabs.com`

Audience: Omani and Arabic-speaking retailers who need a polished store with local payment flow.

Core experience:

- Arabic-first storefront with English switch.
- Product catalog for accessories: perfume, handbags, watches, jewelry, phone accessories.
- Categories, search, filters, product details, related products.
- Cart, customer details, delivery area, order review.
- Thawani checkout session creation server-side.
- Success/cancel pages with payment status reconciliation.
- Admin inventory/order screen.
- Seeded products, customers, orders, and payments.

Tables:

```txt
StoreProduct, StoreCategory, StoreVariant, StoreInventoryMovement,
StoreCart, StoreCartItem, StoreCustomer, StoreOrder, StoreOrderItem,
StorePayment, StoreAddress, StoreCoupon
```

Integration boundary:

- `createCheckoutSession(orderId)` creates a Thawani session.
- Redirect URL format uses `https://[uat]checkout.thawani.om/pay/{session_id}?key=publishable_key`.
- Retrieve session after redirect/webhook and fulfill only when payment status is `paid`.
- Demo mode can simulate a paid session when Thawani keys are not configured.

Acceptance criteria:

- A visitor can browse, add to cart, checkout, and see order status.
- Admin can view orders and update fulfillment status.
- All prices display in OMR.
- Arabic layout feels native, not translated as an afterthought.

## Demo 2: Spa Appointment System With WhatsApp

Subdomain: `spa.idealailabs.com`

Audience: salons, spas, clinics, barbers, and service businesses.

Core experience:

- Services catalog with duration, staff, price, and add-ons.
- Calendar availability by staff and room.
- Customer booking flow with date/time selection.
- Appointment confirmation page.
- Admin schedule board with day/week views.
- WhatsApp automation demo panel showing:
  - booking confirmation
  - reminder
  - reschedule prompt
  - post-visit feedback
- Optional real WhatsApp Cloud API mode when credentials are available.

Tables:

```txt
SpaService, SpaStaff, SpaRoom, SpaAvailabilityRule, SpaBlackout,
SpaAppointment, SpaAppointmentAddon, SpaCustomer, SpaMessage,
SpaTemplate, SpaReminderJob
```

Acceptance criteria:

- Prevents double-booking.
- Supports staff-specific availability.
- Creates realistic WhatsApp conversation timeline after booking.
- Admin can confirm, cancel, reschedule, and mark completed.

## Demo 3: WhatsApp Chatbot Showcase

Subdomain: `bots.idealailabs.com`

Purpose: let prospects test three business chatbots directly in the browser while seeing how the same logic maps to WhatsApp.

Use cases:

- Restaurant bot:
  - menu questions
  - table reservation
  - order pickup
  - allergy handling
  - human handoff
- Retail bot:
  - product recommendation
  - stock check
  - order status
  - return/exchange request
  - coupon capture
- Services bot:
  - quote qualification
  - appointment request
  - location/service-area check
  - emergency priority routing
  - follow-up booking

Core experience:

- Persona selector.
- Browser chat simulator with WhatsApp-style UI.
- Business-side trace panel showing detected intent, extracted slots, tool calls, and next action.
- Lead capture when the visitor asks to build a similar bot.
- Seeded knowledge base per persona.
- Optional real WhatsApp Cloud API webhook adapter.

Tables:

```txt
BotPersona, BotKnowledgeItem, BotConversation, BotMessage,
BotIntent, BotToolCall, BotHandoff, BotLead
```

Acceptance criteria:

- Each bot can complete at least three realistic workflows.
- The trace panel makes the business value visible without exposing secrets.
- Visitors can submit their phone/company to request a similar bot.

## Demo 4: Business Landing Pages

Subdomain: `pages.idealailabs.com`

Purpose: show businesses what a polished, high-conversion page can look like in minutes.

Core experience:

- Template gallery:
  - restaurant
  - clinic
  - contractor/home service
  - retail launch
  - professional service
- Live preview with industry-specific copy, lead form, trust blocks, WhatsApp CTA, and gallery.
- Lightweight editor for colors, services, city, offer, phone, and language.
- Lead analytics dashboard showing visits, form submissions, WhatsApp clicks, and conversion rate.
- "Use this for my business" handoff to main lead system.

Tables:

```txt
LandingTemplate, LandingPageInstance, LandingSection, LandingAsset,
LandingLead, LandingEvent, LandingExperiment
```

Acceptance criteria:

- A visitor can choose a business type, customize the page, and preview it.
- Generated pages are responsive and bilingual-ready.
- Every lead writes into the shared admin pipeline.

## Demo 5: Document And Spreadsheet Intelligence Suite

Subdomain: `docs.idealailabs.com`

Positioning: not another plain RAG chat. This should feel like an analytical command center for files, tables, and decisions.

Differentiators:

- Upload documents, PDFs, spreadsheets, and CSVs into one workspace.
- Auto-detect tables, entities, metrics, deadlines, money amounts, risks, and relationships.
- Create a knowledge graph that connects document claims, spreadsheet rows, people, dates, and source evidence.
- Query modes:
  - Ask: natural-language questions with citations.
  - Analyze: generate pivots, aggregations, anomalies, and charts.
  - Compare: compare contracts, proposals, monthly reports, or vendor sheets.
  - Simulate: ask "what happens if" questions over spreadsheet assumptions.
  - Brief: turn findings into client-ready reports.
- Visual canvas:
  - source-linked answers
  - chart builder
  - metric cards
  - relationship graph
  - query history
  - generated action list
- Data notebook mode that shows the generated query/transform behind each answer.

Tables:

```txt
DocWorkspace, DocFile, DocChunk, DocEmbedding, DocEntity, DocRelation,
DocDataset, DocTable, DocColumnProfile, DocQuery, DocInsight,
DocChart, DocDashboard, DocCitation, DocWorkflow
```

Implementation notes:

- Parse spreadsheets with SheetJS or equivalent.
- Parse PDFs/docs in a background worker.
- Store raw files in S3.
- Store structured facts and query history in Postgres.
- Store embeddings in pgvector or a dedicated vector store.
- Use DuckDB/WASM or server-side DuckDB for fast spreadsheet analytics.
- Use a charting layer such as ECharts or Recharts.

Acceptance criteria:

- Upload sample spreadsheet and PDF.
- Ask questions that produce cited answers and charts.
- Generate a dashboard from a file.
- Save an insight to a report.
- Show why the answer is true through sources, rows, and transformations.

## Build Order

Phase 0: Foundation

- Move to monorepo or prepare current app for modular expansion.
- Add shared database package and Prisma.
- Add lead/request schema.
- Replace email-only contact with persistent lead creation plus Resend.
- Add admin auth and lead inbox.
- Add demos landing section to main site.

Phase 1: Core Website And Admin

- Rewrite positioning for software, services, websites, stores, and WhatsApp automation.
- Add demos index page.
- Add enhanced contact form.
- Build admin lead list/detail and basic analytics.
- Deploy updated main site.

Phase 2: Store Demo

- Build store catalog, cart, orders, Thawani adapter, admin order screen.
- Seed Omani/Arabic data.
- Deploy `store.idealailabs.com`.

Phase 3: Spa Demo

- Build appointment scheduler, admin calendar, WhatsApp timeline, reminders.
- Deploy `spa.idealailabs.com`.

Phase 4: WhatsApp Chatbot Demo

- Build three persona bots, chat simulator, trace panel, lead handoff.
- Deploy `bots.idealailabs.com`.

Phase 5: Landing Page Demo

- Build template gallery, live editor, preview, lead analytics.
- Deploy `pages.idealailabs.com`.

Phase 6: Document Intelligence Demo

- Build file upload, parsing worker, query modes, chart/canvas/report system.
- Deploy `docs.idealailabs.com`.

Phase 7: Production Hardening

- Add rate limiting, spam protection, request audit logs.
- Add backups and seed/reset scripts per demo.
- Add visual regression and smoke tests.
- Add deployment runbooks.
- Add admin analytics across all demos.

## First Implementation Slice

The first slice should be small enough to finish safely but valuable enough to change the site:

1. Add persistent lead storage and admin lead inbox.
2. Enhance the contact form fields.
3. Add a demos section and `/[locale]/demos` page on the core site.
4. Add placeholder demo cards with target subdomains and "coming online" status.
5. Update sitemap.
6. Deploy main site update.

After that, build the store demo first because it proves ecommerce, payments, Arabic UX, data tables, and admin workflows in one visible package.

## Environment Variables

Shared:

```txt
DATABASE_URL=
RESEND_API_KEY=
CONTACT_RECIPIENT=
CONTACT_FROM=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
APP_BASE_URL=
```

Thawani:

```txt
THAWANI_API_KEY=
THAWANI_PUBLISHABLE_KEY=
THAWANI_BASE_URL=https://uatcheckout.thawani.om
THAWANI_CHECKOUT_BASE_URL=https://uatcheckout.thawani.om
THAWANI_WEBHOOK_SECRET=
```

WhatsApp:

```txt
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_BUSINESS_ACCOUNT_ID=
```

Documents:

```txt
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
OPENAI_API_KEY=
```

## Source Notes

- Live website checked: `https://idealailabs.com/`.
- Thawani docs checked: Create Session says to create a checkout session and redirect with `session_id`; Retrieve Session exposes payment statuses such as `paid`, `unpaid`, and `cancelled`.
- Meta WhatsApp Cloud API docs should be used during implementation for webhook verification, message sending, templates, and app secret validation.

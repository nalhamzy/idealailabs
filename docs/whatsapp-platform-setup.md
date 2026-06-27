# WhatsApp Chatbot Platform — Setup & Onboarding Guide

How Ideal Intelligence connects and runs WhatsApp bots for client businesses, end to end.
Companion visual version: `whatsapp-platform-setup.html` (open in a browser).

_Last updated: 2026-06-27_

---

## 1. The big idea

We run **one** Meta app — *Ideal Intelligence* — for **every** client. We never create a new
app per business. Each client connects **their own** WhatsApp number to our app through a
self-serve page on **idealailabs.com**, and from then on their messages flow to our server,
which replies on their behalf.

```
Client's WhatsApp number  ──connects to──▶  Our ONE Meta app  ──messages──▶  idealailabs.com server  ──replies──▶  Client's customers
```

---

## 2. Key identifiers

| Thing | Value |
|---|---|
| Meta app name | **Ideal Intelligence** |
| App ID | `1666901441099073` |
| Business portfolio | Ideal Intelligence — ID `799766182057295` (**verified**) |
| Embedded Signup config | "ES Config" — Config ID `2190411671691417` |
| Website | **idealailabs.com** (Next.js 15 App Router, hosted on Vercel) |
| Graph API version | `v23.0` |
| Webhook URL | `https://idealailabs.com/api/whatsapp/webhook` |

---

## 3. Architecture

The whole platform lives in the **idealailabs** Next.js app (the marketing site doubles as the
platform backend).

| Component | Path | Role |
|---|---|---|
| Onboarding page | `app/onboard/page.tsx` → `/onboard` | The page a client opens to connect their WhatsApp (Embedded Signup button) |
| Connect API | `app/api/whatsapp/onboard/route.ts` → `/api/whatsapp/onboard` | Exchanges the signup `code` for the client's token, subscribes our app to their WABA, stores the connection, emails the team |
| Webhook | `app/api/whatsapp/webhook/route.ts` → `/api/whatsapp/webhook` | Receives inbound messages from Meta, verifies the signature, routes each to the right client, and auto-replies |
| Privacy policy | `app/privacy/page.tsx` → `/privacy` | Required for App Review; describes WhatsApp/Meta data handling |
| Database table | `whatsapp_connections` (Drizzle/libSQL → Turso in prod) | One row per connected client: WABA ID, phone number ID, business name, access token (server-only) |

---

## 4. How Embedded Signup works (the data flow)

1. Client opens **`idealailabs.com/onboard`** and clicks **Connect WhatsApp**.
2. The Facebook JS SDK opens Meta's **Embedded Signup** popup.
3. Client logs in with **their** Facebook business account, selects/creates a WhatsApp Business
   Account, and verifies their phone number by SMS/voice code.
4. On finish, the browser receives a short-lived **authorization `code`**, and the popup also
   posts back the **`waba_id`** and **`phone_number_id`**.
5. The page sends these to **`/api/whatsapp/onboard`**.
6. The server (using the secret **App Secret**) exchanges the `code` for the client's
   **long-lived access token**, reads the number's details, **subscribes our app** to the client's
   WABA, **stores** the connection, and **emails** the team.
7. Done — the client's number is live on our platform.

> The App Secret is used **only on the server**. Tokens are **never** sent to the browser.

---

## 5. Environment variables

Set these in `.env.local` (local) **and** in Vercel → Project → Settings → Environment Variables.

| Variable | Secret? | Value / source |
|---|---|---|
| `NEXT_PUBLIC_WA_APP_ID` | No (public) | `1666901441099073` |
| `NEXT_PUBLIC_WA_CONFIG_ID` | No (public) | `2190411671691417` |
| `WHATSAPP_APP_SECRET` | **YES** | Meta → App settings → Basic → App Secret → Show |
| `WHATSAPP_VERIFY_TOKEN` | Yes-ish | Any random string you choose; must match the value entered in the Meta webhook config |
| `WHATSAPP_GRAPH_VERSION` | No | `v23.0` |
| `DATABASE_URL` | Yes | Turso libSQL URL in production (local dev uses a file) |
| `DATABASE_AUTH_TOKEN` | Yes | Turso auth token (production) |
| `RESEND_API_KEY` | Yes | Optional — enables the "new client connected" email |

---

## 6. One-time platform setup (do once, ever)

1. ✅ Business verification (done).
2. ✅ Create the Embedded Signup **Login configuration** ("ES Config" → `2190411671691417`).
3. Set all env vars (above) in `.env.local` and Vercel.
4. **Deploy** the site: `vercel --prod`.
5. Run the DB migration against production: `npm run db:migrate`.
6. **Webhook**: Meta → WhatsApp → Configuration → Edit →
   - Callback URL: `https://idealailabs.com/api/whatsapp/webhook`
   - Verify token: the value of `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and save**, then subscribe to the **`messages`** field.
7. **Allowlist** `idealailabs.com` in Meta → App settings → Facebook Login for Business → Allowed Domains.
8. For **unlimited** clients (production): complete **App Review** (`whatsapp_business_messaging`)
   and **Access Verification** (Tech Provider). Before that, you can onboard a limited number of
   clients for testing.

---

## 7. A-to-Z: connecting a NEW business

### What the client needs first
- A **phone number** that is **not** currently active on the WhatsApp app or the WhatsApp Business
  app (a number can be on the app **or** the API, not both). A fresh number is easiest, or they
  migrate their existing one (they lose the green app for that number).
- A **Facebook account** that controls (or can create) their business.
- Ability to receive an **SMS/voice code** on that number.

### The steps

| # | Who | Action |
|---|---|---|
| 1 | You | Send the client their onboarding link: **`https://idealailabs.com/onboard`** |
| 2 | Client | Opens the link, clicks **Connect WhatsApp** |
| 3 | Client | Logs in with their **Facebook business account** |
| 4 | Client | Selects or creates their **Meta Business portfolio** + **WhatsApp Business Account** |
| 5 | Client | Enters their **business phone number** and verifies it with the **SMS/voice code** |
| 6 | System | Embedded Signup finishes → our server exchanges the token, subscribes our app to their WABA, stores the connection, and **emails you** "New WhatsApp client connected" |
| 7 | Client | Adds a **payment method** to their WhatsApp account (Model A below) — or you handle billing (Model B) |
| 8 | You | (Optional) Tailor the bot for this client — business name, tone, FAQ/knowledge |
| 9 | Anyone | Send a WhatsApp message to the client's number → the **webhook** receives it → routes it to this client → the **bot replies** ✅ |

### After connection — how a message is handled
1. A customer messages the client's WhatsApp number.
2. Meta calls our **webhook** with the message + the `phone_number_id`.
3. The webhook **verifies the signature** (rejects forgeries), looks up the matching
   `whatsapp_connections` row by `phone_number_id`, marks the message read, generates a reply,
   and sends it back using **that client's** token.

---

## 8. Billing models

| | Model A — client pays Meta | Model B — you pay Meta |
|---|---|---|
| Payment method on the WABA | The **client's** card | **Your** card |
| Who Meta bills for conversations | The client, directly | You |
| How you charge | Your service fee, invoiced separately | One all-in invoice (your fee + messaging, marked up) |
| Best for | Clean separation, no billing risk | "I handle everything, one bill" simplicity |

Meta only governs **who pays for messages**. Your setup/management/service fee is your own
private arrangement — invoice it however you like.

---

## 9. Testing without a real client

Use Meta's **free Test Number** (in the WhatsApp → API Setup panel of the app). It sends free
messages for 90 days, needs no payment method, and doesn't touch any real client account — ideal
for confirming the bot's send/receive/reply loop works.

---

## 10. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Facebook "Verify and save" fails | The site isn't deployed yet, or `WHATSAPP_VERIFY_TOKEN` in Vercel ≠ the value typed in Meta |
| Webhook returns 401 on every message | `WHATSAPP_APP_SECRET` not set (signature check fails) |
| `/onboard` button does nothing | `NEXT_PUBLIC_WA_CONFIG_ID` not set |
| Connection not saved in production | `DATABASE_URL` points to a local file instead of a Turso DB (serverless is ephemeral), or migration not run |
| Client can't send proactive messages | Their WABA has no payment method attached |
| App "Ineligible for Submission" | App icon (1024² transparent), Privacy policy URL, and Category must be filled in App settings → Basic |

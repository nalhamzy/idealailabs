# WhatsApp Chatbot Platform — Setup & Onboarding Guide

How Ideal Intelligence connects and runs WhatsApp bots for client businesses, end to end.
Companion visual version: `whatsapp-platform-setup.html` (open in a browser).

_Last updated: 2026-06-27_

> **Architecture note:** the platform itself is the **Tawasul** app (`tawasul.idealailabs.com`).
> The marketing site (`idealailabs.com`) only markets it and links to it. All WhatsApp
> onboarding, the webhook, and per-business data live in **Tawasul** — repo
> `IdealIntelligenceWebTeam/apps/tawasul`.

---

## 1. The big idea

We run **one** Meta app — *Ideal Intelligence* — for **every** client. We never create a new
app per business. Each client connects **their own** WhatsApp number to that app from inside the
**Tawasul dashboard** (Settings → Connect WhatsApp). From then on their customers' messages flow
to Tawasul, which categorizes them with AI and replies on the business's behalf.

```
Client's WhatsApp number ──connect once in Tawasul──▶ ONE Meta app (Ideal Intelligence)
        └──inbound messages──▶ tawasul.idealailabs.com webhook ──AI──▶ reply + dashboard cards
```

---

## 2. Key identifiers

| Thing | Value |
|---|---|
| Meta app name | **Ideal Intelligence** |
| App ID | `1666901441099073` |
| Business portfolio | Ideal Intelligence — ID `799766182057295` (**verified**) |
| App status | **Published** (production messages delivered) |
| Embedded Signup config | "ES Config" — Config ID `2190411671691417` |
| Product / backend | **Tawasul** — `tawasul.idealailabs.com` (Next.js, Vercel, Drizzle/Turso, Claude) |
| Marketing site | `idealailabs.com` (markets + links to Tawasul) |
| Graph API version | `v22.0` |
| Webhook URL | `https://tawasul.idealailabs.com/api/whatsapp/webhook` |

---

## 3. Architecture

The WhatsApp platform lives entirely in the **Tawasul** app.

| Component | Path (in `apps/tawasul`) | Role |
|---|---|---|
| Connect button | `src/app/dashboard/settings/connect-whatsapp.tsx` | Embedded Signup launcher in **Settings → WhatsApp Connection** |
| Connect API | `src/app/api/whatsapp/connect/route.ts` | Exchanges the signup `code` for the business token, subscribes our app to their WABA, writes the tenant's `whatsapp_accounts` row to `connected` |
| Webhook | `src/app/api/whatsapp/webhook/route.ts` | Verifies signature, routes inbound by `phone_number_id` to the right business, runs the AI agent, replies |
| Database table | `whatsapp_accounts` (per business: `phone_number_id`, `access_token`, `status`…) | One row per connected business; the routing + sending source of truth |
| Inbox / cards | the Tawasul dashboard | Categorized orders / requests / enquiries with status tracking |

The marketing-site (`idealailabs.com`) keeps only `/privacy` (for App Review); its old
`/onboard` + WhatsApp routes were removed once onboarding moved into Tawasul.

---

## 4. How Embedded Signup works (the data flow)

1. A business **owner logs into Tawasul** and opens **Settings → WhatsApp Connection → Connect WhatsApp**.
2. The Facebook JS SDK opens Meta's **Embedded Signup** popup.
3. The owner logs in with **their** Facebook business account, selects/creates a WhatsApp Business
   Account, and verifies their number by SMS/voice code.
4. On finish, the browser receives a short-lived **`code`**, plus the **`waba_id`** + **`phone_number_id`**.
5. The page calls **`/api/whatsapp/connect`**.
6. Tawasul (using the **App Secret**, server-side) exchanges the `code` for the business's
   **long-lived token**, subscribes our app to their WABA, and **upserts their `whatsapp_accounts`
   row to `connected`**.
7. Done — inbound messages to that number now route to this business automatically.

> The App Secret is used **only on Tawasul's server**. Tokens are **never** sent to the browser.

---

## 5. Environment variables (Tawasul — Vercel)

Set in the **Tawasul** Vercel project → Settings → Environment Variables (and `.env.local` for dev).

| Variable | Secret? | Value / source |
|---|---|---|
| `NEXT_PUBLIC_WA_META_APP_ID` | No (public) | `1666901441099073` |
| `NEXT_PUBLIC_WA_META_CONFIG_ID` | No (public) | `2190411671691417` |
| `WA_META_APP_SECRET` | **YES** | The *Ideal Intelligence* app secret (signs webhooks + exchanges signup codes) |
| `WA_META_VERIFY_TOKEN` | Yes-ish | Any string you choose; must match the value in the Meta webhook config |
| `WA_META_API_VERSION` | No | `v22.0` |
| `DATABASE_URL` / `DATABASE_AUTH_TOKEN` | Yes | Turso libSQL (persistence on serverless) |
| `ANTHROPIC_API_KEY` | Yes | Claude (the AI agent); `AI_PROVIDER=anthropic` |
| `R2_*` | Yes | Media storage for inbound images (local disk won't persist on Vercel) |
| `AUTH_SECRET` | Yes | Session cookie signing |

---

## 6. One-time platform setup (already done)

1. ✅ Business verification.
2. ✅ Embedded Signup **Login configuration** ("ES Config" → `2190411671691417`).
3. ✅ Tawasul deployed with the env above.
4. ✅ **Webhook** in Meta → WhatsApp → Configuration:
   - Callback URL: `https://tawasul.idealailabs.com/api/whatsapp/webhook`
   - Verify token: the value of `WA_META_VERIFY_TOKEN`
   - **Verify and save** → subscribed to **`messages`**.
5. ✅ Allowlisted `tawasul.idealailabs.com` in Facebook Login for Business.
6. ✅ **App Review** complete + **app published** (so production messages are delivered).

---

## 7. A-to-Z: connecting a NEW business

### What the client needs first
- A **phone number not active** on the WhatsApp app or WhatsApp Business app (a number lives on the
  app **or** the API, not both). A fresh number is easiest.
- A **Facebook account** that controls (or can create) their business.
- Ability to receive an **SMS / voice code** on that number.

### The steps

| # | Who | Action |
|---|---|---|
| 1 | You | Provision the business in Tawasul (create the business + an **owner** login). |
| 2 | Client | Logs into **`tawasul.idealailabs.com`** and opens **Settings → WhatsApp Connection**. |
| 3 | Client | Clicks **Connect WhatsApp** → logs in with their **Facebook business account**. |
| 4 | Client | Selects/creates their **WhatsApp Business Account** and **verifies their number** (SMS/voice). |
| 5 | System | Tawasul exchanges the token, subscribes our app to their WABA, and writes their `whatsapp_accounts` row → **`connected`**. The Settings page flips to "Connected". |
| 6 | Client | Adds a **payment method** to their WhatsApp account (Model A), or you handle billing (Model B). |
| 7 | You | (Optional) Set the per-business **AI mode** (Auto-reply / Suggest / Off) and tune its knowledge. |
| 8 | Anyone | Message the client's number → Tawasul **webhook** receives it → routes by `phone_number_id` → AI categorizes + replies → it appears as a card in the business's inbox ✅ |

### After connection — how a message is handled
1. A customer messages the client's WhatsApp number.
2. Meta calls Tawasul's **webhook** with the message + `phone_number_id`.
3. Tawasul **verifies the signature**, finds the matching `whatsapp_accounts` row, runs the **AI
   agent**, replies with **that business's** token, and creates the order/request/enquiry card.

---

## 8. Billing models

| | Model A — client pays Meta | Model B — you pay Meta |
|---|---|---|
| Payment method on the WABA | The **client's** card | **Your** card |
| Who Meta bills for conversations | The client, directly | You |
| How you charge | Your service fee, invoiced separately | One all-in invoice (your fee + messaging, marked up) |
| Best for | Clean separation, no billing risk | "I handle everything, one bill" simplicity |

Meta only governs **who pays for messages**. Your setup/management fee is your own arrangement.

---

## 9. Testing

- **Meta Test Number** (WhatsApp → API Setup) — free messages for 90 days, no payment method.
- **Tawasul Simulator** (in the inbox) — exercise the categorization + AI replies with no real
  WhatsApp traffic at all.

---

## 10. Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Verify and save" fails in Meta | Tawasul not redeployed, or `WA_META_VERIFY_TOKEN` in Vercel ≠ the value typed in Meta |
| Webhook returns 401 on every message | `WA_META_APP_SECRET` not set in Tawasul (signature check fails) |
| Connect button missing in Settings | `NEXT_PUBLIC_WA_META_APP_ID` / `…CONFIG_ID` not set, or the user isn't an owner/manager |
| No real messages arrive | App not published (now done), or not subscribed to the `messages` webhook field |
| Connection not saved in production | `DATABASE_URL` points to a local file (serverless is ephemeral) instead of Turso |
| Client can't send proactive messages | Their WABA has no payment method attached |
| Inbound images don't load | `R2_*` media storage not configured (local disk is read-only on Vercel) |

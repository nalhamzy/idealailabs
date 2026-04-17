# Ideal Intelligence — idealailabs.com

Bilingual (EN/AR) marketing site for **Ideal Intelligence**, an AI studio in Muscat, Oman.
Built with Next.js 15 (App Router), Tailwind CSS, and Resend for contact-form email delivery.

## Stack
- Next.js 15 (App Router, RSC)
- TypeScript
- Tailwind CSS
- Resend (contact form email)
- Deployed on Vercel

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY
npm run dev
```

Visit http://localhost:3000 (redirects to `/en`). Arabic at `/ar`.

## Environment variables

| Key | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key. Get one at https://resend.com/api-keys |
| `CONTACT_RECIPIENT` | Inbox that receives inquiries (default `idealailabs@gmail.com`) |
| `CONTACT_FROM` | Verified sender address. Use `onboarding@resend.dev` until you verify `idealailabs.com` in Resend. |

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo at https://vercel.com/new — framework auto-detected as Next.js.
3. Add the env vars above in Project Settings → Environment Variables.
4. Point `idealailabs.com` DNS at Vercel (Vercel UI shows exact records).

## Structure

```
app/
  layout.tsx              root layout (fonts, metadata)
  page.tsx                / → redirects to /en
  [locale]/layout.tsx     sets dir + lang per locale
  [locale]/page.tsx       homepage (all sections)
  api/contact/route.ts    Resend-backed contact API
  robots.ts, sitemap.ts   SEO
components/
  Nav, Footer, Hero, Services, Products, Approach, Contact
lib/
  i18n.ts                 EN + AR dictionaries
```

## Adding a language

1. Add the code to `locales` in `lib/i18n.ts`.
2. Add a dictionary object matching the `en` shape.
3. Everything else (routes, layout, components) picks it up automatically.

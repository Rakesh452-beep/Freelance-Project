# Dhananjaya Studio — Website & Booking System

A complete website + booking system for **Dhananjaya Studio**, a creative studio offering **Photography**, **Cinematography**, and **Graphic Designing**.

Built with **Next.js 16** (App Router, TypeScript), **Tailwind CSS**, **Framer Motion**, and **Supabase** (Postgres + Auth). Advance payments are taken via **UPI** (QR + payment link) — no payment gateway or KYC required.

---

## Features

- Animated, navy-themed landing page with hero intro, services, portfolio, about, testimonials, and contact
- Online booking with service, date, time, and client details
- Optional advance payment via **UPI** — on-screen QR code, payment link, and copyable UPI ID (no gateway, no PAN/KYC)
- Studio confirms the payment manually in the admin dashboard after it reflects in the bank
- Admin dashboard at `/admin` — view/manage bookings, contact messages, payment & booking status
- Contact form stored in the database
- Email notifications via Resend (booking received, new booking/contact alerts, and an automated **confirmation email** to the client when the admin confirms a booking — with a link to a public **`/review`** page)
- Free trial (Sep 1 – Oct 31): first booking per client is free; repeat bookings and bookings from November are charged at the regular rates
- Row-level security on the database; all data access goes through the server

---

## Getting Started

### 1. Prerequisites

- Node.js 20.9+
- A free [Supabase](https://supabase.com) project
- Your **UPI ID** (from GPay / PhonePe / Paytm) — where advance payments land

### 2. Install

```bash
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Supabase — Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend — Dashboard → API Keys
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Your **UPI ID** lives in `lib/config.ts` (the `upiId` field). It is never displayed to clients — payments are QR-code only (the QR encodes a payment-intent URI with the exact amount and your UPI ID).

### 4. Set up the database

Run the migrations in `supabase/migrations/` — `0001_init.sql` (`bookings`, `inquiries`), `0002_reviews.sql` (`reviews`), and `0003_security.sql` (anon RLS policies for reviews/inquiries) — in the **Supabase SQL editor** (or with the Supabase CLI: `supabase db push`). All tables have row-level security enabled.

### 5. Create the admin user

In the **Supabase dashboard → Authentication → Users → Add user**, create the studio admin (email + password). That's the login for `/admin`.

### 6. Enable email verification (production)

The project's `supabase/config.toml` already enables email confirmations and disables public signups. To make this apply on the hosted project, in the **Supabase dashboard → Authentication**:

1. **Providers → Email → Enable "Confirm email"**.
2. **URL Configuration** — set `Site URL` to your production domain and add it to `Redirect URLs`.
3. **SMTP** — configure an SMTP provider so confirm/reset emails are actually delivered (these are sent by Supabase, not the app's own Gmail/Resend settings).

Then confirm the existing admin's email address so you aren't locked out:

```bash
curl -X POST https://YOUR-SITE/api/admin/confirm-email \
  -H "Content-Type: application/json" \
  -H "x-confirm-secret: YOUR_ADMIN_CONFIRM_SECRET"
```

(`ADMIN_CONFIRM_SECRET` is an env var — server-side only, never `NEXT_PUBLIC_`.)

### 7. Run the site

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Customising the studio details

Everything editable — name, phone, email, Instagram, UPI ID, prices, deposit %, services, and intro text — lives in **one file**:

- `lib/config.ts`

Change the values there and the whole site updates.

### Adding Leo's photo

1. Drop the photo at `public/leo.jpg` (square-ish works best).
2. Update the hero in `components/Hero.tsx` and the about portrait in `components/About.tsx` to use `<Image>` with `/leo.jpg` instead of the placeholder frames.

### Portfolio images

Replace the placeholder tiles in `components/Portfolio.tsx` with real images (or wire in Supabase Storage for a full gallery CMS later).

---

## How payments work

1. Client books → `POST /api/booking` creates the booking. If they chose "pay deposit via UPI", the success page shows a **UPI QR code**, an **"Open UPI app"** link, and the **UPI ID** to copy.
2. Client pays from any UPI app (GPay / PhonePe / Paytm) — money lands directly in the studio's bank account.
3. The studio checks the bank app and marks the booking **paid** in `/admin` — verification is manual by design (no gateway, no KYC).
4. When the studio **confirms** a booking (green Confirm button, or the status dropdown), an automated confirmation email goes to the client thanking them and asking them to review the work on **`/review`** after the event.
5. Booking and contact forms also trigger email notifications via Resend when configured.

UPI payments are free and require no PAN or business account.

---

## Security

- **Auth** — Supabase Auth (GoTrue). Passwords are bcrypt-hashed by Supabase; JWTs expire after 1 hour with refresh-token rotation. Admin pages/APIs authorize with server-side `auth.getUser()` (validated JWT), never trusted client-side session state.
- **Login** — `/api/admin/login` runs server-side with an in-memory rate limiter (5 failures / 15 min per IP+email → 429 lockout). Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production. Sign-out runs server-side (`/api/admin/logout`).
- **Password reset** — `/admin/forgot-password` sends a recovery link (expires in 1 hour) that lands on `/admin/update-password`; the code is exchanged server-side and the new password must meet the strength requirements.
- **Secrets** — `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_APP_PASSWORD`, and `RESEND_API_KEY` are server-only. Only the anon key is ever exposed to the browser. **Never** prefix a secret with `NEXT_PUBLIC_`. Note: non-`NEXT_PUBLIC_` vars are undefined in client bundles even if imported by a client component.
- **Public API routes** — `reviews` and `contact` now use the anon key with RLS policies (no service-role key). `booking`/`eligibility` keep the service-role key server-side so server-computed pricing can't be tampered with via direct database calls; both are rate-limited. Booking/contact/reviews are all rate-limited per IP.
- **Headers** — security headers are set in `next.config.ts`; `poweredByHeader` is disabled.
- **Emails** — all user-provided content is HTML-escaped before being interpolated into email templates.

The rate limiter is in-memory (fine for a single instance). For multi-region/serverless deployments, replace `lib/rate-limit.ts` with a shared store (e.g. Upstash Redis).

---

## Project structure

```
app/
  page.tsx               # Landing page
  booking/               # Booking form + success page
  review/                # Public review page (linked from confirmation emails)
  admin/                 # Admin dashboard + login
  api/
    booking/             # Create booking
    contact/             # Contact form
    admin/bookings/      # List + update + delete bookings
    admin/inquiries/     # Delete messages
components/              # UI components (Hero, Services, BookingForm, UpiPaymentCard, AdminDashboard…)
lib/                     # Config, types, Supabase + email helpers
supabase/migrations/     # Database schema
```

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo on [Vercel](https://vercel.com) — it auto-detects Next.js.
3. Add all environment variables from `.env.local` in Vercel's project settings.
4. Deploy. Your studio site is live.

---

## Growing for the company's whole life

This stack is built to grow with the business — no rewrites needed:

- **Now:** bookings, UPI advance payments, admin dashboard, email notifications.
- **Next:** Google Calendar availability (block booked dates), Instagram feed.
- **Later:** live slot picking, analytics, invoicing, multi-branch support.
